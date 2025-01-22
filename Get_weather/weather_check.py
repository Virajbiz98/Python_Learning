from threading import Thread 
import requests
import json
import time


class WeatherCheck(Thread):

    def __init__(self, api_key, city, delay = 5):
        super(WeatherCheck, self).__init__()
        self.api_key = api_key
        self.city = city
        self.delay = delay

    def run(self):
        while True:
            weather = self.__get_weather_report(self.api_key, self.city)
            print(weather)
            time.sleep(self.delay)

    def __get_weather_report(self,api_key,city):
        url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}'
        response = requests.get(url)
        if response.status_code == 200:
            json_content = json.loads(response.content)
            weather = json_content['weather']
            if weather:
                return weather[0]