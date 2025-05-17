from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..controllers import nhankhau as nhankhau_controller
from ..schemas import nhankhau as nk_schema
from ..database import SessionLocal

router = APIRouter(prefix="/nhankhau", tags=["Nhân khẩu"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[nk_schema.NhanKhau])
def read_nhankhaus(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return nhankhau_controller.get_nhankhaus(db, skip=skip, limit=limit)

@router.get("/{nhankhau_id}", response_model=nk_schema.NhanKhau)
def read_nhankhau_by_id(nhankhau_id: int, db: Session = Depends(get_db)):
    nhankhau = nhankhau_controller.get_nhankhau(db, nhankhau_id)
    if nhankhau is None:
        raise HTTPException(status_code=404, detail="Nhân khẩu không tồn tại")
    return nhankhau

@router.post("/", response_model=nk_schema.NhanKhau)
def create_nhankhau(nhankhau: nk_schema.NhanKhauCreate, db: Session = Depends(get_db)):
    return nhankhau_controller.create_nhankhau(db, nhankhau)

@router.put("/{nhankhau_id}", response_model=nk_schema.NhanKhau)
def update_nhankhau(nhankhau_id: int, updated_data: nk_schema.NhanKhauCreate, db: Session = Depends(get_db)):
    existing = nhankhau_controller.get_nhankhau(db, nhankhau_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Nhân khẩu không tồn tại")
    return nhankhau_controller.update_nhankhau(db, nhankhau_id, updated_data)

@router.delete("/{nhankhau_id}", status_code=204)
def delete_nhankhau(nhankhau_id: int, db: Session = Depends(get_db)):
    deleted = nhankhau_controller.delete_nhankhau(db, nhankhau_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Nhân khẩu không tồn tại")
