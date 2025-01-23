from threading import Thread
from multiprocessing import Process
import requests
import json 
# import time

class ImageDownloader(Process):
    def __init__(self, queries, images):
        super(ImageDownloader, self).__init__()
        self.queries = queries
        self.previous_query = None
        self.images = images

# scattered+clouds
    
    def run(self):
        query = self.queries.get()
        print("Query", query)
        while query is not None:
            # if self.previous_query == query:
            #     print("Same query is requested.")
            #     continue

            url = f'https://unsplash.com/napi/search/photos?page=1&query={query}'

            r = requests.get(url, stream = True)

            if r.status_code == 200:
                response_json = json.loads(r.content)
                results = response_json['results']
                for image in results:
                    self.__download_iamge(image)
                
            else:
                print("Image Couldn\'t be retrived")

            
            # time.sleep(5)
            query = self.queries.get()
            self.previous_query = query

    def __download_iamge(self, image):
        urls = image['urls']
        raw = urls['raw']
        print(raw)

        res = requests.get(raw, stream=True)
        if res.status_code == 200:
            res.raw.decode_content = True
            # https://images.unsplash.com/photo-1589486022941-a92fb1c4d8e5?

            x = raw.split('?')

            
            image_name = x[0].split('/')[-1]

            file_name = f'images/{image_name}.jpg'
            with open(file_name, 'wb') as f:
                f.write(res.content)

            self.images.put(file_name)
            
            print('Image sucessfully Downloaded: ', file_name)
        else:
            print("Image Couldn\'t be retreived")


