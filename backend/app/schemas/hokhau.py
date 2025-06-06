from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class HoKhauBase(BaseModel):
    sohokhau: str
    sonha: Optional[str] = None
    duong: Optional[str] = None
    phuong: Optional[str] = None
    quan: Optional[str] = None
    ngaylamhokhau: Optional[date] = None
    chu_ho_id: int

class HoKhauCreate(HoKhauBase):
    pass

class HoKhau(HoKhauBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
