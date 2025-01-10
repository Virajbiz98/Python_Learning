def is_odd(number):
    return "odd" if number % 2 == 1 else "Even"
    # return { number : "odd"} if number % 2 == 1 else { number : "Even"}

a = [12, 45, 85, 87, 33, 100, 34, 11]
b = []

# for i in a:
#     b.append(i)

# for i, value in enumerate(a):
#     if i % 2 == 0:
#         r = is_odd(value)
#         b.append(r)

# b = [is_odd(value) for i, value in enumerate(a) if i % 2 == 0 ]
b = [ {value: is_odd(value)} for i, value in enumerate(a) if i % 2 == 0]


print(a)
print(b)


