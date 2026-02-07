from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from datetime import datetime, date
from app.database import get_db
from app import models
from app.utils.jwt import decode_access_token
from pydantic import BaseModel
from app.utils.security import get_current_user
import json
from sqlalchemy import func
from sqlalchemy import DateTime

router = APIRouter(prefix="/attendance", tags=["Attendance"])

class ScanRequest(BaseModel):
    qr_content: str

class SubmitRequest(BaseModel):
    status: str
    explanation: str

def get_today_date():
    return datetime.now().strftime("%Y-%m-%d")

def get_current_user_id(request: Request):
    token = request.cookies.get("access_token")
    
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(status_code=401, detail="Sesi habis, silakan login ulang")
    
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token tidak valid")
    
    return payload.get("user_id")

@router.post("/scan")
def scan_qr(
    data: ScanRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user or current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can scan QR")

    try:
        payload = json.loads(data.qr_content)
    except:
        raise HTTPException(status_code=400, detail="Invalid QR format")

    if payload.get("type") != "attendance":
        raise HTTPException(status_code=400, detail="Invalid QR type")

    today = date.today()

    existing = db.query(models.Attendance).filter(
        models.Attendance.user_id == current_user.id,
        models.Attendance.date == today
    ).first()

    if existing:
        official_time = datetime.combine(today, datetime.strptime("06:30", "%H:%M").time())
        actual_time = datetime.strptime(existing.time, "%H:%M:%S")
        late_minutes = max(0, int((actual_time - official_time).total_seconds() // 60))
        time_status = "On Time" if late_minutes == 0 else "Late"

        return {
            "success": True,
            "message": "You have already checked in today.",
            "time": existing.time,
            "time_status": time_status,
            "late_minutes": late_minutes
        }

    scan_time = datetime.now()
    official_time = scan_time.replace(hour=6, minute=30, second=0, microsecond=0)

    if scan_time <= official_time:
        time_status = "On Time"
        late_minutes = 0
    else:
        time_status = "Late"
        late_minutes = int((scan_time - official_time).total_seconds() // 60)
        
    attendance = models.Attendance(
        user_id=current_user.id,
        date=today,
        time=scan_time.strftime("%H:%M:%S"),
        status="present"
    )

    db.add(attendance)
    db.commit()

    return {
        "success": True,
        "message": "Attendance recorded successfully.",
        "time": scan_time.strftime("%H:%M:%S"),
        "time_status": time_status,
        "late_minutes": late_minutes
    }

@router.get("/today-status")
def check_today_status(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    
    today = date.today()
    attendance = db.query(models.Attendance).filter(
        models.Attendance.user_id == user_id,
        func.date(models.Attendance.date) == today
    ).first()
    return {"already_present": bool(attendance)}

@router.get("/history")
def get_history(db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    return db.query(models.Attendance).filter(
        models.Attendance.user_id == user_id
    ).order_by(models.Attendance.date.desc(), models.Attendance.time.desc()).all()

@router.post("/submit")
async def submit_absence(
    request: SubmitRequest, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    today = date.today()

    existing = db.query(models.Attendance).filter(
        models.Attendance.user_id == current_user.id, 
        models.Attendance.date == today
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You've already checked in or submitted a leave request today!"
        )

    new_absence = models.Attendance(
        user_id=current_user.id,
        status=request.status,
        explanation=request.explanation if request.status in ["Sick", "Permission"] else None,
        date=today,
        time=datetime.now().strftime("%H:%M:%S")
    )
    
    db.add(new_absence)
    db.commit()

    return {"message": "Permohonan izin berhasil dikirim!"}
