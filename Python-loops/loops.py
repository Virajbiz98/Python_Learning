#.What are for loops?
#.For loops are used to repeat a block of code a specific number of times.
#.They're particularly useful when you want to iterate over a sequence of values, such as a list, string, or range of numbers.
#.examplese
fruits=["banana","apple","mango"]
for fruits in fruits:
    print(fruits)
  >> banana apple mango

............
name = ["kamal, nimal, eranda, malith"]
for names in name:
    print(name)
# (the 'range')funtion create a sequence numbers.
for number in range (20):
    print(number)
  #this will print numbers from 0 to 19 
.....................
a = [1,4,5,6,7,8,9]
for i in a:
  print(i)
# this out put will 1 4 5 6 7 8 9 
..................... 
#. we can print even numbers bitveen 1 and 20 using bilow code 
for number in range(1, 21):
    if number % 2 == 0: 
        print(number)
      ........................

#.we can  filter the numbers from 0 to 14 and only prints those that are odd and not multiples of 5. in bellow code.
#.>>>
for i in range(15): #.this line starts a loop that will iterate 15 times, wiht "i" takinge values from 0 to 14.
    if (i % 2 == 0): #.this checks if "i" is divisible by 2  (i.e., if its remainder when divided by 2 is 0). If it is, the continue statement is executed
        continue #.This statement immediately jumps back to the beginning of the loop for the next iteration, skipping the rest of the code within the loop body.
    elif (i % 5 == 0): #.is not divisible by 2, this condition checks if it's divisible by 5. If it is, the code inside this block is executed.
        print("can divide by 5") #.This line prints a message indicating that i is divisible by 5.
        print("the value is: ", i) #.This line prints the value of i.
    else: #.If i is not divisible by 2 or 5, this block is executed.
        print("this can’t divide by 2 or 5") #. This line prints a message indicating that i is not divisible by 2 or 5.

#. ~.elif meening :- els if 

      


      
