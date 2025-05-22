from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import SessionLocal
from ..controllers import khoanthu as controller
from ..schemas import khoanthu as schema

router = APIRouter(
    prefix="/khoanthu",
    tags=["Khoản Thu"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schema.KhoanThuBase)
def create_khoanthu(khoanthu: schema.KhoanThuCreate, db: Session = Depends(get_db)):
    return controller.create_khoanthu(db, khoanthu)

@router.get("/", response_model=List[schema.KhoanThuBase])
def get_all_khoanthu(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return controller.get_all_khoanthu(db, skip=skip, limit=limit)

@router.get("/{khoanthu_id}", response_model=schema.KhoanThuBase)
def get_khoanthu(khoanthu_id: int, db: Session = Depends(get_db)):
    khoanthu = controller.get_khoanthu(db, khoanthu_id)
    if not khoanthu:
        raise HTTPException(status_code=404, detail="Không tìm thấy khoản thu")
    return khoanthu

@router.put("/{khoanthu_id}", response_model=schema.KhoanThuBase)
def update_khoanthu(khoanthu_id: int, khoanthu_update: schema.KhoanThuUpdate, db: Session = Depends(get_db)):
    updated = controller.update_khoanthu(db, khoanthu_id, khoanthu_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Không tìm thấy khoản thu để cập nhật")
    return updated

@router.delete("/{khoanthu_id}", response_model=schema.KhoanThuBase)
def delete_khoanthu(khoanthu_id: int, db: Session = Depends(get_db)):
    deleted = controller.delete_khoanthu(db, khoanthu_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Không tìm thấy khoản thu để xoá")
    return deleted
