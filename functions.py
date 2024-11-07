import random

def guess_number():
    hidden_number = random.randint(1, 10)

    your_input = 0
    while your_input != hidden_number:
        your_input = int(input("Enter number: "))

        if your_input < hidden_number:
            print("Too low. Tey again")
        elif your_input > hidden_number:
            print("Too high. Try again")

    print("You won")

guess_number()
