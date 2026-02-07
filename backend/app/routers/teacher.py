from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, date, timedelta
from app.database import get_db
from app import models
from fastapi import HTTPException
from sqlalchemy.orm import joinedload
from sqlalchemy import distinct, func

teacher_router = APIRouter(prefix="/teacher", tags=["Teacher Dashboard"])

@teacher_router.get("/classes-summary")
def get_classes_summary(db: Session = Depends(get_db)):
    today = date.today()

    classes = db.query(models.User.student_class).filter(
        models.User.student_class.isnot(None),
        models.User.role == "student"
    ).distinct().all()

    summary = []

    for (cls_name,) in classes:
        total = db.query(models.User).filter(
            models.User.student_class == cls_name,
            models.User.role == "student"
        ).count()

        recorded = (
            db.query(distinct(models.Attendance.user_id))
            .join(models.User)
            .filter(
                models.User.student_class == cls_name,
                models.Attendance.date == today
            )
            .count()
        )

        missing = total - recorded

        summary.append({
            "name": cls_name,
            "total": total,
            "missing": missing
        })

    return summary

@teacher_router.get("/class-details/{class_name}")
def get_class_details(class_name: str, db: Session = Depends(get_db)):
    today = date.today()

    all_students = db.query(models.User).filter(
        models.User.student_class == class_name,
        models.User.role == "student"
    ).all()

    attendance = (
        db.query(models.Attendance)
        .options(joinedload(models.Attendance.user))
        .join(models.User)
        .filter(
            models.User.student_class == class_name,
            models.Attendance.date == today
        )
        .all()
    )

    present_students = []
    present_user_ids = set()

    for a in attendance:
        present_user_ids.add(a.user.id)
        present_students.append({
            "attendanceId": a.id,
            "status": a.status,
            "explanation": a.explanation,
            "time": a.time,
            "user": {
                "id": a.user.id,
                "fullName": a.user.fullName,
                "username": a.user.username 
            }
        })

    missing_students = []

    for s in all_students:
        if s.id not in present_user_ids:
            missing_students.append({
                "id": s.id,
                "fullName": s.fullName,
                "username": s.username 
            })

    return {
        "present": present_students,   
        "missing": missing_students,   
        "total": len(all_students)
    }

@teacher_router.post("/alpha/{student_id}")
def alpha_student(student_id: int, db: Session = Depends(get_db)):
    today = date.today()

    student = db.query(models.User).filter(
        models.User.id == student_id,
        models.User.role == "student"
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    existing = db.query(models.Attendance).filter(
        models.Attendance.user_id == student_id,
        models.Attendance.date == today
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Attendance already recorded for today"
        )

    alpha_attendance = models.Attendance(
        user_id=student_id,
        date=today,
        status="alpha",
        time=datetime.now().strftime("%H:%M"),
        explanation="Absent without permission"
    )

    db.add(alpha_attendance)
    db.commit()

    return {
        "message": "Student marked as alpha",
        "student_id": student_id
    }

@teacher_router.get("/notifications")
def teacher_notifications(db: Session = Depends(get_db)):
    today = date.today()
    start_date = today - timedelta(days=30)

    # Ambil semua attendance & jumlah siswa per kelas dalam 30 hari sekaligus
    subq = (
        db.query(
            models.Attendance.date.label("att_date"),
            models.User.student_class.label("cls_name"),
            func.count(models.Attendance.user_id).label("checked_in"),
        )
        .join(models.User, models.Attendance.user_id == models.User.id)
        .filter(
            models.Attendance.date >= start_date,
            models.User.role == "student",
            models.User.student_class.isnot(None)
        )
        .group_by(models.Attendance.date, models.User.student_class)
        .all()
    )

    # Ambil total siswa per kelas
    total_students_per_class = dict(
        db.query(
            models.User.student_class,
            func.count(models.User.id)
        )
        .filter(models.User.role=="student", models.User.student_class.isnot(None))
        .group_by(models.User.student_class)
        .all()
    )

    notifications = []
    for record in subq:
        total = total_students_per_class.get(record.cls_name, 0)
        if total > 0 and total == record.checked_in:
            # Tentukan string waktu
            if record.att_date == today:
                time_str = "Today"
            elif record.att_date == today - timedelta(days=1):
                time_str = "Yesterday"
            else:
                time_str = record.att_date.strftime("%d/%m/%Y")

            notifications.append({
                "id": f"{record.cls_name}-{record.att_date}",
                "text": f"Class {record.cls_name} has fully checked in!",
                "time": time_str,
                "unread": True
            })

    notifications.sort(key=lambda x: x["id"], reverse=True)
    return notifications

@teacher_router.get("/daily-summary")
def daily_summary(db: Session = Depends(get_db)):
    today = date.today()

    classes = db.query(models.User.student_class).filter(
        models.User.role == "student",
        models.User.student_class.isnot(None)
    ).distinct().all()

    total_classes = len(classes)
    finished_classes = 0

    for (cls_name,) in classes:
        total_students = db.query(models.User).filter(
            models.User.role == "student",
            models.User.student_class == cls_name
        ).count()

        recorded_students = db.query(models.Attendance.user_id).join(models.User).filter(
            models.User.role == "student",
            models.User.student_class == cls_name,
            models.Attendance.date == today
        ).distinct().count()

        if total_students > 0 and total_students == recorded_students:
            finished_classes += 1

    completion_rate = int((finished_classes / total_classes) * 100) if total_classes else 0

    return {
        "total_classes": total_classes,
        "finished_classes": finished_classes,
        "in_progress_classes": total_classes - finished_classes,
        "completion_rate": completion_rate
    }