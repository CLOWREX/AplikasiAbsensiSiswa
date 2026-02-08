from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.utils.jwt import create_access_token, decode_access_token
from app.schemas.user import UserCreate
from pydantic import BaseModel

class LoginSchema(BaseModel):
    username: str
    password: str

auth_router = APIRouter(prefix="/auth", tags=["Auth"])

@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user_exists = db.query(models.User).filter(
        models.User.username == user_in.username
    ).first()

    if user_exists:
        raise HTTPException(
            status_code=400,
            detail="Username already registered"
        )

    new_user = models.User(
        fullName=user_in.fullName,
        username=user_in.username,
        password=user_in.password,
        phone=user_in.phone,
        student_class=user_in.student_class,
        role=user_in.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Registration successful"}

@auth_router.post("/register/student", status_code=201)
def register_student(user_in: UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(
        fullName=user_in.fullName,
        username=user_in.username,
        password=user_in.password,
        phone=user_in.phone,
        student_class=user_in.student_class,
        role="student"
    )
    db.add(new_user)
    db.commit()
    return {"message": "Student registered"}

@auth_router.post("/login")
def login(data: LoginSchema, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.username == data.username
    ).first()

    if not user or data.password != user.password:
     raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    token = create_access_token({
        "user_id": user.id,
        "role": user.role
    })

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=86400,
        samesite="lax",
        secure=False  
    )

    return {
        "message": "Login successful",
        "access_token": token,
        "role": user.role,
        "fullName": user.fullName,
        "username": user.username, 
        "phone": user.phone,
        "student_class": user.student_class
    }

@auth_router.get("/me")
def get_me(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    payload = decode_access_token(token)
    user = db.query(models.User).filter(
        models.User.id == payload.get("user_id")
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return {
        "id": user.id,
        "username": user.username,
        "fullName": user.fullName,
        "role": user.role,
        "phone": user.phone,
        "student_class": user.student_class
    }

@auth_router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logout successful"}
