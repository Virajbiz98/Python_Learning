import pickle
from pathlib import Path
import streamlit_authenticator as stauth
import bcrypt

# User data
names = ["Peter Parker", "Rebecca Miller"]
usernames = ["pparker", "rmiller"]
passwords = ["abc123", "def456"]



passwords = ["password1", "password2", "password3"]

# Hash passwords
hashed_passwords = [bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()) for password in passwords]

# Print the hashed passwords
print(hashed_passwords)

# Hash passwords
hashed_passwords = stauth.Hasher(passwords).generate()  # Correct method

# Save to file
file_path = Path(__file__).parent / "hashed_pw.pkl"
with file_path.open("wb") as file:
    pickle.dump({"names": names, "usernames": usernames, "passwords": hashed_passwords}, file)

print(f"Hashed passwords saved successfully to {file_path}")
