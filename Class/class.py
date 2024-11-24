# instance method
class Person:
    def __init__(self,name):
        print("Person is created.")
        self.name = name

    def print_name(self): 
        print("Name is ", self.name)

praneeth = Person("praneeth")
praneeth.print_name()