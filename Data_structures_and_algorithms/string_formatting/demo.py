name = "jayakodi"
height = 176 
# message = "Hello" + name + ". Your height is " + str(height)
# message = "Hello %s. Your height is %d." %(name, height) 

# message = "Hello {}. Your height is {:05d}".format(name, height)

message = f"Hello {name}. Your height is {height: 05d}"

print(message)