class Phone:
    def say(self , name ):
        self.x = name
        print(f"hello {name}")

phone1 = Phone()
phone1.say("nokia")
print(phone1.x)
phone1.x = "sony"
print(phone1.x)
phone2 = Phone()
phone2.say("samsung")

ipad = Phone()
ipad.say('apple')