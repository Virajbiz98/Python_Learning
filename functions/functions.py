def student(subject,marks,**friends):
  print("subject = " , subject)
  print("marks = ", marks)
  for key,value in friends.items():
    print(key,"=",value)

student("maths",68,kamal=69,saman=54)