from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from app import crud, schemas
from app.api import deps
from app.api.deps import RoleChecker

router = APIRouter()

allow_read = RoleChecker(["Admin", "Auditor", "Registrar", "JMO", "Police"])
allow_write_mlef = RoleChecker(["Admin", "Police"])
allow_write_pm = RoleChecker(["Admin", "JMO"])
allow_write_cert = RoleChecker(["Admin", "JMO"])

@router.get("/mlefs", response_model=List[schemas.examination.MLEFForm])
def read_mlefs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(allow_read),
) -> Any:
    """Retrieve MLEF forms."""
    user_roles = current_user.get("roles", [])
    
    # Just returning all for now as complex joins without police mapping in schema.sql is hard
    # In schema.sql, Police_Officers table does not have user_id, so we can't filter by station_id easily yet.
    return crud.mlef_form.get_multi(db, skip=skip, limit=limit)

@router.post("/mlefs", response_model=schemas.examination.MLEFForm)
def create_mlef(
    *,
    db: Session = Depends(deps.get_db),
    mlef_in: schemas.examination.MLEFFormCreate,
    current_user: Dict[str, Any] = Depends(allow_write_mlef),
) -> Any:
    """Create new MLEF form."""
    mlef = crud.mlef_form.create(db, obj_in=mlef_in)
    return mlef

@router.get("/postmortems", response_model=List[schemas.examination.PostMortemReport])
def read_postmortems(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(allow_read),
) -> Any:
    """Retrieve Post Mortem Reports."""
    user_roles = current_user.get("roles", [])
    
    if "Registrar" in user_roles and "Admin" not in user_roles:
        raise HTTPException(status_code=403, detail="Registrar cannot view full autopsy findings")
        
    if "Admin" not in user_roles and "Auditor" not in user_roles:
        if "JMO" in user_roles and current_user.get("medical_officer_id"):
            query = """
                SELECT p.* FROM PostMortem_Reports p
                JOIN Autopsy_Notifications a ON p.notification_id = a.notification_id
                WHERE a.jmo_id = :jmo_id
                LIMIT :limit OFFSET :skip
            """
            reports = db.execute(text(query), {"jmo_id": current_user["medical_officer_id"], "limit": limit, "skip": skip}).mappings().all()
            return [crud.postmortem_report._map_row(r) for r in reports]
            
    return crud.postmortem_report.get_multi(db, skip=skip, limit=limit)

@router.post("/postmortems", response_model=schemas.examination.PostMortemReport)
def create_postmortem(
    *,
    db: Session = Depends(deps.get_db),
    report_in: schemas.examination.PostMortemReportCreate,
    current_user: Dict[str, Any] = Depends(allow_write_pm),
) -> Any:
    """Create new Post Mortem Report."""
    report = crud.postmortem_report.create(db, obj_in=report_in)
    return report

@router.post("/postmortems/{pm_id}/findings", response_model=schemas.examination.PostMortemFinding)
def add_finding(
    pm_id: int,
    finding_in: schemas.examination.PostMortemFindingCreate,
    db: Session = Depends(deps.get_db),
    current_user: Dict[str, Any] = Depends(allow_write_pm),
) -> Any:
    """Add finding to PM Report."""
    finding_in.postmortem_report_id = pm_id
    finding = crud.postmortem_finding.create(db, obj_in=finding_in)
    return finding

@router.post("/autopsy-notifications", response_model=schemas.examination.AutopsyNotification)
def create_autopsy_notification(
    *,
    db: Session = Depends(deps.get_db),
    notification_in: schemas.examination.AutopsyNotificationCreate,
    current_user: Dict[str, Any] = Depends(allow_write_pm),
) -> Any:
    """Create new Autopsy Notification."""
    notification = crud.autopsy_notification.create(db, obj_in=notification_in)
    return notification

@router.get("/court-certificates", response_model=List[schemas.examination.CourtCertificate])
def read_court_certificates(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Dict[str, Any] = Depends(allow_read),
) -> Any:
    """Retrieve Court Certificates."""
    certs = crud.court_certificate.get_multi(db, skip=skip, limit=limit)
    return certs

@router.post("/court-certificates", response_model=schemas.examination.CourtCertificate)
def create_court_certificate(
    *,
    db: Session = Depends(deps.get_db),
    cert_in: schemas.examination.CourtCertificateCreate,
    current_user: Dict[str, Any] = Depends(allow_write_cert),
) -> Any:
    """Create new Court Certificate."""
    cert = crud.court_certificate.create(db, obj_in=cert_in)
    return cert
