from typing import Optional, List
from pydantic import BaseModel, EmailStr
from datetime import datetime

# Token
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

# Permissions
class PermissionBase(BaseModel):
    module_name: str
    access_level: str

class PermissionCreate(PermissionBase):
    pass

class Permission(PermissionBase):
    id: int
    role_id: int
    class Config:
        from_attributes = True

# Roles
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    permissions: List[Permission] = []
    class Config:
        from_attributes = True

# Users
class UserBase(BaseModel):
    username: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    mfa_enabled: Optional[bool] = False

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class User(UserBase):
    id: int
    last_login: Optional[datetime] = None
    created_at: datetime
    roles: List[Role] = []
    class Config:
        from_attributes = True

# Case Documents
class CaseDocumentBase(BaseModel):
    file_name: str
    file_path: str

class CaseDocumentCreate(CaseDocumentBase):
    case_id: int

class CaseDocument(CaseDocumentBase):
    id: int
    case_id: int
    uploaded_by_id: int
    uploaded_at: datetime
    class Config:
        from_attributes = True

# Audit Log
class AuditLogBase(BaseModel):
    action: str
    table_name: str
    record_id: Optional[str] = None
    ip_address: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    pass

class AuditLog(AuditLogBase):
    id: int
    user_id: int
    timestamp: datetime
    class Config:
        from_attributes = True
