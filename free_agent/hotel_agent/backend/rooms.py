from database import rooms_collection, users_collection
from datetime import datetime

# Clear existing data
rooms_collection.delete_many({})
users_collection.delete_many({})

# Insert room data
rooms = [
    {
        "room_no": 101,
        "type": "Deluxe Suite",
        "features": ["AC", "TV", "Hot Water", "Mini Bar", "King Size Bed", "Ocean View"],
        "price": "12000 LKR",
        "status": "available"
    },
    {
        "room_no": 102,
        "type": "Standard Room",
        "features": ["Fan", "TV", "Hot Water", "Queen Size Bed"],
        "price": "8000 LKR",
        "status": "available"
    },
    {
        "room_no": 103,
        "type": "Family Suite",
        "features": ["AC", "TV", "Hot Water", "Mini Kitchen", "Living Room", "2 Bedrooms"],
        "price": "15000 LKR",
        "status": "available"
    },
    {
        "room_no": 201,
        "type": "Premium Suite",
        "features": ["AC", "Smart TV", "Hot Water", "Mini Bar", "King Size Bed", "Balcony", "City View"],
        "price": "18000 LKR",
        "status": "available"
    }
]

# Insert admin user
admin_user = {
    "username": "admin",
    "password_hash": "bcrypt_hash_here",  # In production, use proper password hashing
    "role": "admin",
    "name": "System Administrator",
    "contact": "admin@kdmhotel.com"
}

try:
    # Insert rooms
    result = rooms_collection.insert_many(rooms)
    print(f"Successfully inserted {len(result.inserted_ids)} rooms")
    
    # Insert admin user
    users_collection.insert_one(admin_user)
    print("Successfully inserted admin user")
    
    # Print all collections and their contents
    print("\nCurrent collections in database:")
    for room in rooms_collection.find():
        print(f"Room {room['room_no']}: {room['type']} - {room['status']}")
        
except Exception as e:
    print(f"Error inserting data: {e}")
