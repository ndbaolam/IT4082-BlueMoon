from sqlalchemy.orm import Session
from ..models import lich_su_ho_khau as models
from ..schemas import lichsuhokhau as schemas

def create_lichsuhokhau(db: Session, data: schemas.LichSuHoKhauCreate):
    new_item = models.LichSuHoKhau(**data.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def get_lichsuhokhau(db: Session, lichsuhokhau_id: int):
    return db.query(models.LichSuHoKhau).filter(models.LichSuHoKhau.id == lichsuhokhau_id).first()

def get_all_lichsuhokhau(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.LichSuHoKhau).offset(skip).limit(limit).all()

def update_lichsuhokhau(db: Session, lichsuhokhau_id: int, data: schemas.LichSuHoKhauUpdate):
    db_item = get_lichsuhokhau(db, lichsuhokhau_id)
    if not db_item:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_lichsuhokhau(db: Session, lichsuhokhau_id: int):
    db_item = get_lichsuhokhau(db, lichsuhokhau_id)
    if not db_item:
        return None
    db.delete(db_item)
    db.commit()
    return db_item