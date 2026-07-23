from typing import Optional
from pydantic import BaseModel

# Police Officer
class PoliceOfficerBase(BaseModel):
    station_id: int
    badge_number: str
    rank: Optional[str] = None

class PoliceOfficerCreate(PoliceOfficerBase):
    user_id: int

class PoliceOfficer(PoliceOfficerBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# Magistrate
class MagistrateBase(BaseModel):
    court_id: int
    name: str
    contact_number: Optional[str] = None

class MagistrateCreate(MagistrateBase):
    pass

class Magistrate(MagistrateBase):
    id: int
    class Config:
        from_attributes = True

# Medical Officer
class MedicalOfficerBase(BaseModel):
    slmc_reg_number: str
    designation: Optional[str] = None

class MedicalOfficerCreate(MedicalOfficerBase):
    user_id: int

class MedicalOfficer(MedicalOfficerBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True
