# # import pickle 
# # from pathlib import path 
# # import streamlit_authenticator as stauth 

# # names = ["seena", "John"]
# # usernames = ["user", "user 1"]
# # passwords = ["admin1", "admin2"]

# # hashed_passwords = stauth.Hasher(passwords).generate()

# # file_path = path(__file__).parent / "hashed_pw.pkl"
# # with file_path.open("wb") as file:
# #     pickle.dump(hashed_passwords, file)
    
# # hashed_passwords = stauth.Hasher(passwords).generate()
# # file_path = path(__file__).User_info_st / "hashed_pw.pkl"
# # with file_path.open("wb") as file:
# #     pickle.dump(hashed_passwords, file)

# import streamlit as st
# import pymongo
# import bcrypt
# import pickle

# # Initialize the hashed_pw.pkl file
# with open('hashed_pw.pkl', 'wb') as file:
#     pickle.dump({}, file)

# # MongoDB Connection
# client = pymongo.MongoClient("mongodb+srv://DEVMONGO:DEVMONGO@cluster0.wcbtj.mongodb.net/")
# db = client["first_project"]
# collection = db["cpu_temperature"]

# def load_passwords():
#     """Load passwords from hashed_pw.pkl"""
#     with open('hashed_pw.pkl', 'rb') as file:
#         return pickle.load(file)

# def save_passwords(passwords):
#     """Save passwords to hashed_pw.pkl"""
#     with open('hashed_pw.pkl', 'wb') as file:
#         pickle.dump(passwords, file)

# def login():
#     st.title("Welcome to :violet[MONGODB]🌵")

#     choice = st.selectbox("Login/Signup", ["Login", "Sign up"])
#     passwords = load_passwords()

#     if choice == "Login":
#         # Login form
#         username = st.text_input("Username")
#         password = st.text_input("Password", type="password")
#         login_button = st.button(label="Login")
        
#         if login_button:
#             user = collection.find_one({"username": username})
#             if username in passwords and bcrypt.checkpw(password.encode(), passwords[username]):
#                 st.success("Login Successful")
#                 st.write(f"Welcome, {username}")
#             elif user and bcrypt.checkpw(password.encode(), user["password"].encode()):
#                 st.success("Login Successful (From Database)")
#                 st.write(f"Welcome, {username}")
#             else:
#                 st.error("Invalid username or password")
    
#     elif choice == "Sign up":
#         # Sign-Up form
#         email = st.text_input("Email", placeholder="Enter your Email")
#         username = st.text_input("Username", placeholder="Enter your Username")
#         password1 = st.text_input("Password", placeholder="Enter your Password", type="password")
#         password2 = st.text_input("Confirm Password", placeholder="Confirm your Password", type="password")
#         signup_button = st.button("Create my account")

#         if signup_button:
#             if not email or not username or not password1 or not password2:
#                 st.warning("Please fill in all fields")
#             elif password1 != password2:
#                 st.error("Passwords do not match")
#             elif username in passwords:
#                 st.error("Username already exists")
#             else:
#                 # Hash the password
#                 hashed_password = bcrypt.hashpw(password1.encode(), bcrypt.gensalt())

#                 # Save to .pkl file
#                 passwords[username] = hashed_password
#                 save_passwords(passwords)

#                 # Save to MongoDB
#                 collection.insert_one({
#                     "email": email,
#                     "username": username,
#                     "password": hashed_password.decode()  # Store as string in MongoDB
#                 })

#                 st.success("Account created successfully! You can now log in.")

# # Run the login function
# login()
