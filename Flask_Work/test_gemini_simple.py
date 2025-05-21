from dotenv import load_dotenv
import os
import google.generativeai as genai
import traceback

def test_api():
    # Load environment variables
    load_dotenv()
    api_key = os.getenv('GOOGLE_API_KEY')

    print("\nAPI Key Testing:")
    print("--------------")
    print(f"API Key present: {bool(api_key)}")
    if api_key:
        print(f"API Key length: {len(api_key)}")
        print(f"API Key prefix: {api_key[:4]}...")

    try:
        # Configure the API
        genai.configure(api_key=api_key)
        
        # List available models
        print("\nFetching available models...")
        for m in genai.list_models():
            print(f"\nFound model: {m.name}")
            print(f"Display name: {m.display_name}")
            print(f"Description: {m.description}")
        
        # Try to use the model
        print("\nTesting model generation...")
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content('Say hello!')
        print(f"\nModel response: {response.text}")
        
        return True
    except Exception as e:
        print(f"\nError occurred: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_api()
    print(f"\nTest {'successful' if success else 'failed'}")
