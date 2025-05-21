from dotenv import load_dotenv
import os
import google.generativeai as genai
import json

def test_api():
    # Load environment variables
    load_dotenv()
    
    # Get API key
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        print("Error: GOOGLE_API_KEY not found in .env file")
        return False
        
    try:
        # Configure API
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        # Test simple generation
        response = model.generate_content("Say 'API is working!'")
        
        # Print response
        print("\nAPI Test Result:")
        print("----------------")
        print(f"API Key present: {bool(api_key)}")
        print(f"API Response: {response.text}")
        return True
        
    except Exception as e:
        print(f"\nError testing API: {str(e)}")
        return False

if __name__ == "__main__":
    test_api()
