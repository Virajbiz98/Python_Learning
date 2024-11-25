
class Person:

    types = ["Student", "Teacher", "Librarian"] # class attributes. this  variables we can run without instance or with instance

    def __init__(self,name):
        print("Person is created.")
        self.name = name

    def print_name(self): 
        print(self)
        print("Name is ", self.name)

    @classmethod # decoraters.   
    def get_types(cls):
        return cls.types # can't access other functions only class variable
    
    @staticmethod # we can use without intaraction with class
    def get_person():
        print("static method")


praneeth = Person("praneeth")
praneeth.print_name()
print(Person.get_types()) 

praneeth.get_person()