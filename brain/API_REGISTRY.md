# API REGISTRY — ATTENDANCE PORTAL

Because **Attendance Portal** utilizes a serverless architecture where the frontend communicates directly with Google Firebase services, the primary API surface consists of:
1. **Internal Data Operations (Firestore & Storage Service API)**
2. **External HTTP Network APIs (IP Resolution Services)**

---

## 1. Internal Service API Layer

### 1.1 Authentication & Role Operations (`src/lib/auth.ts`)
| Function | Parameters | Return Type | Auth Required | Description |
|---|---|---|---|---|
| `signInWithGoogle` | None | `Promise<User>` | Public | Initiates Google OAuth popup and returns Firebase User |
| `signOutUser` | None | `Promise<void>` | Authenticated | Signs out current user session |
| `checkUserRole` | `user: User` | `Promise<UserRole>` | Authenticated | Determines `'admin'`, `'employee'`, or `null`, running UID migration if needed |

### 1.2 Employee Management Operations (`src/lib/firestore.ts`)
| Function | Parameters | Return Type | Role | Description |
|---|---|---|---|---|
| `getAllEmployees` | None | `Promise<Employee[]>` | Admin | Retrieves all employee records |
| `getEmployee` | `uid: string` | `Promise<Employee \| null>` | Any | Retrieves single employee document |
| `addEmployee` | `uid, email, name, empId, salary, createdBy, ...` | `Promise<void>` | Admin | Creates new employee record with initial email UID |
| `updateEmployee` | `uid: string, updates: Partial<Employee>` | `Promise<void>` | Admin | Modifies employee details |
| `deleteEmployee` | `uid: string` | `Promise<void>` | Admin | Permanently deletes employee record |
| `toggleEmployeeStatus` | `uid: string, isActive: boolean` | `Promise<void>` | Admin | Activates or deactivates employee account |

### 1.3 Administrator Management Operations (`src/lib/firestore.ts`)
| Function | Parameters | Return Type | Role | Description |
|---|---|---|---|---|
| `getAllAdmins` | None | `Promise<Admin[]>` | Admin | Retrieves list of all administrator accounts |
| `getAdmin` | `uid: string` | `Promise<Admin \| null>` | Any | Retrieves admin document by UID |
| `addAdmin` | `uid: string, email: string, name: string` | `Promise<void>` | Admin | Registers new admin document with email UID |

### 1.4 Attendance Operations (`src/lib/firestore.ts`)
| Function | Parameters | Return Type | Role | Description |
|---|---|---|---|---|
| `markAttendance` | `employeeUid, status, markedBy, leaveReason?, isEarlyOff?, imageUrl?` | `Promise<void>` | Self / Admin | Marks daily attendance with WiFi check & photo upload |
| `adminUpsertAttendance` | `employeeUid, dateStr, data: { status?, inTime?, outTime?, leaveReason?, mode }` | `Promise<void>` | Admin | Overrides or creates attendance record for any date |
| `getAttendanceForDate` | `dateStr: string, employeeUid?: string` | `Promise<AttendanceRecord[]>` | Any | Fetches attendance records for a specific calendar date |
| `getMonthlyAttendance` | `employeeUid: string, salaryMonthKey: string` | `Promise<AttendanceRecord[]>` | Any | Fetches all attendance records for an employee across a billing month |
| `updateAttendance` | `dateStr: string, employeeUid: string, updates: Partial<AttendanceRecord>` | `Promise<void>` | Admin | Updates specific fields on an existing attendance record |
| `deleteAttendance` | `dateStr: string, employeeUid: string` | `Promise<void>` | Admin | Removes an attendance record |

### 1.5 Holiday Operations (`src/lib/firestore.ts`)
| Function | Parameters | Return Type | Role | Description |
|---|---|---|---|---|
| `addHoliday` | `dateStr: string, reason?: string` | `Promise<void>` | Admin | Creates holiday entry in `holidays` collection |
| `getHoliday` | `dateStr: string` | `Promise<Holiday \| null>` | Any | Retrieves single holiday by date |
| `getMonthHolidays` | `salaryMonthKey: string` | `Promise<Holiday[]>` | Any | Fetches holidays within the specified salary cycle dates |
| `deleteHoliday` | `dateStr: string` | `Promise<void>` | Admin | Removes holiday entry (prevented in UI if reason is "Sunday") |
| `markAllSundaysForYear` | `year: number` | `Promise<void>` | Admin | Iterates 52 weeks and batch-adds all Sundays as holidays |

### 1.6 Payroll & Maintenance Operations (`src/lib/firestore.ts`)
| Function | Parameters | Return Type | Role | Description |
|---|---|---|---|---|
| `calculateMonthlySalary` | `employeeUid: string, salaryMonthKey: string` | `Promise<SalaryReport \| null>` | Any | Computes deductions and net salary for a single employee |
| `generateMonthlyReport` | `salaryMonthKey: string` | `Promise<SalaryReport[]>` | Admin | Computes payroll deduction reports for all employees |
| `addSalaryPayment` | `payment: Omit<SalaryPayment, 'id'>` | `Promise<void>` | Admin | Records salary payment disbursement |
| `getSalaryPayments` | `salaryMonthKey: string` | `Promise<SalaryPayment[]>` | Admin | Fetches payments recorded for a billing cycle |
| `getEmployeePayments` | `employeeUid: string` | `Promise<SalaryPayment[]>` | Self / Admin | Fetches payment disbursement history for an employee |
| `recomputeMonthlyAttendanceStatus` | `salaryMonthKey: string` | `Promise<number>` | Admin | Re-evaluates in-times against updated settings and re-marks status |

### 1.7 Cloud Storage Operations (`src/lib/storage.ts`)
| Function | Parameters | Return Type | Role | Description |
|---|---|---|---|---|
| `uploadAttendanceImage` | `userId: string, imageSrc: string (base64)` | `Promise<string>` | Self / Admin | Uploads webcam snapshot JPG to Firebase Storage and returns download URL |

---

## 2. External HTTP Network APIs

Used by [src/lib/ipRestriction.ts](file:///d:/attendance/attendance-portal-v2/src/lib/ipRestriction.ts) to verify on-premise WiFi presence.

| Service | Method | Endpoint | Response Format | Extracted Field |
|---|---|---|---|---|
| **ipify** | `GET` | `https://api.ipify.org?format=json` | `{"ip": "182.184.79.173"}` | `data.ip` |
| **my-ip.io** | `GET` | `https://api.my-ip.io/ip.json` | `{"ip": "182.184.79.173"}` | `data.ip` |
| **ipapi.co** | `GET` | `https://ipapi.co/json/` | `{"ip": "182.184.79.173"}` | `data.ip` |

- **Fallback Strategy**: Requests `ipify` first; if it fails or times out, cascades to `my-ip.io`, and then `ipapi.co`. Throws `Failed to verify network connection` if all fail.
