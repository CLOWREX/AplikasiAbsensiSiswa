# controllers/attendance_controller.py
import io
import uuid
from datetime import date
import qrcode
from fastapi import HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
from models.attendance import DailyQRCode, AttendanceLog
from models.teacher import Teacher
from models.user import User

def _today_date():
    return date.today()

def generate_qr_for_teacher(db: Session, teacher_id: int):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    today = _today_date()
    existing = db.query(DailyQRCode).filter(DailyQRCode.teacher_id==teacher_id, DailyQRCode.date==today).first()
    if existing:
        token = existing.qr_token
    else:
        token = str(uuid.uuid4())
        new = DailyQRCode(teacher_id=teacher_id, date=today, qr_token=token)
        db.add(new)
        db.commit()
        db.refresh(new)

    qr = qrcode.make(token)
    buf = io.BytesIO()
    qr.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")

def generate_qr_for_all_teachers(db: Session):
    """Generate token for each teacher if not exists today. Return list of {teacher_id, token}."""
    today = _today_date()
    teachers = db.query(Teacher).all()
    created = []
    for t in teachers:
        existing = db.query(DailyQRCode).filter(DailyQRCode.teacher_id==t.id, DailyQRCode.date==today).first()
        if existing:
            created.append({"teacher_id": t.id, "token": existing.qr_token})
            continue
        token = str(uuid.uuid4())
        new = DailyQRCode(teacher_id=t.id, date=today, qr_token=token)
        db.add(new)
        db.commit()
        db.refresh(new)
        created.append({"teacher_id": t.id, "token": token})
    return created

def mark_attendance(db: Session, student_id: int, token: str):
    """Student marks attendance by token (scanned from QR)."""
    today = _today_date()
    daily = db.query(DailyQRCode).filter(DailyQRCode.qr_token==token, DailyQRCode.date==today).first()
    if not daily:
        raise HTTPException(status_code=404, detail="QR code tidak valid atau sudah kedaluwarsa.")

    # Prevent duplicate student attendance for same QR
    exists = db.query(AttendanceLog).filter(AttendanceLog.daily_qr_id==daily.id, AttendanceLog.student_id==student_id).first()
    if exists:
        raise HTTPException(status_code=400, detail="Kamu sudah absen hari ini.")

    # Create attendance log
    log = AttendanceLog(daily_qr_id=daily.id, student_id=student_id, status="Hadir")
    db.add(log)
    db.commit()
    db.refresh(log)

    return {"message": "Absensi berhasil.", "teacher_id": daily.teacher_id, "student_id": student_id}
