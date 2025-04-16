from database import rooms_collection, bookings_collection
from flask import Flask, request, render_template, jsonify, send_from_directory
from chatbot import Chatbot
import os

app = Flask(__name__, 
    template_folder='../frontend/templates',
    static_folder='../frontend/static')
chatbot = Chatbot()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat")
def chat_page():
    return render_template("chatbot.html")

@app.route("/rooms")
def show_rooms():
    rooms = list(rooms_collection.find({}))
    return render_template("rooms.html", rooms=rooms)

@app.route("/book", methods=["POST"])
def book_room():
    room_no = int(request.form["room_no"])
    name = request.form["name"]

    bookings_collection.insert_one({"room_no": room_no, "name": name})
    rooms_collection.update_one({"room_no": room_no}, {"$set": {"status": "booked"}})
    return "Room booked!"

@app.route("/api/chat", methods=["POST"])
def chat():
    question = request.json.get("question")
    
    # Get current room data from database
    room_data = list(rooms_collection.find({}, {'_id': 0}))
    
    # Update chatbot with current room information
    for room in room_data:
        chatbot.update_hotel_data({
            f"Room {room['room_no']}": {
                "type": room.get('type', 'Standard'),
                "features": room.get('features', []),
                "price": room.get('price', 'Not specified'),
                "available": room.get('status') != 'booked'
            }
        })
    
    # Get response from chatbot
    response = chatbot.get_response(question)
    return jsonify({"response": response})

@app.route("/api/upload-pdf", methods=["POST"])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    if not file.filename.endswith('.pdf'):
        return jsonify({"error": "File must be a PDF"}), 400
    
    upload_folder = os.getenv('PDF_UPLOAD_FOLDER', 'backend/uploads')
    os.makedirs(upload_folder, exist_ok=True)
    
    file_path = os.path.join(upload_folder, file.filename)
    file.save(file_path)
    
    try:
        chatbot.process_pdf(file_path)
        return jsonify({"message": "PDF processed successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)
