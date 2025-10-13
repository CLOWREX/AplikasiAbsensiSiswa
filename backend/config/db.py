from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Ganti sesuai kredensial PostgreSQL kamu di pgAdmin
DATABASE_URL = "postgresql+psycopg2://postgres:postgres@localhost:5432/absensi_qr"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency (dipakai di route)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()