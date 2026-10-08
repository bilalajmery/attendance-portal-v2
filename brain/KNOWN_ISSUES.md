# KNOWN ISSUES & TECHNICAL DEBT — ATTENDANCE PORTAL

This document tracks confirmed bugs, architectural risks, and technical debt items identified in the codebase.

---

## 1. Confirmed Issues & Technical Debt

### ISSUE-001: Missing Local Runtime `.env` File
- **Severity**: **High (Operational Blocker)**
- **Affected Area**: Local development environment
- **Symptoms**: Starting the application with `npm run dev` succeeds, but any Firebase operation crashes due to missing config.
- **Cause**: No `.env` or `.env.local` file was present on disk in `d:\attendance\attendance-portal-v2\`.
- **Resolution**: Populated authentic Firebase Web App credentials for project `attendance-portal-39006` in `attendance-portal-v2/.env`. Excluded from Git tracking.
- **Status**: **RESOLVED (2026-10-08)**

---

### ISSUE-002: Hardcoded Office IP Address
- **Severity**: **Medium**
- **Affected Area**: [src/lib/ipRestriction.ts:6](file:///d:/attendance/attendance-portal-v2/src/lib/ipRestriction.ts#L6)
- **Symptoms**: If the office router acquires a new public IP address from the ISP, all employees are blocked from marking attendance until a developer modifies `ALLOWED_IP` in code and redeploys.
- **Cause**: IP address `"182.184.79.173"` is hardcoded as a TypeScript constant rather than read from the `settings/portal` document.
- **Proposed Fix**: Add an `allowedOfficeIp` field to `PortalSettings` in Firestore, editable via the Admin Settings view.
- **Status**: **OPEN (Technical Debt)**

---

### ISSUE-003: Client-Side Network Verification Vulnerability
- **Severity**: **Medium**
- **Affected Area**: [src/lib/ipRestriction.ts](file:///d:/attendance/attendance-portal-v2/src/lib/ipRestriction.ts)
- **Symptoms**: A technologically savvy employee could potentially modify client execution or use local developer tools to bypass `verifyNetworkAccess()`.
- **Cause**: The application does not use a backend server to inspect incoming HTTP request headers. The IP check is performed by the browser invoking public IP APIs.
- **Proposed Fix**: Verify IP server-side using a Firebase Cloud Function or App Check before writing to Firestore.
- **Status**: **ACCEPTED RISK**

---

### ISSUE-004: Redundant Duplicate Vite Configuration
- **Severity**: **Low**
- **Affected Area**: [vite.config.js](file:///d:/attendance/attendance-portal-v2/vite.config.js) vs [vite.config.ts](file:///d:/attendance/attendance-portal-v2/vite.config.ts)
- **Symptoms**: Two configuration files exist at the project root. While Vite prioritizes `vite.config.ts`, having `vite.config.js` causes tooling confusion and lacks path alias definitions.
- **Proposed Fix**: Delete `vite.config.js`.
- **Status**: **OPEN**

---

### ISSUE-005: Absence of Automated Unit & Integration Tests
- **Severity**: **Medium**
- **Affected Area**: Entire repository
- **Symptoms**: Regressions in critical financial math (`salary.ts`) or date interval filtering (`weekHolidays.ts`) cannot be caught automatically during CI/CD.
- **Proposed Fix**: Install `vitest` and add unit test suites for `salary.ts`, `weekHolidays.ts`, and `firestore.ts` data transforms.
- **Status**: **OPEN**

---

### ISSUE-006: Active Firestore Security Rules Set to Default Deny-All
- **Severity**: **High (Operational Blocker)**
- **Affected Area**: Firebase Console / Cloud Firestore (`attendance-portal-39006`)
- **Symptoms**: All client SDK database reads and writes fail with `FirebaseError: [code=permission-denied]: Missing or insufficient permissions`.
- **Cause**: Cloud Firestore was created in locked production mode (`allow read, write: if false;`). The production ruleset prepared in `firestore.rules` has not yet been deployed to the Firebase Console.
- **Proposed Fix**: User must copy the contents of [firestore.rules](file:///d:/attendance/attendance-portal-v2/firestore.rules) into Firebase Console -> Cloud Firestore -> Rules, and click **Publish**.
- **Status**: **OPEN (Requires Firebase Console Action)**

---

### ISSUE-007: Cloud Storage Bucket Not Initialized (404 Not Found)
- **Severity**: **Medium (Attendance Webcam Uploads)**
- **Affected Area**: Firebase Console / Cloud Storage (`attendance-portal-39006`)
- **Symptoms**: Employee webcam punch photo uploads fail because the storage bucket `attendance-portal-39006.firebasestorage.app` does not exist on Google Cloud yet.
- **Cause**: Cloud Storage has not been initialized/activated in the Firebase Console.
- **Proposed Fix**: User must navigate to Firebase Console -> Build -> Storage, click **Get started**, choose Cloud Storage location, and deploy rules from [storage.rules](file:///d:/attendance/attendance-portal-v2/storage.rules).
- **Status**: **OPEN (Requires Firebase Console Action)**

---

### ISSUE-008: Missing `node_modules` Dependencies in Local Workspace
- **Severity**: **Medium (Local Build & Execution)**
- **Affected Area**: Workspace tooling (`attendance-portal-v2`)
- **Symptoms**: Running `npm run build` or `npm run dev` fails with missing binary errors (`tsc: not found`).
- **Cause**: Node packages were not previously installed in `attendance-portal-v2` directory.
- **Resolution**: Successfully executed `npm ci` using the committed `package-lock.json`. 357 packages audited and installed. TypeScript and Vite builds verified clean.
- **Status**: **RESOLVED (2026-10-08)**
