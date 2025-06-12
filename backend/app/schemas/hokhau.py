from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class HoKhauBase(BaseModel):
    sohokhau: str
    sophong: Optional[str] = None
    ngaylamhokhau: Optional[date] = None
    chu_ho_id: int

class HoKhauCreate(HoKhauBase):
    # Inherits: sohokhau, sophong, ngaylamhokhau, chu_ho_id
    # Does NOT include id, created_at, updated_at (these are auto-generated)
    pass

class HoKhau(HoKhauBase):
    # Response model includes all fields
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True