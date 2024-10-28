try:
    a =  int(input("Enter first number: "))
    b =  int(input("Enter second number: "))
    print(a/b)
except ZeroDivisionError as e:
    print("can not divide by zero:" , e)
except ValueError as e:
    print("Use integers: ", e)
except Exception as e:
    print("somthing went wrong" ,e)

finally:
    print("bye")


