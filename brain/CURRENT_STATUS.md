# CURRENT STATUS — ATTENDANCE PORTAL

**Last Brain Update**: 2026-10-08T04:42:00-07:00  
**Repository Branch**: `main`  
**Canonical Brain**: `d:\attendance\attendance-portal-v2\brain` (Junction at `d:\attendance\brain`)  
**Working Tree Status**: Clean (Untracked `brain/` & `AGENTS.md` in repo root; 0 source modifications)

---

## 1. Verified Working Modules & Components
The following modules have been inspected and confirmed complete in code structure:
- **Authentication & Role Guards**: Google OAuth popup, role resolution, lazy UID migration, and dual-portal routing guards are fully implemented.
- **Employee Views**:
  - Dashboard: In-time check-in, early-off check-out, leave submission, real-time deduction preview, upcoming week holidays widget.
  - Calendar: Interactive monthly attendance grid with status badges and detail dialogs.
  - Salary: Historical disbursement records.
- **Admin Views**:
  - Dashboard: Organization metrics, recent attendance log, quick links.
  - Employees: Directory, auto-generating ID (`EMP001`), add modal, edit modal, activate/deactivate toggle.
  - Admins: Admin delegation list with sanitized email pre-registration.
  - Attendance: Daily roster view, manual upsert dialog (mode: attendance, leave, off).
  - Calendar: Organization-wide calendar with employee selector.
  - Holidays: Holiday list, add holiday, auto-mark all Sundays for year.
  - Overtime: Overtime review with rejection dialog.
  - Salary Reports: Full monthly payroll report, deduction calculations, CSV export, mark as paid.
  - Paid Salaries: Filterable salary disbursement history by month and year.
  - Settings: Working hours, late buffer, salary start day, logos, currency, maintenance status recalculator.

---

## 2. Active Status & Application Runtime
- **Firebase Connection**: **CONNECTED** to project `attendance-portal-39006`.
  - `.env` configured with valid Web App credentials (`AIzaSy...`, App ID `1:530798570358:web:...`).
  - Google Authentication is verified active (`google.com` provider enabled).
  - Cloud Firestore default database is verified active in `asia-south1`.
- **Application Runtime**: **ACTIVE (DEV SERVER RUNNING)**.
  - Dependencies: Installed via `npm ci` (357 packages).
  - Production Build: Verified clean (`tsc && vite build` passed with 0 errors).
  - Dev Server: Running at `http://localhost:5173/` (Network: `http://192.168.1.107:5173/`).
- **REMAINING SETUP REQUIREMENTS (Firebase Console Action Required)**:
  1. **First Admin Bootstrap**: **COMPLETED**. Administrator profile document created and verified in Firestore `admins` collection matching Google Auth UID.
  2. **Publish Minimal Admin-Only Security Rules**: Currently running locked rules (`allow read, write: if false;`). Deploy reviewed minimal admin-only rules from `firestore.rules` in Firebase Console -> Firestore -> Rules to unblock administrator dashboard access.
  3. **Enable Cloud Storage Bucket**: In Firebase Console -> Storage, click **Get started** to activate photo storage for webcam attendance punches.

---

## 3. Major Risks & Fragile Areas
1. **Firestore Security Rules**: The database currently runs in locked production mode (`allow read, write: if false;`) until rules from `firestore.rules` are published in Firebase Console.
2. **Cloud Storage Bucket Not Provisioned**: Attendance photo uploads will fail until Cloud Storage is initialized in Firebase Console.
3. **Hardcoded IP Dependency**: `182.184.79.173` hardcoded in `ipRestriction.ts:6`. A network ISP change will lock employees out of check-in until code is changed.
4. **No Automated Test Coverage**: Absence of unit tests creates risk of mathematical regression in `salary.ts`.

---

## 4. Immediate Engineering Priorities
1. **Initial Sign-In**: Open `http://localhost:5173/` in browser and click "Sign in with Google".
2. **Bootstrap Admin**: Copy the generated Google UID and create document in `admins` in Firebase Console.
3. **Publish Firestore Rules**: Deploy rules from `firestore.rules` in Firebase Console.
4. **Provision Cloud Storage**: Click Get Started in Firebase Console -> Storage.
5. **Automated Testing Suite**: Introduce Vitest to unit test `salary.ts` and `weekHolidays.ts`.
6. **Clean Tooling Artifacts**: Delete redundant `vite.config.js`.
