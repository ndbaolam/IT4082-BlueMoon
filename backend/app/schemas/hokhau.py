from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class HoKhauBase(BaseModel):
    sohokhau: str
    sonha: Optional[str]
    duong: Optional[str]
    phuong: Optional[str]
    quan: Optional[str]
    ngaylamhokhau: Optional[date]
    chu_ho_id: int

class HoKhauCreate(HoKhauBase):
    pass

class HoKhau(HoKhauBase):
    id: int
    class Config:
        from_attributes = True