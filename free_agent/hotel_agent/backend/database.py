from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable is not set")

try:
    print(f"Attempting to connect to MongoDB...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    
    # Verify connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB!")
    
    # Initialize database
    db = client["kdm_hotel"]
    
    # Create collections with schema validation
    # Rooms collection
    if "rooms" not in db.list_collection_names():
        db.create_collection("rooms", validator={
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["room_no", "type", "price", "status"],
                "properties": {
                    "room_no": {"bsonType": "int"},
                    "type": {"bsonType": "string"},
                    "features": {"bsonType": "array"},
                    "price": {"bsonType": "string"},
                    "status": {"enum": ["available", "booked", "maintenance"]}
                }
            }
        })
    rooms_collection = db["rooms"]
    rooms_collection.create_index("room_no", unique=True)
    
    # Bookings collection
    if "bookings" not in db.list_collection_names():
        db.create_collection("bookings", validator={
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["room_no", "name", "check_in", "check_out", "status"],
                "properties": {
                    "room_no": {"bsonType": "int"},
                    "name": {"bsonType": "string"},
                    "check_in": {"bsonType": "date"},
                    "check_out": {"bsonType": "date"},
                    "status": {"enum": ["confirmed", "checked_in", "checked_out", "cancelled"]},
                    "total_price": {"bsonType": "string"},
                    "contact": {"bsonType": "string"}
                }
            }
        })
    bookings_collection = db["bookings"]
    bookings_collection.create_index([("room_no", 1), ("check_in", 1)])
    
    # Users collection for staff/admin access
    if "users" not in db.list_collection_names():
        db.create_collection("users", validator={
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["username", "password_hash", "role"],
                "properties": {
                    "username": {"bsonType": "string"},
                    "password_hash": {"bsonType": "string"},
                    "role": {"enum": ["admin", "staff", "receptionist"]},
                    "name": {"bsonType": "string"},
                    "contact": {"bsonType": "string"}
                }
            }
        })
    users_collection = db["users"]
    users_collection.create_index("username", unique=True)
    
    print("\nAvailable collections:")
    print(db.list_collection_names())
    
except ServerSelectionTimeoutError:
    print("Error: Could not connect to MongoDB server. Connection timed out after 5 seconds.")
    print("Please check if:")
    print("1. Your MongoDB Atlas cluster is running")
    print("2. Your IP address is whitelisted in MongoDB Atlas")
    print("3. Your username and password are correct")
    raise
except ConnectionFailure as e:
    print(f"Error: Could not authenticate with MongoDB: {e}")
    raise
except Exception as e:
    print(f"Unexpected error connecting to MongoDB: {e}")
    raise

