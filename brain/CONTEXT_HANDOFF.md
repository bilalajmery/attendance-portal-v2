# CONTEXT HANDOFF — ATTENDANCE PORTAL
## Compact Operational Brief for Future AI Agent Sessions

> **Read This First**: If starting a new session without prior conversation history, this document gives you immediate full-fidelity context on the **Attendance Portal** project.

---

### 1. What Attendance Portal Is
An enterprise-grade, serverless Single Page Application (SPA) providing separate **Employee** and **Admin** portals for attendance tracking, punctuality monitoring, leave management, overtime moderation, and automated monthly payroll deductions.

### 2. Technology Stack
- **Frontend**: React 18 (`18.2.0`), TypeScript 5 (`5.3.3`), Vite (`5.0.8`), React Router v6 (`6.20.0`).
- **Styling & UI**: Tailwind CSS (`3.3.6`), shadcn/ui components (`radix-ui/react-tabs`, `cva`, `clsx`, `tailwind-merge`), Lucide Icons (`0.294.0`), Sonner toasts (`1.2.0`).
- **Backend as a Service (BaaS)**: Google Firebase (`10.7.1`) — Firebase Authentication (Google OAuth), Cloud Firestore, Cloud Storage.
- **Date Utility**: `date-fns` (`3.0.0`).
- **Network Verification**: IP lookup via `api.ipify.org`, `api.my-ip.io`, and `ipapi.co`.

### 3. Architecture Summary
- **Client-Side BaaS**: Browser communicates directly with Firebase SDK without an intermediary Node/Python server.
- **Canonical Brain**: Stored in Git repository at [`attendance-portal-v2/brain/`](file:///d:/attendance/attendance-portal-v2/brain/README.md) and mapped to workspace root via NTFS Junction at `d:\attendance\brain`.
- **Data Partitioning**: Daily attendance documents are partitioned into dynamic root collections by salary billing cycle:
  `attendance_{salaryMonthKey}/{YYYY-MM-DD}/records/{employeeUid}` (e.g. `attendance_2025_12`).
- **Lazy UID Migration**: Admins pre-register employees with sanitized email UIDs (`john_example_com`). On first Google Sign-In, `checkUserRole()` automatically migrates the record to the authenticated Google Auth UID.

### 4. Critical Business Rules (NEVER ALTER WITHOUT APPROVAL)
1. **Salary Cycle**: Default start day is the **6th** (`salaryStartDay = 6`). Days 1–5 belong to the previous month's cycle. Key format: `YYYY_MM`.
2. **Punctuality**:
   - Arrival $\le$ start time + buffer (15m): `'present'`
   - Arrival $>$ start time + buffer and $< 60$m: `'late'`
   - Arrival $\ge 60$m after start time: `'half-day'`
3. **Absence Penalty**: Unexcused absences / off-days incur a **1.2x penalty multiplier** on the per-day salary rate:
   $$\text{offDeduction} = (\text{offDays} + \text{unmarkedDays}) \times (\text{monthlySalary} / 30) \times 1.2$$
4. **Late Penalty**: Every 3 accumulated lates trigger a half-day salary deduction: $\lfloor \text{lateCount} / 3 \rfloor \times (\text{perDaySalary} / 2)$.
5. **Early Leave & Overtime**: Calculated from office end time (`18:00`) rounded to the nearest 0.5 hour: $\text{round}(\text{diffMinutes} / 30) / 2$.
6. **Office WiFi IP Gate**: Check-in (`'present'`) and out-time (`isEarlyOff`) enforce public IP matching `182.184.79.173` when marked by self. Leave marking bypasses the IP check.
7. **Webcam Capture**: If enabled in settings, captures webcam photo on punch with a 5s race timeout; fails gracefully without photo if camera access fails.

### 5. Current State & Blockers
- **Application State**: Fully coded and structurally verified across all routes and services.
- **Primary Blocker**: Missing local `.env` file on disk. Local dev server (`npm run dev`) cannot communicate with Firebase until the project owner provides credentials.
- **Clean Working Tree**: Git working tree is clean on branch `main`.

### 6. Immediate Next Priorities
1. **P0**: User creates `.env` from [.env.example](file:///d:/attendance/attendance-portal-v2/.env.example) with Firebase Console credentials.
2. **P1**: Migrate hardcoded IP `182.184.79.173` into Firestore `settings/portal` document.
3. **P1**: Install `vitest` and unit test `salary.ts` and `weekHolidays.ts`.
4. **P2**: Delete leftover [vite.config.js](file:///d:/attendance/attendance-portal-v2/vite.config.js).

### 7. Essential Rules for AI Agents
- **Git Policy is MANUAL ONLY**: Never stage, commit, push, pull, or branch.
- **Preserve Business Logic**: Never modify salary deductions or attendance rules.
- **Update Brain After Work**: Run tests/build -> update affected brain documents -> report.

### 8. Quick Document Links
- Full Architecture: [ARCHITECTURE.md](file:///d:/attendance/brain/ARCHITECTURE.md)
- Complete Calculations: [BUSINESS_LOGIC.md](file:///d:/attendance/brain/BUSINESS_LOGIC.md)
- Database Schema: [DATABASE.md](file:///d:/attendance/brain/DATABASE.md)
- Feature Registry: [FEATURE_REGISTRY.md](file:///d:/attendance/brain/FEATURE_REGISTRY.md)
- Known Issues: [KNOWN_ISSUES.md](file:///d:/attendance/brain/KNOWN_ISSUES.md)
- Agent Operating Contract: [AGENT_RULES.md](file:///d:/attendance/brain/AGENT_RULES.md)
