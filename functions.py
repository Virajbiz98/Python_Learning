# python calculator

operator = input("Enter an operator (+ - * /): ")
num1  = float(input("Enter the 1st number: "))
num2  = float(input("Enter the 2st number: "))

def cal_num():
    if operator == "+":
        result = num1 + num2
        print(round(result, 3))
    elif operator == "-":
        result = num1 - num2
        print(round(result, 3))
    elif operator == "*":
        result = num1 * num2
        print(round(result, 3))
    elif operator == "/":
        result = num1 / num2
        print(round(result, 3))
    else:
        print(f'{operator} is not valid')

cal_num()


