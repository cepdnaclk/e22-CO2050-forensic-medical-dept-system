from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.forensic import Injury, InjuryCause, BodyDiagramMark, Specimen, SpecimenInvestigation
from app.schemas.forensic import (
    InjuryCreate, InjuryCauseCreate, BodyDiagramMarkCreate, SpecimenCreate, SpecimenInvestigationCreate
)

class CRUDSpecimen(CRUDBase[Specimen, SpecimenCreate, SpecimenCreate]):
    def get_by_case(self, db: Session, *, case_id: int) -> List[Specimen]:
        return db.query(Specimen).filter(Specimen.case_id == case_id).all()

class CRUDInjury(CRUDBase[Injury, InjuryCreate, InjuryCreate]):
    def get_by_case(self, db: Session, *, case_id: int) -> List[Injury]:
        return db.query(Injury).filter(Injury.case_id == case_id).all()

injury = CRUDInjury(Injury)
injury_cause = CRUDBase[InjuryCause, InjuryCauseCreate, InjuryCauseCreate](InjuryCause)
body_diagram_mark = CRUDBase[BodyDiagramMark, BodyDiagramMarkCreate, BodyDiagramMarkCreate](BodyDiagramMark)
specimen = CRUDSpecimen(Specimen)
specimen_investigation = CRUDBase[SpecimenInvestigation, SpecimenInvestigationCreate, SpecimenInvestigationCreate](SpecimenInvestigation)
