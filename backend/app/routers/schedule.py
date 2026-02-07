from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from fastapi import HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/schedule", tags=["Schedule"])

class ScheduleCreate(BaseModel):
    day: str
    time: str
    subject: str
    teacher: str
    room: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_schedules(db: Session = Depends(get_db)):
    return db.query(models.Schedule).all()

@router.post("/")
def create_schedule(data: ScheduleCreate, db: Session = Depends(get_db)):
    schedule = models.Schedule(**data.dict())
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return schedule

@router.put("/{id}")
def update_schedule(id: int, data: ScheduleCreate, db: Session = Depends(get_db)):
    schedule = db.query(models.Schedule).filter(models.Schedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    for key, value in data.dict().items():
        setattr(schedule, key, value)

    db.commit()
    db.refresh(schedule)
    return schedule

@router.delete("/{id}")
def delete_schedule(id: int, db: Session = Depends(get_db)):
    schedule = db.query(models.Schedule).filter(models.Schedule.id == id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    db.delete(schedule)
    db.commit()
    return {"message": "Schedule deleted"}
