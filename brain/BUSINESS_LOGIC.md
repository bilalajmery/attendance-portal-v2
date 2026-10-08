# BUSINESS LOGIC & DOMAIN CALCULATIONS — ATTENDANCE PORTAL

> [!CRITICAL]
> **Preservation Notice**: All business logic and calculation formulas in this document are extracted directly from active code in [src/lib/salary.ts](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts) and [src/lib/firestore.ts](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts). **DO NOT alter any formula or threshold without explicit written authorization.**

---

## 1. Salary Billing Month Cycle

### 1.1 Cycle Window Definition
By default, a salary billing month does **not** follow the calendar month (1st to 31st). Instead, it runs from the configured `salaryStartDay` (default: **6th**) of the current month to `(salaryStartDay - 1)` (default: **5th**) of the following month.

- **Example**: Dec 6, 2025 to Jan 5, 2026 corresponds to billing month key: `2025_12`.
- **Implementation**: [src/lib/salary.ts:8-20](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L8-L20)
  ```typescript
  export const getSalaryMonthKey = (date: Date = new Date(), startDay: number = 6): string => {
    const day = date.getDate();
    if (day < startDay) {
      const prevMonth = subMonths(date, 1);
      return format(prevMonth, 'yyyy_MM');
    }
    return format(date, 'yyyy_MM');
  };
  ```

### 1.2 Interval Dates
Given a `salaryMonthKey` (e.g. `2025_12`) and `startDay`:
- **Start Date**: `new Date(year, month - 1, startDay)` (e.g. `2025-12-06`)
- **End Date**: `new Date(year, month, startDay - 1)` (e.g. `2026-01-05`)
- **Implementation**: [src/lib/salary.ts:22-30](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L22-L30)

---

## 2. Punctuality & Attendance Classification

When an employee marks attendance, their check-in time (`inTime`) is compared against the configured `officeStartTime` (default: `"10:00"`) and `bufferMinutes` (default: `15`).

### 2.1 Punctuality Status Rules
- **Implementation**: [src/lib/salary.ts:43-62](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L43-L62) (`getLateStatus`)
- **Calculation**:
  $$\text{diffMinutes} = \frac{\text{inTime} - \text{officeStartTime}}{1000 \times 60}$$

| Condition | Assigned Status | Impact |
|---|---|---|
| $\text{diffMinutes} \ge 60$ | `'half-day'` | Treated as Half-Day arrival. Deducts 0.5 day salary. |
| $\text{diffMinutes} > \text{bufferMinutes}$ | `'late'` | Marked as Late. Every 3 lates incur 0.5 day deduction. |
| $\text{diffMinutes} \le \text{bufferMinutes}$ | `'present'` | Normal on-time arrival. No penalty. |

### 2.2 Late Minutes Calculation
- **Implementation**: [src/lib/firestore.ts:262-275](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L262-L275)
  $$\text{thresholdMinutes} = \text{startHour} \times 60 + \text{startMinute} + \text{bufferMinutes}$$
  $$\text{lateMinutes} = \max(0, \text{currentMinutes} - \text{thresholdMinutes})$$

---

## 3. Departure Arithmetic: Early Leave & Overtime

When an employee clocks out (`isEarlyOff = true`), the departure time (`outTime`) is evaluated against `officeEndTime` (default: `"18:00"`).

### 3.1 Early Leave Hours
- **Implementation**: [src/lib/salary.ts:64-85](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L64-L85) (`calculateEarlyLeaveHours`)
- If $\text{outTime} \ge \text{officeEndTime}$, $\text{earlyLeaveHours} = 0$.
- If $\text{outTime} < \text{officeEndTime}$:
  $$\text{diffMinutes} = \frac{\text{officeEndTime} - \text{outTime}}{1000 \times 60}$$
  $$\text{earlyLeaveHours} = \frac{\text{round}(\text{diffMinutes} / 30)}{2}$$

| Departure Difference | Rounded Hours |
|---|---|
| $< 15\text{ minutes}$ | $0.0\text{ hours}$ |
| $15 \text{ to } 44\text{ minutes}$ | $0.5\text{ hours}$ |
| $45 \text{ to } 74\text{ minutes}$ | $1.0\text{ hours}$ |
| $75 \text{ to } 104\text{ minutes}$ | $1.5\text{ hours}$ |

### 3.2 Overtime Hours
- **Implementation**: [src/lib/salary.ts:87-108](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L87-L108) (`calculateOvertimeHours`)
- If $\text{outTime} \le \text{officeEndTime}$, $\text{overtimeHours} = 0$.
- If $\text{outTime} > \text{officeEndTime}$:
  $$\text{diffMinutes} = \frac{\text{outTime} - \text{officeEndTime}}{1000 \times 60}$$
  $$\text{overtimeHours} = \frac{\text{round}(\text{diffMinutes} / 30)}{2}$$
- Auto-marked as `overtimeStatus: "approved"` unless subsequently rejected by an admin.

---

## 4. Payroll Deductions & Net Salary Mathematics

All salary formulas are implemented in [src/lib/salary.ts:118-157](file:///d:/attendance/attendance-portal-v2/src/lib/salary.ts#L118-L157).

### 4.1 Base Unit Rates
$$\text{perDaySalary} = \frac{\text{monthlySalary}}{30}$$
$$\text{perHourSalary} = \frac{\text{perDaySalary}}{8} = \frac{\text{monthlySalary}}{240}$$

### 4.2 Individual Deduction Formulas

1. **Off Days & Unexcused Absence Deduction**:
   > [!IMPORTANT]
   > Off days carry a **1.2x penalty multiplier** on the per-day salary rate! Unmarked work days are treated as Off days for deduction purposes ([src/lib/firestore.ts:620](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L620)).
   $$\text{totalOffDays} = \text{offDays} + \text{unmarkedDays}$$
   $$\text{offDeduction} = \text{totalOffDays} \times \text{perDaySalary} \times 1.2$$

2. **Late Arrivals Deduction**:
   Every 3 accumulated lates trigger a half-day salary deduction:
   $$\text{lateDeductionDays} = \lfloor \frac{\text{lateCount}}{3} \rfloor$$
   $$\text{lateDeduction} = \text{lateDeductionDays} \times \frac{\text{perDaySalary}}{2}$$

3. **Half-Day Arrivals Deduction**:
   Each half-day arrival triggers a half-day salary deduction:
   $$\text{halfDayDeduction} = \text{halfDayCount} \times \frac{\text{perDaySalary}}{2}$$

4. **Early Leave Deduction**:
   $$\text{earlyLeaveDeduction} = \text{earlyLeaveHours} \times \text{perHourSalary}$$

### 4.3 Total Deductions & Net Salary
$$\text{totalDeductions} = \text{offDeduction} + \text{lateDeduction} + \text{halfDayDeduction} + \text{earlyLeaveDeduction}$$
$$\text{netSalary} = \text{monthlySalary} - \text{totalDeductions}$$

All amounts are rounded to 2 decimal places: $\text{round}(v \times 100) / 100$.

---

## 5. Account Lifecycle & UID Migration Algorithm

To allow admins to onboard employees before they ever sign in, the system implements an automated **Lazy UID Migration**:
1. Admin creates employee with email (e.g. `user@example.com`).
2. Code sanitizes email to form a document ID: `user_example_com` ([src/routes/admin/employees/AddEmployeeDialog.tsx:97](file:///d:/attendance/attendance-portal-v2/src/routes/admin/employees/AddEmployeeDialog.tsx#L97)).
3. On first login, Firebase OAuth provides a real cryptographic UID (e.g. `Abc123XyZ`).
4. [src/lib/auth.ts:67-109](file:///d:/attendance/attendance-portal-v2/src/lib/auth.ts#L67-L109) checks:
   - Does `employees/{authUid}` exist? If no:
   - Query `employees` where `email == user.email`.
   - If found: Create `employees/{authUid}` copying old data + setting `uid: authUid`, `migratedAt: new Date()`.
   - Delete old `employees/{user_example_com}` document.
   - Return `'employee'` role.
