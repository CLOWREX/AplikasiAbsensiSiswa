from sqlalchemy import Column, Integer, String
from config.db import Base

class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    subject = Column(String(50), nullable=True)
