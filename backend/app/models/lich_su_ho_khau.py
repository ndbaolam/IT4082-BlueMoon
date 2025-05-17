from sqlalchemy import Column, Integer, String, Date, Boolean, Numeric, ForeignKey, Text, TIMESTAMP, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class LichSuHoKhau(Base):
    __tablename__ = "lichsu_hokhau"
    id = Column(Integer, primary_key=True, index=True)
    hokhau_id = Column(Integer, ForeignKey("hokhau.id", ondelete="CASCADE"), nullable=False)
    nhankhau_id = Column(Integer, ForeignKey("nhankhau.id", ondelete="CASCADE"), nullable=False)
    loaithaydoi = Column(SmallInteger, nullable=False)  # 1: thêm, 2: xóa
    thoigian = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    hokhau = relationship("HoKhau", back_populates="lichsu_hokhau")
    nhankhau = relationship("NhanKhau", back_populates="lichsu_hokhau")
