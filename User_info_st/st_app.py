# # import pymongo.mongo_client
# # import streamlit as st 
# # import pymongo 
# # from mongo import collection

# # Client = pymongo.mongo_client("mongodb+srv://DEVMONGO:DEVMONGO@cluster0.wcbtj.mongodb.net/")
# # db ="database-first_project"
# # collection=db(["CPU_Temperature"])

# # # Initialize connection.
# # # Uses st.cach_resource to only run once.
# # @st.cache_resource
# # def init_connection():
# #     return pymongo.MongoClient(**st.secrets["mongo"])

# # Client = init_connection()

# # # Pull data from collection.
# # # 
# # @st.cache_data(ttl=600)
# # def get_data():
# #     db = Client(collection)

# # items = get_data()

# # # Print results.
# # for item in items:
# #     st.write(f"{item["first_project"]} has a :{item["CPU_Temperature"]}:")

# import streamlit as st
# from pymongo import MongoClient

# # Function to connect to MongoDB
# def connect_to_mongodb(uri):
#     try:
#         client = MongoClient(uri)
#         db = client["your_database_name"]  # Replace with your database name
#         return db
#     except Exception as e:
#         st.error(f"Error connecting to MongoDB: {e}")
#         return None

# # Function to verify user credentials
# def verify_user(db, username, password):
#     try:
#         users_collection = db["users"]  # Replace with your users collection
#         user = users_collection.find_one({"username": username, "password": password})
#         return user is not None
#     except Exception as e:
#         st.error(f"Error verifying user: {e}")
#         return False

# # Function to fetch data
# def fetch_data(db):
#     try:
#         collection = db["your_collection_name"]  # Replace with your collection name
#         data = list(collection.find())
#         return data
#     except Exception as e:
#         st.error(f"Error fetching data: {e}")
#         return []

# # Streamlit app
# st.title("MongoDB User Login")

# # Login form
# username = st.text_input("Username")
# password = st.text_input("Password", type="password")
# uri = st.text_input("MongoDB URI", type="password")

# if st.button("Login"):
#     # Connect to MongoDB
#     db = connect_to_mongodb(uri)
#     if db is not None:  # Explicitly check if the database is not None
#         # Verify user
#         if verify_user(db, username, password):
#             st.success("Login successful!")
#             # Fetch and display data
#             data = fetch_data(db)
#             if data:
#                 st.write("Data from MongoDB:")
#                 st.write(data)
#             else:
#                 st.info("No data found in the collection.")
#         else:
#             st.error("Invalid username or password.")
#     else:
#         st.error("Failed to connect to MongoDB.")
