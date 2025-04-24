import warnings
import logging


import streamlit as st

import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate

# load api from .env
load_dotenv()

# disbale warning and info , bugs log
warnings.filterwarnings("ignore")
logging.getLogger("transformers").setLevel(logging.ERROR)


st.title("Chatty")
# setup a session to hold all old messages or convos
if 'messages' not in st.session_state:
    st.session_state.messages=[]

# display all old messages

for message in st.session_state.messages:
    st.chat_message(message['role']).markdown(message['content'])

prompt=st.chat_input('enter a message')

if prompt:
    st.chat_message('user').markdown(prompt)
    # store the user prompts
    st.session_state.messages.append({'role':'user','content':prompt})

    groq_sys_prompt=ChatPromptTemplate.from_template(""" You are a very good AI assistant as named "Chatty",you always provide precise and concise answer as per user promptBe nice and poilte.
    """)
    # call the model
    model="llama3-8b-8192"

    groq_chat=ChatGroq(
        groq_api_key=os.environ.get("GROQ_API_KEY"),
        model_name=model
    )
    chain=groq_sys_prompt | groq_chat | StrOutputParser()

    response=chain.invoke({"user_prompt":prompt})
    st.chat_message('assistant').markdown(response)
    st.session_state.messages.append({'role':'assistant','content':response})