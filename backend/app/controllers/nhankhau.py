from sqlalchemy.orm import Session
from ..models.nhan_khau import NhanKhau
from ..schemas import nhankhau as nk_schema

def get_nhankhau(db: Session, nhankhau_id: int):
    return db.query(NhanKhau).filter(NhanKhau.id == nhankhau_id).first()

def get_nhankhaus(db: Session, skip: int = 0, limit: int = 100):
    return db.query(NhanKhau).offset(skip).limit(limit).all()

def create_nhankhau(db: Session, nhankhau: nk_schema.NhanKhauCreate):
    db_nhankhau = NhanKhau(**nhankhau.dict())
    db.add(db_nhankhau)
    db.commit()
    db.refresh(db_nhankhau)
    return db_nhankhau

def update_nhankhau(db: Session, nhankhau_id: int, updated_data: nk_schema.NhanKhauCreate):
    db_nhankhau = db.query(NhanKhau).filter(NhanKhau.id == nhankhau_id).first()
    if db_nhankhau:
        for field, value in updated_data.dict().items():
            setattr(db_nhankhau, field, value)
        db.commit()
        db.refresh(db_nhankhau)
    return db_nhankhau

def delete_nhankhau(db: Session, nhankhau_id: int):
    nhankhau = db.query(NhanKhau).filter(NhanKhau.id == nhankhau_id).first()
    if nhankhau:
        db.delete(nhankhau)
        db.commit()
        return True
    return False
