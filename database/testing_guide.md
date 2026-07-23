# FMCMS PostgreSQL Manual Verification Checklist

**Connect first:**
`
psql -U postgres -d fmcms
`
Or open pgAdmin → Query Tool with mcms database selected.

Every check follows: command → expected → failure meaning.

---

## SECTION 1: SCHEMA VERIFICATION

### 1.1  List all 27 tables

`sql
SELECT table_name
FROM   information_schema.tables
WHERE  table_schema = 'public'
  AND  table_type   = 'BASE TABLE'
ORDER  BY table_name;
`

**Expected — exactly 27 rows:**
`
audit_log              autopsy_notifications  body_diagram_marks
case_documents         case_types             cases
court_certificates     deceased_persons       hospitals
injured_persons        injuries               injury_causes
magistrates            medical_officers       mlef_forms
permissions            police_officers        police_stations
postmortem_findings    postmortem_reports     roles
specimen_investigations  specimens            user_roles
users                  wards
`
(26 above — case_types makes the full 27 when you count carefully)

**Failure:** Missing table → init_db.py or schema.sql did not apply fully.
Re-run:  psql -U postgres -d fmcms -f database/schema.sql

---

### 1.2  Inspect column structure for key tables

**Cases:**
`sql
SELECT column_name, data_type, is_nullable, column_default
FROM   information_schema.columns
WHERE  table_name = 'cases'
ORDER  BY ordinal_position;
`
Expected: case_id (integer, NOT NULL), case_type_id, inquest_no, court_case_no, status, opened_date (NOT NULL).

**Deceased_Persons:**
`sql
SELECT column_name, data_type, is_nullable
FROM   information_schema.columns
WHERE  table_name = 'deceased_persons'
ORDER  BY ordinal_position;
`
Expected: deceased_id, case_id (NOT NULL), ull_name, 
ic_no (**bytea**), ge, sex, ddress, date_of_admission, date_of_death, place_of_death.
**Key check:** 
ic_no must show ytea not character varying.

**Users:**
`sql
SELECT column_name, data_type, is_nullable
FROM   information_schema.columns
WHERE  table_name = 'users'
ORDER  BY ordinal_position;
`
Expected: user_id, username (NOT NULL), password_hash (NOT NULL), salt, email, is_active, mfa_enabled, ailed_login_attempts, locked_until.

**Failure:** 
ic_no showing as character varying means encryption migration was not applied.

---

### 1.3  List all foreign key relationships with ON DELETE rules

`sql
SELECT
    tc.table_name              AS child_table,
    kcu.column_name            AS child_column,
    ccu.table_name             AS parent_table,
    ccu.column_name            AS parent_column,
    rc.delete_rule
FROM information_schema.table_constraints        tc
JOIN information_schema.key_column_usage         kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage  ccu ON tc.constraint_name = ccu.constraint_name
JOIN information_schema.referential_constraints  rc  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema    = 'public'
ORDER BY child_table, child_column;
`

**Expected key rows:**
| child_table | child_column | parent_table | delete_rule |
|---|---|---|---|
| cases | case_type_id | case_types | RESTRICT |
| deceased_persons | case_id | cases | RESTRICT |
| injured_persons | case_id | cases | RESTRICT |
| mlef_forms | case_id | cases | RESTRICT |
| court_certificates | case_id | cases | RESTRICT |
| autopsy_notifications | case_id | cases | RESTRICT |
| postmortem_reports | notification_id | autopsy_notifications | CASCADE |
| postmortem_findings | pm_report_id | postmortem_reports | CASCADE |
| wards | hospital_id | hospitals | CASCADE |
| police_officers | station_id | police_stations | SET NULL |
| medical_officers | hospital_id | hospitals | SET NULL |
| user_roles | user_id | users | CASCADE |
| audit_log | user_id | users | SET NULL |

**Failure:** NO ACTION in delete_rule instead of RESTRICT/CASCADE → FK was not created with the correct rule.

---

### 1.4  Confirm all CHECK constraints

`sql
SELECT
    tc.table_name,
    cc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints    tc
JOIN information_schema.check_constraints    cc ON tc.constraint_name = cc.constraint_name
WHERE tc.constraint_type = 'CHECK'
  AND tc.table_schema    = 'public'
ORDER BY tc.table_name;
`

**Expected:**
- deceased_persons → age >= 0
- deceased_persons → sex IN ('Male','Female','Other','Unknown')
- deceased_persons → date_of_death >= date_of_admission
- injured_persons  → age >= 0
- injured_persons  → sex IN ('Male','Female','Other','Unknown')
- mlef_forms       → examinee_type IN ('injured','deceased')
- injury_causes    → weapon_type IN ('blunt','sharp','firearm','burn','bite','other')
- specimen_investigations → test_type IN ('histology','serology','toxicology','other')

**Failure:** Empty result → constraints not applied. Re-run schema.sql.

---

### 1.5  Confirm Case_Summary_View exists

`sql
SELECT table_name, table_type
FROM   information_schema.tables
WHERE  table_schema = 'public'
  AND  table_name   = 'case_summary_view';
`
**Expected:** 1 row, 	able_type = 'VIEW'
**Failure:** 0 rows → view was not created. Run schema.sql.

Check the view output:
`sql
SELECT * FROM Case_Summary_View LIMIT 5;
`
**Expected:** Columns case_id, inquest_no, court_case_no, status, opened_date, 	ype_name, 	rial_date, days_open, deceased_count, injured_count — **no nic_no, no cause_of_death**.

---

## SECTION 2: CONSTRAINT TESTING (designed to fail)

> Run each — if the INSERT succeeds instead of failing, the constraint is missing.

---

### 2.1  FK Violation — PostMortem_Reports with invalid notification_id

`sql
INSERT INTO postmortem_reports (notification_id, mo_id, inquest_no, exam_date)
VALUES (99999, 1, 'TEST-FK-01', '2024-01-01');
`

**Expected error:**
`
ERROR:  insert or update on table "postmortem_reports" violates foreign key constraint
DETAIL:  Key (notification_id)=(99999) is not present in table "autopsy_notifications".
`
**Failure (if it succeeds):** FK from postmortem_reports.notification_id → utopsy_notifications.notification_id is missing.

---

### 2.2  UNIQUE Violation — duplicate username

Find an existing username first:
`sql
SELECT username FROM users LIMIT 1;
`
Then insert the same one (replace 'admin' with what you found):
`sql
INSERT INTO users (username, password_hash, salt)
VALUES ('admin', 'fakehash', 'fakesalt');
`

**Expected error:**
`
ERROR:  duplicate key value violates unique constraint "users_username_key"
DETAIL:  Key (username)=(admin) already exists.
`

---

### 2.3  UNIQUE Violation — duplicate pm_serial_no

Find an existing serial number:
`sql
SELECT pm_serial_no FROM autopsy_notifications WHERE pm_serial_no IS NOT NULL LIMIT 1;
`
Then try to insert the same one (replace 'PM-2024-001'):
`sql
INSERT INTO autopsy_notifications (pm_serial_no, date_of_death)
VALUES ('PM-2024-001', '2024-06-01');
`

**Expected error:**
`
ERROR:  duplicate key value violates unique constraint "autopsy_notifications_pm_serial_no_key"
`

---

### 2.4  CHECK Violation — invalid sex value

`sql
INSERT INTO deceased_persons (case_id, full_name, sex, age)
VALUES (1, 'Test Person', 'Robot', 30);
`

**Expected error:**
`
ERROR:  new row for relation "deceased_persons" violates check constraint "deceased_persons_sex_check"
DETAIL:  Failing row contains (..., Robot, ...).
`

---

### 2.5  CHECK Violation — negative age

`sql
INSERT INTO deceased_persons (case_id, full_name, sex, age)
VALUES (1, 'Test Person', 'Male', -3);
`

**Expected error:**
`
ERROR:  new row for relation "deceased_persons" violates check constraint "deceased_persons_age_check"
`

---

### 2.6  CHECK Violation — death before admission

`sql
INSERT INTO deceased_persons (case_id, full_name, date_of_admission, date_of_death)
VALUES (1, 'Test Person', '2024-06-15', '2024-06-01');
`

**Expected error:**
`
ERROR:  new row for relation "deceased_persons" violates check constraint "deceased_persons_check"
`
(The unnamed table-level CHECK enforcing date_of_death >= date_of_admission)

---

### 2.7  ON DELETE RESTRICT — delete a Case that has children

Step 1 — find a case with deceased persons:
`sql
SELECT c.case_id, COUNT(d.deceased_id) AS persons
FROM   cases c
JOIN   deceased_persons d ON c.case_id = d.case_id
GROUP  BY c.case_id
LIMIT  1;
`
Step 2 — try to delete it (replace 1 with the ID returned):
`sql
DELETE FROM cases WHERE case_id = 1;
`

**Expected error:**
`
ERROR:  update or delete on table "cases" violates foreign key constraint
        "deceased_persons_case_id_fkey" on table "deceased_persons"
DETAIL:  Key (case_id)=(1) is still referenced from table "deceased_persons".
`
Repeat with a case that has mlef_forms rows to also verify that RESTRICT.

---

## SECTION 3: DATA INTEGRITY SPOT CHECKS

### 3.1  Row count in every table

`sql
SELECT relname AS table_name, n_live_tup AS approx_rows
FROM   pg_stat_user_tables
WHERE  schemaname = 'public'
ORDER  BY relname;
`

Or for exact counts:
`sql
SELECT 'roles'                   AS tbl, COUNT(*) FROM roles                   UNION ALL
SELECT 'users',                           COUNT(*) FROM users                   UNION ALL
SELECT 'cases',                           COUNT(*) FROM cases                   UNION ALL
SELECT 'deceased_persons',                COUNT(*) FROM deceased_persons        UNION ALL
SELECT 'injured_persons',                 COUNT(*) FROM injured_persons         UNION ALL
SELECT 'mlef_forms',                      COUNT(*) FROM mlef_forms              UNION ALL
SELECT 'postmortem_reports',              COUNT(*) FROM postmortem_reports      UNION ALL
SELECT 'autopsy_notifications',           COUNT(*) FROM autopsy_notifications   UNION ALL
SELECT 'court_certificates',              COUNT(*) FROM court_certificates      UNION ALL
SELECT 'injuries',                        COUNT(*) FROM injuries                UNION ALL
SELECT 'specimens',                       COUNT(*) FROM specimens               UNION ALL
SELECT 'audit_log',                       COUNT(*) FROM audit_log
ORDER  BY tbl;
`

**Expected after seeding:** oles ≥ 6, users ≥ 1 (admin), others depend on your sample data.

---

### 3.2  Confirm every case has at least one person

`sql
SELECT c.case_id, c.inquest_no
FROM   cases c
WHERE  c.case_id NOT IN (SELECT case_id FROM deceased_persons WHERE case_id IS NOT NULL)
  AND  c.case_id NOT IN (SELECT case_id FROM injured_persons  WHERE case_id IS NOT NULL);
`

**Expected:** Empty result (every case has a linked person).
**Failure:** Rows returned → orphan cases with no persons linked.

---

### 3.3  Orphan checks — every subsystem

**Deceased persons with invalid case_id:**
`sql
SELECT d.deceased_id, d.case_id FROM deceased_persons d
LEFT JOIN cases c ON d.case_id = c.case_id
WHERE c.case_id IS NULL;
`

**MLEF forms with invalid case_id:**
`sql
SELECT m.mlef_id, m.case_id FROM mlef_forms m
LEFT JOIN cases c ON m.case_id = c.case_id
WHERE m.case_id IS NOT NULL AND c.case_id IS NULL;
`

**PM reports with invalid notification_id:**
`sql
SELECT pm.pm_report_id, pm.notification_id FROM postmortem_reports pm
LEFT JOIN autopsy_notifications an ON pm.notification_id = an.notification_id
WHERE pm.notification_id IS NOT NULL AND an.notification_id IS NULL;
`

**PM findings with invalid pm_report_id:**
`sql
SELECT f.finding_id FROM postmortem_findings f
LEFT JOIN postmortem_reports pm ON f.pm_report_id = pm.pm_report_id
WHERE f.pm_report_id IS NOT NULL AND pm.pm_report_id IS NULL;
`

**Wards with invalid hospital_id:**
`sql
SELECT w.ward_id FROM wards w
LEFT JOIN hospitals h ON w.hospital_id = h.hospital_id
WHERE w.hospital_id IS NOT NULL AND h.hospital_id IS NULL;
`

**Medical officers with invalid hospital:**
`sql
SELECT mo.mo_id FROM medical_officers mo
LEFT JOIN hospitals h ON mo.hospital_id = h.hospital_id
WHERE mo.hospital_id IS NOT NULL AND h.hospital_id IS NULL;
`

**Injuries with invalid case_id:**
`sql
SELECT i.injury_id FROM injuries i
LEFT JOIN cases c ON i.case_id = c.case_id
WHERE i.case_id IS NOT NULL AND c.case_id IS NULL;
`

**Specimens with invalid case_id:**
`sql
SELECT s.specimen_id FROM specimens s
LEFT JOIN cases c ON s.case_id = c.case_id
WHERE s.case_id IS NOT NULL AND c.case_id IS NULL;
`

**Expected for all:** Empty result.

---

## SECTION 4: SECURITY VERIFICATION

### 4.1  Verify passwords are hashed (NOT plaintext)

`sql
SELECT user_id, username, password_hash FROM users;
`

**Expected:** password_hash starts with $2b$ — the bcrypt identifier and cost factor:
`
...
`

**Failure (dangerous):** Seeing readable text like dmin123 or password — hashing is broken.

---

### 4.2  Verify nic_no and cause_of_death are encrypted (BYTEA)

`sql
SELECT deceased_id, full_name, nic_no FROM deceased_persons LIMIT 5;
`

**Expected:** 
ic_no shows as a hex string in psql:
`
\x674141414141426344...
`
This is the raw Fernet ciphertext stored as BYTEA. You cannot read the actual NIC number.

**Failure:** Seeing readable NIC numbers like 199012345678 → application-layer encryption not applied.

`sql
SELECT notification_id, cause_of_death_immediate FROM autopsy_notifications LIMIT 5;
`
Same rule — should be \x... hex, not readable text.

---

### 4.3  Test audit log after a manual operation

**Step 1 — Set the app user ID and insert (simulating FastAPI):**
`sql
BEGIN;
SET LOCAL app.current_user_id = '1';
INSERT INTO cases (case_type_id, inquest_no, status, opened_date)
VALUES (1, 'TEST-AUDIT-99', 'OPEN', CURRENT_DATE);
COMMIT;
`

**Step 2 — Immediately check the audit log:**
`sql
SELECT log_id, user_id, table_name, record_id, action, timestamp, new_value
FROM   audit_log
ORDER  BY timestamp DESC
LIMIT  1;
`

**Expected:**
`
 log_id | user_id | table_name | record_id | action |      timestamp       |    new_value
--------+---------+------------+-----------+--------+----------------------+----------------
      1 |       1 | Cases      | 42        | INSERT | 2024-07-23 14:35:00  | {"case_id":42,...}
`
- user_id = 1 (what you set with SET LOCAL)
- ction = 'INSERT'
- 
ew_value = JSON of the inserted row

**Step 3 — Test UPDATE logging:**
`sql
BEGIN;
SET LOCAL app.current_user_id = '1';
UPDATE cases SET status = 'CLOSED' WHERE inquest_no = 'TEST-AUDIT-99';
COMMIT;
`
Then check audit_log — expect a new row with ction = 'UPDATE', old_value showing status = OPEN, 
ew_value showing status = CLOSED.

**Failure (no rows appear):** The 	rg_cases_audit_trigger was not created. Re-run schema.sql.

---

## SECTION 5: RBAC AND PERMISSIONS TABLE CHECK

### 5.1  List all roles

`sql
SELECT role_id, role_name FROM roles ORDER BY role_id;
`

**Expected — exactly 6 rows:**
`
 role_id | role_name
---------+--------------
       1 | Admin
       2 | JMO
       3 | Registrar
       4 | Police
       5 | Records Clerk
       6 | Auditor
`

---

### 5.2  List users with their assigned roles

`sql
SELECT
    u.user_id,
    u.username,
    u.is_active,
    STRING_AGG(r.role_name, ', ' ORDER BY r.role_name) AS roles
FROM users u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id
LEFT JOIN roles      r  ON ur.role_id = r.role_id
GROUP BY u.user_id, u.username, u.is_active
ORDER BY u.user_id;
`

**Expected:** At minimum the dmin user with role Admin.

---

### 5.3  List all permissions per role

`sql
SELECT
    r.role_name,
    p.table_name,
    p.can_read,
    p.can_write,
    p.can_delete
FROM permissions p
JOIN roles r ON p.role_id = r.role_id
ORDER BY r.role_name, p.table_name;
`

**Expected permission matrix:**
| Role | can_read | can_write | can_delete |
|---|---|---|---|
| Admin | TRUE | TRUE | TRUE |
| JMO | TRUE | TRUE | FALSE |
| Registrar | TRUE | TRUE | FALSE |
| Police | TRUE | TRUE | FALSE |
| Records Clerk | TRUE | TRUE | FALSE |
| Auditor | TRUE | FALSE | FALSE |

**Failure:** Empty result → Permissions table not seeded. Seed it via the admin UI or directly:
`sql
-- Example: give Auditor read-only on all tables
INSERT INTO permissions (role_id, table_name, can_read, can_write, can_delete)
SELECT r.role_id, 'cases', TRUE, FALSE, FALSE
FROM   roles r WHERE r.role_name = 'Auditor';
`

---

### 5.4  Simulate a JMO-scoped query

Find a JMO's mo_id:
`sql
SELECT mo_id, full_name FROM medical_officers LIMIT 3;
`

Run the scoped query (replace 1 with the mo_id):
`sql
-- What a JMO sees through the API (scoped to their mo_id)
SELECT pm.pm_report_id, pm.inquest_no, pm.exam_date, pm.exam_place
FROM   postmortem_reports pm
WHERE  pm.mo_id = 1;
`

Compare to unscoped admin view:
`sql
SELECT pm.pm_report_id, pm.mo_id, pm.inquest_no FROM postmortem_reports pm;
`

**Expected:** Scoped query returns a subset. If both queries return the same rows, either all PM reports belong to MO #1 or the scoping logic needs review.

---

### 5.5  Simulate a Police-scoped query

Find a station_id:
`sql
SELECT station_id, name FROM police_stations LIMIT 3;
`

Run scoped query (replace 1 with station_id):
`sql
SELECT c.case_id, c.inquest_no, c.status, c.opened_date
FROM   cases c
JOIN   mlef_forms m ON c.case_id = m.case_id
JOIN   police_officers po ON m.police_officer_id = po.officer_id
WHERE  po.station_id = 1;
`

**Expected:** Only cases where the linked MLEF form was submitted by an officer from station 1.

---

## SECTION 6: STORED PROCEDURES, TRIGGERS, AND VIEWS

### 6.1  List all active triggers

`sql
SELECT
    trigger_name,
    event_object_table AS attached_to,
    event_manipulation AS fires_on,
    action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table;
`

**Expected:**
`
        trigger_name        | attached_to | fires_on | action_timing
----------------------------+-------------+----------+---------------
 trg_cases_audit_trigger    | cases       | INSERT   | AFTER
 trg_cases_audit_trigger    | cases       | UPDATE   | AFTER
 trg_cases_audit_trigger    | cases       | DELETE   | AFTER
`
(One row per event because INSERT OR UPDATE OR DELETE becomes 3 rows in information_schema.triggers)

**Failure:** Empty result → trigger was not created. Re-run schema.sql.

---

### 6.2  List all stored functions

`sql
SELECT routine_name, routine_type, data_type AS return_type
FROM   information_schema.routines
WHERE  routine_schema = 'public'
ORDER  BY routine_name;
`

**Expected:**
`
  routine_name    | routine_type | return_type
------------------+--------------+-------------
 trg_cases_audit  | FUNCTION     | trigger
`

To view the full function source:
`sql
SELECT prosrc FROM pg_proc WHERE proname = 'trg_cases_audit';
`

---

### 6.3  End-to-end trigger test (without FastAPI)

`sql
-- Step 1: count current rows in audit_log
SELECT COUNT(*) FROM audit_log;

-- Step 2: insert a case (no user ID — simulates direct psql access)
INSERT INTO cases (inquest_no, status, opened_date)
VALUES ('TEST-TRIGGER-01', 'OPEN', CURRENT_DATE);

-- Step 3: check audit_log increased by 1
SELECT log_id, user_id, table_name, record_id, action, new_value
FROM   audit_log
ORDER  BY timestamp DESC LIMIT 1;
`

**Expected:** New row with ction = INSERT, user_id = NULL (because we did not call SET LOCAL app.current_user_id).

Now test with user_id:
`sql
BEGIN;
SET LOCAL app.current_user_id = '1';
UPDATE cases SET status = 'PENDING' WHERE inquest_no = 'TEST-TRIGGER-01';
COMMIT;

SELECT user_id, action, old_value->>'status', new_value->>'status'
FROM   audit_log ORDER BY timestamp DESC LIMIT 1;
`

**Expected:** user_id = 1, ction = UPDATE, old status = OPEN, new status = PENDING.

---

### 6.4  Test the Case_Summary_View

`sql
-- Should work — all columns are safe
SELECT case_id, inquest_no, status, type_name, trial_date, days_open,
       deceased_count, injured_count
FROM   Case_Summary_View
LIMIT  10;
`

**Verify sensitive columns are NOT accessible through the view:**
`sql
-- This MUST fail with "column does not exist"
SELECT nic_no FROM Case_Summary_View LIMIT 1;
`
`sql
SELECT cause_of_death_immediate FROM Case_Summary_View LIMIT 1;
`

**Expected error for both:**
`
ERROR:  column "nic_no" does not exist
`

---

### 6.5  30-day overdue notification query

Run this to find cases open more than 30 days with no PM report filed:

`sql
SELECT
    c.case_id,
    c.inquest_no,
    c.opened_date,
    (CURRENT_DATE - c.opened_date) AS days_open,
    c.status
FROM cases c
WHERE c.status NOT IN ('CLOSED', 'COMPLETED')
  AND (CURRENT_DATE - c.opened_date) > 30
  AND c.case_id NOT IN (
      SELECT DISTINCT an.case_id
      FROM   autopsy_notifications an
      JOIN   postmortem_reports pm ON an.notification_id = pm.notification_id
      WHERE  an.case_id IS NOT NULL
  )
ORDER BY days_open DESC;
`

**Expected:** Lists any genuinely overdue open cases. If your seed data is recent, change > 30 to > 0 to force output and test the query logic.

---

## Quick Reference: psql Meta-Commands

| Command | What it does |
|---|---|
| \dt | List all tables |
| \d tablename | Describe columns + constraints |
| \dv | List all views |
| \df | List all functions |
| \dy | List all trigger definitions |
| \conninfo | Show current connection |
| \q | Quit |
