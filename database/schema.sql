-- Forensic Medicine Department Database Schema
-- Generated as part of the initial proposal

CREATE DATABASE IF NOT EXISTS forensic_db;
USE forensic_db;

-- --------------------------------------------------------
-- CORE ENTITIES
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS PATIENT (
    PatientID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    Address TEXT,
    DOB DATE,
    Age INT,
    Sex ENUM('Male', 'Female', 'Other'),
    NIC VARCHAR(20) UNIQUE
);

CREATE TABLE IF NOT EXISTS `CASE` (
    CaseID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT NOT NULL,
    CaseNumber VARCHAR(50) UNIQUE NOT NULL,
    CaseType ENUM('clinical', 'autopsy') NOT NULL,
    IncidentDate DATE,
    IncidentLocation VARCHAR(255),
    PoliceStation VARCHAR(100),
    CourtName VARCHAR(100),
    FOREIGN KEY (PatientID) REFERENCES PATIENT(PatientID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS MLEF (
    MLEFID INT AUTO_INCREMENT PRIMARY KEY,
    CaseID INT UNIQUE NOT NULL,
    SerialNo VARCHAR(50) UNIQUE,
    DateOfIssue DATE,
    ReasonForReferral TEXT,
    IssuingOfficerName VARCHAR(100),
    IssuingOfficerRegNo VARCHAR(50),
    FOREIGN KEY (CaseID) REFERENCES `CASE`(CaseID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS DOCTOR (
    DoctorID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Qualifications TEXT,
    SLMCRegNo VARCHAR(50) UNIQUE,
    Designation VARCHAR(100),
    Station VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS CLINICAL_EXAM (
    ExamID INT AUTO_INCREMENT PRIMARY KEY,
    MLEFID INT UNIQUE NOT NULL,
    DoctorID INT,
    HospitalName VARCHAR(255),
    Ward VARCHAR(50),
    BHTNo VARCHAR(50),
    AdmissionDate DATE,
    ExamDate DATE,
    DischargeDate DATE,
    CategoryOfHurt ENUM('grievous', 'non-grievous'),
    FatalOrdinaryCourse BOOLEAN,
    AlcoholStatus VARCHAR(100),
    DrugStatus VARCHAR(100),
    SexualAssaultHistory TEXT,
    FOREIGN KEY (MLEFID) REFERENCES MLEF(MLEFID) ON DELETE CASCADE,
    FOREIGN KEY (DoctorID) REFERENCES DOCTOR(DoctorID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS COURT_ORDER (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    CaseID INT NOT NULL,
    OrderType VARCHAR(100),
    MagistrateName VARCHAR(100),
    DateIssued DATE,
    FOREIGN KEY (CaseID) REFERENCES `CASE`(CaseID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS POSTMORTEM (
    PMID INT AUTO_INCREMENT PRIMARY KEY,
    CaseID INT NOT NULL,
    OrderID INT UNIQUE,
    DoctorID INT,
    PMSerialNo VARCHAR(50) UNIQUE,
    ExamDate DATE,
    CauseOfDeath TEXT,
    FOREIGN KEY (CaseID) REFERENCES `CASE`(CaseID) ON DELETE CASCADE,
    FOREIGN KEY (OrderID) REFERENCES COURT_ORDER(OrderID) ON DELETE SET NULL,
    FOREIGN KEY (DoctorID) REFERENCES DOCTOR(DoctorID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS INJURY (
    InjuryID INT AUTO_INCREMENT PRIMARY KEY,
    ExamID INT,
    PMID INT,
    ItemNo INT,
    NatureDescription TEXT,
    SiteOnBody VARCHAR(255),
    WeaponType ENUM('blunt', 'sharp', 'firearm', 'explosive', 'other'),
    CategoryOfHurt ENUM('grievous', 'non-grievous'),
    FOREIGN KEY (ExamID) REFERENCES CLINICAL_EXAM(ExamID) ON DELETE CASCADE,
    FOREIGN KEY (PMID) REFERENCES POSTMORTEM(PMID) ON DELETE CASCADE,
    CONSTRAINT chk_injury_link CHECK (
        (ExamID IS NOT NULL AND PMID IS NULL) OR 
        (ExamID IS NULL AND PMID IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS INVESTIGATION (
    InvestigationID INT AUTO_INCREMENT PRIMARY KEY,
    ExamID INT NOT NULL,
    Type ENUM('xray', 'CT', 'toxicology', 'histology') NOT NULL,
    Result TEXT,
    DateDone DATE,
    FOREIGN KEY (ExamID) REFERENCES CLINICAL_EXAM(ExamID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS REFERRAL (
    ReferralID INT AUTO_INCREMENT PRIMARY KEY,
    ExamID INT NOT NULL,
    Department VARCHAR(100),
    Reason TEXT,
    FOREIGN KEY (ExamID) REFERENCES CLINICAL_EXAM(ExamID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS REPORT (
    ReportID INT AUTO_INCREMENT PRIMARY KEY,
    CaseID INT NOT NULL,
    DoctorID INT,
    MLEF_PM_No VARCHAR(50),
    SerialNo VARCHAR(50) UNIQUE,
    ExamDate DATE,
    DispatchDate DATE,
    Status ENUM('pending', 'issued') DEFAULT 'pending',
    FOREIGN KEY (CaseID) REFERENCES `CASE`(CaseID) ON DELETE CASCADE,
    FOREIGN KEY (DoctorID) REFERENCES DOCTOR(DoctorID) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS REPORT_OPINION (
    OpinionID INT AUTO_INCREMENT PRIMARY KEY,
    ReportID INT UNIQUE NOT NULL,
    NonGrievousCount INT DEFAULT 0,
    GrievousCount INT DEFAULT 0,
    PenalCodeSection VARCHAR(100),
    FatalCount INT DEFAULT 0,
    BluntCount INT DEFAULT 0,
    CutCount INT DEFAULT 0,
    SharpCount INT DEFAULT 0,
    StabCount INT DEFAULT 0,
    FirearmCount INT DEFAULT 0,
    BurnCount INT DEFAULT 0,
    BiteCount INT DEFAULT 0,
    LiquorSmell BOOLEAN,
    LiquorInfluence BOOLEAN,
    FOREIGN KEY (ReportID) REFERENCES REPORT(ReportID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CERTIFICATE_OF_RECEIPT (
    CertID INT AUTO_INCREMENT PRIMARY KEY,
    ReportID INT UNIQUE NOT NULL,
    CourtName VARCHAR(100),
    CaseNumber VARCHAR(50),
    DateOfTrial DATE,
    ReceivedDate DATE,
    FOREIGN KEY (ReportID) REFERENCES REPORT(ReportID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS COURT_SUMMONS (
    SummonsID INT AUTO_INCREMENT PRIMARY KEY,
    CaseID INT NOT NULL,
    DoctorID INT,
    CourtName VARCHAR(100),
    HearingDate DATE,
    HearingTime TIME,
    RegistrarName VARCHAR(100),
    FOREIGN KEY (CaseID) REFERENCES `CASE`(CaseID) ON DELETE CASCADE,
    FOREIGN KEY (DoctorID) REFERENCES DOCTOR(DoctorID) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- ADDITIONAL REQUIRED ENTITIES
-- --------------------------------------------------------

-- Used for authentication based on role
CREATE TABLE IF NOT EXISTS SYSTEM_USER (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('doctor', 'clerk', 'admin', 'researcher') NOT NULL,
    DoctorID INT UNIQUE,
    FOREIGN KEY (DoctorID) REFERENCES DOCTOR(DoctorID) ON DELETE SET NULL
);

-- Used for audit logging
CREATE TABLE IF NOT EXISTS AUDIT_LOG (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    TableName VARCHAR(50),
    Operation ENUM('INSERT', 'UPDATE', 'DELETE'),
    RecordID INT,
    UserID INT,
    LogTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Details TEXT,
    FOREIGN KEY (UserID) REFERENCES SYSTEM_USER(UserID) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- VIEWS
-- --------------------------------------------------------

CREATE VIEW pending_reports_view AS
SELECT 
    r.ReportID, 
    c.CaseNumber, 
    d.Name AS DoctorName, 
    r.ExamDate, 
    r.Status,
    DATEDIFF(CURRENT_DATE, r.ExamDate) AS DaysPending
FROM REPORT r
JOIN `CASE` c ON r.CaseID = c.CaseID
LEFT JOIN DOCTOR d ON r.DoctorID = d.DoctorID
WHERE r.Status = 'pending' AND DATEDIFF(CURRENT_DATE, r.ExamDate) > 30;

CREATE VIEW monthly_case_stats_view AS
SELECT 
    YEAR(IncidentDate) AS Year,
    MONTH(IncidentDate) AS Month,
    CaseType,
    COUNT(*) AS TotalCases
FROM `CASE`
GROUP BY YEAR(IncidentDate), MONTH(IncidentDate), CaseType;

-- --------------------------------------------------------
-- TRIGGERS & PROCEDURES
-- --------------------------------------------------------

DELIMITER //

-- Procedure: Create a Case and Patient in one transaction
CREATE PROCEDURE CreatePatientAndCase (
    IN p_FullName VARCHAR(255),
    IN p_Address TEXT,
    IN p_DOB DATE,
    IN p_Age INT,
    IN p_Sex ENUM('Male', 'Female', 'Other'),
    IN p_NIC VARCHAR(20),
    IN c_CaseNumber VARCHAR(50),
    IN c_CaseType ENUM('clinical', 'autopsy'),
    IN c_IncidentDate DATE,
    IN c_IncidentLocation VARCHAR(255),
    IN c_PoliceStation VARCHAR(100),
    IN c_CourtName VARCHAR(100)
)
BEGIN
    DECLARE new_patient_id INT;
    DECLARE exit handler for sqlexception
    BEGIN
        ROLLBACK;
    END;

    START TRANSACTION;

    INSERT INTO PATIENT (FullName, Address, DOB, Age, Sex, NIC)
    VALUES (p_FullName, p_Address, p_DOB, p_Age, p_Sex, p_NIC);
    
    SET new_patient_id = LAST_INSERT_ID();

    INSERT INTO `CASE` (PatientID, CaseNumber, CaseType, IncidentDate, IncidentLocation, PoliceStation, CourtName)
    VALUES (new_patient_id, c_CaseNumber, c_CaseType, c_IncidentDate, c_IncidentLocation, c_PoliceStation, c_CourtName);

    COMMIT;
END //

-- Triggers for Audit Logging (Examples on REPORT table)
CREATE TRIGGER after_report_insert
AFTER INSERT ON REPORT
FOR EACH ROW
BEGIN
    -- Normally we'd use connection variables (@current_user_id) to log who did it
    INSERT INTO AUDIT_LOG (TableName, Operation, RecordID, Details)
    VALUES ('REPORT', 'INSERT', NEW.ReportID, CONCAT('New report added for CaseID: ', NEW.CaseID));
END //

CREATE TRIGGER after_report_update
AFTER UPDATE ON REPORT
FOR EACH ROW
BEGIN
    INSERT INTO AUDIT_LOG (TableName, Operation, RecordID, Details)
    VALUES ('REPORT', 'UPDATE', NEW.ReportID, CONCAT('Report status updated to: ', NEW.Status));
END //

-- Note regarding the 30-day pending report notification trigger:
-- Standard MySQL triggers execute on INSERT, UPDATE, or DELETE operations. 
-- They cannot "wake up" after 30 days.
-- Instead, the `pending_reports_view` fulfills the system's ability to check for these 
-- reports. A notification can be raised by the application logic polling this view,
-- or by adding an EVENT (scheduled task) in MySQL that queries the view daily.
CREATE EVENT check_pending_reports
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    -- Logic to push notification, usually application layer handles emailing / UI alerts
    -- based on the pending_reports_view. This event acts as a placeholder for DB-level jobs.
END //

DELIMITER ;
