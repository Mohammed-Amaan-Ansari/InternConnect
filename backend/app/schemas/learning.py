from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LearningResourceBase(BaseModel):
    title: str
    category: str
    url: str
    description: Optional[str] = None

class LearningResourceCreate(LearningResourceBase):
    pass

class LearningResourceOut(LearningResourceBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class UserLearningActivityUpdate(BaseModel):
    status: str # Saved, Completed
