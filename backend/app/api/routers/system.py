from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app import crud, schemas
from app.api import deps

router = APIRouter()

@router.get("/roles", response_model=List[schemas.system.Role])
def read_roles(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve roles."""
    roles = db.execute(
        text("SELECT role_id as id, role_name as name, description FROM Roles LIMIT :limit OFFSET :skip"),
        {"limit": limit, "skip": skip}
    ).mappings().all()
    return [dict(r) for r in roles]

@router.get("/audit-log", response_model=List[schemas.system.AuditLog])
def read_audit_logs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve audit logs."""
    logs = db.execute(
        text("SELECT log_id as id, table_name, record_id, action, changed_by, changed_at as timestamp, old_data, new_data FROM Audit_Log ORDER BY changed_at DESC LIMIT :limit OFFSET :skip"),
        {"limit": limit, "skip": skip}
    ).mappings().all()
    return [dict(l) for l in logs]

@router.get("/dashboard/stats")
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    current_user: Dict[str, Any] = Depends(deps.get_current_active_user),
) -> Dict[str, Any]:
    """Get statistics for the dashboard."""
    open_cases = db.execute(text("SELECT count(*) FROM Cases WHERE status = 'OPEN'")).scalar() or 0
    closed_cases = db.execute(text("SELECT count(*) FROM Cases WHERE status = 'CLOSED'")).scalar() or 0
    total_cases = open_cases + closed_cases
    recent_cases = db.execute(
        text("SELECT case_id as id, inquest_no as case_number, status FROM Cases ORDER BY opened_date DESC LIMIT 5")
    ).mappings().all()
    
    return {
        "open_cases": open_cases,
        "closed_cases": closed_cases,
        "total_cases": total_cases,
        "recent_cases": [{"id": c["id"], "case_number": c["case_number"], "status": c["status"]} for c in recent_cases]
    }
