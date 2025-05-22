from pydantic import BaseModel
from typing import Optional
from datetime import date

class TamTruTamVangBase(BaseModel):
    nhankhau_id: int
    trangthai: str
    diachitamtrutamvang: Optional[str] = None
    thoigian: Optional[date] = None
    noidungdenghi: Optional[str] = None

class TamTruTamVangCreate(TamTruTamVangBase):
    pass

class TamTruTamVangUpdate(TamTruTamVangBase):
    pass

class TamTruTamVangInDB(TamTruTamVangBase):
    id: int

    class Config:
        from_attributes = True
