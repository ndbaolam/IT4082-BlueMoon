from sqlalchemy import Column, Integer, String, Date, TIMESTAMP, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class HoKhau(Base):
    __tablename__ = "hokhau"
    
    id = Column(Integer, primary_key=True, index=True)
    sohokhau = Column(String(20), unique=True, nullable=False)
    sophong = Column(String(100), nullable=True)
    ngaylamhokhau = Column(Date, nullable=True)
    chu_ho_id = Column(Integer, ForeignKey("nhankhau.id", ondelete="RESTRICT"), nullable=False)
    
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

    chu_ho = relationship("NhanKhau", back_populates="hokhau_chuho")
    nhankhaus = relationship("HoKhauNhanKhau", back_populates="hokhau")
    lichsu_hokhau = relationship("LichSuHoKhau", back_populates="hokhau")
    noptien = relationship("NopTien", back_populates="hokhau")
