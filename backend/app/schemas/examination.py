from typing import Optional, List, Any
from pydantic import BaseModel
from datetime import date, datetime

# MLEF Form
class MLEFFormBase(BaseModel):
    case_id: int
    police_station: Optional[str] = None
    date_of_issue: Optional[date] = None
    officer_name: Optional[str] = None
    officer_number: Optional[str] = None
    court: Optional[str] = None
    court_case_no: Optional[str] = None
    examinee_name: Optional[str] = None
    examinee_age: Optional[int] = None
    examinee_gender: Optional[str] = None
    examinee_address: Optional[str] = None
    date_of_incident: Optional[date] = None
    time_of_incident: Optional[str] = None
    place_of_incident: Optional[str] = None
    nature_of_incident: Optional[str] = None
    weapon_used: Optional[str] = None
    police_history: Optional[str] = None
    patient_history: Optional[str] = None
    consent: Optional[bool] = None
    bht_number: Optional[str] = None
    ward: Optional[str] = None
    general_exam_clothing: Optional[str] = None
    general_exam_physique: Optional[str] = None
    general_exam_mental: Optional[str] = None
    general_exam_other: Optional[str] = None
    alcohol_smell: Optional[str] = None
    alcohol_pupils: Optional[str] = None
    alcohol_speech: Optional[str] = None
    sexual_assault_history: Optional[str] = None
    sexual_assault_exam: Optional[str] = None
    short_report: Optional[str] = None
    category_of_hurt: Optional[str] = None
    jmo_name: Optional[str] = None
    jmo_designation: Optional[str] = None
    jmo_date: Optional[date] = None

class MLEFFormCreate(MLEFFormBase):
    pass

class MLEFForm(MLEFFormBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# Post Mortem Finding
class PostMortemFindingBase(BaseModel):
    category: Optional[str] = None
    finding_description: Optional[str] = None

class PostMortemFindingCreate(PostMortemFindingBase):
    postmortem_report_id: int

class PostMortemFinding(PostMortemFindingBase):
    id: int
    postmortem_report_id: int
    class Config:
        from_attributes = True

# Post Mortem Report
class PostMortemReportBase(BaseModel):
    case_id: int
    pm_number: str
    examination_date: Optional[date] = None
    examination_time: Optional[str] = None
    name_of_deceased: Optional[str] = None
    age: Optional[int] = None
    sex: Optional[str] = None
    magistrate_order_date: Optional[date] = None
    magistrate_court: Optional[str] = None
    police_station: Optional[str] = None
    identifiers: Optional[Any] = None
    external_exam: Optional[Any] = None
    internal_exam_head: Optional[Any] = None
    internal_exam_neck: Optional[Any] = None
    internal_exam_chest: Optional[Any] = None
    internal_exam_abdomen: Optional[Any] = None
    internal_exam_spine: Optional[Any] = None
    cause_of_death: Optional[Any] = None

class PostMortemReportCreate(PostMortemReportBase):
    pass

class PostMortemReport(PostMortemReportBase):
    id: int
    created_at: datetime
    updated_at: datetime
    findings: List[PostMortemFinding] = []
    class Config:
        from_attributes = True

# Autopsy Notification
class AutopsyNotificationBase(BaseModel):
    case_id: int
    hospital_name: Optional[str] = None
    pm_serial_no: Optional[str] = None
    inquirer_name: Optional[str] = None
    inquirer_types: Optional[Any] = None
    court_case_no: Optional[str] = None
    inquest_no: Optional[str] = None
    deceased_name: Optional[str] = None
    deceased_age: Optional[int] = None
    deceased_sex: Optional[str] = None
    place_of_death: Optional[str] = None
    hospital_of_death: Optional[str] = None
    bht_no: Optional[str] = None
    ward_no: Optional[str] = None
    date_of_death: Optional[date] = None
    time_of_death: Optional[str] = None
    cause_of_death_immediate: Optional[str] = None
    cause_of_death_antecedent: Optional[str] = None
    under_investigation: Optional[bool] = None
    specimens_retained: Optional[bool] = None
    specimens_list: Optional[str] = None
    maternal_death: Optional[bool] = None
    maternal_type: Optional[str] = None
    comments: Optional[str] = None
    conducted_by_name: Optional[str] = None
    conducted_by_designation: Optional[str] = None
    conducted_by_date: Optional[date] = None
    tentative_report_time: Optional[str] = None

class AutopsyNotificationCreate(AutopsyNotificationBase):
    pass

class AutopsyNotification(AutopsyNotificationBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Court Certificate
class CourtCertificateBase(BaseModel):
    case_id: int
    court_type: Optional[str] = None
    court_of: Optional[str] = None
    date_of_trial: Optional[date] = None
    case_number: Optional[str] = None
    person_name: Optional[str] = None
    reports: Optional[Any] = None
    registrar_signature: Optional[str] = None
    registrar_date: Optional[date] = None

class CourtCertificateCreate(CourtCertificateBase):
    pass

class CourtCertificate(CourtCertificateBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
