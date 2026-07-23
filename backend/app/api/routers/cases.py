from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.api.deps import RoleChecker

router = APIRouter()

allow_all = RoleChecker(["Admin", "Auditor", "Registrar", "JMO", "Police", "Records Clerk"])
allow_write_case = RoleChecker(["Admin", "Records Clerk"])
allow_read_case = RoleChecker(["Admin", "Auditor", "Registrar", "JMO", "Police", "Records Clerk"])

@router.get("/", response_model=List[schemas.case.Case])
def read_cases(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    current_user: models.system.User = Depends(allow_read_case),
) -> Any:
    """Retrieve cases."""
    query = db.query(models.case.Case)
    
    # Enforce row-level scoping
    user_roles = [r.name for r in current_user.roles]
    if "Admin" not in user_roles and "Auditor" not in user_roles:
        if "JMO" in user_roles and current_user.medical_officer:
            query = query.filter(models.case.Case.assigned_jmo_id == current_user.medical_officer.id)
        elif "Police" in user_roles and current_user.police_officer:
            query = query.filter(models.case.Case.police_station_id == current_user.police_officer.station_id)
            
    if status:
        query = query.filter(models.case.Case.status == status)
        
    cases = query.offset(skip).limit(limit).all()
    return cases

@router.post("/", response_model=schemas.case.Case)
def create_case(
    *,
    db: Session = Depends(deps.get_db),
    case_in: schemas.case.CaseCreate,
    current_user: models.system.User = Depends(allow_write_case),
) -> Any:
    """Create new case."""
    case = crud.case.get_by_case_number(db, case_number=case_in.case_number)
    if case:
        raise HTTPException(status_code=400, detail="Case with this number already exists")
    case = crud.case.create(db, obj_in=case_in)
    return case

@router.get("/{case_id}", response_model=schemas.case.Case)
def read_case(
    case_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.system.User = Depends(allow_read_case),
) -> Any:
    """Get case by ID."""
    case = crud.case.get(db, id=case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    # Enforce row-level scoping
    user_roles = [r.name for r in current_user.roles]
    if "Admin" not in user_roles and "Auditor" not in user_roles:
        if "JMO" in user_roles and current_user.medical_officer and case.assigned_jmo_id != current_user.medical_officer.id:
            raise HTTPException(status_code=403, detail="Not authorized to access this case")
        if "Police" in user_roles and current_user.police_officer and case.police_station_id != current_user.police_officer.station_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this case")
            
    return case

@router.put("/{case_id}", response_model=schemas.case.Case)
def update_case(
    case_id: int,
    case_in: schemas.case.CaseCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.system.User = Depends(allow_write_case),
) -> Any:
    """Update a case."""
    case = crud.case.get(db, id=case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    case = crud.case.update(db, db_obj=case, obj_in=case_in)
    return case

@router.post("/{case_id}/deceased", response_model=schemas.case.DeceasedPerson)
def add_deceased(
    case_id: int,
    deceased_in: schemas.case.DeceasedPersonCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.system.User = Depends(allow_write_case),
) -> Any:
    """Add deceased person to a case."""
    deceased_in.case_id = case_id
    deceased = crud.deceased.create(db, obj_in=deceased_in)
    return deceased

@router.post("/{case_id}/injured", response_model=schemas.case.InjuredPerson)
def add_injured(
    case_id: int,
    injured_in: schemas.case.InjuredPersonCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Add injured person to a case."""
    injured_in.case_id = case_id
    injured = crud.injured.create(db, obj_in=injured_in)
    return injured
