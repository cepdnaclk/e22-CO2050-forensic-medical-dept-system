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

from sqlalchemy import text

def init_db(db: Session) -> None:
    # Tables should be created with Alembic in production,
    # but for this setup we'll create them directly
    Base.metadata.create_all(bind=engine)
    
    # 1. Create case_summary_view
    db.execute(text("""
        CREATE OR REPLACE VIEW case_summary_view AS
        SELECT
            c.id            AS case_id,
            c.case_number,
            c.court_case_no,
            c.status,
            c.opened_date,
            ct.name         AS case_type,
            cc.date_of_trial AS trial_date
        FROM cases c
        LEFT JOIN case_types ct ON c.case_type_id = ct.id
        LEFT JOIN court_certificates cc ON c.id = cc.case_id;
    """))

    # 2. Create Audit Trigger Function
    db.execute(text("""
        CREATE OR REPLACE FUNCTION audit_trigger_func() RETURNS trigger AS $$
        DECLARE
            v_user_id integer;
            v_old_data json;
            v_new_data json;
        BEGIN
            -- Read user ID from session context, default to NULL if missing
            BEGIN
                v_user_id := current_setting('app.current_user_id')::integer;
            EXCEPTION WHEN OTHERS THEN
                v_user_id := NULL;
            END;

            IF (TG_OP = 'UPDATE') THEN
                v_old_data := row_to_json(OLD);
                v_new_data := row_to_json(NEW);
                INSERT INTO audit_log (user_id, table_name, record_id, action, timestamp, ip_address, old_value, new_value)
                VALUES (v_user_id, TG_TABLE_NAME::text, NEW.id::text, TG_OP, current_timestamp, '127.0.0.1', v_old_data, v_new_data);
                RETURN NEW;
            ELSIF (TG_OP = 'DELETE') THEN
                v_old_data := row_to_json(OLD);
                INSERT INTO audit_log (user_id, table_name, record_id, action, timestamp, ip_address, old_value)
                VALUES (v_user_id, TG_TABLE_NAME::text, OLD.id::text, TG_OP, current_timestamp, '127.0.0.1', v_old_data);
                RETURN OLD;
            ELSIF (TG_OP = 'INSERT') THEN
                v_new_data := row_to_json(NEW);
                INSERT INTO audit_log (user_id, table_name, record_id, action, timestamp, ip_address, new_value)
                VALUES (v_user_id, TG_TABLE_NAME::text, NEW.id::text, TG_OP, current_timestamp, '127.0.0.1', v_new_data);
                RETURN NEW;
            END IF;
            RETURN NULL;
        END;
        $$ LANGUAGE plpgsql;
    """))

    # 3. Apply Trigger to Cases Table
    db.execute(text("DROP TRIGGER IF EXISTS cases_audit_trigger ON cases;"))
    db.execute(text("""
        CREATE TRIGGER cases_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE ON cases
        FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
    """))

    db.commit()

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
