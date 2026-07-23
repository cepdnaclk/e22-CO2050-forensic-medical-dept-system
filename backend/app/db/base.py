# Import all the models, so that Base has them before being imported by Alembic
from app.db.base_class import Base

from app.models.system import User, Role, Permission, CaseDocument, AuditLog, user_roles
from app.models.institution import Hospital, Ward, PoliceStation, Court
from app.models.personnel import PoliceOfficer, Magistrate, MedicalOfficer
from app.models.case import Case, CaseType, DeceasedPerson, InjuredPerson
from app.models.examination import AutopsyNotification, PostMortemReport, PostMortemFinding, MLEFForm, CourtCertificate
from app.models.forensic import Injury, InjuryCause, BodyDiagramMark, Specimen, SpecimenInvestigation
