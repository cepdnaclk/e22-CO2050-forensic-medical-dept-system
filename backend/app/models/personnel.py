from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base

class PoliceOfficer(Base):
    __tablename__ = "police_officers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    station_id = Column(Integer, ForeignKey("police_stations.id"))
    badge_number = Column(String, unique=True, nullable=False)
    rank = Column(String)
    
    user = relationship("User", back_populates="police_officer")
    station = relationship("PoliceStation", back_populates="officers")

class Magistrate(Base):
    __tablename__ = "magistrates"
    id = Column(Integer, primary_key=True, index=True)
    court_id = Column(Integer, ForeignKey("courts.id"))
    name = Column(String, nullable=False)
    contact_number = Column(String)
    
    court = relationship("Court", back_populates="magistrates")

class MedicalOfficer(Base):
    __tablename__ = "medical_officers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    slmc_reg_number = Column(String, unique=True, nullable=False)
    designation = Column(String) # e.g., JMO, AJMO, Medical Officer
    
    user = relationship("User", back_populates="medical_officer")
