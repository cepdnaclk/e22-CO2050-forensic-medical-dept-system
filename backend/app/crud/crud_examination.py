from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.examination import (
    AutopsyNotification, PostMortemReport, PostMortemFinding, MLEFForm, CourtCertificate
)
from app.schemas.examination import (
    AutopsyNotificationCreate, PostMortemReportCreate, PostMortemFindingCreate,
    MLEFFormCreate, CourtCertificateCreate
)

class CRUDMLEFForm(CRUDBase[MLEFForm, MLEFFormCreate, MLEFFormCreate]):
    def get_by_case(self, db: Session, *, case_id: int) -> List[MLEFForm]:
        return db.query(MLEFForm).filter(MLEFForm.case_id == case_id).all()

class CRUDPostMortemReport(CRUDBase[PostMortemReport, PostMortemReportCreate, PostMortemReportCreate]):
    def get_by_case(self, db: Session, *, case_id: int) -> List[PostMortemReport]:
        return db.query(PostMortemReport).filter(PostMortemReport.case_id == case_id).all()
        
    def get_by_pm_number(self, db: Session, *, pm_number: str) -> Optional[PostMortemReport]:
        return db.query(PostMortemReport).filter(PostMortemReport.pm_number == pm_number).first()

autopsy_notification = CRUDBase[AutopsyNotification, AutopsyNotificationCreate, AutopsyNotificationCreate](AutopsyNotification)
postmortem_report = CRUDPostMortemReport(PostMortemReport)
postmortem_finding = CRUDBase[PostMortemFinding, PostMortemFindingCreate, PostMortemFindingCreate](PostMortemFinding)
mlef_form = CRUDMLEFForm(MLEFForm)
court_certificate = CRUDBase[CourtCertificate, CourtCertificateCreate, CourtCertificateCreate](CourtCertificate)
