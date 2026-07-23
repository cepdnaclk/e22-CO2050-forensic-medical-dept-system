from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()
try:
    print('Checking if columns exist...')
    cols = db.execute(text("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='cases'")).fetchall()
    col_names = [c[0] for c in cols]
    
    if 'assigned_jmo_id' not in col_names:
        print('Adding assigned_jmo_id...')
        db.execute(text('ALTER TABLE cases ADD COLUMN assigned_jmo_id INT'))
    if 'police_station_id' not in col_names:
        print('Adding police_station_id...')
        db.execute(text('ALTER TABLE cases ADD COLUMN police_station_id INT'))
    if 'court_id' not in col_names:
        print('Adding court_id...')
        db.execute(text('ALTER TABLE cases ADD COLUMN court_id INT'))
        
    db.commit()
    print('Done.')
except Exception as e:
    print('Error:', e)
finally:
    db.close()
