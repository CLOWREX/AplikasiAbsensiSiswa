from fastapi import FastAPI
from config.db import Base, engine
from routes import user_routes, attendance_routes, teacher_routes
import uvicorn

# ==========================================================
# Inisialisasi database (buat semua tabel dari model secara otomatis)
# ==========================================================
Base.metadata.create_all(bind=engine)

# ==========================================================
# Inisialisasi aplikasi FastAPI
# ==========================================================
app = FastAPI(
    title="Absensi Berbasis QR API",
    description="Sistem API untuk manajemen absensi menggunakan QR Code",
    version="1.0.0"
)

# ==========================================================
# Include semua routes (endpoint)
# ==========================================================
app.include_router(user_routes.router)        # Route untuk user (register, login, dll)
app.include_router(attendance_routes.router)  # Route untuk absensi (scan, lihat riwayat, dll)
app.include_router(teacher_routes.router)     # Route untuk guru (manajemen jadwal, data, dll)

# ==========================================================
# Endpoint dasar (root)
# ==========================================================
@app.get("/")
def home():
    return {"message": "Backend Absensi QR Berjalan 🚀"}

# ==========================================================
# Jalankan server (hanya berjalan jika file ini dieksekusi langsung)
# ==========================================================
if __name__ == "__main__":
    print("Menjalankan server FastAPI...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
