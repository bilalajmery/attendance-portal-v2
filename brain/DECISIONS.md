# ARCHITECTURAL DECISION RECORDS (ADR) — ATTENDANCE PORTAL

This document tracks all significant architectural, domain, and technical decisions made in the **Attendance Portal**. This is an append-only log.

---

### ADR-001: Pure Client-Side Firebase BaaS Architecture
- **Date**: 2025-12-05 (Commit `c8c517b7`)
- **Status**: **ACCEPTED**
- **Context**: The project required a production-ready attendance management system with authentication, real-time database, and file storage without the operational overhead of managing dedicated custom backend servers.
- **Decision**: Built the entire frontend as a React + Vite SPA interacting directly with Google Firebase (Auth, Firestore, Storage) via the official client SDK (`firebase` v10.7.1).
- **Consequences**:
  - Eliminates server maintenance, container hosting, and backend deployment pipelines.
  - Requires rigorous Cloud Firestore Security Rules in Firebase Console to enforce access control.
  - Business calculations run on the client device.

---

### ADR-002: Dynamic Root Subcollection Partitioning for Attendance Records
- **Date**: 2025-12-05 (Commit `c8c517b7`)
- **Status**: **ACCEPTED**
- **Context**: Storing all company attendance records over years in a single flat collection causes query degradation and document index congestion.
- **Decision**: Partition records by billing cycle at the root collection level: `attendance_{salaryMonthKey}` (e.g. `attendance_2025_12`), organized by date document (`YYYY-MM-DD`) with a subcollection `records/{employeeUid}`.
- **Consequences**:
  - Isolates monthly data into natural archive boundaries.
  - Simplifies month-by-month queries.
  - Prevents write lock contention between employees marking attendance simultaneously.

---

### ADR-003: Email-Based Pre-Registration with Lazy UID Migration
- **Date**: 2025-12-05 (Commit `c8c517b7`)
- **Status**: **ACCEPTED**
- **Context**: Administrators need to onboard employees and set up salaries before the employee creates or signs into their Google account. However, Firebase Auth UIDs are not known until the user authenticates.
- **Decision**: Admins create employee documents with sanitized email UIDs (e.g. `john_example_com`). On the employee's initial Google Sign-In, [src/lib/auth.ts](file:///d:/attendance/attendance-portal-v2/src/lib/auth.ts) matches the authenticated Google email, copies the document under the real Firebase Auth UID, and deletes the old document.
- **Consequences**:
  - Seamless administrative onboarding.
  - Requires fallback email queries in `checkUserRole()` when a direct UID lookup fails.

---

### ADR-004: 1.2x Penalty Rate for Unexcused Absences and Off-Days
- **Date**: 2025-12-05 (Commit `c8c517b7`)
- **Status**: **ACCEPTED**
- **Context**: Corporate policy penalizes unexcused absences and unauthorized off-days beyond standard daily salary rates.
- **Decision**: Implemented formula in [src/lib/salary.ts:129](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L129):
  $$\text{offDeduction} = \text{offDays} \times (\text{monthlySalary} / 30) \times 1.2$$
  Unmarked workdays are also treated as off-days for deduction calculations.
- **Consequences**:
  - Strictly enforces attendance accountability.
  - Must be preserved across all payroll calculations.

---

### ADR-005: Optional Resilient Webcam Capture with Graceful Degradation
- **Date**: 2025-12-05 (Commit `c8c517b7`)
- **Status**: **ACCEPTED**
- **Context**: Verification photos were requested on check-in to confirm physical presence, but webcam hardware failures or network timeouts must not prevent employees from clocking in.
- **Decision**: Added `enableCameraCapture` toggle in portal settings. Photo uploads execute with a 5-second `Promise.race()` timeout. If webcam access fails, upload times out, or camera is disabled, the system logs attendance without photo and informs the user.
- **Consequences**:
  - High operational resilience.
  - Does not block attendance marking during camera hardware failure.

---

### ADR-006: Hardcoded Office IP Restriction for On-Premise Validation
- **Date**: 2025-12-05 (Commit `c8c517b7`)
- **Status**: **ACCEPTED (Technical Debt Identified)**
- **Context**: Need to ensure employees are physically connected to the authorized office WiFi router when marking Present or Out-time.
- **Decision**: Embedded `ALLOWED_IP = "182.184.79.173"` in `src/lib/ipRestriction.ts` and validated via external IP detection services.
- **Consequences**:
  - Prevents casual off-site check-ins.
  - Requires code modification when office ISP changes public IP address.
  - *Identified for future refactor to dynamic Firestore setting.*

---

### ADR-007: Transition to Explicit Relative Import Paths
- **Date**: 2026-03-25 (Commit `904fd82`)
- **Status**: **ACCEPTED**
- **Context**: Path alias inconsistencies across Node scripts, Vite bundling, and IDE extensions caused build friction.
- **Decision**: Ran import rewriting scripts (`fix-imports.*`) to convert `@/` alias imports into explicit relative paths (`../../lib/firestore`).
- **Consequences**:
  - 100% portable across tooling without requiring path alias resolvers.
  - Retained `@/` in `tsconfig.json` for future compatibility.

---

### ADR-008: Canonical Brain Resolution & NTFS Directory Junction
- **Date**: 2026-10-08
- **Status**: **ACCEPTED**
- **Context**: The Git repository root is `d:\attendance\attendance-portal-v2`, while the Antigravity IDE workspace root is `d:\attendance`. Maintaining two physical brain directories risked data drift and severed version control from the parent folder.
- **Decision**: Designated `d:\attendance\attendance-portal-v2\brain` as the single canonical brain. Backed up and removed the redundant physical parent directory, replacing it with an NTFS Directory Junction (`d:\attendance\brain -> d:\attendance\attendance-portal-v2\brain`).
- **Consequences**:
  - Version control remains 100% intact inside the Git repository.
  - Antigravity IDE accesses the brain transparently at the workspace root without duplication.
  - Zero chance of desynchronization between workspace paths.

---

### ADR-009: Service Account Key Isolation & Web Client Configuration
- **Date**: 2026-10-08
- **Status**: **ACCEPTED**
- **Context**: User provided a Firebase Admin SDK Service Account JSON for project `attendance-portal-39006`. The existing architecture is a pure React SPA without a Node.js backend. Exposing the service account private key in frontend source code or `VITE_*` variables would leak administrative IAM credentials to the public.
- **Decision**: 
  1. Isolated the service account credentials outside the version-controlled repository at `D:\attendance\serviceAccountKey.json`.
  2. Hardened `.gitignore` to exclude `serviceAccountKey*.json` and `*service-account*.json`.
  3. Used the service account via a temporary local script to fetch the authentic Web App credentials from the Firebase Management API.
  4. Configured the existing Web SDK via standard `.env` variables (`VITE_FIREBASE_*`).
- **Consequences**:
  - Zero private key exposure in frontend bundles or Git.
  - Application connects to the designated Firebase project via standard Web SDK.
  - Cloud Firestore and Cloud Storage security rules prepared for console deployment.

---

### ADR-010: Hardened Cloud Firestore Security Rules Architecture
- **Date**: 2026-10-08
- **Status**: **ACCEPTED**
- **Context**: An in-depth security audit revealed critical vulnerabilities in the initial `firestore.rules`:
  1. `admins` allowed arbitrary self-creation via `request.auth.uid == adminId`.
  2. `employees` allowed employees to update their own documents without field restrictions, enabling tampering with `monthlySalary` and `isActive`.
  3. Dynamic attendance collections used invalid prefix wildcard path syntax (`/attendance_{month}/{date}`).
  4. Parent date documents permitted unrestricted authenticated writes.
  5. Attendance record subcollections permitted employees to tamper with audit fields and timestamps on check-out.
- **Decision**: Redesigned `firestore.rules` with strict role-based access control:
  1. Restricted all writes to `admins` exclusively to `isAdmin()`. First admin must be bootstrapped via Firebase Console.
  2. Restricted `employees` updates exclusively to `isAdmin()`. Enabled secure first-login UID migration by enforcing `request.resource.data.createdBy` referencing an existing admin, verified email token matching, and `migratedAt` presence.
  3. Matched dynamic monthly collections via exact segment wildcard `/{attendanceCollection}/{date}` guarded by regex `col.matches('^attendance_[0-9]{4}_[0-9]{2}$')`.
  4. Constrained parent date document writes to `{ date: dateStr }` matching the route parameter.
  5. Enforced immutability of `employeeUid`, `date`, `inTime`, `status`, and `createdAt` when an employee performs check-out.
- **Consequences**:
  - Complete elimination of privilege escalation and salary tampering vectors.
  - Exact compatibility with existing frontend queries and mutations.
  - Validated with a 33-case positive and negative permission test suite.



