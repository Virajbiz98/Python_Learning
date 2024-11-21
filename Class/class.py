class Car:
    def __init__(self,make,model,year):
        self.make = make
        self.model = model
        self.year = year

    def start_engine(self):
        print(f"the engine of {self.year} {self.make} is now running.")

    def stop(self):
        print(f"The engine of {self.year} {self.make} is now off. ")

    def __str__(self):
        return f"{self.year} {self.make} {self.model}"

#create Object 
my_car = Car("Toyota", "corolla", 2026)
print(my_car) # print the object using __str__ method
my_car.start_engine()
my_car.stop() #call the function
