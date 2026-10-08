# DATABASE DESIGN — ATTENDANCE PORTAL

## 1. Database Technology Overview
- **Technology**: Google Cloud Firestore
- **Database Model**: NoSQL Document Database (Hierarchical with Root Collections, Documents, and Nested Subcollections)
- **Data Access Layer**: Typed helpers in [src/lib/firestore.ts](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts)

---

## 2. Collections & Document Schemas

### 2.1 Collection: `admins`
Stores authorized administrator profiles.
- **Document ID**: Firebase Auth UID (`user.uid`) or pre-registered sanitized email (e.g. `admin_example_com`).
- **Schema**:
  | Field | Type | Required | Description |
  |---|---|---|---|
  | `uid` | `string` | Yes | Firebase Auth UID |
  | `name` | `string` | Yes | Administrator full name |
  | `email` | `string` | Yes | Administrator Google email |
  | `role` | `string` | Yes | Constant value: `"admin"` |
  | `createdAt` | `Timestamp` | Yes | Document creation server timestamp |
  | `updatedAt` | `Timestamp` | No | Timestamp set during migration |
  | `migratedAt` | `Timestamp` | No | Timestamp set when migrated from email UID |

---

### 2.2 Collection: `employees`
Stores employee profiles and compensation parameters.
- **Document ID**: Firebase Auth UID (`user.uid`) or pre-registered sanitized email (e.g. `john_example_com`).
- **Schema**:
  | Field | Type | Required | Description |
  |---|---|---|---|
  | `uid` | `string` | Yes | Firebase Auth UID |
  | `name` | `string` | Yes | Employee full name |
  | `email` | `string` | Yes | Employee Google email |
  | `empId` | `string` | Yes | Unique sequential identifier (`EMP001`, `EMP002`) |
  | `designation` | `string` | No | Job title / designation |
  | `monthlySalary` | `number` | Yes | Monthly base salary (in currency units) |
  | `cnic` | `string` | No | National Identity Card / ID number |
  | `address` | `string` | No | Residential address |
  | `createdBy` | `string` | Yes | UID of the admin who created the record |
  | `createdAt` | `Timestamp` | Yes | Document creation server timestamp |
  | `isActive` | `boolean` | No | Account status flag (`true` or `false`). Missing defaults to `true`. |
  | `updatedAt` | `Timestamp` | No | Timestamp set during updates/migration |
  | `migratedAt` | `Timestamp` | No | Timestamp set when migrated from email UID |

---

### 2.3 Collection: `settings` -> Document: `portal`
Global configuration settings for the attendance portal.
- **Document ID**: Fixed document key `"portal"`.
- **Schema**:
  | Field | Type | Default | Description |
  |---|---|---|---|
  | `currency` | `string` | `"INR"` | Currency code (`INR`, `PKR`, `USD`, `EUR`, `GBP`, `AED`) |
  | `salaryStartDay` | `number` | `6` | Start day of monthly billing cycle (e.g. 6th of month) |
  | `officeStartTime` | `string` | `"10:00"` | Office start time in 24-hr `"HH:mm"` |
  | `officeEndTime` | `string` | `"18:00"` | Office departure time in 24-hr `"HH:mm"` |
  | `lateMarkAfterMinutes` | `number` | `15` | Grace buffer in minutes before late mark applies |
  | `enableCameraCapture` | `boolean` | `false` | Whether webcam photo capture is enabled on punch |
  | `portalLightLogoUrl` | `string` | `undefined` | Header logo URL for light mode |
  | `portalDarkLogoUrl` | `string` | `undefined` | Header logo URL for dark mode |
  | `loginLightLogoUrl` | `string` | `undefined` | Login screen logo URL for light mode |
  | `loginDarkLogoUrl` | `string` | `undefined` | Login screen logo URL for dark mode |
  | `logoUrl` | `string` | `undefined` | Deprecated fallback logo URL |
  | `lightLogoUrl` | `string` | `undefined` | Deprecated fallback light logo URL |
  | `darkLogoUrl` | `string` | `undefined` | Deprecated fallback dark logo URL |
  | `updatedAt` | `Timestamp` | Server time | Last update timestamp |

---

### 2.4 Collection: `holidays`
Official company holidays and auto-generated Sundays.
- **Document ID**: Date string in `YYYY-MM-DD` format (e.g. `2026-03-23`).
- **Schema**:
  | Field | Type | Required | Description |
  |---|---|---|---|
  | `date` | `string` | Yes | Date string (`YYYY-MM-DD`) |
  | `reason` | `string` | No | Holiday name/description (e.g. `"Sunday"`, `"Eid"`) |
  | `createdAt` | `Timestamp` | Yes | Server timestamp |

---

### 2.5 Partitioned Collections: `attendance_{salaryMonthKey}`
Partitioned root collections created dynamically per salary billing cycle (e.g., `attendance_2025_12`).

#### Daily Parent Document:
- **Path**: `attendance_{salaryMonthKey}/{dateStr}` (e.g. `attendance_2025_12/2025-12-06`)
- **Schema**: `{ date: "YYYY-MM-DD" }`

#### Employee Record Subcollection:
- **Path**: `attendance_{salaryMonthKey}/{dateStr}/records/{employeeUid}`
- **Document ID**: Employee UID (`employeeUid`).
- **Schema**:
  | Field | Type | Required | Description |
  |---|---|---|---|
  | `employeeUid` | `string` | Yes | Employee Auth UID |
  | `date` | `string` | Yes | Date string (`YYYY-MM-DD`) |
  | `status` | `string` | Yes | `'present' \| 'leave' \| 'off' \| 'holiday' \| 'late' \| 'half-day'` |
  | `inTime` | `Timestamp` | No | Timestamp of morning check-in |
  | `outTime` | `Timestamp` | No | Timestamp of departure check-out |
  | `leaveReason` | `string` | No | Employee-provided leave justification |
  | `markedBy` | `string` | Yes | `'self'` or admin UID |
  | `lateMinutes` | `number` | No | Minutes late beyond start time + buffer |
  | `earlyLeaveHours` | `number` | No | Hours departed prior to `officeEndTime` (rounded 0.5h) |
  | `overtimeHours` | `number` | No | Hours worked beyond `officeEndTime` (rounded 0.5h) |
  | `overtimeStatus` | `string` | No | `'approved' \| 'rejected'` |
  | `overtimeReason` | `string` | No | Admin reason when overtime is rejected |
  | `imageUrl` | `string` | No | Firebase Storage URL of webcam photo snapshot |
  | `createdAt` | `Timestamp` | Yes | Server creation timestamp |
  | `updatedAt` | `Timestamp` | No | Server last update timestamp |

---

### 2.6 Collection: `salary_payments`
Disbursement history for employee salaries.
- **Document ID**: Auto-generated Firestore document ID.
- **Schema**:
  | Field | Type | Required | Description |
  |---|---|---|---|
  | `employeeUid` | `string` | Yes | Recipient employee Auth UID |
  | `salaryMonthKey` | `string` | Yes | Billing cycle identifier (e.g. `"2025_12"`) |
  | `amount` | `number` | Yes | Disbursed salary amount |
  | `paidAt` | `Timestamp` | Yes | Disbursement timestamp |
  | `paidBy` | `string` | Yes | UID of administrator who recorded payment |
  | `notes` | `string` | No | Optional payment notes or reference code |

---

## 3. Data Integrity & Partitioning Strategy

1. **Monthly Root Dynamic Partitioning**:
   By using `attendance_{salaryMonthKey}` as the root collection name, records for previous months remain frozen in separate collections. This avoids performance degradation as the database scales over years.
2. **Subcollection Atomicity**:
   Because each punch is written to `.../records/{employeeUid}`, employee writes never lock or conflict with punches from other employees on the same day.
3. **Soft Deletion & Account Preservation**:
   Employees are soft-deactivated via `isActive: false` in [src/lib/firestore.ts:96](file:///d:/attendance/attendance-portal-v2/src/lib/firestore.ts#L96), preventing them from signing in while preserving historical attendance logs.
