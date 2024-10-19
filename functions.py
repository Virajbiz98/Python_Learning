# ~1. What is a Function?

# A function is a block of code that runs only when called.
# It helps reuse code.

# ~2. Creating a Function

# Use def keyword to define a function.

def my_function():
    print("Hello from a function")

# ~ 3. Calling a Function
# After defining, call the function by writing its name.
my_function()
>> Hello from a function

# `~ 4. Parameters 
# Functions can take inputs (parameters).
def greet(name):
    print("Hello", name)

greet("John") 
>> Hello John
# `~5. Return Statement
# Functions can return a value using return.

def sum(num1, num2):
  print(num1 + num2)

sum(4, 5)
>>9

def sum(num1 + num2):
  return num1 + num2

print(sum(4,5))
>> 9

# 6. Default Parameters
# default values for parameters.
def greet(name= "guitar"):
    print("hi", name)
    
greet()
greet("how much you price")
>>hi guitar
  hi how much you price

def funk(length,width):
    perimeter = 2 * (length + width)
    area = length * width
    print("perimeter " "=" , perimeter)
    print("area      " "=" , area)
    
funk(5,3)
>> perimeter = 16
   area      = 15

