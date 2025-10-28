from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.user_schema import UserCreate, UserLogin
from controllers.user_controller import register_user, login_user
from config.db import get_db

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return register_user(user, db)

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    return login_user(user, db)
