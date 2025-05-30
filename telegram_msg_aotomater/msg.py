import asyncio
from telethon import TelegramClient, errors
from datetime import datetime

# Your Telegram API credentials
api_id = 21056222
api_hash = '84b84425cabf8d1dc46f7dae27c48378'
phone_number = '+94779281223'

# Message to be shared
message_to_send = """🎬 Download 100,000 AI Reels Bundle – Absolutely Free for Students!

We’re excited to share this massive collection of AI-generated reels with you! You can download the bundle using the links below. If one link doesn’t work, feel free to try the others provided.

AI MUSIC Videos - https://tinyurl.com/bdrtmn3f

EDUCTION Reels - https://tinyurl.com/bdrtmn3f

AI HOW TO Reels - https://tinyurl.com/bdrtmn3f

AI Tech Reels - https://tinyurl.com/bdrtmn3f

Anime Reels - https://tinyurl.com/bdrtmn3f

Space Reels - https://tinyurl.com/bdrtmn3f

Gym Content - https://tinyurl.com/bdrtmn3f

Hot Girls - https://tinyurl.com/bdrtmn3f

Viral Reels - https://tinyurl.com/bdrtmn3f

Bundle 1 - https://tinyurl.com/bdrtmn3f

Bundle 2 - https://tinyurl.com/bdrtmn3f

Bundle 3 - https://tinyurl.com/bdrtmn3f

Bundle 4 - https://tinyurl.com/bdrtmn3f

Bundle 5 - https://tinyurl.com/bdrtmn3f

Bundle 6 - https://tinyurl.com/bdrtmn3f

✅ Important: Please make a small edit before using any of the reels. Do not use them as-is.

Enjoy creating and stay creative!"""

# All target groups
target_groups = [
    "testvjb"
]

# Create the Telegram client
client = TelegramClient('test_session', api_id, api_hash)

async def main():
    await client.start(phone=phone_number)
    print("Client started.")

    while True:
        try:
            for group in target_groups:
                try:
                    print(f"[{datetime.now()}] Sending message to {group}...")
                    await client.send_message(group, message_to_send)
                except Exception as e:
                    print(f"❌ Error sending to {group}: {e}")
            print("✅ All messages sent. Waiting 5 minutes...\n")
            await asyncio.sleep(300)  # Wait 5 minutes (300 seconds)
        except errors.PersistentTimestampOutdatedError as e:
            print(f"⚠️ PersistentTimestampOutdatedError: {e}. Attempting to reconnect...")
            try:
                await client.disconnect()
                print("Client disconnected.")
                await asyncio.sleep(5) # Wait a bit before reconnecting
                await client.start(phone=phone_number)
                print("Client reconnected successfully.")
            except Exception as reconnect_e:
                print(f"❌ Error during reconnection attempt: {reconnect_e}. Waiting 1 minute before next retry...")
                await asyncio.sleep(60) # Wait longer if reconnection fails
        except Exception as e:
            print(f"❌ An unexpected error occurred: {e}. Waiting 1 minute before next retry...")
            await asyncio.sleep(60) # Wait longer for general errors

# Run the script
with client:
    client.loop.run_until_complete(main())
