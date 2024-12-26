# try:
#     a =  int(input("Enter first number: "))
#     b =  int(input("Enter second number: "))
#     print(a/b)
# except ZeroDivisionError as e:
#     print("can not divide by zero:" , e)
# except ValueError as e:
#     print("Use integers: ", e)
# except Exception as e:
#     print("somthing went wrong" ,e)

# finally:
#     print("bye")


# from os import path 

# file_name = 'Error_handling/data1.txt'

# if path.exists(file_name):

#     # Can get FileNotFoundError
#     with open(file_name) as file:
#         print(file.readlines())
# else:
#     print("File doesn't exist")


# x = 10 
# y = 1 

# z = x / y # it's geting error below this line how to run without crash
# try:
    # z = x / y 
    # print(z)

    #     # Can get FileNotFoundError
    # with open(file_name) as file:
    #     print(file.readlines()) 

# except (ZeroDivisionError, FileNotFoundError):
#     print("input error")

# # except FileNotFoundError:
# #     print("file not found")
# except Exception:
# #     print("Something went wrong.")

# except ZeroDivisionError as e: # we can asign a  variable
#     print("Input error", e)

# except FileNotFoundError as e:
#     print("File not found",e)

# except Exception as e:
#     print("Something wrong.", e)

# finally:
#     print("Process competed.") # this impertent for cleanup task 

# custom Exception 1
class InvalidNameException(Exception):
    def __init__(self, error):
        super(InvalidNameException, self).__init__(error)
        self.error_code = 10 

# Custom Exception 2 
class InvalidAgeException(Exception):
    def __init__(self,error):
        super(InvalidAgeException, self).__init__(error)
        self.error_code =5

class Person:
    def __init__(self,name,age):
        super().__init__()

        self.name = name 
        self.age = age 

    @staticmethod
    def get_person(name,age):
        if not name:
            # raise Exception("Invalid name")
            raise InvalidNameException("Invalid Name") # this line for custom exception 1
            print("Error")
        if age < 0 or age >= 120:
            # raise Exception("Invalid age")
            raise InvalidAgeException("Invalid Age")
            ruturn

        return Person(name,age)
try:
    person = Person.get_person("Jayakodi", 30)
    print(person)
# except Exception as e:
#     print("Error found",e)
except(InvalidAgeException, InvalidNameException) as e:
    if e.error_code == 10:
        print("Invalid Name")
    elif e.error == 5:
        print("Invalid Age")
    else:
        print("somthing else went wrong.")
    # print("Error found", e.error_code)

print("hello world")


