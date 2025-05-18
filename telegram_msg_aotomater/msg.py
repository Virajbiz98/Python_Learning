import asyncio
from telethon import TelegramClient
from datetime import datetime

# Your Telegram API credentials
api_id = '******'
api_hash = '*************'
phone_number = '+94******'

# Message to be shared
message_to_send = """🎬 Download 100,000 AI Reels Bundle – Absolutely Free for Students!

We’re excited to share this massive collection of AI-generated reels with you! You can download the bundle using the links below. If one link doesn’t work, feel free to try the others provided.

AI MUSIC Videos - https://yourlink

EDUCTION Reels - https://yourlink

AI HOW TO Reels - https://yourlink

AI Tech Reels - https://yourlink

Anime Reels - https://yourlink

Space Reels - https://yourlink

Gym Content - https://yourlink

Hot Girls - https://yourlink

Viral Reels - https://yourlink

Bundle 1 - https://yourlink

Bundle 2 - https://yourlink

Bundle 3 - https://yourlink

Bundle 4 - https://yourlink

Bundle 5 - https://yourlink

Bundle 6 - https://yourlink

✅ Important: Please make a small edit before using any of the reels. Do not use them as-is.

Enjoy creating and stay creative!"""

# All target groups
target_groups = [
    "yourgroup,yourgroup"
]

# Create the Telegram client
client = TelegramClient('test_session', api_id, api_hash)

async def main():
    await client.start(phone=phone_number)

    while True:
        for group in target_groups:
            try:
                print(f"[{datetime.now()}] Sending message to {group}...")
                await client.send_message(group, message_to_send)
            except Exception as e:
                print(f"❌ Error sending to {group}: {e}")
        print("✅ All messages sent. Waiting 5 minutes...\n")
        await asyncio.sleep(300)  # Wait 5 minutes

# Run the script
with client:
    client.loop.run_until_complete(main())
