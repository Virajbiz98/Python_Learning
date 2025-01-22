import requests 
import json

import weather_check

city = 'colombo'
api_key = 'b4fd90c6c1a4e3d8161864df79a2cdb7'



if __name__ == "__main__":
  print("Starting dynamic wallpaper")
  weather_engine = weather_check.WeatherCheck(api_key, city, 5)
  weather_engine.start()
  weather_engine.join()






  
