from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever


model = OllamaLLM(model="llama3.2")

template = """
You are an exprert in answering questions about a pizz restaurant

Here are some relevent reviews: {reviews}

Here is a question: {question}

"""

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model 

while True:
    print("\n\n--------------------------------")
    question = input("Ask your question (q to quit): ")
    print("\n\n")
    if question == "q":
        break
    
    reviews = retriever.invoke(question)
    result = chain.invoke({"reviews": reviews, "question": question})
    print(result)

