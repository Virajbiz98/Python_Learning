import requests
import uuid

def main():
    # 1. Discover the agent by fetching its Agent Card
    AGENT_BASE_URL = "http://localhost:5005"
    agent_card_url = f"{AGENT_BASE_URL}/.well-known/agent.json"
    try:
        res = requests.get(agent_card_url, timeout=10)
        res.raise_for_status()
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Failed to get agent card from {agent_card_url}: {e}")

    agent_card = res.json()
    print(f"Discovered Agent: {agent_card['name']} – {agent_card.get('description', '')}")
    print("Enter your question or type 'quit' to exit.")

    while True:
        user_text = input("> ")
        if user_text.lower() == "quit":
            break

        # 2. Prepare a task request for the agent
        task_id = str(uuid.uuid4())  # unique task ID

        task_payload = {
            "id": task_id,
            "message": {
                "role": "user",
                "parts": [
                    {"text": user_text}
                ]
            }
        }
        print(f"Sending task {task_id} to agent...")

        # 3. Send the task to the agent's tasks/send endpoint
        tasks_send_url = f"{AGENT_BASE_URL}/tasks/send"
        try:
            response = requests.post(tasks_send_url, json=task_payload, timeout=60)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Task request failed: {e}, {response.text if 'response' in locals() else 'No response'}")
            continue # Continue to next prompt

        task_response = response.json()

        # 4. Process the agent's response
        if task_response.get("status", {}).get("state") == "completed":
            # The last message in the response messages list should be the agent's answer
            messages = task_response.get("messages", [])
            if messages:
                agent_message = messages[-1]  # last message (from agent)
                # Extract text from the agent's message parts
                agent_reply_text = "".join(part.get("text", "") for part in agent_message.get("parts", []))
                print("Agent:", agent_reply_text)
            else:
                print("Agent: No messages in response!")
        else:
            print("Agent: Task did not complete. Status:", task_response.get("status"))

if __name__ == "__main__":
    main()