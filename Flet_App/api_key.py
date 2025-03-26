

API_KEY = "b03cd6345964bed883cd59e659a1d299"


import requests 

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
MAP_URL = "Https://www.openstreetmap.org/export/embed.html?bbox={lon}%2C{lat}%2C{lon}%2C{lat}&layer=mapnik"

def get_weather(city):
    params = {"q": city, "appid": API_KEY, "units": "metric"}  # Changed "imperial" to "metric" for Celsius
    response = requests.get(BASE_URL, params=params)

    if response.status_code == 200:
        data = response.json()
        print(data)  # Debug: Print the full API response
        return {
            "city": data["name"],
            "temp": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "weather": data["weather"][0]["description"],
            "lat": data["coord"]["lat"],
            "lon": data["coord"]["lon"]
        }
    return None

print(get_weather("matara"))