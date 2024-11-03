# send data back to where function was called from
# return statements end the function's execution
# if omitted, functions return none by default

def add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)
print(result)
