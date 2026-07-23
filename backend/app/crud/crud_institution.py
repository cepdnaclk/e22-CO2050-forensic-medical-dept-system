from app.crud.base import CRUDBase

hospital = CRUDBase("Hospitals", "hospital_id")
ward = CRUDBase("Wards", "ward_id")
police_station = CRUDBase("Police_Stations", "station_id")
court = CRUDBase("Courts", "court_id")
