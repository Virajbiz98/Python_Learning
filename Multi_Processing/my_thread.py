from threading import Thread
from multiprocessing import Process
import requests 
import os 


# class ImageDownloader(Thread):
class ImageDownloader(Process):
    def __init__(self, thread_id, name, urls, results):
        super(ImageDownloader, self).__init__()
        self.id = thread_id
        self.name = name
        self.urls = urls
        self.success_count = 0
        self.results = results

    def run(self):
        # print(num_threads)
        for i, url in enumerate(self.urls):
            if self.download_image(url, f"{self.id}-{i}"):
                self.success_count += 1

        self.results.put(self.success_count)

    def download_image(self, url, image_number):
        os.makedirs('images', exist_ok=True)
        r = requests.get(url, stream= True)
        if r.status_code == 200:
            # Set decode_content value to True, otherwise the downloaded image file's size will be 
            r.raw.decode_content = True
            file_name = f".images/{image_number}.jpg"
            #Open a local file with wb ( write binary) permission.
            with open(file_name,'wb') as f:
                f.write(b"Image data")
            print('Image sucessfully Downladed: ', file_name)
            return True
        else:
            print('Image Couldn\'t beretreved')
            return False 
