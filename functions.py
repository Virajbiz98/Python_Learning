password = input("Enter you password: ")
user_name = input("Enter you user name: ")

def log_in():
    if(password == "Jon") or (user_name == "DEV_TESTING"):
        print(" log in successfully ")
    else:
        print("incorrect password or user name pleas enter correct password")


log_in()
