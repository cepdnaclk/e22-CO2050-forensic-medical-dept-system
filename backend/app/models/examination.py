from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, ForeignKey, JSON
from app.core.encryption import EncryptedString
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base

class AutopsyNotification(Base):
    __tablename__ = "autopsy_notifications"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    hospital_name = Column(String)
    pm_serial_no = Column(String)
    inquirer_name = Column(String)
    inquirer_types = Column(JSON)
    court_case_no = Column(String)
    inquest_no = Column(String)
    
    deceased_name = Column(String)
    deceased_age = Column(Integer)
    deceased_sex = Column(String)
    
    place_of_death = Column(String)
    hospital_of_death = Column(String)
    bht_no = Column(String)
    ward_no = Column(String)
    
    date_of_death = Column(Date)
    time_of_death = Column(String)
    
    # Store immediate and antecedent as encrypted strings instead of plain JSON
    cause_of_death_immediate = Column(EncryptedString)
    cause_of_death_antecedent = Column(EncryptedString)
    
    under_investigation = Column(Boolean)
    specimens_retained = Column(Boolean)
    specimens_list = Column(String)
    
    maternal_death = Column(Boolean)
    maternal_type = Column(String)
    
    comments = Column(String)
    
    conducted_by_name = Column(String)
    conducted_by_designation = Column(String)
    conducted_by_date = Column(Date)
    tentative_report_time = Column(String)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    case = relationship("Case")

class PostMortemReport(Base):
    __tablename__ = "postmortem_reports"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    pm_number = Column(String, unique=True, index=True, nullable=False)
    examination_date = Column(Date)
    examination_time = Column(String)
    
    # Header Information
    name_of_deceased = Column(String)
    age = Column(Integer)
    sex = Column(String)
    magistrate_order_date = Column(Date)
    magistrate_court = Column(String)
    police_station = Column(String)
    
    # Identification
    identifiers = Column(JSON)
    
    # Exam Sections
    external_exam = Column(JSON)
    internal_exam_head = Column(JSON)
    internal_exam_neck = Column(JSON)
    internal_exam_chest = Column(JSON)
    internal_exam_abdomen = Column(JSON)
    internal_exam_spine = Column(JSON)
    
    # Final Cause of Death (Structured)
    cause_of_death = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    case = relationship("Case")
    findings = relationship("PostMortemFinding", back_populates="postmortem_report")

class PostMortemFinding(Base):
    __tablename__ = "postmortem_findings"
    id = Column(Integer, primary_key=True, index=True)
    postmortem_report_id = Column(Integer, ForeignKey("postmortem_reports.id"))
    category = Column(String) # e.g., 'External', 'Internal-Head'
    finding_description = Column(String)
    
    postmortem_report = relationship("PostMortemReport", back_populates="findings")

class MLEFForm(Base):
    __tablename__ = "mlef_forms"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    police_station = Column(String)
    date_of_issue = Column(Date)
    officer_name = Column(String)
    officer_number = Column(String)
    court = Column(String)
    court_case_no = Column(String)
    
    examinee_name = Column(String)
    examinee_age = Column(Integer)
    examinee_gender = Column(String)
    examinee_address = Column(String)
    
    date_of_incident = Column(Date)
    time_of_incident = Column(String)
    place_of_incident = Column(String)
    nature_of_incident = Column(String)
    weapon_used = Column(String)
    police_history = Column(String)
    
    patient_history = Column(String)
    consent = Column(Boolean)
    bht_number = Column(String)
    ward = Column(String)
    
    general_exam_clothing = Column(String)
    general_exam_physique = Column(String)
    general_exam_mental = Column(String)
    general_exam_other = Column(String)
    
    alcohol_smell = Column(String)
    alcohol_pupils = Column(String)
    alcohol_speech = Column(String)
    
    sexual_assault_history = Column(String)
    sexual_assault_exam = Column(String)
    
    short_report = Column(String)
    category_of_hurt = Column(String)
    
    jmo_name = Column(String)
    jmo_designation = Column(String)
    jmo_date = Column(Date)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    case = relationship("Case")

class CourtCertificate(Base):
    __tablename__ = "court_certificates"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    court_type = Column(String)
    court_of = Column(String)
    date_of_trial = Column(Date)
    case_number = Column(String)
    person_name = Column(String)
    reports = Column(JSON) # List of reports acknowledged
    registrar_signature = Column(String)
    registrar_date = Column(Date)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    case = relationship("Case")
