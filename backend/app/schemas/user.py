from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class UserBase(BaseModel):
    username: str
    vaitro: str
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    class Config:
        from_attributes = True