from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LichSuHoKhauBase(BaseModel):
    hokhau_id: int
    nhankhau_id: int
    loaithaydoi: int
    thoigian: str

class LichSuHoKhauCreate(LichSuHoKhauBase):
    pass

class LichSuHoKhauUpdate(BaseModel):
    hokhau_id: Optional[int]
    nhankhau_id: Optional[int]
    loaithaydoi: Optional[int]
    thoigian: Optional[str]

class LichSuHoKhau(LichSuHoKhauBase):
    id: int

    class Config:
        orm_mode = True