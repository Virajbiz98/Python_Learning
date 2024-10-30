class Car:
    def __init__(self,brand:str, horsepower: int) -> None :
        self.brand = brand
        self.horsepower = horsepower

    def drive(self)-> None:
        print(f'{self.brand} is driving!')

    def get_info(self, var: int)->None:
        print(var)
        print(f'{self.brand} with {self.horsepower} horsepower')

BMW: Car = Car('BMW',200)
BMW.drive()
BMW.get_info(10)

vevo: Car = Car('vevo', 390)
vevo.drive()
vevo.get_info(60)
