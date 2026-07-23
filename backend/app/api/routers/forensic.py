from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/specimens", response_model=List[schemas.forensic.Specimen])
def read_specimens(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve specimens."""
    specimens = crud.specimen.get_multi(db, skip=skip, limit=limit)
    return specimens

@router.post("/specimens", response_model=schemas.forensic.Specimen)
def create_specimen(
    *,
    db: Session = Depends(deps.get_db),
    specimen_in: schemas.forensic.SpecimenCreate,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new specimen."""
    specimen_obj = crud.specimen.create(db, obj_in=specimen_in)
    return specimen_obj

@router.get("/specimens/{specimen_id}", response_model=schemas.forensic.Specimen)
def read_specimen(
    specimen_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Get specimen by ID."""
    specimen_obj = crud.specimen.get(db, id=specimen_id)
    if not specimen_obj:
        raise HTTPException(status_code=404, detail="Specimen not found")
    return specimen_obj

@router.post("/specimens/{specimen_id}/investigations", response_model=schemas.forensic.SpecimenInvestigation)
def add_investigation(
    specimen_id: int,
    investigation_in: schemas.forensic.SpecimenInvestigationCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Add investigation to specimen."""
    investigation_in.specimen_id = specimen_id
    investigation = crud.specimen_investigation.create(db, obj_in=investigation_in)
    return investigation

@router.get("/injuries", response_model=List[schemas.forensic.Injury])
def read_injuries(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve injuries."""
    injuries = crud.injury.get_multi(db, skip=skip, limit=limit)
    return injuries

@router.post("/injuries", response_model=schemas.forensic.Injury)
def create_injury(
    *,
    db: Session = Depends(deps.get_db),
    injury_in: schemas.forensic.InjuryCreate,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new injury."""
    injury_obj = crud.injury.create(db, obj_in=injury_in)
    return injury_obj
