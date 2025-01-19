import requests 
import time
import my_thread 

# http://picsum.photos/id/1/200/300

def get_image_urls(count):

    if count <= 0:
        print("Invalid count")
        return 

    for i in range(0, count):
        url = f'http://picsum.photos/id/{i}/1600/2400'
        yield url


start = time.time_ns()

urls = list(get_image_urls(100)) 

urls_list = []
num_threads = 10
 
for i in range(0, len(urls),num_threads):
    l = urls[i: i + num_threads]
    urls_list.append(l)

threads = []

for i in range(0, num_threads):
    thread = my_thread.ImageDownloader(i, f"Thread-{i}", urls_list[i])
    thread.start() #run funtion
    threads.append(thread)


for thread in threads:
    thread.join()



# for i, url in enumerate(urls):
#      download_image(url, i)


diff = time.time_ns() - start

print("Duration", diff / 1000000)
# # Duration 289994.102
