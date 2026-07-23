---
layout: home
permalink: index.html
repository-name: e22-co225-fmdis
title: Forensic Medical Department Information System
---

# Forensic Medical Department Information System (FMDIS)

---

## Team
- E/22/052, K.H.D.M. Bimsara
- E/22/353, G.K.G. Sandeepa
- E/22/419, R.G.S.T. Weerasekara
- E/22/058, M.M.T. Cooray

## Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture)
3. [System Modules](#system-modules)
4. [Database Design](#database-design)
5. [User Roles](#user-roles)
6. [Links](#links)

---

## Introduction

Hospital forensic medical departments manage a large volume of
sensitive medico-legal documents including Medico-Legal Examination
Forms (MLEF), Post-Mortem Reports, Medico-Legal Reports (Form 1135),
Autopsy Notification Forms (Health 1328), Court Summons, and
Certificates of Receipt. Currently these are maintained entirely on
paper, leading to critical problems including data redundancy,
slow retrieval, poor security, difficulty in enforcing confidentiality,
and no reliable audit trail for medico-legal chain-of-custody purposes.

FMDIS is a full-stack web application that digitizes and centralizes
the entire forensic medical workflow — from initial case registration
and patient examination through post-mortem reporting, specimen
tracking, and court document dispatch. The system introduces structured
data management, role-based access control, and a tamper-evident audit
log that satisfies medico-legal chain-of-custody requirements.

---

## Solution Architecture

The system is built as a three-tier web application:

- **Frontend** - React (Vite) with Tailwind CSS, deployed on Vercel
- **Backend** - FastAPI (Python) with SQLAlchemy ORM, deployed on Railway
- **Database** - PostgreSQL hosted on Railway

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

## Database Design

The system uses a relational PostgreSQL database organised 
into five subsystems with 27 tables:

**Case & Persons**
- Cases
- Case_Types
- Deceased_Persons
- Injured_Persons

**Institutions & Personnel**
- Hospitals
- Wards
- Police_Stations
- Police_Officers
- Courts
- Magistrates
- Medical_Officers

**Examination & Autopsy Records**
- Autopsy_Notifications
- PostMortem_Reports
- PostMortem_Findings
- MLEF_Forms
- Court_Certificates

**Injuries & Forensic Detail**
- Injuries
- Injury_Causes
- Body_Diagram_Marks
- Specimens
- Specimen_Investigations

**System Administration**
- Users
- Roles
- User_Roles
- Permissions
- Case_Documents
- Audit_Log

---

## User Roles

| Role | Access |
|---|---|
| Administrator | Full system access, user management, audit log, configuration |
| Judicial Medical Officer (JMO) | Clinical modules — MLEF, Post-Mortem, Forensic Reports |
| Police Officer | Submit MLEF requests, track report status for station cases |
| Registrar | Court certificates, summons, certificates of receipt |
| Records Clerk | Case registration, document uploads, intake queue management |

---

## Links

- [Project Repository](https://github.com/cepdnaclk/e22-CO2050-forensic-medical-dept-system)
- [Project Page](https://cepdnaclk.github.io/e22-CO2050-forensic-medical-dept-system)
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)
