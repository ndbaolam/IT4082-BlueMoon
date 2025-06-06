from sqlalchemy import (
    Column, Integer, String, Date, Text, TIMESTAMP, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base
import enum

class GioiTinhEnum(str, enum.Enum):
    nam = "Nam"
    nu = "Nữ"
    khac = "Khác"

class NhanKhau(Base):
    __tablename__ = "nhankhau"

    id = Column(Integer, primary_key=True, index=True)
    hoten = Column(String(100), nullable=False)
    ngaysinh = Column(Date, index=True)
    gioitinh = Column(Enum(GioiTinhEnum), nullable=True, index=True)
    dantoc = Column(String(50), index=True)
    tongiao = Column(String(50))
    cccd = Column(String(12), unique=True, index=True)
    ngaycap = Column(Date)
    noicap = Column(String(100))
    nghenghiep = Column(String(100))
    ghichu = Column(Text)

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

    hokhau_chuho = relationship("HoKhau", back_populates="chu_ho", uselist=False)
    tamtrutamvang = relationship("TamTruTamVang", back_populates="nhankhau")
    lichsu_hokhau = relationship("LichSuHoKhau", back_populates="nhankhau")
    hokhau_nhankhau = relationship("HoKhauNhanKhau", back_populates="nhankhau")
