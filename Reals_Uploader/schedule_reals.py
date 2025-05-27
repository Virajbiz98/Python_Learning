import os
import requests
import csv
from datetime import datetime
from time import sleep

# 🛠 Replace with your actual page info
PAGE_ID = 'YOUR_PAGE_ID'
ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'

# 📁 Path to folder with video files
VIDEO_FOLDER = 'reels_to_upload'

# 📄 Path to CSV file
CSV_PATH = 'reels_schedule.csv'

# 📦 Facebook upload endpoint
UPLOAD_URL = f'https://graph.facebook.com/v19.0/{PAGE_ID}/video_reels'

def upload_and_schedule_reel(video_path, title, description, scheduled_time):
    print(f'Uploading: {video_path} @ {scheduled_time}')
    files = {'video': open(video_path, 'rb')}
    data = {
        'access_token': ACCESS_TOKEN,
        'title': title,
        'description': description,
        'video_state': 'SCHEDULED',
        'scheduled_publish_time': int(scheduled_time.timestamp()),
    }

    response = requests.post(UPLOAD_URL, files=files, data=data)
    if response.status_code == 200:
        print(f'✅ Scheduled: {video_path}')
    else:
        print(f'❌ Error: {response.status_code} – {response.text}')

def main():
    with open(CSV_PATH, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            video_file = row['filename']
            title = row['title']
            description = row['description']
            try:
                scheduled_time = datetime.strptime(row['schedule_time'], '%Y-%m-%d %H:%M:%S')
            except ValueError:
                print(f"❌ Invalid date format for {video_file}")
                continue

            video_path = os.path.join(VIDEO_FOLDER, video_file)

            if not os.path.exists(video_path):
                print(f"❌ File not found: {video_path}")
                continue

            upload_and_schedule_reel(video_path, title, description, scheduled_time)
            sleep(2)  # small delay between uploads

if __name__ == '__main__':
    main()
