
from threading import Thread
import requests 
import os 

class ImageDownloader(Thread):
    def __init__(self, thread_id, name, urls):
        super(ImageDownloader, self).__init__()
        self.id = thread_id
        self.name = name
        self.urls = urls

    def run(self):
        for i, url in enumerate(self.urls):
            self.download_image(url, f"{self.id}-{i}")

    def download_image(self, url, image_number):
        os.makedirs('images', exist_ok=True)
        r = requests.get(url, stream= True)
        if r.status_code == 200:
            # Set decode_content value to True, otherwise the downloaded image file's size will be 
            r.raw.decode_content = True
            file_name = f".images/{image_number}.jpg"
            # Open a local file with wb ( write binary) permission.
            with open(file_name,'wb') as f:
                f.write(b"Image data")
            print('Image sucessfully Downladed: ', file_name)
        else:
            print('Image Couldn\'t beretreved')

