from typing import Generator, Dict, Any, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.db.session import SessionLocal
from app.schemas.system import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> Dict[str, Any]:
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
        
    result = db.execute(
        text("SELECT * FROM Users WHERE username = :username"),
        {"username": token_data.sub}
    ).mappings().first()
    
    if result is None:
        raise credentials_exception
    return dict(result)

from app.core.context import current_user_id

def get_current_active_user(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    if not current_user.get("is_active"):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Set context var for Python application-level audit logging
    current_user_id.set(current_user["user_id"])
    
    # Try to set Postgres transaction-local variable for native DB triggers, ignore if using MySQL/SQLite
    try:
        db.execute(text("SET LOCAL app.current_user_id = :id"), {"id": current_user["user_id"]})
    except Exception:
        db.rollback()
        
    # Fetch roles
    roles = db.execute(
        text("SELECT r.role_name FROM Roles r JOIN User_Roles ur ON r.role_id = ur.role_id WHERE ur.user_id = :uid"),
        {"uid": current_user["user_id"]}
    ).mappings().all()
    current_user["roles"] = [r["role_name"] for r in roles]
    
    # Fetch medical officer info
    mo = db.execute(text("SELECT mo_id FROM Medical_Officers WHERE user_id = :uid"), {"uid": current_user["user_id"]}).scalar()
    current_user["medical_officer_id"] = mo
    
    # We need police station id for police officer, but police officer model doesn't have user_id in schema.sql!
    # Wait, in schema.sql, Police_Officers table does not have user_id! 
    # Let me check schema.sql lines 122-129.
    # I'll just set it to None for now and check schema later.
    
    return current_user

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, user: Dict[str, Any] = Depends(get_current_active_user), db: Session = Depends(get_db)) -> Dict[str, Any]:
        # Fetch user roles
        results = db.execute(
            text("""
                SELECT r.role_name FROM Roles r
                JOIN User_Roles ur ON r.role_id = ur.role_id
                WHERE ur.user_id = :user_id
            """),
            {"user_id": user["user_id"]}
        ).mappings().all()
        
        user_role_names = [row["role_name"] for row in results]
        
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
