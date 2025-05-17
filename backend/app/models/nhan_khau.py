from sqlalchemy import Column, Integer, String, Date, Boolean, Numeric, ForeignKey, Text, TIMESTAMP, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class NhanKhau(Base):
    __tablename__ = "nhankhau"
    id = Column(Integer, primary_key=True, index=True)
    hoten = Column(String(100), nullable=False)
    ngaysinh = Column(Date)
    gioitinh = Column(String(10))
    dantoc = Column(String(50))
    tongiao = Column(String(50))
    cccd = Column(String(12), unique=True, index=True)
    ngaycap = Column(Date)
    noicap = Column(String(100))
    nghenghiep = Column(String(100))
    ghichu = Column(Text)

    hokhau_chuho = relationship("HoKhau", back_populates="chu_ho", uselist=False)
    tamtrutamvang = relationship("TamTruTamVang", back_populates="nhankhau")
    lichsu_hokhau = relationship("LichSuHoKhau", back_populates="nhankhau")
    hokhau_nhankhau = relationship("HoKhauNhanKhau", back_populates="nhankhau")
