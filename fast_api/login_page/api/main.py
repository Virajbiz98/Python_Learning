from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
import os
import uuid
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import json
from pathlib import Path

# Create data directory if it doesn't exist
data_dir = Path("data")
data_dir.mkdir(exist_ok=True)
users_file = data_dir / "users.json"
cvs_file = data_dir / "cvs.json"

# Initialize empty data files if they don't exist
if not users_file.exists():
    users_file.write_text(json.dumps([]))

if not cvs_file.exists():
    cvs_file.write_text(json.dumps([]))

# Security
SECRET_KEY = os.environ.get("SECRET_KEY", "a_very_secret_key_for_development")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Initialize FastAPI app
app = FastAPI(title="ShimmerCV API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

class CVBase(BaseModel):
    title: str
    template: str

class PersonalInfo(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    summary: Optional[str] = None
    website: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None

class Experience(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None

class Skill(BaseModel):
    name: str
    level: Optional[int] = None

class CVCreate(CVBase):
    personal_info: PersonalInfo
    education: List[Education]
    experience: List[Experience]
    skills: List[Skill]

class CV(CVCreate):
    id: str
    user_id: str
    created_at: str
    updated_at: str

# Helper functions
def get_users():
    users_data = json.loads(users_file.read_text())
    return {user["id"]: user for user in users_data}

def save_users(users):
    users_file.write_text(json.dumps(list(users.values()), indent=2))

def get_cvs():
    cvs_data = json.loads(cvs_file.read_text())
    return {cv["id"]: cv for cv in cvs_data}

def save_cvs(cvs):
    cvs_file.write_text(json.dumps(list(cvs.values()), indent=2))

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_email(email: str):
    users = get_users()
    for user_id, user in users.items():
        if user["email"] == email:
            return user
    return None

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenData(user_id=user_id)
    except JWTError:
        raise credentials_exception
    users = get_users()
    user = users.get(token_data.user_id)
    if user is None:
        raise credentials_exception
    return user

# Routes

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user["id"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users", response_model=User)
async def create_user(user: UserCreate):
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    users = get_users()
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user.password)
    created_at = datetime.utcnow().isoformat()
    
    users[user_id] = {
        "id": user_id,
        "email": user.email,
        "name": user.name,
        "password": hashed_password,
        "created_at": created_at
    }
    
    save_users(users)
    user_data = users[user_id].copy()
    user_data.pop("password")  # Don't return the password
    return user_data

@app.get("/users/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    user_data = current_user.copy()
    user_data.pop("password")  # Don't return the password
    return user_data

@app.post("/cvs", response_model=CV)
async def create_cv(cv: CVCreate, current_user: dict = Depends(get_current_user)):
    cvs = get_cvs()
    cv_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    new_cv = {
        **cv.dict(),
        "id": cv_id,
        "user_id": current_user["id"],
        "created_at": now,
        "updated_at": now
    }
    
    cvs[cv_id] = new_cv
    save_cvs(cvs)
    return new_cv

@app.get("/cvs", response_model=List[CV])
async def get_user_cvs(current_user: dict = Depends(get_current_user)):
    cvs = get_cvs()
    user_cvs = [cv for cv in cvs.values() if cv["user_id"] == current_user["id"]]
    return user_cvs

@app.get("/cvs/{cv_id}", response_model=CV)
async def get_cv(cv_id: str, current_user: dict = Depends(get_current_user)):
    cvs = get_cvs()
    cv = cvs.get(cv_id)
    
    if not cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    if cv["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this CV"
        )
    
    return cv

@app.put("/cvs/{cv_id}", response_model=CV)
async def update_cv(cv_id: str, cv_update: CVCreate, current_user: dict = Depends(get_current_user)):
    cvs = get_cvs()
    existing_cv = cvs.get(cv_id)
    
    if not existing_cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    if existing_cv["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this CV"
        )
    
    updated_cv = {
        **existing_cv,
        **cv_update.dict(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    cvs[cv_id] = updated_cv
    save_cvs(cvs)
    return updated_cv

@app.delete("/cvs/{cv_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cv(cv_id: str, current_user: dict = Depends(get_current_user)):
    cvs = get_cvs()
    if cv_id not in cvs:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CV not found"
        )
    
    if cvs[cv_id]["user_id"] != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this CV"
        )
    
    del cvs[cv_id]
    save_cvs(cvs)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)