import streamlit as st 
import pymongo 
from pymongo.server_api import ServerApi

# # connect to the DB .
# @st.experimental_singleton
# def connect_db():
#     client = pymongo.MongoClient(
#         st.secrets["mongo"]["connection_url"],
#         server_api=ServerApi('1')
#     )
#     db = client.get_database('main')
#     return db.users

# collection=st.secrets["collection"]
# user_db = connect_db()

# # Initialize Session States .

# if 'username' not in st.session_state:
#     st.session_state.username = ''

# if 'form' not in st.session_state:
#     st.session_state.form = ''

# # key features selection, just to demonstrate how usernames are passed 
# application = st.selectbox('key features', 'Do smth', 'Do smth again')

import pymongo

client = pymongo.MongoClient("mongodb+srv://DEVMONGO:DEVMONGO@cluster0.wcbtj.mongodb.net/")
db = client["first_project"] 
collection = db["CPU_Temperature"]

def login():
    st.title("Welcome to :violet[MONGODB]🌵")
    choisce = st.selectbox("Login/signup",["Login","Sign up"])
    if choisce == "Login":
            username = st.text_input("Username")
            password = st.text_input("Password", type="password")
            st.button("Login")

            # if st.button("Login"):
            user = collection.find_one({"username": username, "password":password})
        # test = collection.insert_one({"username": "admin","password":"admin1"})
        # print(test)
            if user:
                st.success("Login Succesful!")
                st.write(f"Welcome, {user['username']}!")
                documents = collection.find({"username":username})
                for doc in documents:
                    st.write(doc)

            # else:
            #     st.error("invalid username or password")

    else:
        email = st.text_input('Email', placeholder= 'Enter your Email')
        username = st.text_input('Username', placeholder= 'Enter Your Username')
        password1 = st.text_input('Password', placeholder='Enter Your Password', type='password')
        password2 = st.text_input('Confirm Password', placeholder='Confirm Your Password', type = 'password')

        st.button('Create my account')

        if user:
                st.success("Login Succesful!")
                st.write(f"Welcome, {user['username']}!")
                documents = collection.find({"username":username})
                for doc in documents:
                    st.write(doc)

login()


# def display_data():
#     st.title("User Data")
#     users = collection.find()
#     for user in users:
#         st.write(user)

# if __name__ == "__main__":
#     display_data()


