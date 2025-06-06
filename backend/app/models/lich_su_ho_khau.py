from sqlalchemy import Column, Integer, SmallInteger, ForeignKey, TIMESTAMP, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class LichSuHoKhau(Base):
    __tablename__ = "lichsu_hokhau"

    id = Column(Integer, primary_key=True, index=True)
    hokhau_id = Column(Integer, ForeignKey("hokhau.id", ondelete="CASCADE"), nullable=False)
    nhankhau_id = Column(Integer, ForeignKey("nhankhau.id", ondelete="CASCADE"), nullable=False)
    
    loaithaydoi = Column(SmallInteger, nullable=False)
    # Giới hạn giá trị loaithaydoi chỉ được phép 1 hoặc 2
    __table_args__ = (
        CheckConstraint(loaithaydoi.in_([1, 2]), name="chk_loaithaydoi"),
    )

    # Có thể dùng created_at thay cho thoigian
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

    hokhau = relationship("HoKhau", back_populates="lichsu_hokhau")
    nhankhau = relationship("NhanKhau", back_populates="lichsu_hokhau")