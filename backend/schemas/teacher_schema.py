from pydantic import BaseModel

class TeacherCreate(BaseModel):
    username: str
    password: str
    subject: str

class TeacherLogin(BaseModel):
    username: str
    password: str

class TeacherOut(BaseModel):
    id: int
    username: str
    subject: str

    class Config:
        orm_mode = True
