from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from app.database import engine
from app import models
from app.routers import auth, admin, qr, attendance, schedule, teacher, student

app = FastAPI(title="Absensi Siswa QR Code")

os.makedirs("static/qr_codes", exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = [
    "http://10.10.18.236:5173",
    "http://10.10.18.236:5004", 
    "http://10.10.18.236:8004", 
    "http://localhost",
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# models.Base.metadata.create_all(bind=engine)

app.include_router(auth.auth_router)
app.include_router(teacher.teacher_router)
app.include_router(admin.router)
app.include_router(attendance.router)
app.include_router(schedule.router)
app.include_router(qr.router)
app.include_router(student.student_router)

@app.get("/")
def root():
    return {"message": "Backend siap 🔥"}
