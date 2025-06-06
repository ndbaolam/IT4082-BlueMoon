from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas import user as user_schema

def get_user(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user(db: Session, user: user_schema.UserCreate):
    # hashed_pw = hash_password(user.password)
    db_user = User(
        email=user.email, 
        password=user.password, 
        vaitro=user.vaitro, 
        first_name=user.first_name, 
        last_name=user.last_name, 
        diachi=user.diachi, 
        sodienthoai=user.sodienthoai
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def delete_user(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()
    if user:
        db.delete(user)
        db.commit()
        return True
    return False
