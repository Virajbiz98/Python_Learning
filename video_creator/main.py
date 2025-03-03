import os
import sys
import json
import time
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create necessary directories
os.makedirs('assets', exist_ok=True)
os.makedirs('job_images', exist_ok=True)

# Default assets
DEFAULT_IMAGE_PATH = 'assets/default.jpg'
DEFAULT_MUSIC_PATH = 'assets/background.mp3'

# Create a default black image if it doesn't exist
if not os.path.exists(DEFAULT_IMAGE_PATH):
    try:
        from PIL import Image
        img = Image.new('RGB', (1280, 720), color='black')
        os.makedirs(os.path.dirname(DEFAULT_IMAGE_PATH), exist_ok=True)
        img.save(DEFAULT_IMAGE_PATH)
        logger.info(f"Created default image at {DEFAULT_IMAGE_PATH}")
    except Exception as e:
        logger.error(f"Failed to create default image: {e}")

try:
    from moviepy.editor import VideoFileClip, ImageClip, TextClip, AudioFileClip, concatenate_videoclips, CompositeAudioClip, ColorClip
    logger.info("Successfully imported moviepy")
except ImportError as e:
    logger.error(f"Error importing moviepy: {e}")
    sys.exit(1)

try:
    from gtts import gTTS
    from PIL import Image, ImageDraw, ImageFont
    import requests
    from bs4 import BeautifulSoup
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    from google.oauth2.credentials import Credentials
    logger.info("Successfully imported all required packages")
except ImportError as e:
    logger.error(f"Error importing dependencies: {e}")
    sys.exit(1)

# --- CONFIGURATION ---
JOB_DATA = {
    "title": "Senior Software Engineer",
    "company": "Tech Innovators Inc.",
    "location": "Berlin, Germany",
    "description": "Seeking experts in Python, AI, and cloud systems. Remote-friendly with visa sponsorship.",
    "perks": ["Healthcare", "Stock Options", "Flexible Hours"],
    "language": "en"  # Supports 'en', 'es', 'de', etc.
}
IMAGE_DIR = "job_images"
BACKGROUND_MUSIC = DEFAULT_MUSIC_PATH
YOUTUBE_CREDENTIALS = "youtube_credentials.json"
UNSPLASH_API_KEY = "YOUR_UNSPLASH_API_KEY"  # Get from https://unsplash.com/developers

def scrape_job_images(keyword):
    try:
        # Use Unsplash API to fetch job-related images
        if UNSPLASH_API_KEY == "YOUR_UNSPLASH_API_KEY":
            logger.warning("No Unsplash API key provided, using default image")
            return [DEFAULT_IMAGE_PATH]

        url = f"https://api.unsplash.com/search/photos?query={keyword}&client_id={UNSPLASH_API_KEY}"
        response = requests.get(url)
        data = response.json()
        image_urls = [img["urls"]["small"] for img in data["results"][:5]]  # Get 5 images
        
        if not os.path.exists(IMAGE_DIR):
            os.makedirs(IMAGE_DIR)
        
        downloaded_images = []
        # Download images
        for i, url in enumerate(image_urls):
            try:
                img_data = requests.get(url).content
                img_path = f"{IMAGE_DIR}/image_{i}.jpg"
                with open(img_path, 'wb') as f:
                    f.write(img_data)
                downloaded_images.append(img_path)
            except Exception as e:
                logger.error(f"Error downloading image {i}: {e}")
        
        return downloaded_images if downloaded_images else [DEFAULT_IMAGE_PATH]
    except Exception as e:
        logger.error(f"Error fetching images: {e}")
        return [DEFAULT_IMAGE_PATH]

def create_video(job_data):
    try:
        # Load images (scrape or use defaults)
        image_files = scrape_job_images(job_data["title"])
        logger.info(f"Using images: {image_files}")
        
        # Create text clips for each section
        def create_text_clip(text, duration, fontsize=40, color="white"):
            try:
                return TextClip(text, fontsize=fontsize, color=color, bg_color="black", size=(1280, 720)).set_duration(duration)
            except Exception as e:
                logger.error(f"Error creating text clip: {e}")
                return ColorClip(size=(1280, 720), color=(0, 0, 0)).set_duration(duration)
        
        # Generate text overlays
        clips = []
        try:
            clips = [
                create_text_clip(f"We're Hiring: {job_data['title']}", 3, fontsize=60),
                create_text_clip(f"At {job_data['company']}", 2),
                create_text_clip(f"Location: {job_data['location']}", 2),
                create_text_clip("About the Role:", 2),
                create_text_clip(job_data["description"], 5),
                create_text_clip("Perks:", 2),
                *[create_text_clip(f"- {perk}", 1.5) for perk in job_data["perks"]],
                create_text_clip("Apply Now at careers.techinnovators.com", 4, fontsize=50)
            ]
        except Exception as e:
            logger.error(f"Error creating text clips: {e}")
        
        # Combine text clips with images
        image_clips = []
        for img in image_files:
            try:
                clip = ImageClip(img).set_duration(3)
                image_clips.append(clip)
            except Exception as e:
                logger.error(f"Error creating image clip from {img}: {e}")
        
        if not clips and not image_clips:
            raise Exception("No clips created successfully")
            
        final_clip = concatenate_videoclips(clips + image_clips, method="compose")
        
        # Add voiceover (TTS)
        try:
            tts = gTTS(text=f"""
                {job_data['company']} is hiring a {job_data['title']} in {job_data['location']}.
                Key responsibilities: {job_data['description']}.
                Perks include: {', '.join(job_data['perks'])}.
                Apply today at careers.techinnovators.com.
            """, lang=job_data["language"])
            tts.save("voiceover.mp3")
            audio = AudioFileClip("voiceover.mp3")
        except Exception as e:
            logger.error(f"Error creating voiceover: {e}")
            audio = None
        
        # Add background music if available
        final_audio = audio if audio else None
        if os.path.exists(BACKGROUND_MUSIC):
            try:
                bg_audio = AudioFileClip(BACKGROUND_MUSIC).subclip(0, final_clip.duration)
                if audio:
                    final_audio = CompositeAudioClip([bg_audio.volumex(0.3), audio])
                else:
                    final_audio = bg_audio
            except Exception as e:
                logger.error(f"Error adding background music: {e}")
        
        # Compile final video
        if final_audio:
            final_clip = final_clip.set_audio(final_audio)
        
        output_path = "job_video.mp4"
        final_clip.write_videofile(output_path, fps=24, codec="libx264")
        logger.info(f"Video created successfully at {output_path}")
        return output_path
    except Exception as e:
        logger.error(f"Error in create_video: {e}")
        raise

# --- STEP 3: UPLOAD TO YOUTUBE <button class="citation-flag" data-index="1"> ---
def upload_to_youtube(video_file, job_data):
    credentials = Credentials.from_authorized_user_file(YOUTUBE_CREDENTIALS)
    youtube = build("youtube", "v3", credentials=credentials)
    
    request_body = {
        "snippet": {
            "title": f"HIRING: {job_data['title']} in {job_data['location']} | {job_data['company']}",
            "description": f"""
                {job_data['company']} is hiring! 🚀
                Role: {job_data['title']}
                Location: {job_data['location']}
                Apply: careers.techinnovators.com
            """,
            "tags": ["Hiring", job_data["title"], job_data["location"], "Jobs"]
        },
        "status": {"privacyStatus": "public"}
    }
    
    media = MediaFileUpload(video_file, chunksize=-1, resumable=True)
    response = youtube.videos().insert(
        part="snippet,status",
        body=request_body,
        media_body=media
    ).execute()
    return response["id"]

# --- RUN THE PIPELINE ---
if __name__ == "__main__":
    video_path = create_video(JOB_DATA)
    video_id = upload_to_youtube(video_path, JOB_DATA)
    print(f"✅ Video uploaded to YouTube! ID: {video_id}")
