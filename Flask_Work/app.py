from flask import Flask, render_template, request, jsonify
import os
import google.generativeai as genai
import pandas as pd
import PyPDF2
from dotenv import load_dotenv
import json
import time
from google.api_core import retry
import logging
import sys
from typing import Optional, List, Tuple

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('hotel_bot.log')
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get API key
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
logger.debug(f"API Key present: {bool(GOOGLE_API_KEY)}")

if not GOOGLE_API_KEY:
    logger.error("GOOGLE_API_KEY environment variable is not set")
    raise ValueError("GOOGLE_API_KEY environment variable is not set")

# Configure the Gemini API
genai.configure(api_key=GOOGLE_API_KEY)

def get_available_models() -> List[str]:
    """Get list of available models"""
    try:
        models = genai.list_models()
        return [model.name for model in models if 'gemini' in model.name.lower()]
    except Exception as e:
        logger.error(f"Error listing models: {e}")
        return []

def initialize_model(model_name: str) -> Tuple[Optional[genai.GenerativeModel], Optional[str]]:
    """Initialize a specific model"""
    try:
        model = genai.GenerativeModel(model_name)
        # Test with minimal content
        response = model.generate_content("Test")
        if response and hasattr(response, 'text'):
            return model, None
    except Exception as e:
        return None, str(e)
    return None, "Model initialization failed"

def find_working_model() -> Optional[genai.GenerativeModel]:
    """Find and initialize a working model"""
    # Priority list for models to try
    model_priorities = [
        'gemini-pro',
        'models/gemini-pro',
        'models/gemini-1.0-pro',
        'models/gemini-1.0-pro-latest',
        'models/gemini-1.5-pro-latest',
    ]
    
    # Get available models
    available_models = get_available_models()
    logger.info(f"Available models: {available_models}")
    
    # Try models in priority order
    for model_name in model_priorities:
        logger.info(f"Attempting to initialize model: {model_name}")
        model, error = initialize_model(model_name)
        if model:
            logger.info(f"Successfully initialized model: {model_name}")
            return model
        logger.warning(f"Failed to initialize {model_name}: {error}")
        
        # If rate limited, wait before trying next model
        if error and "429" in str(error):
            time.sleep(2)
    
    # If no priority models work, try any available gemini model
    for model_name in available_models:
        if model_name not in model_priorities:
            logger.info(f"Attempting to initialize alternative model: {model_name}")
            model, error = initialize_model(model_name)
            if model:
                logger.info(f"Successfully initialized alternative model: {model_name}")
                return model
            if error and "429" in str(error):
                time.sleep(2)
    
    return None

# Initialize model
try:
    model = find_working_model()
    if not model:
        raise Exception("No working model found")
    chat_model = model  # Use the same model for chat
except Exception as e:
    logger.error(f"Failed to initialize any model: {str(e)}")
    raise

# Hotel data dictionary
hotel_data = {
    'name': 'K D M Grand Royal Hotel',
    'location': 'New York, USA',
    'rooms': [
        {
            'name': 'Luxury Suite',
            'price': 499,
            'size': '75 m²',
            'features': ['King-size bed', 'Ocean view', 'Private balcony', 'Luxury bathroom', 'Mini bar']
        },
        {
            'name': 'Presidential Suite',
            'price': 899,
            'size': '120 m²',
            'features': ['Master bedroom', 'Living room', 'Executive lounge access', 'Butler service', 'Private dining']
        },
        {
            'name': 'Standard Room',
            'price': 299,
            'size': '45 m²',
            'features': ['Queen-size bed', 'City view', 'Work desk', 'Rain shower', 'Coffee maker']
        },
        {
            'name': 'Single Room',
            'price': 199,
            'size': '30 m²',
            'features': ['Single bed', 'Garden view', 'Work corner', 'En-suite bathroom', 'Smart TV']
        }
    ],
    'amenities': [
        {'name': 'Infinity Pool', 'icon': 'swimming-pool', 'description': 'Stunning rooftop pool with city views'},
        {'name': 'Luxury Spa', 'icon': 'spa', 'description': 'World-class treatments and facilities'},
        {'name': 'Fitness Center', 'icon': 'dumbbell', 'description': '24/7 state-of-the-art equipment'},
        {'name': 'Fine Dining', 'icon': 'utensils', 'description': 'Award-winning restaurants'},
        {'name': 'Business Center', 'icon': 'business-time', 'description': 'Full-service business facilities'}
    ],
    'images': ['hotel1.jpg', 'hotel2.jpg']
}

def load_knowledge_base():
    knowledge = ""
    
    # Try to load PDF if exists
    if os.path.exists('hotel_data.pdf'):
        with open('hotel_data.pdf', 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                knowledge += page.extract_text()
    
    # Try to load CSV if exists
    elif os.path.exists('hotel_data.csv'):
        df = pd.read_csv('hotel_data.csv')
        knowledge = df.to_string()
    else:
        # Use the existing hotel_data dictionary as fallback
        knowledge = str(hotel_data)
    
    return knowledge

# Initialize Flask app with correct template and static folders
app = Flask(__name__,
            template_folder=os.path.join('hotel_website', 'templates'),
            static_folder=os.path.join('hotel_website', 'static'))

@app.route('/', methods=['GET'])
def home():
    # Check if the request wants JSON
    if request.headers.get('Accept') == 'application/json':
        return jsonify(hotel_data)
    # Otherwise render the HTML template
    return render_template('index.html', hotel=hotel_data, bot_response=None)

@app.route('/ask_bot', methods=['POST'])
def ask_bot():
    try:
        logger.debug("Received ask_bot request")
        user_input = request.json.get('message', '').strip() if request.is_json else request.form.get('user_input', '').strip()
        logger.debug(f"User input: {user_input}")
        
        if not user_input:
            logger.warning("No user input provided")
            return jsonify({
                'status': 'error',
                'response': 'Please enter your question'
            })

        # Create a simple context string with proper formatting
        context = f"""As an AI assistant for {hotel_data['name']}, use the following information to answer questions:

Hotel Information:
- Name: {hotel_data['name']}
- Location: {hotel_data['location']}

Available Rooms:
{chr(10).join(f'- {room["name"]}: ${room["price"]} per night, {room["size"]}\n  Features: {", ".join(room["features"])}' for room in hotel_data['rooms'])}

Hotel Amenities:
{chr(10).join(f'- {amenity["name"]}: {amenity["description"]}' for amenity in hotel_data['amenities'])}"""
        
        logger.debug("Created context for prompt")

        # Maximum retries for rate limiting
        max_retries = 3
        retry_count = 0
        last_error = None

        while retry_count < max_retries:
            try:
                prompt = f"""You are a helpful hotel assistant for {hotel_data['name']}.
                Please answer this question based on our hotel information: {user_input}

                Use this information to answer:
                {context}

                Keep your response concise and professional. If you cannot find specific information in the provided data,
                say: "I apologize, but I don't have that specific information available."
                """
                
                logger.debug(f"Attempt {retry_count + 1} of {max_retries}")
                response = chat_model.generate_content(prompt)
                
                if response and hasattr(response, 'text'):
                    return jsonify({
                        'status': 'success',
                        'response': response.text
                    })
                else:
                    raise ValueError("Invalid response format from API")

            except Exception as e:
                last_error = str(e)
                logger.warning(f"Attempt {retry_count + 1} failed: {last_error}")
                
                if "429" in str(e):  # Rate limit error
                    retry_count += 1
                    if retry_count < max_retries:
                        wait_time = (2 ** retry_count)  # Exponential backoff
                        logger.info(f"Rate limit hit, waiting {wait_time} seconds")
                        time.sleep(wait_time)
                        continue
                break  # Break for non-rate-limit errors or if max retries reached
            
        # If we get here, all retries failed or we hit a non-retryable error
        error_msg = "I apologize, but I'm currently experiencing high demand. Please try again in a moment."
        if "quota" in last_error.lower():
            error_msg = "I apologize, but our service is currently at capacity. Please try again later."
        
        logger.error(f"All attempts failed: {last_error}")
        return jsonify({
            'status': 'error',
            'response': error_msg
        })

    except Exception as e:
        logger.error(f"Unexpected error in ask_bot: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'response': "I apologize, but I encountered an unexpected error. Please try again."
        })

if __name__ == '__main__':
    app.run(debug=True, port=5003)