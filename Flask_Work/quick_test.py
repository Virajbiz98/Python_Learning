import os
import requests
from dotenv import load_dotenv
import json

def test_gemini_api():
    # Load environment variables
    load_dotenv()
    api_key = os.getenv('GOOGLE_API_KEY')
    
    print("\nAPI Key Testing:")
    print("--------------")
    print(f"API Key present: {bool(api_key)}")
    if api_key:
        print(f"API Key length: {len(api_key)}")
        print(f"API Key prefix: {api_key[:4]}...")
    
    if not api_key:
        print("\nError: GOOGLE_API_KEY not found in .env file")
        return
    
    # API endpoint
    # Try the most basic model endpoint first
    url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    
    # Request headers
    headers = {
        'Content-Type': 'application/json'
    }
    
    # Request body
    data = {
        "contents": [{
            "parts": [{"text": "Say hello!"}]
        }]
    }
    
    try:
        print("\nMaking API Request:")
        print("------------------")
        print(f"URL: {url.replace(api_key, 'HIDDEN')}")
        print("\nRequest Headers:")
        print(json.dumps(headers, indent=2))
        print("\nRequest Body:")
        print(json.dumps(data, indent=2))
        
        print("\nSending request to Gemini API...")
        response = requests.post(url, headers=headers, json=data)
        print(f"\nStatus Code: {response.status_code}")
        
        print("\nResponse Headers:")
        for key, value in response.headers.items():
            print(f"{key}: {value}")
        
        print("\nResponse Body:")
        if response.text:
            try:
                print(json.dumps(response.json(), indent=2))
            except json.JSONDecodeError:
                print("Raw response:", response.text)
        else:
            print("Empty response body")
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    test_gemini_api()
