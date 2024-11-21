# inheritance
class Person:
    def __init__(self,name):
        self.name = name
        print("Hello from person")

    def eat(self,food):
        print("person is eating", food)

    def sleep(self):
        print("person is sleeping...")

class Employee(Person): # child class. this class can get properties before class. that's why this class to call inheritance.
    def __init__(self,dep):
        super(Employee,self).__init__("bob")# super function
        self.dep = dep
        print("Hello from employee ")

    def work(self):
        print("this employee is working...")

    def Leave(self):
        print("this employee is leaving...")

emp1 = Employee("IT")
print(emp1.eat("apple"))# This is how to call before class 

print(emp1.name)

emp2 = Employee("HR")
emp2.Leave()