from chatbot import Chatbot
import sys

print("Initializing chatbot...", flush=True)
chatbot = Chatbot()

room_data = {
    "Deluxe Suite": {
        "features": ["AC", "TV", "Hot Water"],
        "price": "12000 LKR",
        "available": True
    }
}

chatbot.update_hotel_data(room_data)
print("\nAsking about hotel features:", flush=True)
question = "What are the features of the Deluxe Suite?"
print(f"Q: {question}", flush=True)
response = chatbot.get_response(question)
print(f"A: {response}", flush=True)