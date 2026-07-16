-- database/schema.sql

CREATE DATABASE IF NOT EXISTS fmcms;
USE fmcms;

-- SUBSYSTEM 5: System Administration (Users and Roles first due to FKs)
CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    locked_until DATETIME DEFAULT NULL
);

CREATE TABLE User_Roles (
    user_id INT,
    role_id INT,
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);

CREATE TABLE Permissions (
    permission_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    table_name VARCHAR(100) NOT NULL,
    can_read BOOLEAN DEFAULT FALSE,
    can_write BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);

CREATE TABLE Audit_Log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    action VARCHAR(10) NOT NULL, -- SELECT, INSERT, UPDATE, DELETE
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    old_value JSON,
    new_value JSON,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- SUBSYSTEM 1: Case & Persons
CREATE TABLE Case_Types (
    case_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Cases (
    case_id INT AUTO_INCREMENT PRIMARY KEY,
    case_type_id INT,
    inquest_no VARCHAR(100),
    court_case_no VARCHAR(100),
    status VARCHAR(50),
    opened_date DATE NOT NULL,
    FOREIGN KEY (case_type_id) REFERENCES Case_Types(case_type_id) ON DELETE RESTRICT
);

CREATE TABLE Deceased_Persons (
    deceased_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    full_name VARCHAR(255),
    nic_no VARBINARY(255), -- Encrypted at application layer
    age INT CHECK (age >= 0),
    sex VARCHAR(20) CHECK (sex IN ('Male', 'Female', 'Other', 'Unknown')),
    address TEXT,
    date_of_admission DATE,
    date_of_death DATE,
    place_of_death VARCHAR(255),
    CHECK (date_of_death >= date_of_admission),
    FOREIGN KEY (case_id) REFERENCES Cases(case_id) ON DELETE RESTRICT
);

CREATE TABLE Injured_Persons (
    injured_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    full_name VARCHAR(255),
    nic_no VARBINARY(255), -- Encrypted at application layer
    age INT CHECK (age >= 0),
    sex VARCHAR(20) CHECK (sex IN ('Male', 'Female', 'Other', 'Unknown')),
    address TEXT,
    date_of_admission DATE,
    FOREIGN KEY (case_id) REFERENCES Cases(case_id) ON DELETE RESTRICT
);

-- SUBSYSTEM 2: Institutions & Personnel
CREATE TABLE Hospitals (
    hospital_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    contact_no VARCHAR(50)
);

CREATE TABLE Wards (
    ward_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT,
    ward_name VARCHAR(100),
    ward_type VARCHAR(100),
    FOREIGN KEY (hospital_id) REFERENCES Hospitals(hospital_id) ON DELETE CASCADE
);

CREATE TABLE Police_Stations (
    station_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    division VARCHAR(100),
    contact_no VARCHAR(50)
);

CREATE TABLE Police_Officers (
    officer_id INT AUTO_INCREMENT PRIMARY KEY,
    station_id INT,
    name VARCHAR(255) NOT NULL,
    rank VARCHAR(100),
    reg_no VARCHAR(100),
    FOREIGN KEY (station_id) REFERENCES Police_Stations(station_id) ON DELETE SET NULL
);

CREATE TABLE Courts (
    court_id INT AUTO_INCREMENT PRIMARY KEY,
    court_name VARCHAR(255) NOT NULL,
    district VARCHAR(100),
    jurisdiction_level VARCHAR(100)
);

CREATE TABLE Magistrates (
    magistrate_id INT AUTO_INCREMENT PRIMARY KEY,
    court_id INT,
    name VARCHAR(255) NOT NULL,
    appointment_no VARCHAR(100),
    FOREIGN KEY (court_id) REFERENCES Courts(court_id) ON DELETE SET NULL
);

CREATE TABLE Medical_Officers (
    mo_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    slmc_reg_no VARCHAR(100),
    qualification VARCHAR(255),
    designation VARCHAR(100),
    hospital_id INT,
    user_id INT,
    FOREIGN KEY (hospital_id) REFERENCES Hospitals(hospital_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- SUBSYSTEM 3: Examination & Autopsy Records
CREATE TABLE Autopsy_Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    hospital_id INT,
    inquirer_name VARCHAR(255),
    magistrate_id INT,
    pm_serial_no VARCHAR(100) UNIQUE,
    date_of_death DATE,
    cause_of_death_immediate VARBINARY(512), -- Encrypted
    cause_of_death_antecedent VARBINARY(512), -- Encrypted
    contributory_causes TEXT,
    FOREIGN KEY (case_id) REFERENCES Cases(case_id) ON DELETE RESTRICT,
    FOREIGN KEY (hospital_id) REFERENCES Hospitals(hospital_id) ON DELETE SET NULL,
    FOREIGN KEY (magistrate_id) REFERENCES Magistrates(magistrate_id) ON DELETE SET NULL
);

CREATE TABLE PostMortem_Reports (
    pm_report_id INT AUTO_INCREMENT PRIMARY KEY,
    notification_id INT,
    mo_id INT,
    inquest_no VARCHAR(100),
    exam_date DATE,
    exam_place VARCHAR(255),
    verdict TEXT,
    cause_of_death_final TEXT,
    FOREIGN KEY (notification_id) REFERENCES Autopsy_Notifications(notification_id) ON DELETE CASCADE,
    FOREIGN KEY (mo_id) REFERENCES Medical_Officers(mo_id) ON DELETE RESTRICT
);

CREATE TABLE PostMortem_Findings (
    finding_id INT AUTO_INCREMENT PRIMARY KEY,
    pm_report_id INT,
    body_region VARCHAR(100),
    description TEXT,
    is_natural_opening BOOLEAN DEFAULT FALSE,
    ordinal_no INT,
    FOREIGN KEY (pm_report_id) REFERENCES PostMortem_Reports(pm_report_id) ON DELETE CASCADE
);

CREATE TABLE MLEF_Forms (
    mlef_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    examinee_type VARCHAR(50) CHECK (examinee_type IN ('injured', 'deceased')),
    mo_id INT,
    police_officer_id INT,
    reg_no VARCHAR(100),
    exam_datetime DATETIME,
    category_of_hurt VARCHAR(100),
    FOREIGN KEY (case_id) REFERENCES Cases(case_id) ON DELETE RESTRICT,
    FOREIGN KEY (mo_id) REFERENCES Medical_Officers(mo_id) ON DELETE RESTRICT,
    FOREIGN KEY (police_officer_id) REFERENCES Police_Officers(officer_id) ON DELETE SET NULL
);

CREATE TABLE Court_Certificates (
    cert_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    court_id INT,
    pm_report_id INT,
    trial_date DATE,
    dispatch_date DATE,
    registrar_signature_ref VARCHAR(255),
    FOREIGN KEY (case_id) REFERENCES Cases(case_id) ON DELETE RESTRICT,
    FOREIGN KEY (court_id) REFERENCES Courts(court_id) ON DELETE RESTRICT,
    FOREIGN KEY (pm_report_id) REFERENCES PostMortem_Reports(pm_report_id) ON DELETE SET NULL
);

-- SUBSYSTEM 4: Injuries & Forensic Detail
CREATE TABLE Injuries (
    injury_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    mlef_id INT,
    body_site VARCHAR(255),
    nature VARCHAR(255),
    size_shape VARCHAR(255),
    severity_grievous_flag BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (case_id) REFERENCES Cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (mlef_id) REFERENCES MLEF_Forms(mlef_id) ON DELETE CASCADE
);

CREATE TABLE Injury_Causes (
    cause_id INT AUTO_INCREMENT PRIMARY KEY,
    injury_id INT,
    weapon_type VARCHAR(100) CHECK (weapon_type IN ('blunt', 'sharp', 'firearm', 'burn', 'bite', 'other')),
    description TEXT,
    FOREIGN KEY (injury_id) REFERENCES Injuries(injury_id) ON DELETE CASCADE
);

CREATE TABLE Body_Diagram_Marks (
    mark_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    diagram_ref VARCHAR(255),
    coordinate_x FLOAT,
    coordinate_y FLOAT,
    annotation TEXT,
    FOREIGN KEY (case_id) REFERENCES Cases(case_id) ON DELETE CASCADE
);

CREATE TABLE Specimens (
    specimen_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    specimen_type VARCHAR(100),
    date_retained DATE,
    purpose TEXT,
    FOREIGN KEY (case_id) REFERENCES Cases(case_id) ON DELETE CASCADE
);

CREATE TABLE Specimen_Investigations (
    investigation_id INT AUTO_INCREMENT PRIMARY KEY,
    specimen_id INT,
    lab_name VARCHAR(255),
    test_type VARCHAR(100) CHECK (test_type IN ('histology', 'serology', 'toxicology', 'other')),
    result TEXT,
    result_date DATE,
    FOREIGN KEY (specimen_id) REFERENCES Specimens(specimen_id) ON DELETE CASCADE
);

-- REMAINING FROM SUBSYSTEM 5
CREATE TABLE Case_Documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT,
    doc_type VARCHAR(100),
    file_path VARCHAR(255),
    uploaded_by INT,
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    hash_checksum VARCHAR(256),
    FOREIGN KEY (case_id) REFERENCES Cases(case_id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- VIEWS
CREATE VIEW Case_Summary_View AS
SELECT 
    c.case_id, 
    c.inquest_no, 
    c.court_case_no, 
    c.status, 
    c.opened_date,
    ct.type_name,
    cc.trial_date
FROM Cases c
LEFT JOIN Case_Types ct ON c.case_type_id = ct.case_type_id
LEFT JOIN Court_Certificates cc ON c.case_id = cc.case_id;

-- TRIGGERS for Audit Log
-- The triggers below capture basic INSERT/UPDATE/DELETE actions for the Cases table.
-- They rely on MySQL user variables (@app_user_id, @app_ip_address) set by the application 
-- right before executing a query to accurately capture user context in the audit log.
DELIMITER //

CREATE TRIGGER trg_cases_insert AFTER INSERT ON Cases
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Log (user_id, table_name, record_id, action, ip_address, new_value)
    VALUES (
        @app_user_id, 
        'Cases', 
        NEW.case_id, 
        'INSERT', 
        @app_ip_address, 
        JSON_OBJECT('case_type_id', NEW.case_type_id, 'inquest_no', NEW.inquest_no, 'court_case_no', NEW.court_case_no, 'status', NEW.status, 'opened_date', NEW.opened_date)
    );
END//

CREATE TRIGGER trg_cases_update AFTER UPDATE ON Cases
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Log (user_id, table_name, record_id, action, ip_address, old_value, new_value)
    VALUES (
        @app_user_id, 
        'Cases', 
        NEW.case_id, 
        'UPDATE', 
        @app_ip_address,
        JSON_OBJECT('case_type_id', OLD.case_type_id, 'inquest_no', OLD.inquest_no, 'court_case_no', OLD.court_case_no, 'status', OLD.status, 'opened_date', OLD.opened_date),
        JSON_OBJECT('case_type_id', NEW.case_type_id, 'inquest_no', NEW.inquest_no, 'court_case_no', NEW.court_case_no, 'status', NEW.status, 'opened_date', NEW.opened_date)
    );
END//

CREATE TRIGGER trg_cases_delete AFTER DELETE ON Cases
FOR EACH ROW
BEGIN
    INSERT INTO Audit_Log (user_id, table_name, record_id, action, ip_address, old_value)
    VALUES (
        @app_user_id, 
        'Cases', 
        OLD.case_id, 
        'DELETE', 
        @app_ip_address,
        JSON_OBJECT('case_type_id', OLD.case_type_id, 'inquest_no', OLD.inquest_no, 'court_case_no', OLD.court_case_no, 'status', OLD.status, 'opened_date', OLD.opened_date)
    );
END//

DELIMITER ;
