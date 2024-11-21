class ac:
    def __init__(self,make,model,year,color,):
        self.make = make
        self.model = model
        self.year = year
        self.color = color


    def dura(self):
        print(f"this " + self.model + " has good durability")


    def maintain(self):
        print(f"this " + self.model + "is easy maintain ")


ac1 = ac("sri lanka","orange",2034,"white",)
print(ac1.dura())
print(ac1.make,ac1.model,ac1.year,ac1.color,ac1.maintain())