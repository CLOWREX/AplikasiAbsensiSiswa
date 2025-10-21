from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.teacher import Teacher
from utils.jwt_handler import create_access_token
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def register_teacher(data, db: Session):
    existing = db.query(Teacher).filter(Teacher.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username sudah digunakan")

    hashed_pw = pwd_context.hash(data.password)
    new_teacher = Teacher(username=data.username, password=hashed_pw, subject=data.subject)
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return {"message": "Guru berhasil didaftarkan", "teacher": new_teacher.username}

def login_teacher(data, db: Session):
    teacher = db.query(Teacher).filter(Teacher.username == data.username).first()
    if not teacher or not pwd_context.verify(data.password, teacher.password):
        raise HTTPException(status_code=400, detail="Username atau password salah")

    token = create_access_token({"sub": teacher.username, "role": "teacher"})
    return {"access_token": token, "token_type": "bearer"}
