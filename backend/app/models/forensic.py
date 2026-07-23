from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base

class InjuryCause(Base):
    __tablename__ = "injury_causes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False) # e.g. Blunt force, Sharp force
    
class Injury(Base):
    __tablename__ = "injuries"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    injury_cause_id = Column(Integer, ForeignKey("injury_causes.id"))
    injury_type = Column(String) # e.g. Abrasion, Laceration
    location_on_body = Column(String)
    dimensions = Column(String)
    description = Column(String)
    
    case = relationship("Case")
    cause = relationship("InjuryCause")

class BodyDiagramMark(Base):
    __tablename__ = "body_diagram_marks"
    id = Column(Integer, primary_key=True, index=True)
    injury_id = Column(Integer, ForeignKey("injuries.id"))
    diagram_x = Column(Integer)
    diagram_y = Column(Integer)
    diagram_part = Column(String) # e.g. Front, Back
    
    injury = relationship("Injury")

class Specimen(Base):
    __tablename__ = "specimens"
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    specimen_type = Column(String, nullable=False) # e.g. Blood, Urine
    collection_date = Column(Date)
    collected_by = Column(String)
    storage_location = Column(String)
    status = Column(String) # e.g. Pending, Sent, Discarded
    
    case = relationship("Case")
    investigations = relationship("SpecimenInvestigation", back_populates="specimen")

class SpecimenInvestigation(Base):
    __tablename__ = "specimen_investigations"
    id = Column(Integer, primary_key=True, index=True)
    specimen_id = Column(Integer, ForeignKey("specimens.id"))
    investigation_type = Column(String) # e.g. Toxicology, Histology
    sent_to = Column(String) # e.g. Government Analyst
    date_sent = Column(Date)
    date_received = Column(Date)
    result_summary = Column(String)
    
    specimen = relationship("Specimen", back_populates="investigations")
