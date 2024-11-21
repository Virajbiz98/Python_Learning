# multible inheritance 
class Car:
    def __init__(self,):
        self.name1 = "Lightning"
        print("Going")

class Flyeble:
    def __init__(self):
        self.name2 = "Flyer"
        print("Flying")

class Flyingcar(Car,Flyeble):
    def __init__(self):
        Car.__init__(self)
        Flyeble.__init__(self)
        print("inherited")

    def PrintName(self):
        print(self.name1,self.name2)

ob = Flyingcar()
ob.PrintName()