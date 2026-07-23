import logging
from sqlalchemy import event
from sqlalchemy.orm import mapper
from app.core.context import current_user_id
from app.models.system import AuditLog

logger = logging.getLogger(__name__)

def log_action(mapper_obj, connection, target, action):
    try:
        # Avoid infinite loop when inserting into audit_log
        if target.__tablename__ == 'audit_log':
            return
            
        user_id = current_user_id.get()
        
        # We use connection.execute to bypass the ORM session and prevent triggering more events
        connection.execute(
            AuditLog.__table__.insert().values(
                user_id=user_id,
                action=action,
                table_name=target.__tablename__,
                record_id=str(getattr(target, 'id', 'unknown')),
                ip_address="127.0.0.1" # Can be extended to capture real IP from request
            )
        )
    except Exception as e:
        logger.error(f"Failed to write audit log: {e}")

def register_audit_events():
    """Register SQLAlchemy event listeners for all models to enable automatic audit logging."""
    from app.db.base import Base
    
    # Wait until all mappers are configured
    from sqlalchemy.orm import configure_mappers
    configure_mappers()
    
    for mapper_obj in Base.registry.mappers:
        # Don't log the audit table itself or many-to-many association tables without standard PKs
        if mapper_obj.local_table.name == 'audit_log':
            continue
            
        event.listen(mapper_obj.class_, 'after_insert', lambda m, c, t: log_action(m, c, t, 'INSERT'))
        event.listen(mapper_obj.class_, 'after_update', lambda m, c, t: log_action(m, c, t, 'UPDATE'))
        event.listen(mapper_obj.class_, 'after_delete', lambda m, c, t: log_action(m, c, t, 'DELETE'))
        
    logger.info("Audit logging events registered successfully.")
