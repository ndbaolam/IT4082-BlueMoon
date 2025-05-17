from sqlalchemy import Column, Integer, String, Date, Boolean, Numeric, ForeignKey, Text, TIMESTAMP, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class HoKhau(Base):
    __tablename__ = "hokhau"
    id = Column(Integer, primary_key=True, index=True)
    sohokhau = Column(String(20), unique=True, nullable=False)
    sonha = Column(String(100))
    duong = Column(String(100))
    phuong = Column(String(100))
    quan = Column(String(100))
    ngaylamhokhau = Column(Date)
    chu_ho_id = Column(Integer, ForeignKey("nhankhau.id"), nullable=False)

    chu_ho = relationship("NhanKhau", back_populates="hokhau_chuho")
    nhankhaus = relationship("HoKhauNhanKhau", back_populates="hokhau")
    lichsu_hokhau = relationship("LichSuHoKhau", back_populates="hokhau")
    noptien = relationship("NopTien", back_populates="hokhau")
