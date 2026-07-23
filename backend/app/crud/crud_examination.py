from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.crud.base import CRUDBase

class CRUDMLEFForm(CRUDBase):
    def get_by_case(self, db: Session, *, case_id: int) -> List[Dict[str, Any]]:
        results = db.execute(
            text("SELECT * FROM MLEF_Forms WHERE case_id = :case_id"),
            {"case_id": case_id}
        ).mappings().all()
        return [dict(row) for row in results]

class CRUDPostMortemReport(CRUDBase):
    def get_by_case(self, db: Session, *, case_id: int) -> List[Dict[str, Any]]:
        # PM report is linked to Autopsy Notification which is linked to Case
        # We need a JOIN here
        query = """
            SELECT p.* FROM PostMortem_Reports p
            JOIN Autopsy_Notifications a ON p.notification_id = a.notification_id
            WHERE a.case_id = :case_id
        """
        results = db.execute(
            text(query),
            {"case_id": case_id}
        ).mappings().all()
        return [dict(row) for row in results]
        
    def get_by_pm_number(self, db: Session, *, pm_number: str) -> Optional[Dict[str, Any]]:
        # The pm number is usually inquest_no or pm_serial_no in the notification
        # Based on schema.sql: PostMortem_Reports has inquest_no, Autopsy_Notifications has pm_serial_no
        result = db.execute(
            text("SELECT * FROM PostMortem_Reports WHERE inquest_no = :pm_number"),
            {"pm_number": pm_number}
        ).mappings().first()
        return dict(result) if result else None

autopsy_notification = CRUDBase("Autopsy_Notifications", "notification_id")
postmortem_report = CRUDPostMortemReport("PostMortem_Reports", "pm_report_id")
postmortem_finding = CRUDBase("PostMortem_Findings", "finding_id")
mlef_form = CRUDMLEFForm("MLEF_Forms", "mlef_id")
court_certificate = CRUDBase("Court_Certificates", "cert_id")
