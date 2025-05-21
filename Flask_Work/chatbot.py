from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__,
    template_folder='hotel_website/templates',
    static_folder='hotel_website/static')

# Load environment variables and configure Gemini
load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

@app.route('/')
def home():
    return render_template('chatbot.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message', '')
        if not user_message:
            return jsonify({'error': 'No message provided'})

        # Add context and generate response using Gemini
        prompt = f"""You are a helpful and friendly AI assistant. Please provide a helpful, concise, and friendly response 
        to the following message: {user_message}
        
        Remember to:
        - Be concise but informative
        - Be friendly and conversational
        - If asked about technical topics, provide accurate information
        - If you don't know something, be honest about it
        """
        
        response = model.generate_content(prompt)
        
        if response and hasattr(response, 'text'):
            return jsonify({'response': response.text.strip()})
        else:
            return jsonify({'error': 'Failed to generate response'})
            
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5002)
