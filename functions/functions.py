def apple(unit_price):
    return (lambda number_of_apples : number_of_apples*unit_price)

x = apple(48)
print(x(9))