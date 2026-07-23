from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/mlefs", response_model=List[schemas.examination.MLEFForm])
def read_mlefs(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve MLEF forms."""
    mlefs = crud.mlef_form.get_multi(db, skip=skip, limit=limit)
    return mlefs

@router.post("/mlefs", response_model=schemas.examination.MLEFForm)
def create_mlef(
    *,
    db: Session = Depends(deps.get_db),
    mlef_in: schemas.examination.MLEFFormCreate,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new MLEF form."""
    mlef = crud.mlef_form.create(db, obj_in=mlef_in)
    return mlef

@router.get("/postmortems", response_model=List[schemas.examination.PostMortemReport])
def read_postmortems(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve Post Mortem Reports."""
    reports = crud.postmortem_report.get_multi(db, skip=skip, limit=limit)
    return reports

@router.post("/postmortems", response_model=schemas.examination.PostMortemReport)
def create_postmortem(
    *,
    db: Session = Depends(deps.get_db),
    report_in: schemas.examination.PostMortemReportCreate,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new Post Mortem Report."""
    report = crud.postmortem_report.create(db, obj_in=report_in)
    return report

@router.post("/postmortems/{pm_id}/findings", response_model=schemas.examination.PostMortemFinding)
def add_finding(
    pm_id: int,
    finding_in: schemas.examination.PostMortemFindingCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.system.User = Depends(deps.get_current_active_user),
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
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new Autopsy Notification."""
    notification = crud.autopsy_notification.create(db, obj_in=notification_in)
    return notification

@router.get("/court-certificates", response_model=List[schemas.examination.CourtCertificate])
def read_court_certificates(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Retrieve Court Certificates."""
    certs = crud.court_certificate.get_multi(db, skip=skip, limit=limit)
    return certs

@router.post("/court-certificates", response_model=schemas.examination.CourtCertificate)
def create_court_certificate(
    *,
    db: Session = Depends(deps.get_db),
    cert_in: schemas.examination.CourtCertificateCreate,
    current_user: models.system.User = Depends(deps.get_current_active_user),
) -> Any:
    """Create new Court Certificate."""
    cert = crud.court_certificate.create(db, obj_in=cert_in)
    return cert
