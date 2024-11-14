class Phone:
  def __init__(self,make,model,year,color):
    self.make = make
    self.model = model
    self.year = year
    self.color = color

  def cam(self) :
      print("this " +self.model+ " phone have a good camara")

  def temp(self):
      print("this " +self.model+ " mobile is more expensive but is over heating sice using")

p1 = Phone("japan","sony",2023,"gray")
p2 = Phone("amerika","apple",2023,"red")

print(p1.make)
print(p1.model)
print(p1.year)
print(p1.color)
print(p1.cam())
print(p2.temp())