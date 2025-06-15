from sqlalchemy.orm import Session
from ..models import khoanthu as model
from ..schemas import khoanthu as schema
from ..models.hokhau import HoKhau
from ..models.noptien import NopTien

def create_khoanthu(db: Session, data: schema.KhoanThuCreate):
    new_khoanthu = model.KhoanThu(**data.dict())
    db.add(new_khoanthu)
    db.commit()
    db.refresh(new_khoanthu)
    return new_khoanthu

def get_khoanthu(db: Session, khoanthu_id: int):
    return db.query(model.KhoanThu).filter(model.KhoanThu.id == khoanthu_id).first()

def get_all_khoanthu(db: Session, skip: int = 0, limit: int = 100):
    return db.query(model.KhoanThu).offset(skip).limit(limit).all()

def update_khoanthu(db: Session, khoanthu_id: int, data: schema.KhoanThuUpdate):
    db_item = get_khoanthu(db, khoanthu_id)
    if not db_item:
        return None
    for key, value in data.dict(exclude_unset=True).items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_khoanthu(db: Session, khoanthu_id: int):
    db_item = get_khoanthu(db, khoanthu_id)
    if not db_item:
        return None
    db.delete(db_item)
    db.commit()
    return db_item

def get_household_payment_status(khoanthu_id: int, db):
    all_households = db.query(HoKhau).all()
    paid_records = db.query(NopTien).filter(NopTien.khoanthu_id == khoanthu_id).all()
    paid_household_ids = set([nt.hokhau_id for nt in paid_records])
    chu_ho_map = {hk.id: getattr(hk.chu_ho, 'hoten', f"ID {hk.chu_ho_id}") for hk in all_households}
    paid = [
        {
            "id": hk.id,
            "sohokhau": hk.sohokhau,
            "chu_ho_name": chu_ho_map.get(hk.id, "")
        }
        for hk in all_households if hk.id in paid_household_ids
    ]
    unpaid = [
        {
            "id": hk.id,
            "sohokhau": hk.sohokhau,
            "chu_ho_name": chu_ho_map.get(hk.id, "")
        }
        for hk in all_households if hk.id not in paid_household_ids
    ]
    return {"paid": paid, "unpaid": unpaid}