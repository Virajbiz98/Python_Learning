from flask import Flask, render_template
import os

# Update the static_folder to point to the correct location
app = Flask(__name__, 
           template_folder=os.path.join('hotel_website', 'templates'),
           static_folder=os.path.join('hotel_website', 'static'))

@app.route('/')
def home():
    hotel_data = {
        'name': 'K D M Grand Royal Hotel',
        'location': 'New York, USA',
        'rooms': [
            {
                'name': 'Luxury Suite',
                'price': 499,
                'size': '75 m²',
                'features': ['King-size bed', 'Ocean view', 'Private balcony', 'Luxury bathroom', 'Mini bar']
            },
            {
                'name': 'Presidential Suite',
                'price': 899,
                'size': '120 m²',
                'features': ['Master bedroom', 'Living room', 'Executive lounge access', 'Butler service', 'Private dining']
            },
            {
                'name': 'Standard Room',
                'price': 299,
                'size': '45 m²',
                'features': ['Queen-size bed', 'City view', 'Work desk', 'Rain shower', 'Coffee maker']
            },
            {
                'name': 'Single Room',
                'price': 199,
                'size': '30 m²',
                'features': ['Single bed', 'Garden view', 'Work corner', 'En-suite bathroom', 'Smart TV']
            }
        ],
        'amenities': [
            {'name': 'Infinity Pool', 'icon': 'swimming-pool', 'description': 'Stunning rooftop pool with city views'},
            {'name': 'Luxury Spa', 'icon': 'spa', 'description': 'World-class treatments and facilities'},
            {'name': 'Fitness Center', 'icon': 'dumbbell', 'description': '24/7 state-of-the-art equipment'},
            {'name': 'Fine Dining', 'icon': 'utensils', 'description': 'Award-winning restaurants'},
            {'name': 'Business Center', 'icon': 'business-time', 'description': 'Full-service business facilities'}
        ],
        'images': ['hotel1.jpg', 'hotel2.jpg']
    }
    return render_template('index.html', hotel=hotel_data)

if __name__ == '__main__':
    app.run(debug=True, port=5002)