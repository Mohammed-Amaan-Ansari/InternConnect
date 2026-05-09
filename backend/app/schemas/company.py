from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class CompanyRegister(BaseModel):
    companyName: str
    email: str
    phone: str
    address: str
    contactPerson: str
    designation: str
    password: str

class InternshipCreate(BaseModel):
    title: str
    department: str
    category: str
    description: str
    duration: str
    type: str
    openings: int
    location: str
    workMode: str
    stipend: str
    deadline: date
    eligibility: Optional[str] = None
    skills: Optional[List[str]] = []
    minCgpa: Optional[str] = None
    preferredYear: Optional[str] = None
    benefits: Optional[str] = None
