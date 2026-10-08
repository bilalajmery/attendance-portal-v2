# TESTING & QUALITY ASSURANCE — ATTENDANCE PORTAL

## 1. Current Testing State

> [!WARNING]
> **No Automated Test Runner**:
> The project currently lacks automated unit or integration tests (`npm test` is not defined in `package.json`). Quality assurance currently relies on TypeScript compile checks (`tsc`) and manual verification.

---

## 2. High-Risk Regression Zones

When making modifications to the application, prioritize verification in these five critical zones:

### 2.1 Salary Deduction Arithmetic (`src/lib/salary.ts`)
- **Risk**: Mathematical drift in deduction calculations can lead to incorrect payroll totals.
- **Verification Matrix**:
  - Off days / unmarked days penalty: Must multiply by $1.2 \times \text{perDaySalary}$.
  - Late arrival deduction: Must evaluate $\lfloor \text{lateCount} / 3 \rfloor \times (\text{perDaySalary} / 2)$.
  - Half-day deduction: Must multiply by $\text{halfDayCount} \times (\text{perDaySalary} / 2)$.
  - Early leave deduction: Must calculate hours rounded to nearest $0.5$ hour multiplied by $\text{perHourSalary}$.

### 2.2 Billing Cycle Cutoff Boundaries (`getSalaryMonthKey`)
- **Risk**: On the 5th and 6th of any month, off-by-one errors can attribute attendance to the wrong billing cycle collection (`attendance_YYYY_MM`).
- **Rule**: If day $< \text{startDay}$ (default: 6), record belongs to the previous month. On day $\ge \text{startDay}$, it belongs to the current month.

### 2.3 Timezone & Local Date Shifting (`parseLocalYyyyMmDd`)
- **Risk**: In regions east or west of UTC, `new Date('YYYY-MM-DD')` can parse as UTC midnight and roll back to the previous day in local time.
- **Rule**: Always use integer extraction or local Date constructors when parsing date strings.

### 2.4 Pre-Registration UID Migration (`checkUserRole`)
- **Risk**: When an employee signs in with Google for the first time, failure to migrate their pre-registered record will result in an `Access Denied` error.
- **Rule**: Test onboarding flow: Admin adds employee -> Employee signs in -> Document successfully migrates from `email_sanitized` UID to Google Auth UID.

### 2.5 Dynamic Firestore Subcollection Paths
- **Risk**: Firestore subcollection path mismatches will cause attendance data to become invisible.
- **Format**: `attendance_${salaryMonthKey}/${dateStr}/records/${employeeUid}`.

---

## 3. Manual Quality Assurance Checklists

### 3.1 Employee Portal Test Protocol
1. **Google Sign-in**: Verify authentication succeeds and loads `/dashboard`.
2. **Network Gate Check**:
   - Verify that marking Present or Out-time from outside the office WiFi displays the error toast.
   - Verify that marking Leave with a reason bypasses the WiFi check.
3. **Punctuality Evaluation**:
   - Check in on-time (< start + 15m) -> Expect `'present'` badge.
   - Check in 16m-59m late -> Expect `'late'` badge.
   - Check in $\ge 60$m late -> Expect `'half-day'` badge.
4. **Departure Logging**:
   - Check out before end time -> Verify early leave hours calculated.
   - Check out after end time -> Verify overtime hours recorded.
5. **Calendar Navigation**: Verify monthly calendar displays color-coded badges and holiday indicators.

### 3.2 Admin Portal Test Protocol
1. **Employee Management**:
   - Add new employee -> Verify `empId` increments sequentially (`EMP001`, `EMP002`).
   - Deactivate employee -> Verify account cannot log in.
2. **Attendance Management**:
   - View daily sheet -> Verify employee records appear.
   - Perform manual upsert -> Verify record updates immediately.
3. **Holiday Management**:
   - Run "Mark All Sundays" -> Verify all 52 Sundays populate in database.
   - Add custom holiday -> Verify it appears in calendar view and employee dashboards.
4. **Payroll Reports**:
   - Select current and previous billing cycles.
   - Verify CSV export generates correctly formatted spreadsheet data.
   - Mark employee as paid -> Verify payment record appears in `salary_payments`.
