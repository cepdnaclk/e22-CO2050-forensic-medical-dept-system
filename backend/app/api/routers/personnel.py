from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.api import deps

router = APIRouter()

@router.get("/medical-officers", response_model=List[schemas.personnel.MedicalOfficer])
def read_medical_officers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve medical officers."""
    officers = crud.medical_officer.get_multi(db, skip=skip, limit=limit)
    return officers

@router.post("/medical-officers", response_model=schemas.personnel.MedicalOfficer)
def create_medical_officer(
    *,
    db: Session = Depends(deps.get_db),
    officer_in: schemas.personnel.MedicalOfficerCreate,
    current_user: Dict[str, Any] = Depends(deps.get_current_active_user),
) -> Any:
    """Create new medical officer."""
    officer = crud.medical_officer.create(db, obj_in=officer_in)
    return officer

@router.get("/police-officers", response_model=List[schemas.personnel.PoliceOfficer])
def read_police_officers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve police officers."""
    officers = crud.police_officer.get_multi(db, skip=skip, limit=limit)
    return officers

@router.post("/police-officers", response_model=schemas.personnel.PoliceOfficer)
def create_police_officer(
    *,
    db: Session = Depends(deps.get_db),
    officer_in: schemas.personnel.PoliceOfficerCreate,
    current_user: Dict[str, Any] = Depends(deps.get_current_active_user),
) -> Any:
    """Create new police officer."""
    officer = crud.police_officer.create(db, obj_in=officer_in)
    return officer

@router.get("/magistrates", response_model=List[schemas.personnel.Magistrate])
def read_magistrates(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve magistrates."""
    magistrates = crud.magistrate.get_multi(db, skip=skip, limit=limit)
    return magistrates

@router.post("/magistrates", response_model=schemas.personnel.Magistrate)
def create_magistrate(
    *,
    db: Session = Depends(deps.get_db),
    magistrate_in: schemas.personnel.MagistrateCreate,
    current_user: Dict[str, Any] = Depends(deps.get_current_active_user),
) -> Any:
    """Create new magistrate."""
    magistrate = crud.magistrate.create(db, obj_in=magistrate_in)
    return magistrate
