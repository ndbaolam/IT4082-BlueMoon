import enum
from sqlalchemy import (
    Column, Integer, String, Date, Text, TIMESTAMP,
    ForeignKey, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class TrangThaiTamTruTamVang(str, enum.Enum):
    tamtru = "tạm trú"
    tamvang = "tạm vắng"

class TamTruTamVang(Base):
    __tablename__ = "tamtrutamvang"

    id = Column(Integer, primary_key=True, index=True)
    nhankhau_id = Column(Integer, ForeignKey("nhankhau.id", ondelete="CASCADE"), nullable=False, index=True)

    trangthai = Column(Enum(TrangThaiTamTruTamVang), nullable=False, index=True)
    diachitamtrutamvang = Column(String(255))
    thoigian = Column(Date)
    noidungdenghi = Column(Text)

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

    nhankhau = relationship("NhanKhau", back_populates="tamtrutamvang")