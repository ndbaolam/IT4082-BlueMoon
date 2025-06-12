from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class HoKhauBase(BaseModel):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    sohokhau: str
    sophong: Optional[str] = None
    ngaylamhokhau: Optional[date] = None
    chu_ho_id: int

class HoKhauCreate(HoKhauBase):
    pass

class HoKhau(HoKhauBase):    
    class Config:
        from_attributes = True
