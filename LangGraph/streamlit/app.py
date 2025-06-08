from langchain import hub
from langchain.agents import tool, create_json_agent
from langchain_google_genai import ChatGoogleGenerativeAI
import os 
from typing import TypedDict, Annotated, Union
from langchain_core.agents import AgentAction, AgentFinish
import operator
from typing import TypedDict, Annotated
from langchain_core.agents import AgentFinish
from langchain.prebuilt import ToolExecutor
from langchain_core.agents import AgentActionMessageLog
from langgraph.graph import END , StateGraph


import streamlit as st
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(page_title="LangGraph Agent + Gemini Pro + Custom Tool + Streamlit")

def main():
    input_text = st.text_input("Enter your query: ")

    if st.button("Run Agent"):
        serper_api_key = os.getenv("SERPER_API_KEY")
        google_api_key = os.getenv("GOOGLE_API_KEY")
        
        if not serper_api_key or not google_api_key:
            st.error("API keys not found. Please check your .env file.")
            return

        search = GoogleSerperAPIWrapper(serper_api_key=serper_api_key)

        def toggle_case(word):
            toggle_case_result = ""
            for char in word:
                if char.islower():
                    toggle_case_result += char.upper()
                elif char.isupper():
                    toggle_case_result += char.lower()
                else:
                    toggle_case_result += char
            return toggle_case_result
        
        def sort_string(string):
            return "".join(sorted(string))

        tools = [
            Tool(
                name="Search",
                func=search.run,
                description="useful for when you need to answer questions about current events"
            ),
            Tool(
                name="Toggle Case",
                func=lambda word: toggle_case(word),
                description="use when you want convert the letter case to upper or lowercase"
            ),
            Tool(
                name="Sort String",
                func=lambda string: sort_string(string),
                description="use when you want to sort a string alphabetically",
            )
        ]

        prompt = hub.pull("hwchase17/react")

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash-exp",
            google_api_key=google_api_key,
            convert_system_message_to_human=True,
            verbose=True,
        )
        
        # Create the agent using the LLM, tools, and prompt
        agent_runnable = create_json_agent(llm, tools, prompt)

        class AgentState(TypedDict):
            input: str
            chat_history: list[BaseMessage]
            agent_outcome: Union[AgentAction, AgentFinish, None] 
            return_direct: bool
            intermediate_steps: Annotated[list[tuple[AgentAction, str]], operator.add]
        
        tool_executor = ToolExecutor(tools)

        def run_agent(state: AgentState):
            agent_outcome = agent_runnable.invoke(state)
            return {"agent_outcome": agent_outcome}

        def execute_tool(state):
            message = [state["agent_outcome"]]
            last_message = message[-1]

            tool_name = last_message.tool
            arguments = last_message
            
            if tool_name == "Search" or tool_name == "Sort String" or tool_name == "Toggle Case":
                if "return_direct" in arguments:
                    del arguments["return_direct"]
                action = ToolInvocation(
                    tool=tool_name,
                    tool_input=last_message.tool_input,
                )
            response = tool_executor.invoke(action)
            return {"intermediate_steps": [(state['agent_outcome'], response)]}

        def should_continue(state):
            message = [state["agent_outcome"]]
            last_message = message[-1]
            if "Action" not in last_message.log:
                return "end"
            else:
                arguments = state["return_direct"]
                if arguments is True:
                    return "end"
                else:
                    return "continue"

        def first_agent(inputs):
            action = AgentActionMessageLog(
                tool="Search",
                tool_input= inputs["input"],
                log="",
            )

            return {"agent_outcome":action}
                        
        workflow = StateGraph(AgentState)

        workflow.add_node("agent", run_agent)
        workflow.add_node("action", execute_tool)
        workflow.add_node("final", execute_tool)
        workflow.set_entry_point("agent")
        workflow.add_conditional_edges(
            "agent",
            should_continue,
            {
                "continue": "action",
                "final": "final",
                "end": END 
            }
        )

        workflow.add_edge("action", "agent")
        workflow.add_edge("final", END)

        app = workflow.compile()

        inputs = {"input": input_text, "chat_history": [], "return_direct": False}
        results = []
        for s in app.stream(inputs):
            result = list(s.values())[0]
            results.append(result)
            st.write(result)


if __name__ == "__main__":
    main()



