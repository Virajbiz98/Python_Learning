from dotenv import load_dotenv
import os
import google.generativeai as genai
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def list_available_models():
    try:
        # Load environment variables
        load_dotenv()
        api_key = os.getenv('GOOGLE_API_KEY')
        
        if not api_key:
            logger.error("GOOGLE_API_KEY not found in environment variables")
            return False
            
        # Configure API
        genai.configure(api_key=api_key)
        
        # List available models
        logger.info("Fetching available models...")
        models = genai.list_models()
        
        logger.info("\nAvailable Models:")
        logger.info("----------------")
        for model in models:
            logger.info(f"Name: {model.name}")
            logger.info(f"Display Name: {model.display_name}")
            logger.info(f"Description: {model.description}")
            logger.info("----------------")
            
        return True
    except Exception as e:
        logger.error(f"Error listing models: {str(e)}", exc_info=True)
        return False

if __name__ == "__main__":
    success = list_available_models()
    print(f"\nModel listing {'successful' if success else 'failed'}")
