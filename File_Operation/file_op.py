# file = open("data.txt")

# print(type(file))

# contents = file.read()
# print(contents)
# contents = file.read(1)
# print(contents)

# while True:
#     contents = file.readline()

#     if not contents:
#         break
#     print(contents)

# for line in file:
#     print("Line-->", line)

'''
'r' = read only
'w' = write with truncate
'x' = open for excludive creation
'a' = append
'b' = binary
't' = text mode
'+' = updating
'''



# file = open("data.txt",)

# for i, line in enumerate(file):
#     print("Line-->", i, line)


# file = open('data.txt', 'w')
# this how to write a file with new line
# for i in range(0, 100):
#     file.write(str(i) + '\n')


# for i in range(0, 100):
#     file.write(str(i) + ',')

# file.close()

# file = open('data.txt', 'w')

# x = [ str(i) for i in range(0, 100)]

# # msg = ', '.join(x)
# msg = '\n'.join(x)

# file.write(msg)

# file.close()

# this how to append something 
# file = open("data.txt", 'a')

# x  = [ str(i * 2) for i in range(0, 100) ]

# msg = '\n'.join(x)

# file.write(msg)

# file.close()

with open('data.txt', 'a') as file:
    x = [ str(i * 2) for i in range(0, 100) ]
    msg = '\n'.join(x)
    file.write(msg)