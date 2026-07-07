---
layout: home
permalink: index.html
repository-name: e22-co225-fmdis
title: Forensic Medical Department Information System
---

# Forensic Medical Department Information System (FMDIS)

---

## Team
- E/22/052, K.H.D.M. Bimsara, [email](mailto:e22052@eng.pdn.ac.lk)
- E/22/353, G.K.G. Sandeepa, [email](mailto:e22353@eng.pdn.ac.lk)
- E/22/419, R.G.S.T. Weerasekara, [email](mailto:e22419@eng.pdn.ac.lk)
- E/22/058, M.M.T. Cooray, [email](mailto:e22058@eng.pdn.ac.lk)

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

- **Frontend** — React (Vite) with Tailwind CSS, deployed on Vercel
- **Backend** — FastAPI (Python) with SQLAlchemy ORM, deployed on Railway
- **Database** — PostgreSQL hosted on Railway

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

The system uses a relational PostgreSQL database with 14 tables
covering all entities in the forensic medical workflow:

DEPARTMENT, DOCTOR, PATIENT, CASE_RECORD, POSTMORTEM_REPORT,
MLEF, MEDICO_LEGAL_REPORT, AUTOPSY_NOTIFICATION, POLICE_REQUEST,
COURT_SUMMONS, COURT_RECEIPT, SPECIMEN, INVESTIGATION, AUDIT_LOG

---

## User Roles

| Role | Access |
|---|---|
| Medical Officer | Clinical modules — MLEF, Post-Mortem, Forensic Reports |
| Administrative Staff | Case registration, court dispatch, police requests |
| Police Liaison Officer | Submit requests, track report status |
| DBA | Full system access, user management, audit log |

---

## Links

- [Project Repository](https://github.com/cepdnaclk/e22-co225-fmdis){:target="_blank"}
- [Project Page](https://cepdnaclk.github.io/e22-co225-fmdis){:target="_blank"}
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)
