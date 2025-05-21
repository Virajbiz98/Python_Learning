import os
import requests
from dotenv import load_dotenv
import json

def test_api_versions():
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
    
    # Test both v1 and v1beta endpoints
    versions = ['v1', 'v1beta']
    
    for version in versions:
        print(f"\nTesting {version} endpoint:")
        print("-" * 50)
        
        # API endpoint for listing models
        url = f"https://generativelanguage.googleapis.com/{version}/models?key={api_key}"
        
        try:
            print(f"\nRequesting available models from {version}...")
            response = requests.get(url)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                models = response.json()
                print("\nAvailable Models:")
                print("-----------------")
                for model in models.get('models', []):
                    print(f"\nModel Name: {model.get('name')}")
                    print(f"Display Name: {model.get('displayName', 'N/A')}")
                    print(f"Version: {model.get('version', 'N/A')}")
                    print(f"Description: {model.get('description', 'N/A')}")
                    print(f"Input Token Limit: {model.get('inputTokenLimit', 'N/A')}")
                    print(f"Output Token Limit: {model.get('outputTokenLimit', 'N/A')}")
                    print(f"Generation Methods: {', '.join(model.get('supportedGenerationMethods', []))}")
                    print("-" * 50)
            else:
                print("\nError Response:")
                print(json.dumps(response.json(), indent=2))
                
        except Exception as e:
            print(f"\nError: {str(e)}")

if __name__ == "__main__":
    test_api_versions()
