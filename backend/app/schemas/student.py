from pydantic import BaseModel, Field, ConfigDict, AliasChoices
from typing import Optional, List

class StudentRegister(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    fullName: str = Field(..., validation_alias=AliasChoices("fullName", "full_name"))
    email: str
    phone: str
    course: str
    year: str
    rollNumber: str = Field(..., validation_alias=AliasChoices("rollNumber", "roll_number"))
    password: str
    acceptTerms: bool = Field(False, validation_alias=AliasChoices("acceptTerms", "accept_terms"))
    resumeUrl: Optional[str] = None
    portfolioUrl: Optional[str] = None
    skills: Optional[List[str]] = None
    profileVisibility: Optional[bool] = None

class StudentProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    phone: Optional[str] = None
    course: Optional[str] = None
    year: Optional[str] = None
    resumeUrl: Optional[str] = None
    portfolioUrl: Optional[str] = None
    skills: Optional[List[str]] = None
    profileVisibility: Optional[bool] = None
