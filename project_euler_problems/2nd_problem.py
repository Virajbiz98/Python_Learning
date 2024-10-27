def sum_evn(n):
    a, b = 0, 1
    sum_even = 0

    for n in range(n):
        if a % 2 == 0:
            sum_even += a
        a, b = b, a + b

    print(sum_even)

n = 0
sum_evn(10)
>> 44
