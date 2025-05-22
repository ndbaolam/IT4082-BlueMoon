from sqlalchemy.orm import Session
from ..models import noptien as model
from ..schemas import noptien as schema

def create_noptien(db: Session, data: schema.NopTienCreate):
    new_noptien = model.NopTien(**data.dict())
    db.add(new_noptien)
    db.commit()
    db.refresh(new_noptien)
    return new_noptien

def get_noptien(db: Session, noptien_id: int):
    return db.query(model.NopTien).filter(model.NopTien.id == noptien_id).first()

def get_all_noptien(db: Session, skip: int = 0, limit: int = 100):
    return db.query(model.NopTien).offset(skip).limit(limit).all()

def update_noptien(db: Session, noptien_id: int, data: schema.NopTienUpdate):
    db_item = get_noptien(db, noptien_id)
    if not db_item:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_noptien(db: Session, noptien_id: int):
    db_item = get_noptien(db, noptien_id)
    if not db_item:
        return None
    db.delete(db_item)
    db.commit()
    return db_item
