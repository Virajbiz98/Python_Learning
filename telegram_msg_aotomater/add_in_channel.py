from telethon.sync import TelegramClient
from telethon.tl.functions.messages import GetDialogsRequest
from telethon.tl.types import InputPeerEmpty, InputPeerChannel, InputPeerUser
from telethon.errors.rpcerrorlist import PeerFloodError, UserPrivacyRestrictedError
from telethon.tl.functions.channels import InviteToChannelRequest
import sys
import csv
import traceback
import time
import random

api_id = 1219108
api_hash = '6a62fccfd576a92a04e6f021bd5c8bf2'
phone = '94779281223' 

session_name = ''
channel_username = 'testone'

client = TelegramClient(str(session_name), api_id, api_hash)

client.connect()
if not client.is_user_authorized():
    client.send_code_request(phone)
    client.sign_in(phone, input('Enter the code: '))


input_file = 'data.csv'
users = []
with open(input_file, encoding='UTF-8') as f:
    rows = csv.reader(f, delimiter=",", lineterminator="\n")
    next(rows, None)
    for row in rows:
        user = {}
        user['srno'] = row[0]
        user['username'] = row[1]
        user['id'] = int(row[2])
        #user['access_hash'] = int(row[2])
        user['name'] = row[4]
        users.append(user)

startfrom = int(input("Start From = "))
endto = int(input("End To = "))

n = 0

for user in users:
    if (int(startfrom) <= int(user['srno'])) and (int(user['srno']) <= int(endto)):
        n += 1
        if n % 50 == 0:
            sleep(900)
            quit()
        try:
            print("Adding {}".format(user['id']))

            if user['username'] == "":
                print("no username, moving to next")
                continue
            
            client(InviteToChannelRequest(
                channel_username,
                [user['username']]
            ))
            
            print("Waiting for 60-180 Seconds...")
            time.sleep(random.randrange(60, 130))
        except PeerFloodError:
            print("Getting Flood Error from telegram. Script is stopping now. Please try again after some time.")
            quit()
        except UserPrivacyRestrictedError:
            print("The user's privacy settings do not allow you to do this. Skipping.")
        except:
            traceback.print_exc()
            print("Unexpected Error")
            continue
    elif int(user['srno']) > int(endto):
        print("members added successfully")
        break

