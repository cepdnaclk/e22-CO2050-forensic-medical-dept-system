import psycopg2
conn = psycopg2.connect(dbname='fmcms', user='postgres', password='12345678', host='localhost')
conn.autocommit = True
cur = conn.cursor()
tables = ['Cases', 'Deceased_Persons', 'Injured_Persons', 'MLEF_Forms', 'PostMortem_Reports', 'Autopsy_Notifications']
for table in tables:
    cur.execute(f'ALTER TABLE {table} ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
    cur.execute(f'ALTER TABLE {table} ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP')
print('Timestamps added!')