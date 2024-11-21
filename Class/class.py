# Encapsulation (hiding data)
class Fish:
    def __init__(self,name,age,):
        self.name = name
        self.__age = age # privet attribute
        
    def get__age(self): # Public method to access the private attribute
        return self.__age
    
fish = Fish("Dolphin", 16)

print(fish.get__age()) # accessing private attribute using a method