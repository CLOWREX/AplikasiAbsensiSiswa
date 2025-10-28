from fastapi import HTTPException
from sqlalchemy.orm import Session
from models.teacher import Teacher

# Sementara tanpa bcrypt / JWT, password disimpan plain (untuk testing Swagger)
def register_teacher(data, db: Session):
    existing = db.query(Teacher).filter(Teacher.username == data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username sudah digunakan")

    new_teacher = Teacher(username=data.username, password=data.password, subject=data.subject)
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return {"message": "Guru berhasil didaftarkan", "teacher": new_teacher.username}

def login_teacher(data, db: Session):
    teacher = db.query(Teacher).filter(Teacher.username == data.username).first()
    if not teacher or teacher.password != data.password:
        raise HTTPException(status_code=400, detail="Username atau password salah")
    return {"message": f"Login berhasil untuk {teacher.username}"}

def get_all_teachers(db: Session):
    teachers = db.query(Teacher).all()
    return [{"id": t.id, "username": t.username, "subject": t.subject} for t in teachers]
