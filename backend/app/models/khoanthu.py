from sqlalchemy import Column, Integer, String, Date, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class KhoanThu(Base):
    __tablename__ = "khoanthu"
    id = Column(Integer, primary_key=True, index=True)
    ngaytao = Column(Date, server_default=func.now(), nullable=False)
    thoihan = Column(Date)
    tenkhoanthu = Column(String(100), nullable=False)
    batbuoc = Column(Boolean, nullable=False, default=True)
    ghichu = Column(Text)

    noptien = relationship("NopTien", back_populates="khoanthu")
