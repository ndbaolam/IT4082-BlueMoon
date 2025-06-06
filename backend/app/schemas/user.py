from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from ..models.user import VaiTroEnum

class UserBase(BaseModel):
    email: EmailStr
    vaitro: VaiTroEnum
    first_name: str
    last_name: str
    sodienthoai: Optional[str] = None
    diachi: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    trangthai: Optional[bool] = True

    class Config:
        from_attributes = True
