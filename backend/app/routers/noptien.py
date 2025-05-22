from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import SessionLocal
from ..controllers import noptien as controller
from ..schemas import noptien as schema

router = APIRouter(
    prefix="/noptien",
    tags=["Nộp Tien"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schema.NopTienInDB)
def create_noptien(data: schema.NopTienCreate, db: Session = Depends(get_db)):
    return controller.create_noptien(db, data)

@router.get("/", response_model=List[schema.NopTienInDB])
def get_all_noptien(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return controller.get_all_noptien(db, skip=skip, limit=limit)

@router.get("/{noptien_id}", response_model=schema.NopTienInDB)
def get_noptien(noptien_id: int, db: Session = Depends(get_db)):
    noptien = controller.get_noptien(db, noptien_id)
    if not noptien:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin nộp tiền")
    return noptien

@router.put("/{noptien_id}", response_model=schema.NopTienInDB)
def update_noptien(noptien_id: int, data: schema.NopTienUpdate, db: Session = Depends(get_db)):
    updated = controller.update_noptien(db, noptien_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Không tìm thấy để cập nhật")
    return updated

@router.delete("/{noptien_id}", response_model=schema.NopTienInDB)
def delete_noptien(noptien_id: int, db: Session = Depends(get_db)):
    deleted = controller.delete_noptien(db, noptien_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Không tìm thấy để xoá")
    return deleted
