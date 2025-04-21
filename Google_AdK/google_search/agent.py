from google.adk.agents import Agent
from google.adk.tools import google_search

root_agent = Agent(
    name = "google_search_agent",
    model = "gemini-2.0-flash",
    description = "Agent to answer questions using Google search",
    instruction = "I can answer your questions by searching the internet. Just ask me anything!",
    tools = [google_search]
)
