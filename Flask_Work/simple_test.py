import os
from dotenv import load_dotenv
import google.generativeai as genai
import sys

def main():
    # Load environment variables
    load_dotenv()
    api_key = os.getenv('GOOGLE_API_KEY')
    
    if not api_key:
        print("Error: No API key found")
        sys.exit(1)
        
    print(f"Using API key: {api_key[:4]}...")
    
    try:
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        
        # Create the model
        model = genai.GenerativeModel('gemini-pro')
        
        # Generate a response
        response = model.generate_content('Say hello!')
        
        # Print the response
        print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error: {type(e).__name__}: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
