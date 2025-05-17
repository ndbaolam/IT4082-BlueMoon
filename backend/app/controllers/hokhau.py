from sqlalchemy.orm import Session
from ..models.hokhau import HoKhau
from ..schemas import hokhau as hokhau_schema

def get_hokhau(db: Session, hokhau_id: int):
    return db.query(HoKhau).filter(HoKhau.id == hokhau_id).first()

def get_hokhaus(db: Session, skip: int = 0, limit: int = 100):
    return db.query(HoKhau).offset(skip).limit(limit).all()

def create_hokhau(db: Session, hokhau: hokhau_schema.HoKhauCreate):
    db_hokhau = HoKhau(**hokhau.dict())
    db.add(db_hokhau)
    db.commit()
    db.refresh(db_hokhau)
    return db_hokhau

def update_hokhau(db: Session, hokhau_id: int, updated_data: hokhau_schema.HoKhauCreate):
    db_hokhau = db.query(HoKhau).filter(HoKhau.id == hokhau_id).first()
    if db_hokhau:
        for field, value in updated_data.dict().items():
            setattr(db_hokhau, field, value)
        db.commit()
        db.refresh(db_hokhau)
    return db_hokhau

def delete_hokhau(db: Session, hokhau_id: int):
    hokhau = db.query(HoKhau).filter(HoKhau.id == hokhau_id).first()
    if hokhau:
        db.delete(hokhau)
        db.commit()
        return True
    return False
