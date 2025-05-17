from sqlalchemy import Column, Integer, String, Date, Boolean, Numeric, ForeignKey, Text, TIMESTAMP, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    vaitro = Column(String(20), nullable=False)