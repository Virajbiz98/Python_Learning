# Streamlit Login and Registration System with MongoDB Atlas

This project is a **Streamlit application** that allows users to:

- **Register** with a username and hashed password.
- **Login** securely by verifying hashed passwords.
- **Log user activity**, such as login times, in MongoDB Atlas.
- **View user login activity** with timestamps.

## Features

- Secure password hashing using `bcrypt`.
- MongoDB Atlas for database storage.
- Tracks user login activity with timestamps.
- Clean and simple Streamlit interface.

## Requirements

- Python 3.7+
- MongoDB Atlas account

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Virajbiz98/Python_Learning
.git
   cd Python_Learning

   ```

2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your **MongoDB Atlas Cluster**:
   - Create a MongoDB Atlas account.
   - Set up a cluster.
   - Obtain your MongoDB URI.

4. Replace the placeholder URI in the code with your own MongoDB URI:
   ```python
   client = pymongo.MongoClient("mongodb+srv://Myuser123:Myuser123@cluster123.r0ahy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster123")
   ```

## Usage

1. Run the Streamlit app:
   ```bash
   streamlit run login_app.py
   ```

2. Open the app in your browser (Streamlit will provide the URL).

3. Use the sidebar to:
   - **Register** a new user.
   - **Login** to your account.
   - **View Login Activity** to see all user login records.

## Project Structure

```
<your-repo-name>/
├── login_app.py          # Main Streamlit application
├── requirements.txt      # List of dependencies
└── README.md             # Project documentation
```

## Dependencies

- `streamlit`: For building the web application.
- `bcrypt`: For secure password hashing.
- `pymongo`: To connect to MongoDB Atlas.

Install all dependencies using:
```bash
pip install -r requirements.txt
```

## Screenshots

### Registration Page
![Registration Page](Python_Learning\User_info_st\Userlogin25-registration.png)

### Login Page
![Login Page](Python_Learning\User_info_st\Userlogin25-login.png)

### User Activity Log
![Activity Log Page](Python_Learning\User_info_st\Userlogin25-activity-log.png)

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests for improvements.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author

isuru viraj (https://github.com/Virajbiz98)
