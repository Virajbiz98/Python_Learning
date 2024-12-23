# # import streamlit as st 
# # import pymongo 
# # from pymongo.server_api import ServerApi

# # # connect to the DB .
# # @st.experimental_singleton
# # def connect_db():
# #     client = pymongo.MongoClient(
# #         st.secrets["mongo"]["connection_url"],
# #         server_api=ServerApi('1')
# #     )
# #     db = client.get_database('main')
# #     return db.users

# # collection=st.secrets["collection"]
# # user_db = connect_db()

# # # Initialize Session States .

# # if 'username' not in st.session_state:
# #     st.session_state.username = ''

# # if 'form' not in st.session_state:
# #     st.session_state.form = ''

# # # key features selection, just to demonstrate how usernames are passed 
# # application = st.selectbox('key features', 'Do smth', 'Do smth again')

# # import pymongo

# # client = pymongo.MongoClient("mongodb+srv://DEVMONGO:DEVMONGO@cluster0.wcbtj.mongodb.net/")
# # db = client["first_project"] 
# # collection = db["CPU_Temperature"]

# # # login_username = st.secrets("db_username")
# # # login_password = st.secrets("password")
# # login_username = "myuser"
# # login_password = "admin123"

# # class Login:
# #     def login():
# #         st.title("Welcome to :violet[MONGODB]🌵")
# #         choisce = st.selectbox("Login/signup",["Login","Sign up"])
# #         if choisce == "Login":
# #             username = st.text_input("Username")
# #             password = st.text_input("Password", type="password")
# #             st.button("Login")

            

# #             # if st.button("Login"):
# #             user = collection.find_one({"username": username, "password":password})

# #             if username == login_username:
# #                   pass
# #             elif password == login_password:
# #                 st.button("Login")
# #                 # if st.button == True:
# #                 #         st.title("User Data")
# #                 #         users = collection.find()
# #                 #         for user in users:
# #                 #             st.write(user)
                            
# #                 # user = collection.find_one({"username": username, "password":password})
# #                 # for user in user:
# #                 #     st.write(user)
# #             else:
# #                 st.error("invalid username or password")
                  
# #         # test = collection.insert_one({"username": "admin","password":"admin1"})
# #         # print(test)
# #             # if user:
# #             #     st.success("Login Succesful!")
# #             #     st.write(f"Welcome, {user['username']}!")
# #             #     documents = collection.find({"username":username})
# #             #     for doc in documents:
# #             #         st.write(doc)

# #             # else:
# #             #     st.error("invalid username or password")

# #         else:
# #             email = st.text_input('Email', placeholder= 'Enter your Email')
# #             username = st.text_input('Username', placeholder= 'Enter Your Username')
# #             password1 = st.text_input('Password', placeholder='Enter Your Password', type='password')
# #             password2 = st.text_input('Confirm Password', placeholder='Confirm Your Password', type = 'password')

# #             st.button('Create my account')
# #             if st.button == True:
# #                         st.title("User Data")
# #                         users = collection.find()
# #                         for user in users:
# #                             st.write(user)
# #             print(user)



# #         # st.success("Login Succesful!")
# #         # st.write(f"Welcome, {user['username']}!")
# #         # documents = collection.find({"username":username})
# #         # for doc in documents:
# #         #     st.write(doc)

# #         # def display_data(login):
# #     def display_data(login):
# #         st.title("User Data")
# #         users = collection.find()
# #         for user in users:
# #             st.write(user)


# # # login_one = Login()
# # # # print(login_one.display_data())
# # # print(login_one.login())
# # # # login()


# # # def display_data():
# # #     st.title("User Data")
# # #     users = collection.find()
# # #     for user in users:
# # #         st.write(user)

# # # if __name__ == "__main__":
# # #     display_data()

# # login = Login()
# # login.login()

# #---------

# # import streamlit as st
# # import pymongo

# # # Connect to MongoDB
# # client = pymongo.MongoClient("mongodb+srv://myuser:admin123@cluster0.wcbtj.mongodb.net/")
# # db = client["first_project"]
# # collection = db["CPU_Temperature"]

# # # Default login credentials (replace with actual DB values in production)
# # login_username = "myuser"
# # login_password = "admin123"

# # # Define the Login class
# # class Login:
# #     @staticmethod
# #     def login():
# #         st.title("Welcome to :violet[MONGODB]🌵")
# #         choisce = st.selectbox("Login/signup", ["Login", "Sign up"])

# #         if choisce == "Login":
# #             # Login form
# #             username = st.text_input("Username")
# #             password = st.text_input("Password", type="password")
# #             login_button = st.button("Login")

# #             if login_button:
# #                 # Check if the credentials match in the collection
# #                 user = collection.find_one({"username": username, "password": password})

# #                 if user:
# #                     st.success(f"Welcome {user['username']}!")
# #                     # After login, display the user's collection data
# #                     Login.display_data(username)
# #                 else:
# #                     st.error("Invalid username or password")

# #         elif choisce == "Sign up":
# #             # Sign up form
# #             email = st.text_input('Email', placeholder='Enter your Email')
# #             username = st.text_input('Username', placeholder='Enter Your Username')
# #             password1 = st.text_input('Password', placeholder='Enter Your Password', type='password')
# #             password2 = st.text_input('Confirm Password', placeholder='Confirm Your Password', type='password')

# #             signup_button = st.button('Create my account')

# #             if signup_button:
# #                 # Check if passwords match
# #                 if password1 != password2:
# #                     st.error("Passwords do not match!")
# #                 else:
# #                     # Check if username already exists
# #                     existing_user = collection.find_one({"username": username})
# #                     if existing_user:
# #                         st.error("Username already exists!")
# #                     else:
# #                         # Create the new user and insert into DB
# #                         collection.insert_one({"username": username, "password": password1, "email": email})
# #                         st.success("Account created successfully!")
# #                         # Optionally, you could log the user in after successful creation
# #                         Login.display_data(username)

# #     @staticmethod
# #     def display_data(username):
# #         st.title("User Data")
# #         # You can display user-specific data from the collection
# #         users = collection.find({"username": username})
# #         for user in users:
# #             st.write(user)  # This will display user data for the logged-in user

# # # Run the login function
# # login = Login()
# # login.login()

# import streamlit as st
# import pymongo 



# client = pymongo.MongoClient("mongodb+srv://myuser:admin123@cluster0.wcbtj.mongodb.net/")
# db = client["first_project"]
# collection = db["CPU_Temperature"]

# login_username = "myuser"
# login_password = "admin123"

# class Login:
#     @staticmethod
#     def login():
#         st.title("Welcome to :violet[MONGODB]🌵")
#         choisce = st.selectbox("Login/signup", ["Login", "Sign up"])

#         if choisce == "Login":
#             # Login form
#             username = st.text_input("Username")
#             password = st.text_input("Password", type="password")
#             login_button = st.button("Login")

#             # Only process login after button click
#             if login_button:
#                 # Check if the credentials match in the collection
#                 user = collection.find_one({"username": username, "password": password})

#                 if user:
#                     st.success(f"Welcome {user['username']}!")
#                     # After login, display the user's collection data
#                     Login.display_data(username)
#                 else:
#                     st.error("Invalid username or password")

#         elif choisce == "Sign up":
#             # Sign up form
#             email = st.text_input('Email', placeholder='Enter your Email')
#             username = st.text_input('Username', placeholder='Enter Your Username')
#             password1 = st.text_input('Password', placeholder='Enter Your Password', type='password')
#             password2 = st.text_input('Confirm Password', placeholder='Confirm Your Password', type='password')

#             signup_button = st.button('Create my account')

#             # Handle account creation on button click
#             if signup_button:
#                 # Check if passwords match
#                 if password1 != password2:
#                     st.error("Passwords do not match!")
#                 else:
#                     # Check if username already exists
#                     existing_user = collection.find_one({"username": username})
#                     if existing_user:
#                         st.error("Username already exists!")
#                     else:
#                         # Create the new user and insert into DB
#                         collection.insert_one({"username": username, "password": password1, "email": email})
#                         st.success("Account created successfully!")
#                         # Optionally, you could log the user in after successful creation
#                         Login.display_data(username)

#     @staticmethod
#     def display_data(username):
#         # This method should only be called after successful login
#         st.title("User Data")
#         # Display collection data for that specific user
#         users = collection.find({"username": username})
#         for user in users:
#             st.write(user)  # This will display user data for the logged-in user

# # Run the login function
# login = Login()
# login.login()
