from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
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
    current_user: Dict[str, Any] = Depends(allow_read_case),
) -> Any:
    """Retrieve cases."""
    user_roles = current_user.get("roles", [])
    if "Admin" not in user_roles and "Auditor" not in user_roles:
        if "JMO" in user_roles and current_user.get("medical_officer_id"):
            # A bit of a hack: crud_case doesn't support assigned_jmo filter right now,
            # But the schema.sql doesn't even have assigned_jmo_id on the Cases table!
            # Let's just fetch all cases for now or rely on crud's get_multi
            pass
            
    cases = crud.case.get_cases_with_filters(db, status=status, skip=skip, limit=limit)
    return cases

@router.post("/", response_model=schemas.case.Case)
def create_case(
    *,
    db: Session = Depends(deps.get_db),
    case_in: schemas.case.CaseCreate,
    current_user: Dict[str, Any] = Depends(allow_write_case),
) -> Any:
    """Create new case."""
    existing = crud.case.get_by_case_number(db, case_number=case_in.case_number)
    if existing:
        raise HTTPException(status_code=400, detail="A case with this inquest number already exists.")
    case = crud.case.create(db, obj_in=case_in)
    return case

@router.get("/{case_id}", response_model=schemas.case.Case)
def read_case(
    case_id: int,
    db: Session = Depends(deps.get_db),
    current_user: Dict[str, Any] = Depends(allow_read_case),
) -> Any:
    """Get case by ID."""
    case = crud.case.get(db, id=case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
            
    return case

@router.put("/{case_id}", response_model=schemas.case.Case)
def update_case(
    case_id: int,
    case_in: schemas.case.CaseCreate,
    db: Session = Depends(deps.get_db),
    current_user: Dict[str, Any] = Depends(allow_write_case),
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
    current_user: Dict[str, Any] = Depends(allow_write_case),
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
    current_user: Dict[str, Any] = Depends(allow_write_case),
) -> Any:
    """Add injured person to a case."""
    injured_in.case_id = case_id
    injured = crud.injured.create(db, obj_in=injured_in)
    return injured
