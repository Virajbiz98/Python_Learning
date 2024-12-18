import streamlit as st 
import pymongo 
from pymongo.server_api import ServerApi

# connect to the DB .
@st.experimental_singleton
def connect_db():
    client = pymongo.MongoClient(
        st.secrets["mongo"]["connection_url"],
        server_api=ServerApi('1')
    )
    db = client.get_database('main')
    return db.users

user_db = connect_db()

# Initialize Session States .

if 'username' not in st.session_state:
    st.session_state.username = ''

if 'form' not in st.session_state:
    st.session_state.form = ''

# key features selection, just to demonstrate how usernames are passed 
application = st.selectbox('key features', 'Do smth', 'Do smth again')
