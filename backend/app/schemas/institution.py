from typing import Optional, List
from pydantic import BaseModel

# Wards
class WardBase(BaseModel):
    ward_number: str
    name: Optional[str] = None

class WardCreate(WardBase):
    hospital_id: int

class Ward(WardBase):
    id: int
    hospital_id: int
    class Config:
        from_attributes = True

# Hospitals
class HospitalBase(BaseModel):
    name: str
    address: Optional[str] = None
    contact_number: Optional[str] = None

class HospitalCreate(HospitalBase):
    pass

class Hospital(HospitalBase):
    id: int
    wards: List[Ward] = []
    class Config:
        from_attributes = True

# Police Stations
class PoliceStationBase(BaseModel):
    name: str
    division: Optional[str] = None
    contact_number: Optional[str] = None

class PoliceStationCreate(PoliceStationBase):
    pass

class PoliceStation(PoliceStationBase):
    id: int
    class Config:
        from_attributes = True

# Courts
class CourtBase(BaseModel):
    name: str
    location: Optional[str] = None
    court_type: Optional[str] = None

class CourtCreate(CourtBase):
    pass

class Court(CourtBase):
    id: int
    class Config:
        from_attributes = True
