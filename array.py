# ~ Python Arrays (Lists)

# array is a collection of items stored at continuous memory locations.

# data type            type code
# Character                  'c'
# Unuicode                   'u' - can use for stor string
# Signed short               'h'
# Undigned short             'H'
# Signed int                 'i' - dhana ha rina sankya stor kala haka.
# Unsigned int               'I' - dana sankya pamanak stor kala haka.
# Signed long                'l'
# Unsigned long              'L'
# Float                      'f'
# double                     'd'

# python have no defoalt array but we can import array
import array
 x = array.array('i', [2,3,5,4,-1,5,6,7,9])
pirnt(x)
>> array('i', [2, 3, 5, 4, -1, 5, 6, 7, 9])
print(x[0])
>> 2
print(x[-1])
>> 9

import array
x = array.array('i', [2,3,5,4,-1,5,6,7,9])
for i in x:
 print(i)
>>
2
3
5
4
-1
5
6
7
9


my_list = [1, 2, 3, 4, 5]
mixed_list = [1, "apple", 3.14, True]

# Ordered: Elements are stored in a specific order.
my_list = [10, 20, 30]
print(my_list) 
>>  [10, 20, 30] 

# Mutable: You can change, add, or remove elements. list eka haduvata passe venas karanna puluvan
my_list = [1, 2, 3]
my_list[0] = 10  # Changing first element
print(my_list) 
>> [10, 2, 3]

# Allows duplicates: Lists can have the same value multiple times.
my_list = [5, 5, 6]
print(my_list) 
>>  [5, 5, 6]

# Dynamic size: You can add or remove elements, and the size changes automatically.
my_list = [1, 2]
my_list.append(3)  # Adding element
print(my_list) 
>> [1, 2, 3]

# Heterogeneous: Can store different data types (e.g., numbers, strings).
my_list = [1, "hello", 3.5]
print(my_list) 
>> [1, 'hello', 3.5]

# Indexed: Access elements using their index (position).
my_list = [10, 20, 30]
print(my_list[1])
>> 20  #(access by index)

# Supports slicing: You can get a part of the list using slicing 
my_list = [1, 2, 3, 4, 5]
print(my_list[1:4])  # (slice from index 1 to 3)
>> [2,3,4]

   #. List Operations

# 1. Accessing Elements

my_list = [10, 20, 30, 40, 50]
print(my_list[0]) 
>> 10 # first element
print(my_list[-1])  
>> 50 #last element

# 2. Slicing

my_list = [10, 20, 30, 40, 50]
print(my_list[1:4])
>> [20, 30, 40]
print(my_list[:3]) 
>> [10, 20, 30]
print(my_list[2:]) 
>> [30, 40, 50]

# 3. Modifying Lists
my_list = [1, 2, 3]
my_list[1] = 20
print(my_list)
>>  [1, 20, 3]

my_list.append(4)
print(my_list) 
>> [1, 20, 3, 4]

my_list.insert(2, 25)
print(my_list)  
>>  [1, 20, 25, 3, 4]

my_list.remove(20)
print(my_list)  
>> [1, 25, 3, 4]

popped_item = my_list.pop()
print(popped_item)  
>> 4
print(my_list) 
>> [1, 25, 3]

# 4. List Methods

# len(): List eke length eka / elemant gana
# sort(): kuda agaye sita vishala agayata
# reverse(): List eka reverse karanawa / big value start small value end
# count(): Specified value how many time using
# extend(): List ekakata thawa list ekak add kirima

my_list = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]
print(len(my_list)) # len(): List eke length eka / elemant gana
>>  11

my_list.sort()
print(my_list)  
>>  [1, 1, 2, 3, 3, 4, 5, 5, 5, 6, 9]

my_list.reverse()
print(my_list)
>> [9, 6, 5, 5, 5, 4, 3, 3, 2, 1, 1]

print(my_list.count(5))  
>>  3

my_list.extend([8, 7])
print(my_list)
>> [9, 6, 5, 5, 5, 4, 3, 3, 2, 1, 1, 8, 7]

# 5. List Comprehension
# List comprehension using for create a list, filter list and modify list thes stuf for a good short cut

squares = [x**2 for x in range(10)]
print(squares) 
>> [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

even_numbers = [x for x in range(20) if x % 2 == 0]
print(even_numbers) 
>> [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]


