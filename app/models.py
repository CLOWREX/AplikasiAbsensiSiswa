from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin / guru / siswa
    kelas = Column(String, nullable=True)


class QrCode(Base):
    __tablename__ = "qr_codes"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, nullable=False)
    kelas_id = Column(Integer, nullable=False)
    tanggal = Column(Date, nullable=False)
    aktif_dari = Column(Time, nullable=False)
    aktif_sampai = Column(Time, nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"))
