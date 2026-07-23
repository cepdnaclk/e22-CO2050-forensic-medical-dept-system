from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.institution import Hospital, Ward, PoliceStation, Court
from app.schemas.institution import HospitalCreate, WardCreate, PoliceStationCreate, CourtCreate

hospital = CRUDBase[Hospital, HospitalCreate, HospitalCreate](Hospital)
ward = CRUDBase[Ward, WardCreate, WardCreate](Ward)
police_station = CRUDBase[PoliceStation, PoliceStationCreate, PoliceStationCreate](PoliceStation)
court = CRUDBase[Court, CourtCreate, CourtCreate](Court)
