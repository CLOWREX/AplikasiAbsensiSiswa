from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from datetime import date, datetime, timedelta
from app.utils.jwt import decode_access_token

student_router = APIRouter(prefix="/student", tags=["Student Dashboard"])

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_access_token(token)
    user = db.query(models.User).filter(models.User.id == payload.get("user_id")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@student_router.get("/notifications")
def student_notifications(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Ambil data 30 hari terakhir
    today = date.today()
    start_date = today - timedelta(days=30)
    
    records = db.query(models.Attendance).filter(
        models.Attendance.user_id == current_user.id,
        models.Attendance.date >= start_date
    ).order_by(models.Attendance.date.desc()).all()

    notifications = []
    OFFICIAL_H, OFFICIAL_M = 6, 30

    for rec in records:
        db_status = rec.status.lower() if rec.status else ""
        
        # FILTER: Sakit/Izin tidak ditampilkan
        if db_status not in ["present", "alpha"]:
            continue

        status_type = "alpha" 
        text = ""

        if db_status == "present":
            if rec.time:
                try:
                    t_str = str(rec.time).split(':')
                    h, m = int(t_str[0]), int(t_str[1])
                    
                    if h < OFFICIAL_H or (h == OFFICIAL_H and m <= OFFICIAL_M):
                        status_type = "success"
                        text = f"You checked in on time at {h:02d}:{m:02d}"
                    else:
                        status_type = "late"
                        total_late_mins = (h * 60 + m) - (OFFICIAL_H * 60 + OFFICIAL_M)
                        if total_late_mins >= 60:
                            hrs, mns = divmod(total_late_mins, 60)
                            late_text = f"{hrs} hours {mns} mins" if mns > 0 else f"{hrs} hours"
                        else:
                            late_text = f"{total_late_mins} mins"
                        text = f"You were late ({late_text})"
                except:
                    status_type = "success"
                    text = "You checked in successfully"
            else:
                status_type = "success"
                text = "You checked in successfully"
        elif db_status == "alpha":
            status_type = "alpha"
            text = "You have been marked as Alpha"

        # Tampilkan tanggal murni (Tanpa Today/Yesterday)
        display_date = rec.date.strftime("%d %b %Y") if hasattr(rec.date, 'strftime') else str(rec.date)

        notifications.append({
            "id": f"notif-{rec.id}",
            "text": text,
            "time": display_date,
            "type": status_type
        })
        
    return notifications

@student_router.get("/monthly-summary")
def monthly_summary(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    start_date = today.replace(day=1)
    
    records = db.query(models.Attendance).filter(
        models.Attendance.user_id == current_user.id,
        models.Attendance.date >= start_date
    ).all()

    summary = {"on_time": 0, "late": 0, "alpha": 0}
    OFFICIAL_H, OFFICIAL_M = 6, 30

    for rec in records:
        db_status = rec.status.lower() if rec.status else ""
        if db_status == "present":
            try:
                t_str = str(rec.time).split(':')
                h, m = int(t_str[0]), int(t_str[1])
                if h < OFFICIAL_H or (h == OFFICIAL_H and m <= OFFICIAL_M):
                    summary["on_time"] += 1
                else:
                    summary["late"] += 1
            except:
                summary["on_time"] += 1
        elif db_status == "alpha":
            summary["alpha"] += 1
            
    return summary