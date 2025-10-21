from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.db import get_db
from controllers import attendance_controller

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.get("/")
def get_all_attendance(db: Session = Depends(get_db)):
    return {"message": "Fitur absensi masih dalam pengembangan"}
