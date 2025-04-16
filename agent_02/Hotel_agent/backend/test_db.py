from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    MONGO_URI = os.getenv("MONGO_URI")
    if not MONGO_URI:
        print("Error: MONGO_URI not found in environment variables")
        return False
    
    try:
        print("Testing MongoDB connection...")
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("MongoDB connection successful!")
        
        db = client["kdm_hotel"]
        collections = db.list_collection_names()
        print(f"\nExisting collections: {collections}")
        
        print("\nCollection contents:")
        for collection in collections:
            count = db[collection].count_documents({})
            print(f"{collection}: {count} documents")
            
        return True
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        return False

if __name__ == "__main__":
    test_connection()
