# FEATURE REGISTRY — ATTENDANCE PORTAL

This registry tracks the granular implementation and verification status of features in the **Attendance Portal**.

### Status Definitions
- **VERIFIED_COMPLETE**: Code implementation verified and confirmed functional through source inspection and structural integrity.
- **IMPLEMENTED_UNVERIFIED**: Code is fully implemented but requires runtime environment credentials (active Firebase project or physical hardware) to execute live.
- **PARTIALLY_IMPLEMENTED**: Only portions of the feature or configuration slots exist.
- **PLANNED**: Identified in project vision or docs but not yet written.
- **BLOCKED**: Implementation blocked by external dependencies or credentials.
- **DEPRECATED**: Outdated code preserved for backwards compatibility.

---

## Feature Inventory

| Feature ID | Feature Name | Module | Status | Evidence / Source Reference |
|---|---|---|---|---|
| **FEAT-AUTH-01** | Google OAuth Login | Auth | `VERIFIED_COMPLETE` | [auth.ts:21](file:///d:/attendance/attendance-portal-v2/src/lib/auth.ts#L21) (`signInWithGoogle`) |
| **FEAT-AUTH-02** | Role-Based Access Control | Auth | `VERIFIED_COMPLETE` | [RequireAuth.tsx:12](file:///d:/attendance/attendance-portal-v2/src/components/auth/RequireAuth.tsx#L12), [auth.ts:42](file:///d:/attendance/attendance-portal-v2/src/lib/auth.ts#L42) |
| **FEAT-AUTH-03** | Pre-Registration Email-to-UID Migration | Auth | `VERIFIED_COMPLETE` | [auth.ts:67-143](file:///d:/attendance/attendance-portal-v2/src/lib/auth.ts#L67-L143) |
| **FEAT-AUTH-04** | Dual Login Portal Boundary Enforcement | Auth | `VERIFIED_COMPLETE` | [Login.tsx:41](file:///d:/attendance/attendance-portal-v2/src/routes/shared/Login.tsx#L41), [AdminLogin.tsx:41](file:///d:/attendance/attendance-portal-v2/src/routes/shared/AdminLogin.tsx#L41) |
| **FEAT-AUTH-05** | Account Deactivation Check | Auth | `VERIFIED_COMPLETE` | [AuthContext.tsx:66](file:///d:/attendance/attendance-portal-v2/src/context/AuthContext.tsx#L66) (`isActive === false`) |
| **FEAT-ATTN-01** | Employee Daily Check-in | Attendance | `VERIFIED_COMPLETE` | [firestore.ts:148](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L148) (`markAttendance`) |
| **FEAT-ATTN-02** | Automated Late / Half-Day Detection | Attendance | `VERIFIED_COMPLETE` | [salary.ts:43](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L43) (`getLateStatus`) |
| **FEAT-ATTN-03** | Early Departure (Out-time) Logging | Attendance | `VERIFIED_COMPLETE` | [salary.ts:64](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L64) (`calculateEarlyLeaveHours`) |
| **FEAT-ATTN-04** | Overtime Calculation | Attendance | `VERIFIED_COMPLETE` | [salary.ts:87](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L87) (`calculateOvertimeHours`) |
| **FEAT-ATTN-05** | Office WiFi IP Validation | Attendance | `VERIFIED_COMPLETE` | [ipRestriction.ts:44](file:///d:/attendance/attendance-portal-v2/src/lib/ipRestriction.ts#L44) (`ALLOWED_IP = "182.184.79.173"`) |
| **FEAT-ATTN-06** | Webcam Photo Capture on Punch | Attendance | `IMPLEMENTED_UNVERIFIED` | [Dashboard.tsx:270-362](file:///d:/attendance/attendance-portal-v2/src/routes/employee/Dashboard.tsx#L270-L362), [storage.ts:5](file:///d:/attendance/attendance-portal-v2/src/lib/storage.ts#L5) |
| **FEAT-ATTN-07** | Leave Submission with Reason | Attendance | `VERIFIED_COMPLETE` | [Dashboard.tsx:93](file:///d:/attendance/attendance-portal-v2/src/routes/employee/Dashboard.tsx#L93), [firestore.ts:240](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L240) |
| **FEAT-ATTN-08** | Off-Day Submission | Attendance | `VERIFIED_COMPLETE` | [Dashboard.tsx](file:///d:/attendance/attendance-portal-v2/src/routes/employee/Dashboard.tsx), [firestore.ts:153](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L153) |
| **FEAT-ADMIN-01** | Employee Management & Sequential ID | Admin | `VERIFIED_COMPLETE` | [AddEmployeeDialog.tsx:50](file:///d:/attendance/attendance-portal-v2/src/routes/admin/employees/AddEmployeeDialog.tsx#L50) (`EMP001` auto-gen) |
| **FEAT-ADMIN-02** | Employee Activation / Deactivation | Admin | `VERIFIED_COMPLETE` | [EmployeeList.tsx:55](file:///d:/attendance/attendance-portal-v2/src/routes/admin/employees/EmployeeList.tsx#L55), [firestore.ts:96](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L96) |
| **FEAT-ADMIN-03** | Admin User Delegation | Admin | `VERIFIED_COMPLETE` | [AdminList.tsx:42](file:///d:/attendance/attendance-portal-v2/src/routes/admin/admins/AdminList.tsx#L42), [firestore.ts:42](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L42) |
| **FEAT-ADMIN-04** | Manual Attendance Upsert / Override | Admin | `VERIFIED_COMPLETE` | [AttendanceView.tsx:32](file:///d:/attendance/attendance-portal-v2/src/routes/admin/attendance/AttendanceView.tsx#L32), [firestore.ts:357](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L357) |
| **FEAT-ADMIN-05** | Holiday Management & Annual Sundays | Admin | `VERIFIED_COMPLETE` | [HolidayManagement.tsx:9](file:///d:/attendance/attendance-portal-v2/src/routes/admin/holidays/HolidayManagement.tsx#L9), [firestore.ts:533](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L533) |
| **FEAT-ADMIN-06** | Overtime Review & Rejection | Admin | `VERIFIED_COMPLETE` | [Overtime.tsx:58](file:///d:/attendance/attendance-portal-v2/src/routes/admin/overtime/Overtime.tsx#L58) (`overtimeStatus = 'rejected'`) |
| **FEAT-PAY-01** | Monthly Salary Calculation | Payroll | `VERIFIED_COMPLETE` | [salary.ts:118](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L118) (`calculateDeductions`) |
| **FEAT-PAY-02** | Unexcused Absence 1.2x Penalty | Payroll | `VERIFIED_COMPLETE` | [salary.ts:129](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L129) (`offDays * perDaySalary * 1.2`) |
| **FEAT-PAY-03** | 3-Lates = 0.5 Day Salary Deduction | Payroll | `VERIFIED_COMPLETE` | [salary.ts:132](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L132) (`Math.floor(lateCount / 3) * (perDaySalary / 2)`) |
| **FEAT-PAY-04** | Half-Day = 0.5 Day Salary Deduction | Payroll | `VERIFIED_COMPLETE` | [salary.ts:136](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L136) (`halfDayCount * (perDaySalary / 2)`) |
| **FEAT-PAY-05** | Early Leave Hourly Deduction | Payroll | `VERIFIED_COMPLETE` | [salary.ts:139](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L139) (`earlyLeaveHours * perHourSalary`) |
| **FEAT-PAY-06** | Payroll Reports & CSV Export | Payroll | `VERIFIED_COMPLETE` | [SalaryReports.tsx:18](file:///d:/attendance/attendance-portal-v2/src/routes/admin/reports/SalaryReports.tsx#L18), [firestore.ts:657](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L657) |
| **FEAT-PAY-07** | Salary Payment Disbursement Recording | Payroll | `VERIFIED_COMPLETE` | [PaidSalaries.tsx:56](file:///d:/attendance/attendance-portal-v2/src/routes/admin/reports/PaidSalaries.tsx#L56), [firestore.ts:807](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L807) |
| **FEAT-CONF-01** | Customizable Working Hours & Buffer | Settings | `VERIFIED_COMPLETE` | [Settings.tsx:53](file:///d:/attendance/attendance-portal-v2/src/routes/admin/settings/Settings.tsx#L53), [firestore.ts:127](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L127) |
| **FEAT-CONF-02** | Dynamic Billing Cycle Start Day | Settings | `VERIFIED_COMPLETE` | [salary.ts:8](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L8) (`salaryStartDay` default 6) |
| **FEAT-CONF-03** | Multi-Currency Symbol Selection | Settings | `VERIFIED_COMPLETE` | [SettingsContext.tsx:48](file:///d:/attendance/attendance-portal-v2/src/context/SettingsContext.tsx#L48) (`INR`, `PKR`, `USD`, `EUR`, `GBP`, `AED`) |
| **FEAT-CONF-04** | Custom Logo Branding (Light & Dark) | Settings | `VERIFIED_COMPLETE` | [SettingsContext.tsx:83-100](file:///d:/attendance/attendance-portal-v2/src/context/SettingsContext.tsx#L83-L100) |
| **FEAT-CONF-05** | Maintenance Recompute Statuses | Settings | `VERIFIED_COMPLETE` | [Settings.tsx:21](file:///d:/attendance/attendance-portal-v2/src/routes/admin/settings/Settings.tsx#L21), [firestore.ts:833](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L833) |
| **FEAT-UI-01** | Dark & Light Theme Switching | UI/UX | `VERIFIED_COMPLETE` | [ThemeContext.tsx:13](file:///d:/attendance/attendance-portal-v2/src/context/ThemeContext.tsx#L13), [ThemeToggle.tsx](file:///d:/attendance/attendance-portal-v2/src/components/ThemeToggle.tsx) |
| **FEAT-NOTIF-01** | Firebase Cloud Messaging (FCM) | Notifications | `PARTIALLY_IMPLEMENTED` | Configured in [firebase.ts:11](file:///d:/attendance/attendance-portal-v2/src/lib/firebase.ts#L11); Push handling not coded |
| **FEAT-INT-01** | Biometric Hardware Device Sync | Hardware | `PLANNED` | Not implemented in current codebase |
