from sqlalchemy import Column, Integer, String, Date, Boolean, Text, TIMESTAMP
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class KhoanThu(Base):
    __tablename__ = "khoanthu"

    id = Column(Integer, primary_key=True, index=True)
    ngaytao = Column(Date, server_default=func.now(), nullable=False)
    thoihan = Column(Date, nullable=True)
    tenkhoanthu = Column(String(100), nullable=False)
    batbuoc = Column(Boolean, nullable=False, server_default='true')
    ghichu = Column(Text, nullable=True)
    
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

    noptien = relationship("NopTien", back_populates="khoanthu")
