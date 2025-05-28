import asyncio
from telethon import TelegramClient, errors
from datetime import datetime
import sys
import os

# Add the parent directory to the sys.path to allow importing config.py
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import API_ID, API_HASH, PHONE_NUMBER, MESSAGE_SEND_INTERVAL, RECONNECT_WAIT_TIME, ERROR_WAIT_TIME

# Your Telegram API credentials
api_id = API_ID
api_hash = API_HASH
phone_number = PHONE_NUMBER

# Group + message mapping
group_messages = {
    # group         message
    "eskort_ekb1": """❤️ Ваша родственная душа может быть всего в одном клике от вас! Загрузите свою фотографию и найдите свою вторую половинку прямо сейчас!
👉 https://lovematcher109.blogspot.com/""", # russian 

    "eskort_ekb1": """🎬 Скачайте 100 000 Bundles AI Reels – Абсолютно Бесплатно для Студентов!

Мы рады поделиться с вами этой огромной коллекцией видеороликов, созданных ИИ! Вы можете скачать бандл, используя ссылки ниже. Если одна ссылка не работает, не стесняйтесь попробовать другие предоставленные.

AI MUSIC Videos - https://tinyurl.com/bdrtmn3f

EDUCTION Reels - https://tinyurl.com/bdrtmn3f

AI HOW TO Reels - https://tinyurl.com/bdrtmn3f

AI Tech Reels - https://tinyurl.com/bdrtmn3f

Anime Reels - https://tinyurl.com/bdrtmn3f

Space Reels - https://tinyurl.com/bdrtmn3f

Gym Content - https://tinyurl.com/bdrtmn3f

wood works - https://tinyurl.com/bdrtmn3f

Viral Reels - https://tinyurl.com/bdrtmn3f

Bundle 1 - https://tinyurl.com/bdrtmn3f

Bundle 2 - https://tinyurl.com/bdrtmn3f

Bundle 3 - https://tinyurl.com/bdrtmn3f

Bundle 4 - https://tinyurl.com/bdrtmn3f

Bundle 5 - https://tinyurl.com/bdrtmn3f

Bundle 6 - https://tinyurl.com/bdrtmn3f

✅ Важно: Пожалуйста, внесите небольшие изменения перед использованием любого из роликов. Не используйте их как есть.

Наслаждайтесь творчеством и оставайтесь креативными!""",

    "Mavrence": """❤️ Jodohmu bisa ditemukan hanya dengan sekali klik! Unggah fotomu dan temukan jodohmu sekarang!
👉 https://lovematcher109.blogspot.com""", # indunisia 

    "intratsitotsiinnoulban": """❤️ Ваша родственная душа может быть всего в одном клике от вас! Загрузите свою фотографию и найдите свою вторую половинку прямо сейчас!
👉 https://lovematcher109.blogspot.com/""",

"LinkShare_Earn": """❤️ Your soulmate could be just a click away! Upload your photo and find your love match now!
👉 https://tinyurl.com/muctcjja""",

"jackiesi": """❤️ Jodohmu bisa ditemukan hanya dengan sekali klik! Unggah fotomu dan temukan jodohmu sekarang!
👉https://tinyurl.com/muctcjja""",

#  "Cari_Kenalan_Bestie_Online" : """❤️ Jodohmu bisa ditemukan hanya dengan sekali klik! Unggah fotomu dan temukan jodohmu sekarang!
# 👉https://tinyurl.com/muctcjja""",

 "Mavrence": """🎬 Unduh 100.000 Bundel AI Reels – Sepenuhnya Gratis untuk Pelajar!

Kami sangat antusias untuk berbagi koleksi besar reels yang dihasilkan AI ini dengan Anda! Anda dapat mengunduh bundelnya menggunakan tautan di bawah ini. Jika satu tautan tidak berfungsi, silakan coba tautan lain yang tersedia.

Video Musik AI - https://tinyurl.com/bdrtmn3f

Reels EDUKASI - https://tinyurl.com/bdrtmn3f

Reels Cara Membuat AI - https://tinyurl.com/bdrtmn3f

Reels Teknologi AI - https://tinyurl.com/bdrtmn3f

Reels Anime - https://tinyurl.com/bdrtmn3f

Reels Luar Angkasa - https://tinyurl.com/bdrtmn3f

Konten Gym - https://tinyurl.com/bdrtmn3f

Hot Girls - https://tinyurl.com/bdrtmn3f

Reels Viral - https://tinyurl.com/bdrtmn3f

Bundel 1 - https://tinyurl.com/bdrtmn3f

Bundel 2 - https://tinyurl.com/bdrtmn3f

Bundel 3 - https://tinyurl.com/bdrtmn3f

Bundel 4 - https://tinyurl.com/bdrtmn3f

Bundel 5 - https://tinyurl.com/bdrtmn3f

Bundel 6 - https://tinyurl.com/bdrtmn3f

✅ Penting: Harap lakukan sedikit pengeditan sebelum menggunakan reels apa pun. Jangan gunakan persis seperti aslinya.

Selamat berkreasi dan tetaplah kreatif!"""

# "group " : """message"""
}

# Create the Telegram client
session_name = sys.argv[1] if len(sys.argv) > 1 else 'test_session'
client = TelegramClient(session_name, api_id, api_hash)

async def send_messages_to_groups(client, group_messages):
    """Sends predefined messages to Telegram groups."""
    for group, message in group_messages.items():
        try:
            print(f"[{datetime.now()}] Sending message to {group}...")
            await client.send_message(group, message)
        except Exception as e:
            print(f"❌ Error sending to {group}: {e}")

async def main():
    while True:
        try:
            await send_messages_to_groups(client, group_messages)
            print("✅ All messages sent. Waiting for the next interval...\n")
            await asyncio.sleep(MESSAGE_SEND_INTERVAL)
        except errors.PersistentTimestampOutdatedError as e:
            print(f"⚠️ PersistentTimestampOutdatedError: {e}. Reconnecting...")
            try:
                await client.disconnect()
                await asyncio.sleep(RECONNECT_WAIT_TIME)
                await client.start(phone=phone_number)
                print("Client reconnected.")
            except Exception as reconnect_e:
                print(f"❌ Reconnect error: {reconnect_e}. Waiting for error retry...")
                await asyncio.sleep(ERROR_WAIT_TIME)
        except Exception as e:
            print(f"❌ Unexpected error: {e}. Waiting for error retry...")
            await asyncio.sleep(ERROR_WAIT_TIME)

# Run the script
with client:
    client.loop.run_until_complete(main())
