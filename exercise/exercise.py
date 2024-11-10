# how to create a list and tuple with comma separated numbers in python

values = input('Enter some numbers: ')
list = values.split(",")
tuple = tuple(list)

print("list :" , list)
print("tuple : " , tuple )
