from pydantic import BaseModel

class FacultyRegister(BaseModel):
    facultyName: str
    email: str
    phone: str
    address: str
    password: str
