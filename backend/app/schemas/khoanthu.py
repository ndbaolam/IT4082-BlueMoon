from pydantic import BaseModel
from typing import Optional
from datetime import date

class KhoanThuBase(BaseModel):
    tenkhoanthu: str
    thoihan: Optional[date] = None
    batbuoc: bool = True
    ghichu: Optional[str] = None

class KhoanThuCreate(KhoanThuBase):
    pass

class KhoanThuUpdate(KhoanThuBase):
    pass

class KhoanThuInDB(KhoanThuBase):
    id: int
    ngaytao: date

    class Config:
        from_attributes = True
