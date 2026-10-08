# MODULE REGISTRY — ATTENDANCE PORTAL

This registry indexes all 12 functional application modules implemented in the codebase.

---

### Module 1: Authentication & Identity Management
- **Location**: [src/lib/auth.ts](file:///d:/attendance/attendance-portal-v2/src/lib/auth.ts), [src/context/AuthContext.tsx](file:///d:/attendance/attendance-portal-v2/src/context/AuthContext.tsx), [src/components/auth/RequireAuth.tsx](file:///d:/attendance/attendance-portal-v2/src/components/auth/RequireAuth.tsx)
- **Purpose**: Authenticates users with Google OAuth, verifies membership in `admins` or `employees` collections, automatically migrates pre-registered email UIDs to Firebase Auth UIDs, and guards protected routes.
- **Key Functions**: `signInWithGoogle()`, `signOutUser()`, `checkUserRole()`
- **Data Models**: `UserRole` (`'admin' | 'employee' | null`), `Admin`, `Employee`
- **Dependencies**: Firebase Auth, Cloud Firestore (`admins`, `employees`)
- **Status**: **VERIFIED_COMPLETE**

---

### Module 2: Employee Attendance Capture
- **Location**: [src/routes/employee/Dashboard.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/employee/Dashboard.tsx), [src/lib/firestore.ts:148](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L148)
- **Purpose**: Allows employees to mark present, log out (early off), submit leave with reasons, or log off-days. Incorporates network WiFi validation and optional webcam picture capture.
- **Key Workflows**:
  - Check-in: Checks WiFi IP -> captures webcam frame -> writes attendance record with in-time -> evaluates late or half-day.
  - Check-out: Updates existing record with out-time -> calculates early departure or overtime hours.
  - Leave: Submits leave reason (bypasses WiFi check).
- **Data Models**: `AttendanceRecord`, `AttendanceStatus`, `AttendanceStats`
- **Status**: **VERIFIED_COMPLETE** (Webcam & upload verified via code; requires live environment)

---

### Module 3: Admin Attendance Oversight & Manual Correction
- **Location**: [src/routes/admin/attendance/AttendanceView.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/admin/attendance/AttendanceView.tsx), [src/lib/firestore.ts:357](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L357)
- **Purpose**: Provides administrators with a daily attendance roster across all employees. Allows manual attendance injection, time editing, and mode switching (`attendance`, `leave`, `off`).
- **Key Functions**: `adminUpsertAttendance()`, `getAttendanceForDate()`, `deleteAttendance()`
- **Data Models**: `AttendanceRecord`, `Employee`
- **Status**: **VERIFIED_COMPLETE**

---

### Module 4: Calendar & Shift Visualization
- **Location**: [src/routes/employee/Calendar.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/employee/Calendar.tsx), [src/routes/admin/calendar/CalendarView.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/admin/calendar/CalendarView.tsx)
- **Purpose**: Visual monthly grid rendering daily status (green for present, amber for late, orange for half-day, purple for leave, red for off, blue for holiday). Clicking a date shows full punch times and details.
- **Key Functions**: `getMonthlyAttendance()`, `getMonthHolidays()`
- **Status**: **VERIFIED_COMPLETE**

---

### Module 5: Holiday Management
- **Location**: [src/routes/admin/holidays/HolidayManagement.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/admin/holidays/HolidayManagement.tsx), [src/lib/holidays.ts](file:///d:/attendance/attendance-portal-v2/src/lib/holidays.ts), [src/lib/weekHolidays.ts](file:///d:/attendance/attendance-portal-v2/src/lib/weekHolidays.ts)
- **Purpose**: Defines public holidays for the company. Includes an automated tool to populate all Sundays for a selected calendar year.
- **Key Functions**: `addHoliday()`, `deleteHoliday()`, `markAllSundaysForYear()`, `getCurrentWeekHolidays()`
- **Data Models**: `Holiday`
- **Status**: **VERIFIED_COMPLETE**

---

### Module 6: Employee Directory & Lifecycle Management
- **Location**: [src/routes/admin/employees/](file:///d:/attendance/attendance-portal-v2/src/routes/admin/employees/) (`EmployeeList.tsx`, `AddEmployeeDialog.tsx`, `EditEmployeeDialog.tsx`)
- **Purpose**: Administrative employee directory. Auto-generates sequential Employee IDs (`EMP001`, `EMP002`), creates pre-registration records, updates designations/salaries, and supports account activation/deactivation.
- **Key Functions**: `addEmployee()`, `updateEmployee()`, `deleteEmployee()`, `toggleEmployeeStatus()`
- **Data Models**: `Employee`
- **Status**: **VERIFIED_COMPLETE**

---

### Module 7: Admin User Management
- **Location**: [src/routes/admin/admins/AdminList.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/admin/admins/AdminList.tsx)
- **Purpose**: Grants administrator privileges to email addresses. Pre-registers admin documents with sanitized email UIDs before their first login.
- **Key Functions**: `getAllAdmins()`, `addAdmin()`
- **Data Models**: `Admin`
- **Status**: **VERIFIED_COMPLETE**

---

### Module 8: Overtime Tracking & Moderation
- **Location**: [src/routes/admin/overtime/Overtime.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/admin/overtime/Overtime.tsx)
- **Purpose**: Scans monthly attendance records for employees who stayed beyond `officeEndTime`. Auto-sets status to `approved`, allowing admins to review and reject with reasons.
- **Key Functions**: `calculateOvertimeHours()`, `updateAttendance()`
- **Status**: **VERIFIED_COMPLETE**

---

### Module 9: Payroll Calculation & Monthly Reporting
- **Location**: [src/routes/admin/reports/SalaryReports.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/admin/reports/SalaryReports.tsx), [src/lib/salary.ts](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts), [src/lib/firestore.ts:657](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L657)
- **Purpose**: Aggregates month-to-date or full-month attendance records per employee across dynamic billing dates. Calculates deductions for off-days (1.2x penalty), lates (3 lates = 0.5 day deduction), half-days, and early departures. Provides CSV data export.
- **Key Functions**: `generateMonthlyReport()`, `calculateMonthlySalary()`, `calculateDeductions()`
- **Data Models**: `SalaryReport`
- **Status**: **VERIFIED_COMPLETE**

---

### Module 10: Salary Disbursements & Payment Tracking
- **Location**: [src/routes/admin/reports/PaidSalaries.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/admin/reports/PaidSalaries.tsx), [src/routes/employee/Salary.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/employee/Salary.tsx)
- **Purpose**: Allows admins to record salary disbursements with timestamp and notes, marking employees as paid in monthly reports. Employees can review historical disbursement slips.
- **Key Functions**: `addSalaryPayment()`, `getSalaryPayments()`, `getEmployeePayments()`
- **Data Models**: `SalaryPayment`
- **Status**: **VERIFIED_COMPLETE**

---

### Module 11: Portal Configuration & Maintenance
- **Location**: [src/routes/admin/settings/Settings.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/admin/settings/Settings.tsx), [src/context/SettingsContext.tsx](file:///d:/attendance/attendance-portal-v2/src/context/SettingsContext.tsx)
- **Purpose**: Configures office working hours (`10:00` - `18:00`), late grace period (`15` mins), salary start day (`6th`), currency (`INR`, `PKR`, `USD`, `EUR`, `GBP`, `AED`), light/dark logo URLs, and runs batch recomputation of monthly attendance statuses.
- **Key Functions**: `getPortalSettings()`, `updatePortalSettings()`, `recomputeMonthlyAttendanceStatus()`
- **Data Models**: `PortalSettings`
- **Status**: **VERIFIED_COMPLETE**

---

### Module 12: Network Security & IP Restriction
- **Location**: [src/lib/ipRestriction.ts](file:///d:/attendance/attendance-portal-v2/src/lib/ipRestriction.ts)
- **Purpose**: Queries public IP lookup endpoints to ensure employees are connected to the official office WiFi network before permitting check-in or early off marks.
- **Key Functions**: `getUserIP()`, `isOnAllowedNetwork()`, `verifyNetworkAccess()`
- **Status**: **VERIFIED_COMPLETE** (Contains hardcoded IP: `182.184.79.173`)
