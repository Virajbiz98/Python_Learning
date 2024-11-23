class Parent:
    def func1(self):
        print("hello")

class Child(Parent):
    def func2(self):
        super().func1() 
        print("welcome")

myobj1 = Child() 
myobj1.func2()
