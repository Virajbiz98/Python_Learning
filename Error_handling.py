try: 
    a =  int(input("Enter first number: "))
    b =  int(input("Enter second number: "))
    print(a/b)

except Exception as e: # e is chooseble and we can finde what is error using Exception 
    print("somthing went wrong" ,e)
print("bye")
