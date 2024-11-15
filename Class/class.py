class Myclass:
    x = 18
    __y = 29; # privet variable can't access without method

    def disp(self):
        return self.__y # this method can use for get access to privet variable 


myObjct = Myclass()
print(myObjct.disp())