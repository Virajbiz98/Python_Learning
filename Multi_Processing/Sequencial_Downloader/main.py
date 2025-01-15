import requests 
import time
# http://picsum.photos/id/1/200/300

def get_image_urls(count):

    if count <= 0:
        print("Invalid count")
        return 

    for i in range(0, count):
        url = f'http://picsum.photos/id/{i}/200/300'
        yield url

start = time.time_ns()

urls = get_image_urls(100) 
urls = get_image_urls(100) 

for i, url in enumerate(urls):
    r = requests.get(url, stream= True)
    if r.status_code == 200:
        r.raw.decode_content = True
        file_name = f'images/{i}.jpg'

    with open(file_name,'wb') as f:
        f.write(r.content)

    print('Image sucessfully Downladed: ', file_name)
else:
    print('Image Couldn\'t beretreved')

diff = time.time_ns() - start

print("Duration", diff / 1000000)
# Duration 289994.102
