from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/roles", response_model=List[schemas.system.Role])
def read_roles(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve roles."""
    roles = db.query(models.system.Role).offset(skip).limit(limit).all()
    return roles

@router.get("/audit-log", response_model=List[schemas.system.AuditLog])
def read_audit_logs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve audit logs."""
    logs = db.query(models.system.AuditLog).order_by(models.system.AuditLog.timestamp.desc()).offset(skip).limit(limit).all()
    return logs

@router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Dict[str, Any]:
    """Get statistics for the dashboard."""
    # Simple count examples
    open_cases = db.query(models.case.Case).filter(models.case.Case.status == "OPEN").count()
    closed_cases = db.query(models.case.Case).filter(models.case.Case.status == "CLOSED").count()
    total_cases = open_cases + closed_cases
    recent_cases = db.query(models.case.Case).order_by(models.case.Case.opened_date.desc()).limit(5).all()
    
    return {
        "open_cases": open_cases,
        "closed_cases": closed_cases,
        "total_cases": total_cases,
        "recent_cases": [{"id": c.id, "case_number": c.case_number, "status": c.status} for c in recent_cases]
    }
