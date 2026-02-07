from fastapi import Depends, HTTPException, status, Request
from jose import jwt, JWTError
from sqlalchemy.orm import Session
import os

from app.database import SessionLocal
from app import models

SECRET_KEY = os.getenv("SECRET_KEY", "secret_dev_jangan_produksi")
ALGORITHM = "HS256"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    request: Request, 
    db: Session = Depends(get_db)
):
    token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Log in terlebih dahulu"
        )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token tidak valid")
        user_id = int(user_id) 
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Token kadaluwarsa atau rusak")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")

    return user

def teacher_only(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses ditolak. Hanya untuk Guru."
        )
    return current_user

def admin_only(current_user: models.User = Depends(get_current_user)):
    return teacher_only(current_user)