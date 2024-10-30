class Car: 
    def __init__(self,colour:str, horsepower: int) -> None  :
        self.colour = colour
        self.horsepower = horsepower

volvo: Car = Car('red', 200) 
print(volvo.colour)
print(volvo.horsepower)

range_rower: Car = Car('blue', 240)
print(range_rower.colour)
print(range_rower.horsepower)
