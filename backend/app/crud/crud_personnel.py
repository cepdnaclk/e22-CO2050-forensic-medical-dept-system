from typing import List
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.personnel import PoliceOfficer, Magistrate, MedicalOfficer
from app.schemas.personnel import PoliceOfficerCreate, MagistrateCreate, MedicalOfficerCreate

class CRUDMedicalOfficer(CRUDBase[MedicalOfficer, MedicalOfficerCreate, MedicalOfficerCreate]):
    pass

police_officer = CRUDBase[PoliceOfficer, PoliceOfficerCreate, PoliceOfficerCreate](PoliceOfficer)
magistrate = CRUDBase[Magistrate, MagistrateCreate, MagistrateCreate](Magistrate)
medical_officer = CRUDMedicalOfficer(MedicalOfficer)
