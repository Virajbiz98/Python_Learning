from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import uuid

from pydantic_ai.mcp import MCPServerStdio
from pydantic_ai import Agent

load_dotenv()

app = Flask(__name__)

# Local RAG MCP server configuration based on provided details
local_rag_server = MCPServerStdio(
    'uv', # Command
    ['--directory', '/Users/priyalaruna/Src/Demos/MCP/Local-MCP', 'run', 'server.py'] # Args
)

# Configure the Agent to use the local RAG MCP
# Using Gemini for the RAG agent as a Google API key was provided.
agent = Agent(
    model="gemini-pro", # Using Gemini
    system_prompt="You are an assistant answering questions based on local knowledge provided by your connected RAG system.",
    mcp_servers=[local_rag_server]
)

# RAG Agent Card metadata
AGENT_CARD = {
    "name": "RAGAgentServer",
    "description": "An agent that answers questions using a local RAG system via MCP.",
    "url": "http://localhost:5006",  # base URL where this agent is hosted
    "version": "1.0",
    "capabilities": {
        "streaming": False, # Assuming false based on existing server.py
        "pushNotifications": False
    }
}

# Endpoint to serve the RAG Agent Card
@app.get("/.well-known/agent.json")
def get_agent_card():
    return jsonify(AGENT_CARD)

# Endpoint to handle task requests for the RAG Agent
@app.post("/tasks/send")
async def handle_task():
    task_request = request.get_json()
    if not task_request:
        return jsonify({"error": "Invalid request"}), 400

    task_id = task_request.get("id", str(uuid.uuid4())) # Use provided or generate new ID

    # Extract user's message text from the request
    try:
        user_text = task_request["message"]["parts"][0]["text"]
        print(f"RAG Agent received task {task_id} with text: '{user_text}'")
    except (KeyError, IndexError, TypeError) as e:
        print(f"Error extracting user text for task {task_id}: {e}")
        return jsonify({"error": "Bad message format"}), 400

    try:
        # Run the agent with the local RAG MCP server
        async with agent.run_mcp_servers():
            print(f"Running agent for task {task_id} with local RAG MCP...")
            result = await agent.run(user_text)
        response_text = result.data
        print(f"Agent for task {task_id} completed. Response: '{response_text[:100]}...'" ) # Log snippet

        # Formulate A2A response Task
        response_task = {
            "id": task_id,
            "status": {"state": "completed"},
            "messages": [
                task_request.get("message", {}),  # include original user message
                {
                    "role": "agent",
                    "parts": [{"text": response_text}]
                }
            ]
        }
        return jsonify(response_task)

    except Exception as e:
        print(f"Error processing task {task_id} with agent: {e}") # Log agent error
        # Return an error task response
        error_response_task = {
            "id": task_id,
            "status": {"state": "failed", "reason": f"Agent processing failed: {e}"},
            "messages": [
                task_request.get("message", {}), # include original user message
                 {
                    "role": "agent",
                    "parts": [{"text": f"Error: The RAG agent failed to process the request. Details: {e}"}]
                }
            ]
        }
        return jsonify(error_response_task), 500 # Internal Server Error

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5006))
    print(f"RAG Agent server starting on port {port}")
    app.run(host="0.0.0.0", port=port)
