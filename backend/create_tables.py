from app.database import engine, Base
from app import models 

print("⏳ Menghubungkan ke Railway untuk membuat tabel...")
try:
    Base.metadata.create_all(bind=engine)
    print("✅ Tabel-tabel berhasil dibuat di PostgreSQL Railway!")
except Exception as e:
    print(f"❌ Gagal membuat tabel: {e}")