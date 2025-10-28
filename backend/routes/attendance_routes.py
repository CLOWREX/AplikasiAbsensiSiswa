from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from config.db import get_db
from controllers import attendance_controller

router = APIRouter(prefix="/attendance", tags=["Attendance"])

# Endpoint lama biar tidak hilang
@router.get("/")
def get_all_attendance(db: Session = Depends(get_db)):
    return {"message": "Fitur absensi QR aktif dan siap digunakan 🚀"}

# === Fitur baru: Generate QR code per guru ===
@router.get("/generate_qr/{teacher_id}", summary="Generate QR harian untuk guru (atau ambil yang sudah ada)")
def generate_qr_for_teacher(teacher_id: int, db: Session = Depends(get_db)):
    return attendance_controller.generate_qr_for_teacher(db, teacher_id)

# === Fitur baru: Generate QR semua guru (otomatis / admin) ===
@router.get("/generate_all", summary="Generate QR untuk semua guru hari ini")
def generate_all(db: Session = Depends(get_db)):
    return attendance_controller.generate_qr_for_all_teachers(db)

# === Fitur baru: Absen siswa ===
@router.post("/mark", summary="Siswa melakukan absen dengan token dari QR")
def mark_attendance(
    token: str = Query(..., description="Token QR yang dipindai"),
    student_id: int = Query(..., description="ID siswa yang absen"),
    db: Session = Depends(get_db)
):
    return attendance_controller.mark_attendance(db, student_id, token)
