from sqlalchemy.orm import Session
from ..models import tamtrutamvang as model
from ..schemas import tamtrutamvang as schema

def create_tttv(db: Session, tttv: schema.TamTruTamVangCreate):
    db_tttv = model.TamTruTamVang(**tttv.dict())
    db.add(db_tttv)
    db.commit()
    db.refresh(db_tttv)
    return db_tttv

def get_tttv(db: Session, tttv_id: int):
    return db.query(model.TamTruTamVang).filter(model.TamTruTamVang.id == tttv_id).first()

def get_all_tttv(db: Session, skip: int = 0, limit: int = 100):
    return db.query(model.TamTruTamVang).offset(skip).limit(limit).all()

def update_tttv(db: Session, tttv_id: int, tttv_update: schema.TamTruTamVangUpdate):
    db_tttv = get_tttv(db, tttv_id)
    if not db_tttv:
        return None
    for key, value in tttv_update.dict(exclude_unset=True).items():
        setattr(db_tttv, key, value)
    db.commit()
    db.refresh(db_tttv)
    return db_tttv

def delete_tttv(db: Session, tttv_id: int):
    db_tttv = get_tttv(db, tttv_id)
    if not db_tttv:
        return None
    db.delete(db_tttv)
    db.commit()
    return db_tttv