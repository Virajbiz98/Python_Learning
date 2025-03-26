# Building a interactive Flet App with python
# API's and Stret and Map 

import flet as ft 
import requests 
from api_key import API_KEY


MAP_URL = "Https://www.openstreetmap.org/export/embed.html?bbox={lon}%2C{lat}%2C{lon}%2C{lat}&layer=mapnik"

BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

# Build out the API and get a response 
#API_KEY = "b03cd6345964bed883cd59e659a1d299"

#MAP_URL = "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/0,0,1/800x800?access_token=pk.eyJ1IjoiYXJ0aHVyYmF0aCIsImEiOiJja3B1Z2J4Z2YwMm1oMnZwZm1kZ3Z2Z3ZoIn0.1"

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
#print(get_weather("matara"))


def main(page: ft.Page):
    page.title = "Weather App with Python"
    page.bgcolor = ft.colors.BLUE_GREY_900
    page.padding = 20
    page.horizontal_alignment = ft.CrossAxisAlignment.CENTER
    page.window_width = 500 
    page.window_height = 700

    city_input = ft.TextField(
        label="Enter City",
        width=300,
        bgcolor=ft.colors.WHITE,
        color=ft.colors.BLACK,
        border_radius=10
    )

    results_text = ft.Text("",size=18, weight=ft.FontWeight.BOLD, color=ft.colors.WHITE)

    # create a map
    map_frame = ft.WebView(url="", width=600, height=400, visible=False)

    def search_weather(e):
        city = city_input.value.strip()
        if not city:
            results_text.value = "Please enter a city name..."
            page.update()
            return
        
        weather_data = get_weather(city)

        if weather_data:
            results_text.value = f"city: {weather_data["city"]}\nTemperature: {weather_data["temp"]}°C\nHumidity: {weather_data["humidity"]}%\nweather:{weather_data["weather"]}"

            map_frame.url = MAP_URL.format(lat=weather_data["lat"], lon=weather_data["lon"])
            map_frame.visible = True
        else:
            results_text.value = "City not found"
            map_frame.visible = False

        page.update()

    # Search Button
    search_button = ft.ElevatedButton(
        "Search",
        on_click=search_weather,
        bgcolor=ft.colors.BLUE_500,
        color=ft.colors.WHITE,
        style=ft.ButtonStyle(shape=ft.RoundedRectangleBorder(radius=10)) 
    )


    # Container to hold my UI
    container = ft.Container(
        content=ft.Column(
            alignment=ft.MainAxisAlignment.CENTER,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            controls=[
                ft.Text("Weather App", size=24, weight=ft.FontWeight.BOLD, color=ft.colors.WHITE),
                city_input,
                search_button,
                results_text,
                map_frame
            ],

        ),
        alignment=ft.alignment.center,
        padding=20,
        border_radius=15,
        bgcolor=ft.colors.BLUE_GREY_800,
        shadow=ft.BoxShadow(blur_radius=15, spread_radius=2, color=ft.colors.BLACK12)
    )

    page.add(container)





if __name__ == "__main__":
    ft.app(target=main)
   