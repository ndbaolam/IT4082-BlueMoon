from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class NopTien(Base):
    __tablename__ = "noptien"

    id = Column(Integer, primary_key=True, index=True)
    hokhau_id = Column(Integer, ForeignKey("hokhau.id", ondelete="CASCADE"), nullable=False, index=True)
    khoanthu_id = Column(Integer, ForeignKey("khoanthu.id", ondelete="CASCADE"), nullable=False, index=True)

    nguoinop = Column(String(100), nullable=False)
    sotien = Column(Numeric(12, 2), nullable=False)

    ngaynop = Column(Date, server_default=func.current_date(), nullable=False, index=True)

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

    hokhau = relationship("HoKhau", back_populates="noptien")
    khoanthu = relationship("KhoanThu", back_populates="noptien")
