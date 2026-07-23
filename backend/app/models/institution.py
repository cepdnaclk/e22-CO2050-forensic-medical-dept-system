from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    address = Column(String)
    contact_number = Column(String)
    
    wards = relationship("Ward", back_populates="hospital")

class Ward(Base):
    __tablename__ = "wards"
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    ward_number = Column(String, nullable=False)
    name = Column(String)
    
    hospital = relationship("Hospital", back_populates="wards")

class PoliceStation(Base):
    __tablename__ = "police_stations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    division = Column(String)
    contact_number = Column(String)
    
    officers = relationship("PoliceOfficer", back_populates="station")

class Court(Base):
    __tablename__ = "courts"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
    court_type = Column(String) # Magistrate, District, High
    
    magistrates = relationship("Magistrate", back_populates="court")
