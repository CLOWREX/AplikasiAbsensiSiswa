from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.teacher_schema import TeacherCreate, TeacherLogin
from controllers.teacher_controller import register_teacher, login_teacher, get_all_teachers
from config.db import get_db

router = APIRouter(prefix="/teachers", tags=["Teachers"])

@router.post("/register", summary="Daftar guru baru")
def register(data: TeacherCreate, db: Session = Depends(get_db)):
    return register_teacher(data, db)

@router.post("/login", summary="Login guru")
def login(data: TeacherLogin, db: Session = Depends(get_db)):
    return login_teacher(data, db)

@router.get("/", summary="Daftar semua guru")
def list_teachers(db: Session = Depends(get_db)):
    return get_all_teachers(db)
