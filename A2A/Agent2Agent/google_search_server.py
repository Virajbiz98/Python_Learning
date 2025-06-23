from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os

from pydantic_ai.mcp import MCPServerStdio
from pydantic_ai import Agent

load_dotenv()

app = Flask(__name__)

# Brave Search MCP server
brave_server = MCPServerStdio(
    'npx', ['-y', '@modelcontextprotocol/server-brave-search'],
    env={"BRAVE_API_KEY": os.getenv("BRAVE_API_KEY")}
)

agent = Agent(
    model="openai:gpt-4o-mini",
    system_prompt="You are an assistant with the ability to search the web with Brave.",
    mcp_servers=[brave_server]
)

# Agent Card metadata
AGENT_CARD = {
    "name": "SearchAgent",
    "description": "A simple agent that has an MCP server to search the web with Brave.",
    "url": "http://localhost:5000",  # base URL where this agent is hosted
    "version": "1.0",
    "capabilities": {
        "streaming": False,
        "pushNotifications": False
    }
}

# Endpoint to serve the Agent Card
@app.get("/.well-known/agent.json")
def get_agent_card():
    return jsonify(AGENT_CARD)

# Endpoint to handle task requests
@app.post("/tasks/send")
async def handle_task():
    task_request = request.get_json()
    if not task_request:
        return jsonify({"error": "Invalid request"}), 400

    task_id = task_request.get("id")
    # Extract user's message text from the request
    try:
        user_text = task_request["message"]["parts"][0]["text"]
    except Exception as e:
        return jsonify({"error": "Bad message format"}), 400

    async with agent.run_mcp_servers():
        result = await agent.run(user_text)
    response_text = result.data

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5010)