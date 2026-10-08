# PENDING TASKS & ENGINEERING BACKLOG — ATTENDANCE PORTAL

This document maintains the prioritized and deduplicated development backlog for the **Attendance Portal**.

---

## 1. Prioritized Backlog

### TASK-001: Populate Local Runtime `.env` File
- **Priority**: **P0 (Critical / Immediate)**
- **Status**: `BLOCKED` (Awaiting User Credentials)
- **Source**: Environmental Audit
- **Description**: Copy `.env.example` to `.env` in `attendance-portal-v2/` and populate all 6 `VITE_FIREBASE_*` variables from the Firebase Console.
- **Dependencies**: None.
- **Acceptance Criteria**:
  - `.env` exists on disk.
  - Starting `npm run dev` connects successfully to Firebase without console errors.

---

### TASK-002: Remove Redundant `vite.config.js`
- **Priority**: **P2 (Maintenance)**
- **Status**: `READY`
- **Source**: Codebase Discovery
- **Description**: Delete `attendance-portal-v2/vite.config.js` to ensure the project exclusively uses `vite.config.ts`.
- **Dependencies**: None.
- **Acceptance Criteria**:
  - `vite.config.js` deleted.
  - `npm run build` and `npm run dev` continue to function identically using `vite.config.ts`.

---

### TASK-003: Make Allowed Office IP Dynamic via Firestore Settings
- **Priority**: **P1 (High)**
- **Status**: `PLANNED`
- **Source**: Technical Debt (ADR-006 / ISSUE-002)
- **Description**: Migrate the hardcoded IP constant `ALLOWED_IP = "182.184.79.173"` from [src/lib/ipRestriction.ts](file:///d:/attendance/attendance-portal-v2/src/lib/ipRestriction.ts) into the `settings/portal` Firestore document. Add an "Office WiFi IP" field in the Admin Settings view.
- **Dependencies**: TASK-001 (Requires active Firebase connection).
- **Acceptance Criteria**:
  - `PortalSettings` interface includes `allowedOfficeIp?: string`.
  - Admin can update the allowed IP in `/admin/settings`.
  - `verifyNetworkAccess()` retrieves the dynamic IP from Firestore with a fallback to the default IP.

---

### TASK-004: Establish Automated Unit Testing Suite (Vitest)
- **Priority**: **P1 (Quality)**
- **Status**: `PLANNED`
- **Source**: Quality Assurance (ISSUE-005)
- **Description**: Install `vitest` as a devDependency and create automated unit tests covering all edge cases in `salary.ts` (1.2x off penalty, 3-late half day deduction, rounding of early departure and overtime hours, salary month boundaries) and `weekHolidays.ts` (local date parsing).
- **Dependencies**: None.
- **Acceptance Criteria**:
  - `npm test` script added to `package.json`.
  - 100% of mathematical rules in `salary.ts` validated via automated assertions.

---

### TASK-005: Verify and Document Cloud Firestore Security Rules
- **Priority**: **P1 (Security)**
- **Status**: `PLANNED`
- **Source**: Security Audit (ISSUE-006)
- **Description**: Ensure the Cloud Firestore rules deployed in Firebase Console restrict writes to `admins` and `salary_payments` to genuine administrator UIDs, and prevent employees from overwriting other employees' attendance records.
- **Dependencies**: Firebase Console Access.
- **Acceptance Criteria**:
  - Security rules documented in `brain/AUTH_SECURITY.md`.
  - Unauthenticated reads and writes rejected by Firestore rules.

---

### TASK-006: Archive Legacy Import Migration Scripts
- **Priority**: **P3 (Cleanup)**
- **Status**: `READY`
- **Source**: Codebase Discovery
- **Description**: Archive or remove legacy one-off migration scripts (`fix-imports.cjs`, `fix-imports.ps1`, `fix-imports.py`) from the root application folder.
- **Dependencies**: None.
- **Acceptance Criteria**:
  - Root directory cleaned up of redundant scripts.
