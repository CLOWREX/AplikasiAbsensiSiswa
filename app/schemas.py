from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    role: str  # admin / student
    kelas: str | None = None

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    kelas: str | None

    class Config:
        from_attributes = True
