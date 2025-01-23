import requests 
import json
import time

import weather_check
import Image_downloader

from multiprocessing import Queue 
import engine 

city = 'colombo'
api_key = 'b4fd90c6c1a4e3d8161864df79a2cdb7'


# queries.get()

if __name__ == "__main__":
  print("Starting dynamic wallpaper")

  queries = Queue ()
  images = Queue()
  weather = {}

  weather_engine = weather_check.WeatherCheck(api_key, city, queries)
  weather_engine.start()
  
  downloader = Image_downloader.ImageDownloader(queries, images)
  downloader.start()
  
  engine = engine.Engine(images)
  engine.start()

  weather_engine.join()
  downloader.join()
  engine.join()



  
