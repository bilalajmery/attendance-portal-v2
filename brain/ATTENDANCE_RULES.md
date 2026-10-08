# ATTENDANCE RULES & POLICIES — ATTENDANCE PORTAL

This document specifies all domain rules governing attendance operations, punch constraints, verification gates, and reporting behaviors.

---

## 1. Daily Check-In & Check-Out Rules

### 1.1 In-Time Marking (Check-In)
- **Allowed States**: An employee may mark `'present'`, `'leave'`, or `'off'`.
- **Duplicate Prevention**: If a record already exists for the employee on the current date, attempting to mark attendance throws:
  `"Attendance already marked for today"` ([src/lib/firestore.ts:216](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L216)).
- **Timestamping**: Handled automatically using Firebase server/client timestamp: `Timestamp.now()`.
- **Classification**: An arrival marked `'present'` is automatically evaluated via `getLateStatus()`:
  - If `inTime <= officeStartTime + lateBuffer` -> Stored as `'present'`.
  - If `inTime > officeStartTime + lateBuffer` and `diff < 60 min` -> Stored as `'late'`.
  - If `inTime >= officeStartTime + 60 min` -> Stored as `'half-day'`.

### 1.2 Out-Time Marking (Check-Out / Early Off)
- **Pre-requisite**: Employee must already have an existing attendance record for today.
- **Workflow**: Triggered when `isEarlyOff = true` is passed to `markAttendance`.
- **Fields Updated**:
  - `outTime`: Recorded with `Timestamp.now()`.
  - `earlyLeaveHours`: Computed if departing prior to `officeEndTime`.
  - `overtimeHours`: Computed if departing after `officeEndTime`.
  - `overtimeStatus`: Defaulted to `"approved"` if overtime occurred.
  - `updatedAt`: Updated with `serverTimestamp()`.

---

## 2. Network Security & WiFi IP Restrictions

- **Source Reference**: [src/lib/ipRestriction.ts](file:///d:/attendance/attendance-portal-v2/src/lib/ipRestriction.ts) & [src/lib/firestore.ts:156-160](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L156-L160).
- **Authorized Office IP**: `182.184.79.173` (Constant `ALLOWED_IP`).

### Validation Matrix
| Action | Marked By | Network Check Enforced? | Rule / Behavior |
|---|---|---|---|
| **Mark Present** | Employee (`'self'`) | **YES** | Throws error if user public IP $\neq$ `ALLOWED_IP` |
| **Mark Out-Time** | Employee (`'self'`) | **YES** | Throws error if user public IP $\neq$ `ALLOWED_IP` |
| **Mark Leave** | Employee (`'self'`) | **NO** | Allowed from any network (e.g. employee sick at home) |
| **Mark Off-Day** | Employee (`'self'`) | **NO** | Allowed from any network |
| **Admin Upsert** | Admin (`adminUid`) | **NO** | Admins bypass all network restrictions |

---

## 3. Camera Capture & Photo Verification

- **Config Flag**: Controlled by `enableCameraCapture` in `settings/portal` document.
- **Source Reference**: [src/routes/employee/Dashboard.tsx:326-362](file:///d:/attendance/attendance-portal-v2/src/routes/employee/Dashboard.tsx#L326-L362).
- **Workflow**:
  1. Requests webcam stream via `navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })`.
  2. Renders video frame to hidden HTML5 canvas and converts to base64 JPEG (`image/jpeg`, 0.7 quality).
  3. Uploads image to Cloud Storage path `attendance_images/{userId}/{timestamp}.jpg` ([src/lib/storage.ts:11](file:///d:/attendance/attendance-portal-v2/src/lib/storage.ts#L11)).
  4. Stores returned public download URL in `record.imageUrl`.
- **Graceful Degradation**:
  - Upload has a strict **5-second timeout race**: `Promise.race([upload(), timeoutPromise(5000)])`.
  - If camera access is denied, hardware fails, or upload times out, the system displays a warning toast and **marks attendance without photo**, ensuring employees are never blocked from clocking in due to hardware glitches.

---

## 4. Date, Timezone & Future Interval Handling

- **Date String Standard**: All document dates and keys use local `YYYY-MM-DD` strings.
- **Local Date Parsing**:
  - Standard `new Date('2026-03-23')` can be parsed as UTC by JavaScript, causing date shifting in non-GMT timezones.
  - [src/lib/weekHolidays.ts:13-21](file:///d:/attendance/attendance-portal-v2/src/lib/weekHolidays.ts#L13-L21) uses `parseLocalYyyyMmDd` regex to parse integers into local calendar dates.
- **Future Date Exclusion in Payroll**:
  - When calculating monthly reports or employee stats during an active month, days strictly after today (`dateStr > todayStr`) are skipped ([src/lib/firestore.ts:581, 717](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L581)).
  - Employees are **not** penalized for future dates as absent or off.

---

## 5. Holidays & Sundays Policies

- **Sundays Automation**:
  - Admins can trigger `markAllSundaysForYear(year)` in Holiday Management.
  - Automatically identifies all 52 Sundays and adds them to `holidays` collection with `reason: "Sunday"`.
  - **Immutability**: Auto-marked Sundays cannot be deleted in the admin UI ([src/routes/admin/holidays/HolidayManagement.tsx:59](file:///d:/attendance/attendance-portal-v2/src/routes/admin/holidays/HolidayManagement.tsx#L59)).
- **Holiday Attendance Impact**:
  - If an employee has no punch on an official holiday date, the system checks `holidaysSet.has(dateStr)`.
  - Because it is recognized as a holiday, it is **not** counted as an unmarked/absent day and incurs zero salary deduction ([src/lib/firestore.ts:612, 752](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L612)).
