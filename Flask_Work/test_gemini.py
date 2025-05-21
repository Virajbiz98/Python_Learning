import os
from dotenv import load_dotenv
import google.generativeai as genai
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_gemini_api():
    # Load environment variables
    load_dotenv()
    api_key = os.getenv('GOOGLE_API_KEY')
    
    # Check if API key exists
    logger.info(f"API Key present: {bool(api_key)}")
    if not api_key:
        logger.error("GOOGLE_API_KEY not found in environment variables")
        return False
    
    try:
        # Configure the API
        genai.configure(api_key=api_key)
        
        # Get available models
        models = genai.list_models()
        logger.info("Available models:")
        for model in models:
            logger.info(f"- {model.name}")
        
        # Initialize the model
        model = genai.GenerativeModel('gemini-pro')
        
        # Test with a simple prompt
        prompt = "Say hello!"
        logger.info(f"Testing with prompt: {prompt}")
        
        response = model.generate_content(prompt)
        logger.info(f"Response received: {response.text}")
        
        return True
    except Exception as e:
        logger.error(f"Error testing Gemini API: {str(e)}", exc_info=True)
        return False

if __name__ == "__main__":
    success = test_gemini_api()
    print(f"\nAPI Test {'Successful' if success else 'Failed'}")
