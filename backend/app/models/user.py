from sqlalchemy import Column, Integer, String, TIMESTAMP, Boolean
from sqlalchemy.sql import func
from ..database import Base
import enum
from sqlalchemy import Enum

class VaiTroEnum(str, enum.Enum):
    ketoan = "ke_toan"
    totruong = "to_truong"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    password = Column(String(255), nullable=False)
    vaitro = Column(Enum(VaiTroEnum, name="user_role"), nullable=False)

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, nullable=False)
    sodienthoai = Column(String(20), nullable=True)
    diachi = Column(String(255), nullable=True)

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

    trangthai = Column(Boolean, nullable=False, server_default='true')
