from sqlalchemy.orm import Session

from ..models.hokhau_nhankhau import HoKhauNhanKhau
from ..models.nhan_khau import NhanKhau
from ..schemas import nhankhau as nk_schema

def get_nhankhau(db: Session, nhankhau_id: int):
    return db.query(NhanKhau).filter(NhanKhau.id == nhankhau_id).first()

def get_nhankhaus(db: Session, skip=0, limit=20):
    nhankhau_list = db.query(NhanKhau).all()
    result = []
    for nk in nhankhau_list:
        # Lấy hokhau_id từ bảng liên kết (nếu có)
        hokhau_nk = db.query(HoKhauNhanKhau).filter_by(nhankhau_id=nk.id).first()
        hokhau_id = hokhau_nk.hokhau_id if hokhau_nk else None
        nk_dict = nk.__dict__.copy()
        nk_dict["hokhau_id"] = hokhau_id
        result.append(nk_dict)
    return result

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
