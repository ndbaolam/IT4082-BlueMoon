from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..controllers import hokhau as hokhau_controller
from ..schemas import hokhau as hokhau_schema
from ..database import SessionLocal

router = APIRouter(prefix="/hokhau", tags=["Hộ khẩu"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[hokhau_schema.HoKhau])
def read_all(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return hokhau_controller.get_hokhaus(db, skip=skip, limit=limit)

@router.get("/{hokhau_id}", response_model=hokhau_schema.HoKhau)
def read_by_id(hokhau_id: int, db: Session = Depends(get_db)):
    hk = hokhau_controller.get_hokhau(db, hokhau_id)
    if not hk:
        raise HTTPException(status_code=404, detail="Hộ khẩu không tồn tại")
    return hk

@router.post("/", response_model=hokhau_schema.HoKhau)
def create(hokhau: hokhau_schema.HoKhauCreate, db: Session = Depends(get_db)):
    return hokhau_controller.create_hokhau(db, hokhau)

@router.put("/{hokhau_id}", response_model=hokhau_schema.HoKhau)
def update(hokhau_id: int, updated: hokhau_schema.HoKhauCreate, db: Session = Depends(get_db)):
    hk = hokhau_controller.update_hokhau(db, hokhau_id, updated)
    if not hk:
        raise HTTPException(status_code=404, detail="Hộ khẩu không tồn tại")
    return hk

@router.delete("/{hokhau_id}")
def delete(hokhau_id: int, db: Session = Depends(get_db)):
    success = hokhau_controller.delete_hokhau(db, hokhau_id)
    if not success:
        raise HTTPException(status_code=404, detail="Hộ khẩu không tồn tại")
    return {"message": "Đã xóa hộ khẩu thành công"}
