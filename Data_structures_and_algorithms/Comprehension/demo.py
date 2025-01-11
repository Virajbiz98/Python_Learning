def is_odd(number):
    return "Odd" if number % 2 == 1 else "Even"

a = [12, 45, 87, 33, 100, 34, 11]
b = []

# b = { value for i, value in enumerate(a) if i % 2 == 0}
# b = { value: is_odd(value) for i, value in enumerate(a) if i % 2 == 0}

b = (value for i, value in enumerate(a) if i % 2 == 0)

print(a)

for i in b:
    print(i)