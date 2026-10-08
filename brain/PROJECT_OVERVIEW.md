# PROJECT OVERVIEW — ATTENDANCE PORTAL

## 1. Project Information
- **Project Name**: Attendance Portal (Repository folder: `attendance-portal-v2`)
- **Package Manifest Identifier**: `"attendance-portal"` (`v1.0.0`)
- **Type**: Web Single Page Application (SPA)
- **Primary Domain**: Human Resources, Employee Attendance & Payroll Calculation

---

## 2. Verified Project Purpose
The **Attendance Portal** is an enterprise-grade attendance and payroll management web application. It provides two distinct portals:
1. **Employee Portal**: For employees to perform daily attendance marking (check-in / check-out), request leave, log off-days, monitor personal monthly attendance history, view upcoming holidays, and inspect monthly salary calculations and payment receipts.
2. **Admin Portal**: For HR and business administrators to oversee organization-wide employee records, manage admin credentials, configure working hours and salary cycle parameters, manage official holidays, review and approve overtime, track daily attendance, generate monthly payroll reports with automatic deductions, and record salary disbursements.

---

## 3. Product Category & Target Users

| User Persona | Primary Interface | Key Capabilities |
|---|---|---|
| **Employees** | `/dashboard`, `/calendar`, `/salary` | Check in with automated timestamp & optional webcam photo; check out with early departure calculation; view real-time salary estimate; view attendance calendar; view payment history. |
| **Administrators** | `/admin/*` | Manage employees (add, edit, deactivate); add new admins; manual attendance upsert / override; overtime approvals; manage official holidays; view detailed payroll reports; export CSV data; mark salaries as paid; customize portal settings. |

---

## 4. Primary Business Objectives
- **Accurate Time & Attendance Capture**: Replace manual registers with automatic timestamping and late-arrival classification.
- **On-Premise Validation**: Ensure attendance is marked within the authorized office facility by checking the client's public IP against the designated office network.
- **Automated Deduction Mathematics**: Compute fair, rule-based payroll deductions based on late arrivals (every 3 lates = 0.5 day deduction), unexcused absences (1.2x per-day salary penalty), half-days, and early departures.
- **Role-Based Workflow Isolation**: Keep administrative controls strictly separated from employee dashboards through dual-portal routing and role checking.
- **Zero-Friction Authentication**: Utilize Google OAuth for authentication, linking accounts automatically to employee profile documents.

---

## 5. Existing Applications & Components
The system currently consists of a **single unified frontend application** hosting both portals:
- **Client Application**: React 18 + Vite SPA located in `attendance-portal-v2/src/`.
- **Backend as a Service (BaaS)**: Google Firebase (Firebase Auth, Cloud Firestore, Firebase Storage).
- **External Network Services**: Public IP resolution APIs (`api.ipify.org`, `api.my-ip.io`, `ipapi.co`).

*Note: There are no native mobile applications (iOS/Android), no desktop wrappers (Electron/Tauri), and no custom Node.js/Go/Python backend servers in this repository.*

---

## 6. High-Level Functional Scope
- **Authentication**: Google Sign-In with automatic role verification and email-to-UID migration.
- **Attendance Mark Flow**:
  - Present: Records in-time, evaluates late / half-day status, captures webcam image (if enabled).
  - Early Off (Out-time): Records departure time, computes early leave hours or overtime hours.
  - Leave: Submits leave with written justification.
  - Off: Submits off-day mark.
- **Calendar & Holiday Management**: Visual monthly calendars with color-coded day states; auto-generation of annual Sundays; custom holiday management.
- **Payroll & Deductions**: Real-time monthly deduction calculations based on custom salary billing cycles (e.g. 6th to 5th).
- **Payment Disbursements**: Tracking recorded payments in Firestore (`salary_payments`).
- **Portal Customization**: Customizable office hours, late thresholds, currency symbols, and branding logos (light/dark mode).

---

## 7. Current Implementation State
- **Core Architecture**: Implemented and operational.
- **Frontend Views**: 100% of planned routes and UI components exist in `src/routes/`.
- **Runtime Connectivity**: **Blocked locally** due to missing `.env` credentials on disk. All Firebase calls require valid environment variables.

---

## 8. Project Boundaries
- **No Custom Backend**: All database operations occur via Firebase Client SDK. Security relies on Cloud Firestore security rules.
- **No Background Cron Worker**: Monthly report aggregation and Sunday generation are executed on-demand in the browser rather than via scheduled Cloud Functions.
- **Client-Side IP Check**: WiFi IP verification is performed in the client browser, not via server-side middleware.
