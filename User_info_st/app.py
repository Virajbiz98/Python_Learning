# import pymongo
# import streamlit as st 
# from pymongo import MongoClient

# client = pymongo.MongoClient("mongodb+srv://DEVMONGO:DEVMONGO@cluster0.wcbtj.mongodb.net/")

# db = client["first_project"]
# collection = db["CPU_Temperature"]
# print(db)

# database_names = client.list_database_names()

# st.title("mongodb datainfomation")
# selected_database = st.selectbox("select a database",database_names)

# import streamlit as st

# # Create an empty container
# placeholder = st.empty()

# actual_email = "email"
# actual_password = "password"

# # Insert a form in the container
# with placeholder.form("login"):
#     st.markdown("#### Enter your credentials")
#     email = st.text_input("Email")
#     password = st.text_input("Password", type="password")
#     submit = st.form_submit_button("Login")

# if submit and email == actual_email and password == actual_password:
#     # If the form is submitted and the email and password are correct,
#     # clear the form/container and display a success message
#     placeholder.empty()
#     st.success("Login successful")
# elif submit and email != actual_email and password != actual_password:
#     st.error("Login failed")
# else:
#     pass


# import streamlit_authenticator as stuth
# import datetime 
# import re

# def sign_up():
#     st.subheader(',:green[Sign Up]')
#     email = st.text_input('Email', placeholder= 'Enter your Email')
#     username = st.text_input('Username', placeholder= 'Enter Your Username')
#     password1 = st.text_input('Password', placeholder='Enter Your Password', type='password')
#     password2 = st.text_input('Confirm Password', placeholder='Confirm Your Password', type = 'password')

# def app():
#     st.title('Welcome to :violet[MONGODB]🌵')

#     choisce = st.selectbox('Login/Signup',['Login','Sign Up'])
#     if choisce =='Login':
#         Email = st.text_input('Enter your Email Address')
#         Password = st.text_input('Enter Your Password',type='password')

#         st.button('Login')

#     else:
    #     email = st.text_input('Email', placeholder= 'Enter your Email')
    #     username = st.text_input('Username', placeholder= 'Enter Your Username')
    #     password1 = st.text_input('Password', placeholder='Enter Your Password', type='password')
    #     password2 = st.text_input('Confirm Password', placeholder='Confirm Your Password', type = 'password')

#         st.button('Create my account')

# print(app())

