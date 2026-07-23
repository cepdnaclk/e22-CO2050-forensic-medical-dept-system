from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/hospitals", response_model=List[schemas.institution.Hospital])
def read_hospitals(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve hospitals."""
    hospitals = crud.hospital.get_multi(db, skip=skip, limit=limit)
    return hospitals

@router.post("/hospitals", response_model=schemas.institution.Hospital)
def create_hospital(
    *,
    db: Session = Depends(deps.get_db),
    hospital_in: schemas.institution.HospitalCreate,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new hospital."""
    hospital = crud.hospital.create(db, obj_in=hospital_in)
    return hospital

@router.get("/police-stations", response_model=List[schemas.institution.PoliceStation])
def read_police_stations(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve police stations."""
    stations = crud.police_station.get_multi(db, skip=skip, limit=limit)
    return stations

@router.post("/police-stations", response_model=schemas.institution.PoliceStation)
def create_police_station(
    *,
    db: Session = Depends(deps.get_db),
    station_in: schemas.institution.PoliceStationCreate,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new police station."""
    station = crud.police_station.create(db, obj_in=station_in)
    return station

@router.get("/courts", response_model=List[schemas.institution.Court])
def read_courts(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve courts."""
    courts = crud.court.get_multi(db, skip=skip, limit=limit)
    return courts

@router.post("/courts", response_model=schemas.institution.Court)
def create_court(
    *,
    db: Session = Depends(deps.get_db),
    court_in: schemas.institution.CourtCreate,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new court."""
    court = crud.court.create(db, obj_in=court_in)
    return court
