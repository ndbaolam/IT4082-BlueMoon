from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from ..models.user import User
from ..database import SessionLocal
from ..config import SECRET_KEY, ALGORITHM
from .jwt_handler import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(token: str = Depends(oauth2_scheme)):    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không xác thực được người dùng",
        headers={"WWW-Authenticate": "Bearer"},
    )

    email = verify_token(token)
    if email is None:
        raise credentials_exception

    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()

    if user is None:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    return user
