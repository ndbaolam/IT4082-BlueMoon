from sqlalchemy import Column, Integer, String, Date, Boolean, Numeric, ForeignKey, Text, TIMESTAMP, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class TamTruTamVang(Base):
    __tablename__ = "tamtrutamvang"
    id = Column(Integer, primary_key=True, index=True)
    nhankhau_id = Column(Integer, ForeignKey("nhankhau.id", ondelete="CASCADE"), nullable=False)
    trangthai = Column(String(20), nullable=False)  # 'tạm trú' or 'tạm vắng'
    diachitamtrutamvang = Column(String(255))
    thoigian = Column(Date)
    noidungdenghi = Column(Text)

    nhankhau = relationship("NhanKhau", back_populates="tamtrutamvang")
