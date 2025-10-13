from fastapi import FastAPI
from config.db import Base, engine
from routes import user_routes

# Buat tabel otomatis di database PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Absensi Berbasis QR API", version="1.0")

# Include routes
app.include_router(user_routes.router)

@app.get("/")
def home():
    return {"message": "Backend Absensi QR Berjalan 🚀"}
