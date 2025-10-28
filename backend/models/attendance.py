# models/attendance.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from config.db import Base
from datetime import datetime

class DailyQRCode(Base):
    __tablename__ = "daily_qr_codes"
    id = Column(Integer, primary_key=True, index=True)
    teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    qr_token = Column(String(128), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # relationships (optional)
    attendance_logs = relationship("AttendanceLog", back_populates="daily_qr")
    teacher = relationship("Teacher")

class AttendanceLog(Base):
    __tablename__ = "attendance_logs"
    id = Column(Integer, primary_key=True, index=True)
    daily_qr_id = Column(Integer, ForeignKey("daily_qr_codes.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default="Hadir")
    timestamp = Column(DateTime, default=datetime.utcnow)

    daily_qr = relationship("DailyQRCode", back_populates="attendance_logs")
