import asyncio
from telethon import TelegramClient, errors
from datetime import datetime

# Your Telegram API credentials
api_id = 21056222
api_hash = '84b84425cabf8d1dc46f7dae27c48378'
phone_number = '+94768314890'

# Group + message mapping
group_messages = {
    # group         message
    "eskort_ekb1": """❤️ Ваша родственная душа может быть всего в одном клике от вас! Загрузите свою фотографию и найдите свою вторую половинку прямо сейчас!
👉 https://lovematcher109.blogspot.com/""", # russian 
    "Mavrence": """❤️ Jodohmu bisa ditemukan hanya dengan sekali klik! Unggah fotomu dan temukan jodohmu sekarang!
👉 https://l8.nu/-1N7!""", # indunisia 
    "YourThirdGroup": """❤️ Your soulmate could be just a click away! Upload your photo and find your love match now!
👉 https://l8.nu/-1N7"""
}

# Create the Telegram client
client = TelegramClient('test_session', api_id, api_hash)

async def main():
    await client.start(phone=phone_number)
    print("Client started.")

    while True:
        try:
            for group, message in group_messages.items():
                try:
                    print(f"[{datetime.now()}] Sending message to {group}...")
                    await client.send_message(group, message)
                except Exception as e:
                    print(f"❌ Error sending to {group}: {e}")
            print("✅ All messages sent. Waiting 10 minutes...\n")
            await asyncio.sleep(600)  # Wait 10 minutes
        except errors.PersistentTimestampOutdatedError as e:
            print(f"⚠️ PersistentTimestampOutdatedError: {e}. Reconnecting...")
            try:
                await client.disconnect()
                await asyncio.sleep(5)
                await client.start(phone=phone_number)
                print("Client reconnected.")
            except Exception as reconnect_e:
                print(f"❌ Reconnect error: {reconnect_e}. Waiting 1 minute...")
                await asyncio.sleep(60)
        except Exception as e:
            print(f"❌ Unexpected error: {e}. Waiting 1 minute...")
            await asyncio.sleep(60)

# Run the script
with client:
    client.loop.run_until_complete(main())
