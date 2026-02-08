from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from datetime import date, datetime, timedelta
from app.utils.jwt import decode_access_token
from sqlalchemy import func

student_router = APIRouter(prefix="/student", tags=["Student Dashboard"])

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = decode_access_token(token)
        user = db.query(models.User).filter(models.User.id == payload.get("user_id")).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@student_router.get("/notifications")
def student_notifications(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    start_of_month = today.replace(day=1)
    
    records = db.query(models.Attendance).filter(
        models.Attendance.user_id == current_user.id,
        func.date(models.Attendance.date) >= start_of_month,
        models.Attendance.status.in_(["Present", "Alpha", "present", "alpha"])
    ).order_by(models.Attendance.date.desc()).all()

    notifications = []
    OFFICIAL_H, OFFICIAL_M = 6, 30

    for rec in records:
        db_status = rec.status.strip().lower() if rec.status else ""
        status_type = "success"
        text = ""

        if db_status == "present":
            if rec.time:
                try:
                    if hasattr(rec.time, 'hour'):
                        h, m = rec.time.hour, rec.time.minute
                    else:
                        t_str = str(rec.time).split(':')
                        h, m = int(t_str[0]), int(t_str[1])
                    
                    if h < OFFICIAL_H or (h == OFFICIAL_H and m <= OFFICIAL_M):
                        status_type = "success"
                        text = f"You checked in on time at {h:02d}:{m:02d}"
                    else:
                        status_type = "late"
                        total_mins = (h * 60 + m) - (OFFICIAL_H * 60 + OFFICIAL_M)
                        
                        if total_mins >= 60:
                            hours = total_mins // 60
                            mins = total_mins % 60
                            if mins > 0:
                                late_text = f"{hours} hour {mins} mins"
                            else:
                                late_text = f"{hours} hour"
                        else:
                            late_text = f"{total_mins} mins"
                        
                        text = f"You were late ({late_text})"
                except:
                    text = "You checked in successfully"
            else:
                text = "You checked in successfully"
        
        elif db_status == "alpha":
            status_type = "alpha"
            text = "You have been marked as Alpha"
        else:
            continue

        notifications.append({
            "id": f"notif-{rec.id}",
            "text": text,
            "time": rec.date.strftime("%d %b %Y"),
            "type": status_type,
            "unread": True
        })
        
    return notifications

@student_router.get("/monthly-summary")
def monthly_summary(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    today = date.today()
    start_of_month = today.replace(day=1)
    
    records = db.query(models.Attendance).filter(
        models.Attendance.user_id == current_user.id,
        func.date(models.Attendance.date) >= start_of_month
    ).all()

    summary = {"on_time": 0, "late": 0, "alpha": 0}
    OFFICIAL_H, OFFICIAL_M = 6, 30

    for rec in records:
        db_status = rec.status.strip().lower() if rec.status else ""
        
        if db_status == "present":
            try:
                if hasattr(rec.time, 'hour'):
                    h, m = rec.time.hour, rec.time.minute
                else:
                    t_parts = str(rec.time).split(':')
                    h, m = int(t_parts[0]), int(t_parts[1])
                
                if h < OFFICIAL_H or (h == OFFICIAL_H and m <= OFFICIAL_M):
                    summary["on_time"] += 1
                else:
                    summary["late"] += 1
            except:
                summary["on_time"] += 1
        
        elif db_status == "alpha":
            summary["alpha"] += 1
            
    return summary