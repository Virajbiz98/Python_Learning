import os
from dotenv import load_dotenv
import json
from langchain_community.llms import Ollama
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

load_dotenv()

class Chatbot:
    def __init__(self):
        self.hotel_data = {}
        self.llm = Ollama(model="mistral", temperature=0)
        self.prompt = PromptTemplate(
            input_variables=["hotel_data", "question"],
            template="""You are a helpful hotel assistant. Answer the following question based on this hotel information:

Hotel Information:
{hotel_data}

Question: {question}

Provide a clear and concise answer based only on the information given."""
        )
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt)

    def update_hotel_data(self, room_data):
        """Update the chatbot with current hotel room information."""
        self.hotel_data.update(room_data)

    def get_response(self, question):
        if not self.hotel_data:
            return "I'm sorry, but I don't have any hotel information loaded yet."

        try:
            response = self.chain.invoke({
                "hotel_data": json.dumps(self.hotel_data, indent=2),
                "question": question
            })
            return response["text"].strip()
        except Exception as e:
            return f"An error occurred: {str(e)}"
