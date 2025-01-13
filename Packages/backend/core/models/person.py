class Person:
    def __init__(self,name):
        super().__init__()
        self.name = name
        self.age = 0 

    def get_name(self):
        return self.name 
    
    def set_name(self, name):
        self.name = name 

    def get_age(self):
        return self.age
    
    def set_age(self, age):
        self.age = age