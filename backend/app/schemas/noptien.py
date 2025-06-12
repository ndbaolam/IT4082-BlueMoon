from pydantic import BaseModel, condecimal
from typing import Optional
from datetime import date, datetime

class NopTienBase(BaseModel):
    id: int    
    hokhau_id: int
    khoanthu_id: int
    nguoinop: str
    sotien: condecimal(max_digits=12, decimal_places=2)  # nếu cần 2 số thập phân

class NopTienCreate(NopTienBase):
    pass

class NopTienUpdate(BaseModel):
    nguoinop: Optional[str] = None
    sotien: Optional[condecimal(max_digits=12, decimal_places=2)] = None
    ngaynop: Optional[date] = None

class NopTienInDB(NopTienBase):
    id: int
    ngaynop: date

    class Config:
        from_attributes = True
