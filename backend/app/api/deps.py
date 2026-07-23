from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.system import User
from app.schemas.system import TokenPayload
from app import crud

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM if hasattr(settings, 'ALGORITHM') else "HS256"]
        )
        token_data = TokenPayload(**payload)
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.username == token_data.sub).first()
    if user is None:
        raise credentials_exception
    return user

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.context import current_user_id

def get_current_active_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Set context var for Python application-level audit logging
    current_user_id.set(current_user.id)
    
    # Set Postgres transaction-local variable for native DB triggers
    db.execute(text("SET LOCAL app.current_user_id = :id"), {"id": current_user.id})
    
    return current_user

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_active_user)) -> User:
        user_role_names = [role.name for role in user.roles]
        
        # Admin bypasses all checks
        if "Admin" in user_role_names:
            return user
            
        for role in self.allowed_roles:
            if role in user_role_names:
                return user
                
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Operation not permitted. Requires one of: {', '.join(self.allowed_roles)}"
        )
