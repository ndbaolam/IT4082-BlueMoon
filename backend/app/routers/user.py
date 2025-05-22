from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..controllers import user as user_controller
from ..schemas import user as user_schema
from ..database import SessionLocal
from ..auth.jwt_handler import create_access_token
from ..models.user import User
from ..auth.get_current_user import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import status

router = APIRouter(prefix="/users", tags=["Người dùng"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[user_schema.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return user_controller.get_users(db, skip=skip, limit=limit)

@router.post("/register", response_model=user_schema.User, status_code=status.HTTP_201_CREATED)
def register_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    existing_user = user_controller.get_user(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="username đã tồn tại")

    new_user = user_controller.create_user(db, user)
    return new_user

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not (form_data.password == user.password):
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")
    
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}
  
@router.put("/{username}", response_model=user_schema.User)
def update_user(username: str, update_data: user_schema.UserCreate, db: Session = Depends(get_db)):
    user = user_controller.update_user(db, username, update_data)
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    return user

@router.delete("/{username}")
def delete_user(username: str, db: Session = Depends(get_db)):
    success = user_controller.delete_user(db, username)
    if not success:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    return {"message": "Đã xóa người dùng thành công"}
  
@router.get("/me")
def read_own_info(current_user: User = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "vaitro": current_user.vaitro,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name
    }
