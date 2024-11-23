class Parent:
    def func1(self):
        print("hello")

class Child(Parent):
    def func2(self):
        print("welcome")

    def func1(self): #  overwriting method
        print("hi")

myobj1 = Child()
myobj1.func1()