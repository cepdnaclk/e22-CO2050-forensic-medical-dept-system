from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum, CheckConstraint
from app.core.encryption import EncryptedString
from sqlalchemy.orm import relationship
import enum

from app.db.base_class import Base

class CaseStatus(str, enum.Enum):
    OPEN = "OPEN"
    PENDING = "PENDING"
    CLOSED = "CLOSED"

class CaseType(Base):
    __tablename__ = "case_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False) # e.g., Clinical, Autopsy

class Case(Base):
    __tablename__ = "cases"
    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True, nullable=False)
    case_type_id = Column(Integer, ForeignKey("case_types.id"))
    opened_date = Column(Date, nullable=False)
    status = Column(String, default=CaseStatus.OPEN)
    assigned_jmo_id = Column(Integer, ForeignKey("medical_officers.id"))
    police_station_id = Column(Integer, ForeignKey("police_stations.id"))
    court_id = Column(Integer, ForeignKey("courts.id"))
    court_case_no = Column(String)
    
    # Relationships
    case_type = relationship("CaseType")
    assigned_jmo = relationship("MedicalOfficer")
    police_station = relationship("PoliceStation")
    court = relationship("Court")
    documents = relationship("CaseDocument", back_populates="case")
    deceased_persons = relationship("DeceasedPerson", back_populates="case")
    injured_persons = relationship("InjuredPerson", back_populates="case")

class DeceasedPerson(Base):
    __tablename__ = "deceased_persons"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    full_name = Column(String, nullable=False)
    nic = Column(EncryptedString)
    age = Column(Integer)
    sex = Column(String)
    address = Column(String)
    date_of_death = Column(Date)
    
    __table_args__ = (
        CheckConstraint('age >= 0', name='check_age_positive'),
        CheckConstraint("sex IN ('M', 'F', 'Other')", name='check_sex_valid'),
    )
    
    case = relationship("Case", back_populates="deceased_persons")

class InjuredPerson(Base):
    __tablename__ = "injured_persons"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    full_name = Column(String, nullable=False)
    nic = Column(EncryptedString)
    age = Column(Integer)
    sex = Column(String)
    address = Column(String)
    date_of_incident = Column(Date)
    
    __table_args__ = (
        CheckConstraint('age >= 0', name='check_injured_age_positive'),
        CheckConstraint("sex IN ('M', 'F', 'Other')", name='check_injured_sex_valid'),
    )
    
    case = relationship("Case", back_populates="injured_persons")
