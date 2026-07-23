import os
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.security import get_password_hash

def init_db(db: Session) -> None:
    # 1. Read and execute the PostgreSQL schema file from the database folder
    schema_path = os.path.join(os.path.dirname(__file__), "../../../database/schema.sql")
    with open(schema_path, 'r') as f:
        schema_sql = f.read()
    
    # Execute the raw schema SQL
    # Split by statements is complex due to functions, so we just run the whole block if the driver supports it
    # psycopg2 supports executing multiple statements at once using execute()
    db.execute(text(schema_sql))
    db.commit()
    
    # 2. Seed default roles
    default_roles = ["Admin", "JMO", "Police", "Receptionist", "Records Clerk"]
    for role_name in default_roles:
        existing = db.execute(text("SELECT role_id FROM Roles WHERE role_name = :role_name"), {"role_name": role_name}).scalar()
        if not existing:
            db.execute(text("INSERT INTO Roles (role_name) VALUES (:role_name)"), {"role_name": role_name})
    db.commit()

    # 3. Seed admin user if it doesn't exist
    admin_exists = db.execute(text("SELECT user_id FROM Users WHERE username = 'admin'")).scalar()
    if not admin_exists:
        admin_role_id = db.execute(text("SELECT role_id FROM Roles WHERE role_name = 'Admin'")).scalar()
        if admin_role_id:
            hashed_pwd = get_password_hash("admin123")
            # Create user
            admin_user_id = db.execute(
                text("""
                    INSERT INTO Users (username, email, password_hash, salt, is_active) 
                    VALUES ('admin', 'admin@fmcms.local', :pwd, 'salt', true) 
                    RETURNING user_id
                """),
                {"pwd": hashed_pwd}
            ).scalar()
            
            # Map role
            db.execute(
                text("INSERT INTO User_Roles (user_id, role_id) VALUES (:user_id, :role_id)"),
                {"user_id": admin_user_id, "role_id": admin_role_id}
            )
            db.commit()
