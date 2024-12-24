
import streamlit as st
import pymongo 
import bcrypt 


client = pymongo.MongoClient("mongodb+srv://DEVMONGO:DEVMONGO@cluster0.wcbtj.mongodb.net/")
db = client["first_project"]
collection = db["cpu_temperature"]
print(db)

login_username = "myuser"
login_password = "admin123"

def login():
    st.title("Welcome to :violet[MONGODB]🌵")

    choisce = st.selectbox("Login/signup", ["Login", "Sign up"])
    if choisce == "Login":
        # Login form
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        login_button = st.button(label="login")
        if login_button:
            if username == "admin" and password == "password123":
                st.success("Login Successful")
            # collection.insert_one({"username":"myuser", "password": "mypassword"})
            users = collection.find({"username": username})
            for user in users:
                st.write(user)

        else:
            st.error("invalid username or password")
    elif choisce == "Sign up":
            
            form_values = {
                 "email": None,
                 "username": None,
                 "password1": None,
                 "password2": None
            }
            # Sign up form
            form_values["email"] = st.text_input('Email', placeholder='Enter your Email')
            form_values["username"] = st.text_input('Username', placeholder='Enter Your Username')
            form_values["password1"] = st.text_input('Password', placeholder='Enter Your Password', type='password')
            form_values["password2"] = st.text_input('Confirm Password', placeholder='Confirm Your Password', type='password')

            signup_button = st.button('Create my account')

            if st.button:
                if not all(form_values.values()):
                    st.warning("pleas fil in all of the fields")
                else:
                    users = collection.find({"username": username})
                    for user in users:
                                st.write(user)

login()




# test = collection.insert_one({"username": "myuser","password":"admin123"})
# print(test.inserted_id)