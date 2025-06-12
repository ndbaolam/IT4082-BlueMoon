from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

# Dữ liệu người dùng gửi vào
class KhoanThuCreate(BaseModel):
    tenkhoanthu: str
    thoihan: Optional[date] = None
    batbuoc: bool = True
    ghichu: Optional[str] = None
    sotien: int

# Dữ liệu người dùng có thể cập nhật
class KhoanThuUpdate(BaseModel):
    tenkhoanthu: Optional[str] = None
    thoihan: Optional[date] = None
    batbuoc: Optional[bool] = None
    ghichu: Optional[str] = None
    sotien: Optional[int] = None

# Schema để trả ra client (bao gồm cả id, ngaytao...)
class KhoanThuResponse(BaseModel):
    id: int
    ngaytao: date
    tenkhoanthu: str
    thoihan: Optional[date] = None
    batbuoc: bool
    ghichu: Optional[str] = None
    sotien: int

    class Config:
        from_attributes = True  # Cho phép đọc từ ORM
