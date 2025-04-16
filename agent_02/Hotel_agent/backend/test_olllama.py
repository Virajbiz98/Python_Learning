import subprocess
print("Starting simple Ollama test...", flush=True)

prompt = "What are the features of a deluxe hotel room that has AC, TV, and Hot Water?"

try:
    print("Running Ollama...", flush=True)
    result = subprocess.run(
        ["ollama", "run", "mistral", prompt],
        capture_output=True,
        text=True,
        check=True,
        timeout=30
    )
    print("Response:", result.stdout.strip(), flush=True)
except Exception as e:
    print(f"Error: {str(e)}", flush=True)
