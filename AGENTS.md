# AGENTS.md — ATTENDANCE PORTAL
## Autonomous Agent Operating Contract & Universal Brain Entry Point

Welcome to the **Attendance Portal** codebase.
This project maintains a persistent knowledge system called the **Universal Brain** in the canonical [`brain/`](file:///d:/attendance/attendance-portal-v2/brain/README.md) directory.

> [!CRITICAL]
> **Authoritative Baseline**: The live source code in `src/` is the single source of truth for runtime behavior. The Universal Brain preserves architecture, domain calculations, historical decisions, and operating contracts. If code and documentation conflict, investigate before modifying anything.

---

### Mandatory Protocol for Every Development Task

```
READ BRAIN → INSPECT CODE → UNDERSTAND IMPACT → IMPLEMENT → VERIFY → UPDATE BRAIN → REPORT
```

#### 1. Before Starting Work (Discovery & Context Recovery)
1. Read [`brain/README.md`](file:///d:/attendance/attendance-portal-v2/brain/README.md) (Navigation index).
2. Read [`brain/AGENT_RULES.md`](file:///d:/attendance/attendance-portal-v2/brain/AGENT_RULES.md) (Non-negotiable rules).
3. Read [`brain/CONTEXT_HANDOFF.md`](file:///d:/attendance/attendance-portal-v2/brain/CONTEXT_HANDOFF.md) (Compact architecture & rule summary).
4. Read [`brain/CURRENT_STATUS.md`](file:///d:/attendance/attendance-portal-v2/brain/CURRENT_STATUS.md) (Real-time blockers & state).
5. Read task-relevant brain files (e.g. [`BUSINESS_LOGIC.md`](file:///d:/attendance/attendance-portal-v2/brain/BUSINESS_LOGIC.md), [`ATTENDANCE_RULES.md`](file:///d:/attendance/attendance-portal-v2/brain/ATTENDANCE_RULES.md), [`DATABASE.md`](file:///d:/attendance/attendance-portal-v2/brain/DATABASE.md)).
6. Inspect the actual source code in `src/`.
7. Confirm current behavior, dependencies, and regression risks before editing code.

#### 2. During Development (Discipline & Protection)
- **Make Minimal Changes**: Avoid sprawling refactors or aesthetic redesigns.
- **Preserve Business Logic**: Never silently change salary deduction formulas (especially the 1.2x off-penalty or 3-late half day deduction), working hours, or cutoff dates.
- **Maintain Security Controls**: Preserve role isolation (`admin` vs `employee`) and WiFi IP restrictions.
- **Strict Source Code Protection**: Do NOT delete, rename, or regenerate application files without approval.
- **Git Policy is MANUAL ONLY**:
  - **NEVER** run `git add`, `git commit`, `git push`, `git pull`, `git checkout`, `git switch`, `git reset`, or `git merge`.
  - The project owner retains exclusive manual control of Git. You may use read-only inspection commands (`git status`, `git log`, `git diff`).

#### 3. After Completing Work (Automatic Brain Memory Update)
Immediately after making code changes, you must automatically:
1. Verify results using safe commands (e.g. `npm run build` or `npm run lint`).
2. Update affected brain documentation in canonical `brain/` (`FEATURE_REGISTRY.md`, `MODULE_REGISTRY.md`).
3. Record new decisions in `DECISIONS.md`.
4. Record new bugs or blockers in `KNOWN_ISSUES.md`.
5. Update `CHANGELOG.md`, `CURRENT_STATUS.md`, and `CONTEXT_HANDOFF.md`.
6. Create or update the task log under `brain/tasks/TASK-XXXX-...md`.
7. Report findings and verification results to the user.

---

### Key Project Specifications at a Glance
- **Stack**: React 18 SPA (`18.2.0`), TypeScript (`5.3.3`), Vite (`5.0.8`), Tailwind CSS (`3.3.6`), Firebase Web SDK (`10.7.1`).
- **Database**: Cloud Firestore partitioned root collections (`attendance_{salaryMonthKey}/{dateStr}/records/{uid}`).
- **Office WiFi IP**: `182.184.79.173` enforced on self check-in/out.
- **Billing Cycle**: Starts on 6th of month (`salaryStartDay = 6`).
- **Absence Penalty**: 1.2x per-day salary deduction for off/unmarked days.
