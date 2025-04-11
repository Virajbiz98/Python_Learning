from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    # Data to pass to the HTML template
    hotel_data = {
        'name': 'Grand Royal Hotel',
        'location': 'New York, USA',
        'rooms': ['Luxury Suite', 'Presidential Suite', 'Standard Room', 'Single Room'],
        'amenities': ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant'],
        'images': ['hotel1.jpg', 'hotel2.jpg']
    }
    return render_template('index.html', hotel=hotel_data)

if __name__ == '__main__':
    app.run(debug=True)
