# ~Python Basic with examples ~

# Python Syntax

print("Hello World")

# Comments in Python 
# This is a comment

# Docstrings
""""This is a multilien docstring."""

# Synax Explained

~"Python Variables"~

"Create a variable"
X = 6 
y = " john"
print(X)
print(y)

"Output both text and a variable"
x = "Python"
y = "is"
z = "awesome"
print(x,y,z)

"Add a variable to another variable"
print(x + y + z)
print(f"{x} is awesome")
">> Python is awesome" 
">> Python is awesome" 

#"Variables Explained."

~ "Python Numbers"

"Verify the type of an object"
x = 1 
y = 2.5
z = 3j 
print(type(x)) :- "class 'int' "
print(type(y)) :- "class 'float' "
print(type(z)) :- "class 'complex' " .

"Create integers"
x = 1 
y = 4834783747
z = -72345

print(type(x)) :- 'int'
print(type(y)) :- 'int'
print(type(z)) :- 'int' .

"Create floating point numbers"
x = 1.10
y = 1.0 
z = -35.76
print(type(x)) :- 'float'
print(type(y)) :- 'float'
print(type(z)) :- 'float'

"Create scientific numbers with an 'e' indicate the power of 10"
x  = 35e4
y = 13E4
z = -87.7e100

print(type(x)) :- 'float'
print(type(y)) :- 'float'
print(type(z)) :- 'float'

" Create complex numbers"
x = 3+5j
y = 6j
z = 5j

print(type(x)) :- 'complex'
print(type(y)) :- 'complex'
print(type(z)) :- 'complex'

"Numbers Explained."


~ "Python Casting"

"Casting - Integers"
x = int(1)
y = int(3.7)
z = int("3")

print(x) :- 1
print(y) :- 3
print(z) :- 3

"Casting - Floats" 

x = float(2)
y = float(2.8)
z = float("4")
w = float("4.5")

print(x) :- 2.0
print(y) :- 2.8
print(z) :- 4.0
print(w) :- 4.5 

"Casting - Strings"
x = str("s1")
y = str(2)
z = str(3.0)
print(x) :- ' s1 '
print(y) :- ' 2 '
print(z) :- ' 3.0 '

"Casting Explained."