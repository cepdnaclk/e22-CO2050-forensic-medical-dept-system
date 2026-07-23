from typing import Optional, List
from pydantic import BaseModel
from datetime import date

# Case Types
class CaseTypeBase(BaseModel):
    name: str

class CaseTypeCreate(CaseTypeBase):
    pass

class CaseType(CaseTypeBase):
    id: int
    class Config:
        from_attributes = True

# Deceased Person
class DeceasedPersonBase(BaseModel):
    full_name: str
    nic: Optional[str] = None
    age: Optional[int] = None
    sex: Optional[str] = None
    address: Optional[str] = None
    date_of_death: Optional[date] = None
    time_of_death: Optional[str] = None
    place_of_death: Optional[str] = None
    hospital_name: Optional[str] = None
    ward: Optional[str] = None
    bht_no: Optional[str] = None

class DeceasedPersonCreate(DeceasedPersonBase):
    case_id: int

class DeceasedPerson(DeceasedPersonBase):
    id: int
    case_id: int
    class Config:
        from_attributes = True

# Injured Person
class InjuredPersonBase(BaseModel):
    full_name: str
    nic: Optional[str] = None
    age: Optional[int] = None
    sex: Optional[str] = None
    address: Optional[str] = None
    date_of_incident: Optional[date] = None
    time_of_incident: Optional[str] = None
    place_of_incident: Optional[str] = None
    hospital_name: Optional[str] = None
    ward: Optional[str] = None
    bht_no: Optional[str] = None

class InjuredPersonCreate(InjuredPersonBase):
    case_id: int

class InjuredPerson(InjuredPersonBase):
    id: int
    case_id: int
    class Config:
        from_attributes = True

# Case
class CaseBase(BaseModel):
    case_number: str
    opened_date: date
    status: Optional[str] = "OPEN"
    case_type_id: Optional[int] = None
    assigned_jmo_id: Optional[int] = None
    police_station_id: Optional[int] = None
    court_id: Optional[int] = None
    court_case_no: Optional[str] = None

class CaseCreate(CaseBase):
    pass

class Case(CaseBase):
    id: int
    deceased_persons: List[DeceasedPerson] = []
    injured_persons: List[InjuredPerson] = []
    class Config:
        from_attributes = True
