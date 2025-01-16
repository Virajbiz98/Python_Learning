
import streamlit as st
import bcrypt 
import pymongo 
from datetime import datetime

client = pymongo.MongoClient("mongodb+srv://Myuser123:Myuser123@cluster123.r0ahy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster123")
db = client["NEW_USER"]
collection = db["User info"]
Activity_collection = db["User Activity"]


def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'),salt)

def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password)

# this funtion for stor user activity
def log_activity(username):
    Activity_collection.insert_one({"username":username,
                                    "login_time":datetime.now()})
    

def user_register():
    st.subheader("Reister")
    name = st.text_input("Enter your name")
    username = st.text_input("Enter your username")
    password = st.text_input(b"Enter your password")
    if st.button("Register"):
        if collection.find_one({"username":username}):
            st.warning("Username already exists")
        else:
            hashed_password = hash_password(password)
            collection.insert_one({"username": username,"password": hashed_password})
            st.success("Registration successful!")

def login_user():
    st.subheader("Login")
    username = st.text_input("Enter your username",key="login_username")
    password = st.text_input("Enter your password",type="password",key="login_password")
    if st.button("Login"):
        user = collection.find_one({"username":username})
        if user:
            # verify password
            if verify_password(password, user['password']):
                st.success(f"Welcome {username}!")
                log_activity(username)
            else:
                st.error("Invalid password!")
        else:
            st.error("User not found!")

# View user activity
def view_user_activity():
    st.subheader("User Login Activity")
    activities = Activity_collection.find()
    for activity in activities:
        username = activity["username"]
        login_time = activity["login_time"].strftime("%Y-%m-%d %H:%M:%S")
        st.write(f"User: {username}, Login Time: {login_time}")

st.title("Welcome to :violet[MONGODATA]🌵")

menu = st.sidebar.selectbox('Menu',['Login', 'Register',"View Login Activity"])

if menu == "Register":
    user_register()

elif menu == "Login":
    login_user()

elif menu == "View Login Activity":
    view_user_activity()

            




