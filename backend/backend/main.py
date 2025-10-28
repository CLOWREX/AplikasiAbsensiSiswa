from fastapi import FastAPI
from config.db import Base, engine
from routes import user_routes, teacher_routes, attendance_routes

# Buat tabel otomatis di database
Base.metadata.create_all(bind=engine)

# Inisialisasi aplikasi FastAPI
app = FastAPI(
    title="Absensi Berbasis QR API",
    version="1.0",
    description="Sistem absensi siswa & guru menggunakan QR code"
)

# Registrasi semua router
app.include_router(user_routes.router)
app.include_router(teacher_routes.router)
app.include_router(attendance_routes.router)

# Endpoint utama
@app.get("/")
def home():
    return {"message": "Backend Absensi QR Berjalan 🚀"}
