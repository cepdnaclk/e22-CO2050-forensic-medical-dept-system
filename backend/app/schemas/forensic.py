from typing import Optional, List
from pydantic import BaseModel
from datetime import date

# Injury Cause
class InjuryCauseBase(BaseModel):
    name: str

class InjuryCauseCreate(InjuryCauseBase):
    pass

class InjuryCause(InjuryCauseBase):
    id: int
    class Config:
        from_attributes = True

# Body Diagram Mark
class BodyDiagramMarkBase(BaseModel):
    diagram_x: Optional[int] = None
    diagram_y: Optional[int] = None
    diagram_part: Optional[str] = None

class BodyDiagramMarkCreate(BodyDiagramMarkBase):
    injury_id: int

class BodyDiagramMark(BodyDiagramMarkBase):
    id: int
    injury_id: int
    class Config:
        from_attributes = True

# Injury
class InjuryBase(BaseModel):
    injury_cause_id: Optional[int] = None
    injury_type: Optional[str] = None
    location_on_body: Optional[str] = None
    dimensions: Optional[str] = None
    description: Optional[str] = None

class InjuryCreate(InjuryBase):
    case_id: int

class Injury(InjuryBase):
    id: int
    case_id: int
    class Config:
        from_attributes = True

# Specimen Investigation
class SpecimenInvestigationBase(BaseModel):
    investigation_type: Optional[str] = None
    sent_to: Optional[str] = None
    date_sent: Optional[date] = None
    date_received: Optional[date] = None
    result_summary: Optional[str] = None

class SpecimenInvestigationCreate(SpecimenInvestigationBase):
    specimen_id: int

class SpecimenInvestigation(SpecimenInvestigationBase):
    id: int
    specimen_id: int
    class Config:
        from_attributes = True

# Specimen
class SpecimenBase(BaseModel):
    specimen_type: str
    collection_date: Optional[date] = None
    collected_by: Optional[str] = None
    storage_location: Optional[str] = None
    status: Optional[str] = None

class SpecimenCreate(SpecimenBase):
    case_id: int

class Specimen(SpecimenBase):
    id: int
    case_id: int
    investigations: List[SpecimenInvestigation] = []
    class Config:
        from_attributes = True
