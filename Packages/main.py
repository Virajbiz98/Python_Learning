from backend.core.models import Person

from frontend.validators import is_valid_age 

age = "52"

p = Person("Praneeth")
print(p)

if is_valid_age(age):
    p.set_age(age)


