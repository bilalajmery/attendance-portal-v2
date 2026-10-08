# CHANGELOG — ATTENDANCE PORTAL

All notable changes to the **Attendance Portal** codebase and its **Universal Brain** knowledge system will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Firestore Security Rules Hardened] - 2026-10-08

### Security
- **Cloud Firestore Security Rules Hardened**:
  - Remediated critical self-admin privilege escalation vulnerability in `admins` collection; restricted writes exclusively to existing administrators.
  - Locked `employees` collection against employee profile tampering (salary, account activation, sequential ID, designation); updates restricted exclusively to administrators.
  - Implemented secure first-login UID migration requiring verified Google email token and existing admin creator reference.
  - Corrected dynamic collection path matching from invalid prefix syntax to exact wildcard `/{attendanceCollection}/{date}` with regex validation.
  - Restricted parent date document writes to `{ date: dateStr }` matching the URI parameter.
  - Enforced audit trail immutability on employee attendance check-out punches.
  - Created and executed a 33-case positive and negative security permission test suite.
  - Recorded ADR-010 in `DECISIONS.md`.

---

## [Universal Brain Finalized] - 2026-10-08

### Changed
- **Canonical Brain Unified**:
  - Designated `d:\attendance\attendance-portal-v2\brain` as the single canonical source of truth for version control.
  - Backed up parent brain to `d:\attendance\brain_backup_verified`.
  - Replaced redundant parent folder with an NTFS Directory Junction (`d:\attendance\brain` -> `d:\attendance\attendance-portal-v2\brain`).
  - Updated both `AGENTS.md` files to explicitly reference the canonical brain path.
  - Recorded ADR-008 in `DECISIONS.md`.

---

## [Universal Brain Initialized] - 2026-10-08

### Added
- **Complete Universal Brain Knowledge System**:
  - `brain/README.md`: Central sitemap and navigation index.
  - `brain/PROJECT_OVERVIEW.md`: High-level business goals, user personas, operational scope.
  - `brain/ARCHITECTURE.md`: Serverless SPA + Firebase BaaS architecture, detailed Mermaid diagrams.
  - `brain/TECH_STACK.md`: Verified tech stack, dependency versions, tooling nuances.
  - `brain/PROJECT_STRUCTURE.md`: Comprehensive directory hierarchy and entry point mapping.
  - `brain/MODULE_REGISTRY.md`: Registry of all 12 functional application modules.
  - `brain/FEATURE_REGISTRY.md`: Granular feature inventory with verified completion statuses.
  - `brain/DATABASE.md`: Cloud Firestore schemas, dynamic `attendance_{salaryMonthKey}` partitioning.
  - `brain/API_REGISTRY.md`: Internal Firestore data operations and external IP lookup services.
  - `brain/BUSINESS_LOGIC.md`: Mathematical formulas for deductions, late thresholds, and UID migrations.
  - `brain/ATTENDANCE_RULES.md`: Punctuality rules, duplicate checks, WiFi IP validation, webcam capture.
  - `brain/AUTH_SECURITY.md`: Google OAuth, role checking, dual portal guardrails, threat analysis.
  - `brain/CODING_STANDARDS.md`: TypeScript, React, Tailwind, and date-fns conventions.
  - `brain/UI_UX_GUIDELINES.md`: Design tokens, dark mode engine, status badge palette, Sonner toasts.
  - `brain/INTEGRATIONS.md`: Firebase Auth, Firestore, Storage, and external IP lookup APIs.
  - `brain/ENVIRONMENT.md`: Environment variable contract, local setup guide, audit status.
  - `brain/DEPLOYMENT.md`: Build output specs (`dist/`), static hosting deployment guides.
  - `brain/TESTING_QA.md`: Quality assurance status, high-risk regression zones, manual QA checklists.
  - `brain/DECISIONS.md`: Append-only Architectural Decision Records (ADR-001 through ADR-007).
  - `brain/KNOWN_ISSUES.md`: Tracking technical debt, hardcoded IP, missing `.env` blocker.
  - `brain/DEVELOPMENT_HISTORY.md`: Chronological milestone history from Git commit logs.
  - `brain/CURRENT_STATUS.md`: Real-time operational snapshot of application status.
  - `brain/PENDING_TASKS.md`: Prioritized engineering backlog (TASK-001 through TASK-006).
  - `brain/AGENT_RULES.md`: Non-negotiable operating rules for AI agents working on this codebase.
  - `brain/CONTEXT_HANDOFF.md`: Ultra-compact context summary for zero-shot session recovery.
  - `brain/tasks/README.md`: Guidelines for development task recording.
  - `brain/tasks/TASK_TEMPLATE.md`: Reusable development task template.
  - Root `AGENTS.md`: Short, persistent agent pointer to Universal Brain.

---

## Historical Codebase Releases

### [Commit 904fd82] - 2026-03-25
- Removed outdated setup and guide markdown documents.
- Refined `src/lib/weekHolidays.ts` with local date parsing (`parseLocalYyyyMmDd`).
- Cleaned up legacy JSX and CSS artifacts.

### [Commits aca461e, fd9080e, 28f6c61] - ~Jan 2026
- Added Admin Salary Reports view with monthly breakdown and CSV export.
- Added Paid Salaries tracking view with payment disbursement recording.
- Added employee-facing Salary History page.

### [Commit c8c517b] - 2025-12-05
- Initial release of React Attendance Portal with Firebase Authentication and Firestore database integration.
