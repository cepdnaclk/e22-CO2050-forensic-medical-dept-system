# FMDIS - Forensic Medical Department Information System

A web-based information system designed to digitize and streamline the
operations of a hospital forensic medical department. The system manages
the complete medico-legal workflow — from initial case registration and
patient examination through post-mortem reporting, specimen tracking,
and court document dispatch.

---

## Background

Forensic medical departments currently rely on a large number of
physical paper forms including Medico-Legal Examination Forms (MLEF),
Post-Mortem Reports, Medico-Legal Reports (Form 1135), Autopsy
Notification Forms (Health 1328), Court Summons, and Certificates of
Receipt. Managing these manually leads to data redundancy, slow
retrieval, poor security, and difficulties in court report tracking.

FMDIS replaces this paper-based system with a secure, structured
database-driven web application.

---

## Features

- **Case Management** — Register and track forensic cases with full
  lifecycle status (Open / Pending / Closed)
- **Patient Records** — Maintain patient demographics, BHT numbers,
  admission and discharge details
- **MLEF Module** — Digital Medico-Legal Examination Forms with
  injury classification, alcohol/drug examination, and sexual assault
  examination fields
- **Post-Mortem Reports** — Structured entry covering external and
  internal examination findings, cause-of-death chain (Ia/Ib/Ic/Id/II),
  and toxicology results
- **Medico-Legal Reports** — Generate and track Form 1135 reports
  dispatched to courts
- **Autopsy Notification** — Manage Health 1328 forms with specimen
  retention and maternal death classification
- **Court Document Tracking** — Track court summons, trial dates, and
  certificates of receipt with automated overdue flagging
- **Specimen Management** — Record specimen collection, storage
  location, and laboratory results (histology, serology, toxicology)
- **Role-Based Access Control** — Separate access levels for Medical
  Officers, Administrative Staff, Police Liaison Officers, and the DBA
- **Audit Trail** — Tamper-evident logging of all data operations with
  user ID, timestamp, and action type

---

## System Modules

| Module | Description |
|---|---|
| Dashboard | Summary statistics and pending task overview |
| Cases | Create, view, and manage forensic cases |
| Patients | Patient registration and record management |
| MLEF | Medico-Legal Examination Form entry and tracking |
| Post-Mortem Reports | Post-mortem examination report management |
| Medico-Legal Reports | Form 1135 generation and court dispatch tracking |
| Autopsy Notifications | Health 1328 form management |
| Court Documents | Summons, receipts, and trial date tracking |
| Specimens | Specimen collection and laboratory result tracking |
| Investigations | Investigation record management |
| User Management | Role and permission management (DBA only) |
| Audit Log | System-wide activity log (DBA only) |

---

## Database

The system uses a relational database with 14 tables:

- DEPARTMENT
- DOCTOR
- PATIENT
- CASE_RECORD
- POSTMORTEM_REPORT
- MLEF
- MEDICO_LEGAL_REPORT
- AUTOPSY_NOTIFICATION
- POLICE_REQUEST
- COURT_SUMMONS
- COURT_RECEIPT
- SPECIMEN
- INVESTIGATION
- AUDIT_LOG

---

## User Roles

| Role | Access |
|---|---|
| Medical Officer | Clinical modules — MLEF, Post-Mortem, Forensic Reports |
| Administrative Staff | Case registration, court dispatch, police requests |
| Police Liaison Officer | Submit requests, track report status |
| DBA | Full system access, user management, audit log |

---

## Project Structure
