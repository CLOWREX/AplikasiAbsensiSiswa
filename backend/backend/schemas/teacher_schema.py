from pydantic import BaseModel

class TeacherCreate(BaseModel):
    username: str
    password: str
    subject: str

class TeacherLogin(BaseModel):
    username: str
    password: str
