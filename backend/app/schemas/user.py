from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str 
    password: str
    fullName: str
    role: str 
    student_class: Optional[str] = None 
    phone: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str 
    fullName: str
    role: str
    student_class: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True
