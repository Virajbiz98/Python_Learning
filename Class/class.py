class Fruit:
    number_of_items = None
    unit_price = None
    def set_value(self,x,y):
        self.number_of_items = x
        self.unit_price = y

class Apple(Fruit):
    def price(self):
        print("for apple" ,self.number_of_items * self.unit_price)

class Orange(Fruit):
    def price(self):
        print("for orange" ,self.number_of_items * self.unit_price)

class Grapes(Fruit):
    def price(self):
        print("for grapes" ,self.number_of_items * self.unit_price)

myobj1 = Apple()
myobj2 = Orange()
myobj3 = Grapes()

myobj1.set_value(12,34)
myobj2.set_value(13,54)
myobj3.set_value(15,4)

myobj1.price()
myobj2.price()
myobj3.price()