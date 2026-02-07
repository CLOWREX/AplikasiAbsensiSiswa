from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.deps import teacher_only, get_db
from app import models

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db), 
    teacher: models.User = Depends(teacher_only)
):
    qr_count = db.query(models.QrCode).filter(models.QrCode.created_by == teacher.id).count()

    return {
        "message": f"Selamat datang, {teacher.fullName}",
        "stats": {
            "username": teacher.username,
            "role": teacher.role,
            "total_qr_created": qr_count
        }
    }
