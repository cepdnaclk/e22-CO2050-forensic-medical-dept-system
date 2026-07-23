from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.crud.base import CRUDBase

class CRUDCase(CRUDBase):
    def get_by_case_number(self, db: Session, *, case_number: str) -> Optional[Dict[str, Any]]:
        # The schema.sql calls it inquest_no and court_case_no, not case_number, but keeping compatibility
        # Let's search by inquest_no or court_case_no for case_number 
        result = db.execute(
            text("SELECT * FROM Cases WHERE inquest_no = :case_number OR court_case_no = :case_number"),
            {"case_number": case_number}
        ).mappings().first()
        return dict(result) if result else None
        
    def get_cases_with_filters(self, db: Session, *, status: Optional[str] = None, case_type_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
        query = "SELECT * FROM Cases WHERE 1=1"
        params: Dict[str, Any] = {"limit": limit, "skip": skip}
        
        if status:
            query += " AND status = :status"
            params["status"] = status
        if case_type_id:
            query += " AND case_type_id = :case_type_id"
            params["case_type_id"] = case_type_id
            
        query += " LIMIT :limit OFFSET :skip"
        
        results = db.execute(text(query), params).mappings().all()
        return [dict(row) for row in results]

case = CRUDCase("Cases", "case_id")
case_type = CRUDBase("Case_Types", "case_type_id")
deceased = CRUDBase("Deceased_Persons", "deceased_id")
injured = CRUDBase("Injured_Persons", "injured_id")
