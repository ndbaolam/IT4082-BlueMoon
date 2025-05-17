from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class NopTien(Base):
    __tablename__ = "noptien"
    id = Column(Integer, primary_key=True, index=True)
    hokhau_id = Column(Integer, ForeignKey("hokhau.id", ondelete="CASCADE"), nullable=False)
    khoanthu_id = Column(Integer, ForeignKey("khoanthu.id", ondelete="CASCADE"), nullable=False)
    nguoinop = Column(String(100), nullable=False)
    sotien = Column(Numeric(12, 2), nullable=False)
    ngaynop = Column(Date, server_default=func.now(), nullable=False)

    hokhau = relationship("HoKhau", back_populates="noptien")
    khoanthu = relationship("KhoanThu", back_populates="noptien")
