# Polymorphism (Different Forms)
class Animal:
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        print("woof!")

class Cat(Animal):
    def speak(self):
        print("meow!")

# Creating a list of animals
animals = [Dog(),Cat()]
for animal in animals:
    animal.speak() # # Each animal will speak its own way (Polymorphism)
