import streamlit as st 
import pymongo 
from mongo import collection

# Initialize connection.
# Uses st.cach_resource to only run once.
@st.cache_resource
def init_connection():
    return pymongo.MongoClient(**st.secrets["mongo"])

Client = init_connection()

# Pull data from collection.
# 
@st.cache_data(ttl=600)
def get_data():
    db = Client.CPU_Temperature

items = get_data()

# Print results.
for item in items:
    st.write(f"{item["first_project"]} has a :{item["CPU_Temperature"]}:")


