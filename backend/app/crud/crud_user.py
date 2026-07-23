from typing import Any, Dict, Optional, Union, List
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.security import get_password_hash, verify_password
from app.schemas.system import UserCreate, UserUpdate

class CRUDUser:
    def get(self, db: Session, id: int) -> Optional[Dict[str, Any]]:
        result = db.execute(
            text("SELECT * FROM Users WHERE user_id = :id"),
            {"id": id}
        ).mappings().first()
        return dict(result) if result else None

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        results = db.execute(
            text("SELECT * FROM Users LIMIT :limit OFFSET :skip"),
            {"limit": limit, "skip": skip}
        ).mappings().all()
        return [dict(row) for row in results]

    def get_by_username(self, db: Session, *, username: str) -> Optional[Dict[str, Any]]:
        result = db.execute(
            text("SELECT * FROM Users WHERE username = :username"),
            {"username": username}
        ).mappings().first()
        return dict(result) if result else None

    def get_by_email(self, db: Session, *, email: str) -> Optional[Dict[str, Any]]:
        result = db.execute(
            text("SELECT * FROM Users WHERE email = :email"),
            {"email": email}
        ).mappings().first()
        return dict(result) if result else None

    def create(self, db: Session, *, obj_in: UserCreate) -> Dict[str, Any]:
        hashed_password = get_password_hash(obj_in.password)
        # using dummy salt since bcrypt manages salt inside the hash
        result = db.execute(
            text("""
                INSERT INTO Users (username, email, password_hash, salt, is_active, mfa_enabled)
                VALUES (:username, :email, :password_hash, :salt, :is_active, :mfa_enabled)
                RETURNING user_id
            """),
            {
                "username": obj_in.username,
                "email": obj_in.email,
                "password_hash": hashed_password,
                "salt": "bcrypt_managed",
                "is_active": obj_in.is_active,
                "mfa_enabled": obj_in.mfa_enabled
            }
        ).scalar()
        db.commit()
        return self.get(db, result)

    def authenticate(self, db: Session, *, username: str, password: str) -> Optional[Dict[str, Any]]:
        user = self.get_by_username(db, username=username)
        if not user:
            return None
        if not verify_password(password, user["password_hash"]):
            return None
        return user

user = CRUDUser()
