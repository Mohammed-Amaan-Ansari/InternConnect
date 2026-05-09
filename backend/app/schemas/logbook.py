from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LogbookEntryCreate(BaseModel):
    application_id: Optional[int] = None
    week_number: int
    task_description: str
    hours_worked: int
    file_url: Optional[str] = None

class LogbookEntryUpdate(BaseModel):
    task_description: Optional[str] = None
    hours_worked: Optional[int] = None
    file_url: Optional[str] = None

class LogbookApproval(BaseModel):
    status: str # Approved, Rejected, Revision Requested
    supervisor_comments: Optional[str] = None
