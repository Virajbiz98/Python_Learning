# class variable 
class Student:

    class_year = 2024 
    num_student = 0

    def __init__(self,name,age):
        self.name = name
        self.age = age
        Student.num_student += 1 # count objects 

student1 = Student("mark",14)
student2  = Student("patrick",16 )
student3 = Student("saman", 17)
student4 = Student("sandy", 14)

print(f"My graduating class of {Student.class_year} has {Student.num_student} students")
print(student1.name)
print(student2.name)
print(student3.name)
print(Student.class_year)

