def is_odd(number):
    return "odd" if number % 2 == 1 else "Even"
    # return number % 2 == 1
    # if number % 2 == 1:
    #     return True
    # return False



a = [12, 45, 85, 33]
b = []
# b = a 
# b = list(a)

# is_odd(a)
# b.append(100)
for i in a:
    b.append(i)

b = [ is_odd(i) for i in a]

# b = [i for i in a]
# b = [i * 2 for i in a]

print(a)
print(b)
# [12, 45, 85, 33]
# [False, True, True, True]

# [12, 45, 85, 33]
# ['Even', 'odd', 'odd', 'odd']

