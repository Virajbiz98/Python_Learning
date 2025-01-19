import streamlit as st
import bcrypt
import pymongo
from datetime import datetime

# MongoDB setup
client = pymongo.MongoClient("mongodb+srv://Myuser123:Myuser123@cluster123.r0ahy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster123")
db = client["NEW_USER"]
collection = db["User info"]
Activity_collection = db["User Activity"]

def hash_password(password):
    if not password:  
        raise ValueError("Password cannot be empty")
    # Hash the password using bcrypt
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')  

# Verify password function
def verify_password(password, hashed_password):
    # Convert hashed_password back to bytes for bcrypt check
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

# Log user activity
def log_activity(username):
    Activity_collection.insert_one({
        "username": username,
        "login_time": datetime.now()
    })

# Register user
def user_register():
    st.subheader("Register")
    name = st.text_input("Enter your name")
    username = st.text_input("Enter your username")
    password = st.text_input("Enter your password", type="password")
    password2 = st.text_input("Confirm your password", type="password")
    
    if st.button("Register"):
        if not password or not password2:
            st.warning("Password fields cannot be empty!")
        elif password != password2:
            st.warning("Passwords do not match!")
        elif collection.find_one({"username": username}):
            st.warning("Username already exists")
        else:
            try:
                hashed_password = hash_password(password)  # Hash the password
                collection.insert_one({
                    "username": username,
                    "password": hashed_password  # Store as string
                })
                st.success("Registration successful! You can log in now.")
            except ValueError as e:
                st.error(str(e))

# Login user
def login_user():
    st.subheader("Login")
    username = st.text_input("Enter your username", key="login_username")
    password = st.text_input("Enter your password", type="password", key="login_password")
    
    if st.button("Login"):
        user = collection.find_one({"username": username})
        if user:
            # Verify password
            if verify_password(password, user['password']):
                st.success(f"Welcome, {username}!")
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

# Main application
st.title("Welcome to :violet[MONGODATA]🌵")

menu = st.sidebar.selectbox('Menu', ['Login', 'Register', "View Login Activity"])

if menu == "Register":
    user_register()

elif menu == "Login":
    login_user()

elif menu == "View Login Activity":
    view_user_activity()
