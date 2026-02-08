from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Date, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, date
from app.database import Base
from sqlalchemy import UniqueConstraint

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullName = Column(String)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    phone = Column(String)
    role = Column(String)
    student_class = Column(String, nullable=True)

    attendances = relationship("Attendance", back_populates="user")

class Attendance(Base):
    __tablename__ = "attendances"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date)

    status = Column(String)
    explanation = Column(String, nullable=True)
    time = Column(String)
    time_status = Column(String)

    user = relationship("User", back_populates="attendances")

    __table_args__ = (
        UniqueConstraint("user_id", "date", name="unique_user_date"),
    )

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    day = Column(String)
    time = Column(String)
    subject = Column(String)
    teacher = Column(String)
    room = Column(String)

class QRCode(Base):
    __tablename__ = "qr_codes"

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String, nullable=False)
    created_at = Column(Date, default=date.today)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    unread = Column(Boolean, default=True)
