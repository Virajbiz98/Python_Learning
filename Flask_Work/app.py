from flask import Flask, render_template
import os

# Update the static_folder to point to the correct location
app = Flask(__name__, 
           template_folder=os.path.join('hotel_website', 'templates'),
           static_folder=os.path.join('hotel_website', 'static'))

@app.route('/')
def home():
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
