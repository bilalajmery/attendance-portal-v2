# DEVELOPMENT HISTORY — ATTENDANCE PORTAL

This document records the verified development milestones of the **Attendance Portal**, compiled from repository Git history, commit logs, and code evolution.

---

## 1. Verified Chronological Timeline

### Phase 1: Foundation & Core Portal Implementation
- **Commit**: `c8c517b75c34be2d445e55ed316021cb405d3256`
- **Date**: 2025-12-05
- **Author**: Bilal Ajmery
- **Milestone Summary**:
  - Initial implementation of the React Attendance Portal.
  - Setup of Google OAuth authentication flow and role determination (`admin` vs `employee`).
  - Architecture of Cloud Firestore dynamic subcollections (`attendance_{salaryMonthKey}/{dateStr}/records/{employeeUid}`).
  - Implementation of core salary deduction rules (1.2x off-penalty, 3-late half day deduction, early departure hourly deduction).
  - Integration of office WiFi IP restriction logic (`ipRestriction.ts`).
  - Integration of optional webcam photo capture on attendance punch.

---

### Phase 2: Payroll Reporting & Payment Disbursement Suite
- **Commits**: `aca461e`, `fd9080e`, `28f6c61`
- **Date**: ~December 2025 – Early 2026
- **Author**: Bilal Ajmery
- **Milestone Summary**:
  - Built comprehensive Admin Salary Reports page (`src/routes/admin/reports/SalaryReports.tsx`).
  - Implemented client-side CSV spreadsheet export for monthly payroll summaries.
  - Added payment tracking and recording module (`src/routes/admin/reports/PaidSalaries.tsx`) storing disbursements in `salary_payments` collection.
  - Added detailed employee attendance day-by-day modal dialog breakdown.
  - Added employee-facing salary disbursement history view (`src/routes/employee/Salary.tsx`).

---

### Phase 3: Documentation Cleanup & Refinements
- **Commit**: `904fd825d48cdaf45bd38c2340b6e79307dc3976`
- **Date**: 2026-03-25
- **Author**: Bilal Ajmery
- **Milestone Summary**:
  - Removed redundant markdown documentation files (`DARK_MODE_IMPLEMENTATION.md`, `FIRESTORE_RULES.md`, `FIX_CORS.md`, `IMPLEMENTATION_SUMMARY.md`, `QUICK_START.md`, `SETUP_FIRST_ADMIN.md`, `WIFI_IP_RESTRICTION.md`).
  - Refined `weekHolidays.ts` to include safe local date parsing (`parseLocalYyyyMmDd`) and upcoming holiday filtering.
  - Cleaned up legacy CSS and JSX references in favor of clean TypeScript.

---

### Phase 4: Branch Consolidation
- **Commit**: `e234277`
- **Date**: 2026-03-25+
- **Author**: Bilal Ajmery
- **Milestone Summary**:
  - Merged latest updates from `origin/main`.
  - Repository stabilized on branch `main` with a clean working tree.
