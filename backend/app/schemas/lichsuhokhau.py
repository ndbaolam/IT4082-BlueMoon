from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LichSuHoKhauBase(BaseModel):
    hokhau_id: int
    nhankhau_id: int
    loaithaydoi: int
    created_at: datetime 

class LichSuHoKhauCreate(BaseModel):
    hokhau_id: int
    nhankhau_id: int
    loaithaydoi: int

class LichSuHoKhauUpdate(BaseModel):
    hokhau_id: Optional[int]
    nhankhau_id: Optional[int]
    loaithaydoi: Optional[int]

class LichSuHoKhau(LichSuHoKhauBase):
    id: int

    class Config:
        from_attributes = True