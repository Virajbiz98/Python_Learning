import random

h = random.randint(1,10)
while True:
    if h == (i:=int(input(":"))):
        print("won")
        break
    print("Too high" if h > i else "Too low")
    
