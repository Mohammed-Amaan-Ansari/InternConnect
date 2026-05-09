from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InternFeedbackCreate(BaseModel):
    evaluation: str
    performance_rating: int
    recommend_completion: bool

class CommunicationMessageCreate(BaseModel):
    receiver_id: int
    application_id: Optional[int] = None
    subject: Optional[str] = None
    message: str
