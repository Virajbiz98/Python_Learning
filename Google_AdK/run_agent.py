from google_search.agent import root_agent

if __name__ == "__main__":
    question = input("Ask a question: ")
    response = root_agent(question)
    print(response)
