from pydantic import BaseModel
from typing import Optional
from datetime import date

class NhanKhauBase(BaseModel):
    hoten: str
    ngaysinh: Optional[date]
    gioitinh: Optional[str]
    dantoc: Optional[str]
    tongiao: Optional[str]
    cccd: Optional[str]
    ngaycap: Optional[date]
    noicap: Optional[str]
    nghenghiep: Optional[str]
    ghichu: Optional[str]

class NhanKhauCreate(NhanKhauBase):
    pass

class NhanKhau(NhanKhauBase):
    id: int

    class Config:
        from_attributes = True
