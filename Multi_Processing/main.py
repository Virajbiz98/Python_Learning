import requests 
import time
import my_thread
# from threading import Thread
import requests 
# from queue import Queue
from multiprocessing import Queue, Manager


# http://picsum.photos/id/1/200/300

def get_image_urls(count):

    if count <= 0:
        print("Invalid count")
        return 

    for i in range(0, count):
        url = f'http://picsum.photos/id/{i}/400/600'
        yield url

if __name__ == '__main__':


    start = time.time_ns()

    urls = list(get_image_urls(100)) 

    urls_list = []
    num_threads = 10
    
    for i in range(0, len(urls),num_threads):
        l = urls[i: i + num_threads]
        urls_list.append(l)

    threads = []
    results = Queue()
    x = Manager().dict()

    for i in range(0, num_threads):
        thread = my_thread.ImageDownloader(i, f"Thread-{i}", urls_list[i], results)
        thread.start() #run funtion
        threads.append(thread)


    for thread in threads:
        thread.join()

    total = 0 

    # for i in range(0, num_threads):
    #     total += results.get()

    while not results.empty():
        total += results.get()

    print("Total Image Downloads", total)


    # for result in results:
    #     print(result)

    # for i, url in enumerate(urls):
    #      download_image(url, i)


    diff = time.time_ns() - start

    print("Duration", diff / 1000000)
    # # Duration 289994.102
