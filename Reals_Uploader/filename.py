import os
import csv
from datetime import datetime, timedelta

import os

# Automatically use script's folder
script_dir = os.path.dirname(os.path.abspath(__file__))
folder_path = os.path.join(script_dir, 'reels_to_upload')



# Folder path with videos
folder_path = '/Users/vjb/Desktop/Reals_Uploader/reels_to_upload'




# Output CSV file
csv_file = 'reels_schedule.csv'

# Default scheduling start time (now + 10 mins)
base_time = datetime.now() + timedelta(minutes=10)

# Get list of video files in folder
video_files = [f for f in os.listdir(folder_path) if f.lower().endswith('.mp4')]

# Sort file names alphabetically (optional)
video_files.sort()

# Write to CSV
with open(csv_file, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['filename', 'schedule_time', 'title', 'description'])  # CSV headers

    for i, video in enumerate(video_files):
        scheduled_time = base_time + timedelta(days=i)  # e.g., one per day
        title = f'Reel {i + 1}'
        description = f'Automatically scheduled reel number {i + 1}'

        writer.writerow([
            video,
            scheduled_time.strftime("%Y-%m-%d %H:%M:%S"),
            title,
            description
        ])

print(f"CSV file created with {len(video_files)} entries → {csv_file}")
