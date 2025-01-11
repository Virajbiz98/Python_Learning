def get_odd_numbers(upper_limit):
    odd = []
    for i in range(0, upper_limit):
        if i % 2 == 1:
            print('odd', i)
            # odd.append(i)
            yield i 

    return odd 

print("Starting")
x = get_odd_numbers(10)
print("finish")

for i in x:
    print("Loop", i)

print("*" * 20)

x = get_odd_numbers(10)

for i in x:
    print("Loop", i)
print(x)