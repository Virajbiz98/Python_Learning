from dotenv import load_dotenv
import os
import google.generativeai as genai
import requests
import json

def test_api_key(api_key):
    print("\nAPI Key Verification Test")
    print("-" * 30)
    
    # Basic checks
    print(f"API Key length: {len(api_key)}")
    print(f"API Key prefix: {api_key[:12]}...")
    
    # Test direct HTTP request to verify API key
    base_url = "https://generativelanguage.googleapis.com/v1/models"
    headers = {
        "Content-Type": "application/json",
    }
    
    try:
        print("\nTesting API key with direct request...")
        response = requests.get(f"{base_url}?key={api_key}", headers=headers)
        print(f"Status Code: {response.status_code}")
        if response.status_code == 200:
            print("✅ API key is valid!")
            return True
        else:
            print("❌ API key validation failed!")
            print(f"Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing API key: {str(e)}")
        return False

def test_gemini_api(api_key):
    print("\nGemini API Integration Test")
    print("-" * 30)
    
    try:
        # Configure the API
        genai.configure(api_key=api_key)
        
        # Test model listing
        print("Testing model listing...")
        models = genai.list_models()
        print("Available models:")
        for model in models:
            print(f"- {model.name}")
        
        # Test simple generation
        print("\nTesting content generation...")
        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')
        response = model.generate_content("Say 'Hello, testing!'")
        print(f"Response: {response.text}")
        
        print("✅ Gemini API integration test successful!")
        return True
    except Exception as e:
        print(f"❌ Gemini API test failed: {str(e)}")
        return False

def main():
    # Load environment variables
    load_dotenv()
    api_key = os.getenv('GOOGLE_API_KEY')
    
    if not api_key:
        print("❌ No API key found in .env file!")
        return
    
    # Run tests
    key_valid = test_api_key(api_key)
    if key_valid:
        gemini_valid = test_gemini_api(api_key)
        if gemini_valid:
            print("\n✅ All tests passed! Your API key is valid and working.")
        else:
            print("\n⚠️ API key is valid but Gemini API tests failed. Please check API access and quotas.")
    else:
        print("\n❌ API key validation failed. Please check your API key.")

if __name__ == "__main__":
    main()
