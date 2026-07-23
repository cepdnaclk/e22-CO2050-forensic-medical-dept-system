from typing import Optional, List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.case import Case, CaseType, DeceasedPerson, InjuredPerson
from app.schemas.case import CaseCreate, CaseTypeCreate, DeceasedPersonCreate, InjuredPersonCreate

class CRUDCase(CRUDBase[Case, CaseCreate, CaseCreate]):
    def get_by_case_number(self, db: Session, *, case_number: str) -> Optional[Case]:
        return db.query(Case).filter(Case.case_number == case_number).first()
        
    def get_cases_with_filters(self, db: Session, *, status: Optional[str] = None, case_type_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Case]:
        query = db.query(Case)
        if status:
            query = query.filter(Case.status == status)
        if case_type_id:
            query = query.filter(Case.case_type_id == case_type_id)
        return query.offset(skip).limit(limit).all()

case = CRUDCase(Case)
case_type = CRUDBase[CaseType, CaseTypeCreate, CaseTypeCreate](CaseType)
deceased = CRUDBase[DeceasedPerson, DeceasedPersonCreate, DeceasedPersonCreate](DeceasedPerson)
injured = CRUDBase[InjuredPerson, InjuredPersonCreate, InjuredPersonCreate](InjuredPerson)
