# Given the names and grades for each student in a class of  students, store them in a nested list and print the name(s) of any student(s) having the second lowest grade.

# Note: If there are multiple students with the second lowest grade, order their names alphabetically and print each name on a new line.


if __name__ == '__main__':
    records = []  

    for _ in range(int(input())):
        name = input()
        score = float(input())
        records.append([name, score])

    grades = sorted(set([score for name, score in records]))

    second_lowest = grades[1]

    students = [name for name, score in records if score == second_lowest]

    students.sort()

    for student in students:
        print(student)


