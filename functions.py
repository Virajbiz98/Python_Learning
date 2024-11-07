# the code for short form  words
def generator(sentence):
    word_list = text.split()  # this for separate words
    short_form = ""
    for i in word_list:
        short_form = short_form + i[0].upper() # .upper for capitalise text
    print(short_form)

text = input("Enter something: ")
generator(text)
