from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..controllers import tamtrutamvang as controller
from ..schemas import tamtrutamvang as schema
from ..database import SessionLocal
from typing import List

router = APIRouter(
    prefix="/tamtrutamvang",
    tags=["Tạm Trú Tạm Vắng"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schema.TamTruTamVangInDB)
def create_tttv(tttv: schema.TamTruTamVangCreate, db: Session = Depends(get_db)):
    return controller.create_tttv(db, tttv)

@router.get("/{tttv_id}", response_model=schema.TamTruTamVangInDB)
def get_tttv(tttv_id: int, db: Session = Depends(get_db)):
    db_tttv = controller.get_tttv(db, tttv_id)
    if db_tttv is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy")
    return db_tttv

@router.get("/", response_model=List[schema.TamTruTamVangInDB])
def get_all_tttv(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return controller.get_all_tttv(db, skip=skip, limit=limit)

@router.put("/{tttv_id}", response_model=schema.TamTruTamVangInDB)
def update_tttv(tttv_id: int, tttv_update: schema.TamTruTamVangUpdate, db: Session = Depends(get_db)):
    db_tttv = controller.update_tttv(db, tttv_id, tttv_update)
    if db_tttv is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy")
    return db_tttv

@router.delete("/{tttv_id}", response_model=schema.TamTruTamVangInDB)
def delete_tttv(tttv_id: int, db: Session = Depends(get_db)):
    db_tttv = controller.delete_tttv(db, tttv_id)
    if db_tttv is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy")
    return db_tttv
