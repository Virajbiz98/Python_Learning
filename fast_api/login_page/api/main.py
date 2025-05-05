from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import httpx

load_dotenv()  # Load environment variables from .env file

app = FastAPI(title="ShimmerCV API")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:4173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class PersonalInfo(BaseModel):
    fullName: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    linkedin: Optional[str] = None
    website: Optional[str] = None
    summary: Optional[str] = None

class Education(BaseModel):
    institution: str
    degree: str
    field: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    description: Optional[str] = None

class Experience(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    current: Optional[bool] = False
    description: Optional[str] = None

class Skill(BaseModel):
    name: str
    level: int

class CVCreate(BaseModel):
    personalInfo: PersonalInfo
    education: List[Education]
    experience: List[Experience]
    skills: List[Skill]
    template: str

class CV(BaseModel):
    id: str
    title: str
    template: str
    created_at: str
    updated_at: str

# Helper functions for Supabase
async def make_supabase_request(endpoint: str, method: str = "GET", token: str = None, data=None):
    url = f"{SUPABASE_URL}/rest/v1/{endpoint}"
    headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json",
    }
    
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    async with httpx.AsyncClient() as client:
        if method == "GET":
            response = await client.get(url, headers=headers)
        elif method == "POST":
            response = await client.post(url, headers=headers, json=data)
        elif method == "PUT":
            response = await client.put(url, headers=headers, json=data)
        elif method == "DELETE":
            response = await client.delete(url, headers=headers)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        if response.status_code >= 400:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Supabase error: {response.text}"
            )
        
        return response.json() if response.text else None

async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {token}"
                }
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid authentication credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication error: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to ShimmerCV API"}

@app.get("/cvs", response_model=List[CV])
async def get_cvs(user=Depends(verify_token)):
    user_id = user["id"]
    return await make_supabase_request(
        f"cvs?user_id=eq.{user_id}&order=updated_at.desc",
        token=SUPABASE_KEY
    )

@app.post("/cvs")
async def create_cv(cv: CVCreate, user=Depends(verify_token)):
    user_id = user["id"]
    
    # Create CV record
    cv_data = {
        "user_id": user_id,
        "title": cv.personalInfo.fullName + "'s CV",
        "template": cv.template,
        "personal_info": cv.personalInfo.dict(),
    }
    
    cv_response = await make_supabase_request(
        "cvs",
        method="POST",
        token=SUPABASE_KEY,
        data=cv_data
    )
    
    # Get the created CV ID
    cv_id = cv_response[0]["id"]
    
    # Create education records
    for edu in cv.education:
        edu_data = {
            "cv_id": cv_id,
            "institution": edu.institution,
            "degree": edu.degree,
            "field": edu.field,
            "start_date": edu.startDate,
            "end_date": edu.endDate,
            "description": edu.description,
        }
        await make_supabase_request(
            "education",
            method="POST",
            token=SUPABASE_KEY,
            data=edu_data
        )
    
    # Create experience records
    for exp in cv.experience:
        exp_data = {
            "cv_id": cv_id,
            "company": exp.company,
            "position": exp.position,
            "location": exp.location,
            "start_date": exp.startDate,
            "end_date": exp.endDate,
            "current": exp.current,
            "description": exp.description,
        }
        await make_supabase_request(
            "experience",
            method="POST",
            token=SUPABASE_KEY,
            data=exp_data
        )
    
    # Create skill records
    for skill in cv.skills:
        skill_data = {
            "cv_id": cv_id,
            "name": skill.name,
            "level": skill.level,
        }
        await make_supabase_request(
            "skills",
            method="POST",
            token=SUPABASE_KEY,
            data=skill_data
        )
    
    return {"message": "CV created successfully", "cv_id": cv_id}

@app.get("/cvs/{cv_id}")
async def get_cv(cv_id: str, user=Depends(verify_token)):
    user_id = user["id"]
    
    # Get CV
    cv_data = await make_supabase_request(
        f"cvs?id=eq.{cv_id}&user_id=eq.{user_id}",
        token=SUPABASE_KEY
    )
    
    if not cv_data:
        raise HTTPException(status_code=404, detail="CV not found")
    
    # Get education
    education_data = await make_supabase_request(
        f"education?cv_id=eq.{cv_id}&order=start_date.desc",
        token=SUPABASE_KEY
    )
    
    # Get experience
    experience_data = await make_supabase_request(
        f"experience?cv_id=eq.{cv_id}&order=start_date.desc",
        token=SUPABASE_KEY
    )
    
    # Get skills
    skills_data = await make_supabase_request(
        f"skills?cv_id=eq.{cv_id}&order=name.asc",
        token=SUPABASE_KEY
    )
    
    return {
        "cv": cv_data[0],
        "education": education_data,
        "experience": experience_data,
        "skills": skills_data
    }

@app.delete("/cvs/{cv_id}")
async def delete_cv(cv_id: str, user=Depends(verify_token)):
    user_id = user["id"]
    
    # Verify ownership
    cv_data = await make_supabase_request(
        f"cvs?id=eq.{cv_id}&user_id=eq.{user_id}",
        token=SUPABASE_KEY
    )
    
    if not cv_data:
        raise HTTPException(status_code=404, detail="CV not found")
    
    # Delete skills
    await make_supabase_request(
        f"skills?cv_id=eq.{cv_id}",
        method="DELETE",
        token=SUPABASE_KEY
    )
    
    # Delete experiences
    await make_supabase_request(
        f"experience?cv_id=eq.{cv_id}",
        method="DELETE",
        token=SUPABASE_KEY
    )
    
    # Delete education
    await make_supabase_request(
        f"education?cv_id=eq.{cv_id}",
        method="DELETE",
        token=SUPABASE_KEY
    )
    
    # Delete CV
    await make_supabase_request(
        f"cvs?id=eq.{cv_id}",
        method="DELETE",
        token=SUPABASE_KEY
    )
    
    return {"message": "CV deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)