from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import SessionLocal
from ..schemas import lichsuhokhau as schemas
from ..controllers import lichsuhokhau as controller

router = APIRouter(
    prefix="/lichsuhokhau",
    tags=["lichsuhokhau"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.get("/", response_model=List[schemas.LichSuHoKhau])
def read_lichsuhokhau(db: Session = Depends(get_db)):
    return controller.get_all_lichsuhokhau(db)

@router.get("/{lichsuhokhau_id}", response_model=schemas.LichSuHoKhau)
def read_lichsuhokhau_by_id(lichsuhokhau_id: int, db: Session = Depends(get_db)):
    return controller.get_lichsuhokhau(db, lichsuhokhau_id)

@router.post("/", response_model=schemas.LichSuHoKhau)
def create_lichsuhokhau(lichsu: schemas.LichSuHoKhauCreate, db: Session = Depends(get_db)):
    return controller.create_lichsuhokhau(db, lichsu)

@router.put("/{lichsuhokhau_id}", response_model=schemas.LichSuHoKhau)
def update_lichsuhokhau(lichsuhokhau_id: int, lichsu: schemas.LichSuHoKhauUpdate, db: Session = Depends(get_db)):
    return controller.update_lichsuhokhau(db, lichsuhokhau_id, lichsu)

@router.delete("/{lichsuhokhau_id}")
def delete_lichsuhokhau(lichsuhokhau_id: int, db: Session = Depends(get_db)):
    return controller.delete_lichsuhokhau(db, lichsuhokhau_id)