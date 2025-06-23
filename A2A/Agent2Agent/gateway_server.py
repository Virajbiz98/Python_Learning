from flask import Flask, request, jsonify
import requests
import uuid
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Load Google API key
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("Warning: GOOGLE_API_KEY environment variable not set. Routing will default to Search.")
    # Optionally raise an error: raise ValueError("GOOGLE_API_KEY environment variable not set.")
else:
    genai.configure(api_key=GOOGLE_API_KEY)

app = Flask(__name__)

SEARCH_AGENT_URL = "http://localhost:5010"
RAG_AGENT_URL = "http://localhost:5006"

# Agent Card metadata for the Gateway Agent
AGENT_CARD = {
    "name": "GatewayAgent",
    "description": "Routes requests to either a Search Agent or a RAG Agent using AI.",
    "url": "http://localhost:5005",  # base URL where this gateway is hosted
    "version": "1.1",
    "capabilities": {
        "streaming": False,
        "pushNotifications": False
    }
}

# --- New Function: Gemini Routing Logic ---
def route_query_with_gemini(user_text: str) -> str:
    """Uses Gemini to determine if the query should go to RAG or Search."""
    if not GOOGLE_API_KEY: # Check if API key is loaded
         print("Google API key not available. Defaulting to Search.")
         return SEARCH_AGENT_URL

    model = genai.GenerativeModel('gemini-pro') # You can change the model if needed

    prompt = f"""
You are an intelligent request router. You need to decide whether to route a user's query to a 'RAG Agent' or a 'Search Agent'.
- The 'RAG Agent' answers questions based *only* on a specific local knowledge base (e.g., documents provided to it). Use this agent if the query explicitly mentions using local documents, a specific knowledge base, or seems highly specific to a contained set of information.
- The 'Search Agent' answers questions using a general web search engine. Use this agent for general knowledge questions, current events, or anything not specifically tied to the local knowledge base.

User query: "{user_text}"

Based on the query, which agent is more appropriate? Respond with ONLY 'RAG' or 'SEARCH'.
"""
    try:
        response = model.generate_content(
            contents=[{"role": "user", "parts": [{"text": prompt}]}],
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=10,
                temperature=0
            )
        )
        choice = response.text.strip().upper()
        
        if "RAG" in choice: # Check if RAG is mentioned
            print(f"Gemini routing decision: RAG (based on response: '{choice}')")
            return RAG_AGENT_URL
        elif "SEARCH" in choice: # Check if SEARCH is mentioned
            print(f"Gemini routing decision: SEARCH (based on response: '{choice}')")
            return SEARCH_AGENT_URL
        else:
            print(f"Warning: Gemini returned unexpected choice: '{choice}'. Defaulting to Search.")
            return SEARCH_AGENT_URL
            
    except Exception as e:
        print(f"Error calling Gemini for routing: {e}. Defaulting to Search.")
        return SEARCH_AGENT_URL

# Endpoint to serve the Gateway Agent Card
@app.get("/.well-known/agent.json")
def get_agent_card():
    return jsonify(AGENT_CARD)

# Endpoint to handle and route task requests
@app.post("/tasks/send")
def handle_task():
    task_request = request.get_json()
    if not task_request:
        return jsonify({"error": "Invalid request"}), 400

    task_id = task_request.get("id")
    if not task_id:
         task_id = str(uuid.uuid4()) # Generate one if missing, though A2A spec implies it should exist
         task_request['id'] = task_id

    # Extract user's message text from the request
    try:
        user_text = task_request["message"]["parts"][0]["text"]
    except (KeyError, IndexError, TypeError) as e:
        print(f"Error extracting user text: {e}") # Log error
        return jsonify({"error": "Bad message format"}), 400

    # --- Determine target agent using Gemini ---
    target_agent_url = route_query_with_gemini(user_text)
    print(f"Routing task {task_id} via Gemini decision to Agent ({target_agent_url})")
    # --- End Gemini Routing ---


    # Forward the task to the selected agent
    target_send_url = f"{target_agent_url}/tasks/send"
    try:
        response = requests.post(target_send_url, json=task_request, timeout=60)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error forwarding task {task_id} to {target_agent_url}: {e}") # Log error
        # Return an error task response to the original client
        error_response_task = {
            "id": task_id,
            "status": {"state": "failed", "reason": f"Failed to contact downstream agent: {target_agent_url}"},
            "messages": [
                task_request.get("message", {}), # include original user message
                 {
                    "role": "agent",
                    "parts": [{"text": f"Error: Could not reach the target agent at {target_agent_url}. Details: {e}"}]
                }
            ]
        }
        return jsonify(error_response_task), 502 # Bad Gateway
    
    # Return the response from the downstream agent
    print(f"Received response for task {task_id} from {target_agent_url}")
    return jsonify(response.json())


if __name__ == "__main__":
    # Ensure port is integer
    port = int(os.environ.get("PORT", 5005))
    print(f"Gateway server starting on port {port}")
    app.run(host="0.0.0.0", port=port)
