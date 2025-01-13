# import person as p
import os.path as path
import person as p
import sys 

# print(sys.argv)
# print(sys.path)
print(sys.platform)
 
if path.exists('person.py'):
    print("Person is there")

# print(__name__)
# print(p.get_name())

print(dir(p))
