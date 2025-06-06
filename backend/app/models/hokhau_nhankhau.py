from sqlalchemy import Column, Integer, String, Date, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class HoKhauNhanKhau(Base):
    __tablename__ = "hokhau_nhankhau"
    
    hokhau_id = Column(Integer, ForeignKey("hokhau.id", ondelete="CASCADE"), primary_key=True)
    nhankhau_id = Column(Integer, ForeignKey("nhankhau.id", ondelete="CASCADE"), primary_key=True)
    ngaythem = Column(Date, nullable=True)
    quanhevoichuho = Column(String(50), nullable=True)
    
    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    
    hokhau = relationship("HoKhau", back_populates="nhankhaus")
    nhankhau = relationship("NhanKhau", back_populates="hokhau_nhankhau")
