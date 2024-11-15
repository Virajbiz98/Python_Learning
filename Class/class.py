class Myclass:
    def meth1(self):
        print("hello")
        self.__meth2() # that's how to call privet method

    def __meth2(self): # privet method
        print("Welcome")

myobj = Myclass()
myobj.meth1() 