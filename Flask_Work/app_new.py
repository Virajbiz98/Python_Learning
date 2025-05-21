from flask import Flask, render_template, request, jsonify
import os
import google.generativeai as genai
from dotenv import load_dotenv
import logging
import sys

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

# Initialize Flask app
app = Flask(__name__, 
    template_folder='hotel_website/templates',
    static_folder='hotel_website/static')

# Load environment variables
load_dotenv()

def init_genai():
    """Initialize and test the Gemini API connection"""
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        logger.error("GOOGLE_API_KEY not found in environment variables")
        return False

    try:
        genai.configure(api_key=api_key)
        
        # List available models first
        models = genai.list_models()
        logger.info("Available models:")
        for model in models:
            logger.info(f"- {model.name}")
        
        # Initialize the model
        model = genai.GenerativeModel('gemini-pro')
        
        # Test with a simple prompt
        response = model.generate_content("Test")
        if response and hasattr(response, 'text'):
            logger.info("Gemini API initialized successfully")
            return model
        else:
            logger.error("Failed to get valid response from Gemini API")
            return None
    except Exception as e:
        logger.error(f"Error initializing Gemini API: {str(e)}", exc_info=True)
        return None

# Initialize Gemini model
model = init_genai()

# Hotel data
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

@app.route('/')
def home():
    """Render the home page"""
    return render_template('index.html', hotel=hotel_data)

@app.route('/ask_bot', methods=['POST'])
def ask_bot():
    """Handle chat bot requests"""
    if not model:
        logger.error("Gemini model not initialized")
        return jsonify({
            'status': 'error',
            'response': 'Chat service is currently unavailable. Please try again later.'
        })

    try:
        user_input = request.form.get('user_input', '').strip()
        logger.debug(f"Received user input: {user_input}")
        
        if not user_input:
            return jsonify({
                'status': 'error',
                'response': 'Please enter your question'
            })

        # Create context for the AI
        prompt = f"""You are a helpful hotel assistant for {hotel_data['name']}.
        Answer this question using the following hotel information: {user_input}

        Hotel Details:
        - Name: {hotel_data['name']}
        - Location: {hotel_data['location']}

        Rooms Available:
        {chr(10).join(f'- {room["name"]}: ${room["price"]}/night, {room["size"]}, Features: {", ".join(room["features"])}' for room in hotel_data['rooms'])}

        Amenities:
        {chr(10).join(f'- {amenity["name"]}: {amenity["description"]}' for amenity in hotel_data['amenities'])}

        Keep your response professional, friendly, and concise. If you don't have specific information, say: "I apologize, but I don't have that specific information available."
        """

        try:
            response = model.generate_content(prompt)
            if response and hasattr(response, 'text'):
                return jsonify({
                    'status': 'success',
                    'response': response.text.strip()
                })
            else:
                raise ValueError("Invalid response from API")
        except Exception as api_error:
            logger.error(f"API Error: {str(api_error)}", exc_info=True)
            error_msg = "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
            if "quota" in str(api_error).lower():
                error_msg = "I apologize, but our service is temporarily unavailable. Please try again later."
            return jsonify({
                'status': 'error',
                'response': error_msg
            })

    except Exception as e:
        logger.error(f"General Error: {str(e)}", exc_info=True)
        return jsonify({
            'status': 'error',
            'response': 'An unexpected error occurred. Please try again.'
        })

if __name__ == '__main__':
    app.run(debug=True)
