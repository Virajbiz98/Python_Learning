def cal():
    a = float(input("Enter the 1st number: "))
    b = float(input("Enter the 2nd number: "))
    c = input("Enter an operator (+ - * / ): ")

    match c: # check the value of c 
        case "+":
            print(a + b)
        case "-":
            print(a - b)
        case "*":
            print(a * b)
        case "/":
            print(a / b)
        case _:
            print("It's not a valid operator")

cal() # call the function 
 





