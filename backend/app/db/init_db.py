from sqlalchemy.orm import Session
from app.db.base_class import Base
from app.db.session import engine, SessionLocal
from app.models.system import Role, User
from app.core.security import get_password_hash

# Import all models to ensure they are registered with Base
from app.models.institution import Hospital, Ward, PoliceStation, Court
from app.models.personnel import PoliceOfficer, Magistrate, MedicalOfficer
from app.models.case import Case, CaseType, DeceasedPerson, InjuredPerson
from app.models.examination import AutopsyNotification, PostMortemReport, PostMortemFinding, MLEFForm, CourtCertificate
from app.models.forensic import Injury, InjuryCause, BodyDiagramMark, Specimen, SpecimenInvestigation

def init_db(db: Session) -> None:
    # Tables should be created with Alembic in production,
    # but for this setup we'll create them directly
    Base.metadata.create_all(bind=engine)
    
    # Create default roles
    default_roles = ["Admin", "JMO", "Police", "Receptionist"]
    for role_name in default_roles:
        role = db.query(Role).filter(Role.name == role_name).first()
        if not role:
            role = Role(name=role_name, description=f"{role_name} Role")
            db.add(role)
            db.commit()
            db.refresh(role)
            
    # Create admin user
    admin_user = db.query(User).filter(User.username == "admin").first()
    if not admin_user:
        admin_role = db.query(Role).filter(Role.name == "Admin").first()
        admin_user = User(
            username="admin",
            email="admin@fmcms.local",
            full_name="System Administrator",
            hashed_password=get_password_hash("admin123"),
            is_active=True,
        )
        if admin_role:
            admin_user.roles.append(admin_role)
        db.add(admin_user)
        db.commit()

if __name__ == "__main__":
    print("Creating initial data...")
    db = SessionLocal()
    init_db(db)
    print("Initial data created")
