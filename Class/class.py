class Guitar:
    def __init__(self,n_strings= 6):
        self.n_strings = n_strings
        self.play()
        self.__cost = 50000

    def play(self):
        print("em em em em em ")

class BassGuitar(Guitar):
    pass

class ElectricGuitar(Guitar):# child class
    def __init__(self):
        super().__init__(n_strings=6)
        # self.n_strings = 12
        self.color = ("Black", "White")
        self.__cost = 50000
    def playLouder(self):
        print("em em em em em" .upper())
    def __secret(self): # privet method
        print("this guitar actually cost me Rs",self._Guitar__cost, "only")

my_guitar = ElectricGuitar()
# print(my_guitar.n_strings)
# print(my_guitar.playLouder())
# print("child class:", my_guitar.n_strings)
# print("parent class:",Guitar().n_strings)
# print(my_guitar._Guitar__cost)
# my_guitar._ElectricGuitar__secret()
# print(BassGuitar(4).n_strings)
print("my bass guitar has",BassGuitar(4).n_strings, "strings")
print("my electric guitar has", my_guitar.n_strings, "strings")