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

def verify_api_key():
    # Load environment variables
    load_dotenv()
    api_key = os.getenv('GOOGLE_API_KEY')
    
    print("\nAPI Key Verification:")
    print("-" * 20)
    print(f"API Key present: {bool(api_key)}")
    if api_key:
        print(f"API Key length: {len(api_key)}")
        print(f"API Key prefix: {api_key[:8]}...")
        
        try:
            # Configure the Gemini API
            genai.configure(api_key=api_key)
            
            # List available models
            models = genai.list_models()
            print("\nAvailable Models:")
            print("-" * 20)
            model_found = False
            for m in models:
                if 'gemini' in m.name.lower():
                    print(f"Found model: {m.name}")
                    model_found = True
            
            if not model_found:
                print("No Gemini models found!")
                return False
                
            # Try a simple generation
            print("\nTesting API with simple prompt...")
            model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
            response = model.generate_content("Hello! Please respond with 'API is working!'")
            
            print(f"\nResponse received: {response.text}")
            return True
            
        except Exception as e:
            print(f"\nError: {str(e)}")
            print("\nPlease check that:")
            print("1. Your API key is valid")
            print("2. You have enabled the Gemini API in your Google Cloud Console")
            print("3. Your API key has access to the Gemini API")
            return False
    else:
        print("\nNo API key found in .env file!")
        return False

if __name__ == "__main__":
    success = verify_api_key()
    print(f"\nAPI Verification {'Successful' if success else 'Failed'}")
