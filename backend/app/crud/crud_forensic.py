from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.crud.base import CRUDBase

class CRUDSpecimen(CRUDBase):
    def get_by_case(self, db: Session, *, case_id: int) -> List[Dict[str, Any]]:
        results = db.execute(
            text("SELECT * FROM Specimens WHERE case_id = :case_id"),
            {"case_id": case_id}
        ).mappings().all()
        return [dict(row) for row in results]

class CRUDInjury(CRUDBase):
    def get_by_case(self, db: Session, *, case_id: int) -> List[Dict[str, Any]]:
        results = db.execute(
            text("SELECT * FROM Injuries WHERE case_id = :case_id"),
            {"case_id": case_id}
        ).mappings().all()
        return [dict(row) for row in results]

injury = CRUDInjury("Injuries", "injury_id")
injury_cause = CRUDBase("Injury_Causes", "cause_id")
body_diagram_mark = CRUDBase("Body_Diagram_Marks", "mark_id")
specimen = CRUDSpecimen("Specimens", "specimen_id")
specimen_investigation = CRUDBase("Specimen_Investigations", "investigation_id")
