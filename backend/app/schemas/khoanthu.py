from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class KhoanThuBase(BaseModel):
    id: int
    ngaytao: date
    tenkhoanthu: str
    thoihan: Optional[date] = None
    batbuoc: bool = True
    ghichu: Optional[str] = None
    sotien: int

class KhoanThuCreate(KhoanThuBase):
    pass

class KhoanThuUpdate(KhoanThuBase):
    pass

class KhoanThuInDB(KhoanThuBase):    
    id: int
    ngaytao: date
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
