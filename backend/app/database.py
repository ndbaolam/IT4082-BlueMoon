from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://ktpm:ktpm@localhost:5432/ktpm")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

# Import các model sau khi tạo Base
from app.models.khoanthu import KhoanThu
from app.models.nop_tien import NopTien
from app.models.hokhau import HoKhau
from app.models.nhan_khau import NhanKhau
from app.models.hokhau_nhankhau import HoKhauNhanKhau
from app.models.lich_su_ho_khau import LichSuHoKhau
from app.models.user import User
from app.models.tamtrutamvang import TamTruTamVang
