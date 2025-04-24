import warnings
import logging


import streamlit as st

# disbale warning and info , bugs log

warnings.filterwarnings("ignore")
logging.getLogger("transformers").setLevel(logging.ERROR)


st.title("ChatUI")
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

    response="Hi! I'm Chatty"

    st.chat_message('assistant').markdown(response)
    st.session_state.messages.append({'role':'assistant','content':response})