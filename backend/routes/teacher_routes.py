from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.teacher_schema import TeacherCreate, TeacherLogin
from controllers.teacher_controller import register_teacher, login_teacher
from config.db import get_db

router = APIRouter(prefix="/teachers", tags=["Teachers"])

@router.post("/register")
def register(data: TeacherCreate, db: Session = Depends(get_db)):
    return register_teacher(data, db)

@router.post("/login")
def login(data: TeacherLogin, db: Session = Depends(get_db)):
    return login_teacher(data, db)
