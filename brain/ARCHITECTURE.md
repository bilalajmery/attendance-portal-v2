# ARCHITECTURE — ATTENDANCE PORTAL

## 1. System Topology Overview

The **Attendance Portal** is architected as a serverless Single Page Application (SPA) communicating directly with Google Firebase Backend-as-a-Service (BaaS) and external network IP services.

```mermaid
graph TD
    User([End User / Browser])
    
    subgraph FrontendApp ["React 18 SPA (Vite + TypeScript)"]
        Router["React Router v6 (/routes)"]
        AuthCtx["AuthContext (src/context/AuthContext.tsx)"]
        SettingsCtx["SettingsContext (src/context/SettingsContext.tsx)"]
        ThemeCtx["ThemeContext (src/context/ThemeContext.tsx)"]
        Services["Service Layer (src/lib/*.ts)"]
        UI["shadcn/ui & Tailwind CSS Components"]
    end

    subgraph FirebaseServices ["Google Firebase BaaS"]
        FirebaseAuth["Firebase Authentication (Google OAuth)"]
        Firestore["Cloud Firestore (NoSQL Document DB)"]
        Storage["Cloud Storage (Attendance Photo JPGs)"]
    end

    subgraph ExternalServices ["External Network Services"]
        IPService["Public IP Detection (ipify, my-ip.io, ipapi.co)"]
    end

    User -->|HTTP/HTTPS| Router
    Router --> AuthCtx
    Router --> SettingsCtx
    Router --> ThemeCtx
    Router --> UI
    UI --> Services
    
    Services -->|OAuth Popup| FirebaseAuth
    Services -->|CRUD Operations| Firestore
    Services -->|Base64 DataURL Upload| Storage
    Services -->|GET Public IP| IPService
```

---

## 2. Component Relationships & Layering

The codebase follows a modular client-side layered architecture:

```
src/
├── main.tsx                      # DOM root mounting & React.StrictMode
├── App.tsx                       # Provider tree & Route configuration
├── components/
│   ├── auth/RequireAuth.tsx      # Route guard verifying user authentication & role
│   ├── ui/                       # Atomic UI widgets (Radix UI / Tailwind primitives)
│   └── ThemeToggle.tsx           # Light/Dark mode switcher
├── context/
│   ├── AuthContext.tsx           # Auth state listener, role resolution & profile
│   ├── SettingsContext.tsx       # System-wide operational settings & branding
│   └── ThemeContext.tsx          # LocalStorage-backed theme state (light/dark)
├── lib/
│   ├── firebase.ts               # Firebase App & SDK service initialization
│   ├── auth.ts                   # Google popup sign-in, sign-out, role migration
│   ├── firestore.ts              # Data access layer for Firestore operations
│   ├── salary.ts                 # Domain math: deductions, late status, hours
│   ├── holidays.ts               # Sundays generator & calendar utilities
│   ├── weekHolidays.ts           # Week-interval holiday filtering & formatting
│   ├── ipRestriction.ts          # Public IP detection & office WiFi validation
│   ├── storage.ts                # Base64 photo upload to Cloud Storage
│   └── utils.ts                  # Tailwind clsx + twMerge helper
├── routes/
│   ├── shared/                   # Public routes: Login, AdminLogin, AccessDenied
│   ├── employee/                 # Employee views: Dashboard, Calendar, Salary
│   └── admin/                    # Admin views: Dashboard, Employees, Attendance, etc.
└── types/index.ts                # TypeScript interfaces for entities & records
```

---

## 3. Authentication & Role Migration Pipeline

The application uses Google Sign-In with automated database record synchronization:

```mermaid
sequenceDiagram
    autonumber
    actor User as Employee / Admin
    participant UI as Login Page (/login or /admin/login)
    participant Auth as Firebase Auth
    participant AuthCtx as AuthContext
    participant AuthLib as auth.ts (checkUserRole)
    participant DB as Cloud Firestore

    User->>UI: Clicks "Sign in with Google"
    UI->>Auth: signInWithPopup(GoogleAuthProvider)
    Auth-->>UI: Returns User Object (user.uid, user.email)
    Auth-->>AuthCtx: onAuthStateChanged triggers
    AuthCtx->>AuthLib: checkUserRole(user)

    AuthLib->>DB: Check admins/{user.uid}
    alt UID exists in admins
        DB-->>AuthLib: Admin document exists
        AuthLib-->>AuthCtx: Returns 'admin'
    else Not in admins by UID
        AuthLib->>DB: Check employees/{user.uid}
        alt UID exists in employees
            DB-->>AuthLib: Employee document exists
            AuthLib-->>AuthCtx: Returns 'employee'
        else UID not found in either
            AuthLib->>DB: Query employees where email == user.email
            alt Record found by email
                Note over AuthLib,DB: Pre-registered by Admin with sanitized email UID
                AuthLib->>DB: Create employees/{user.uid} (Migrate data)
                AuthLib->>DB: Delete old employees/{oldSanitizedUid}
                AuthLib-->>AuthCtx: Returns 'employee'
            else Not found in employees by email
                AuthLib->>DB: Query admins where email == user.email
                alt Record found by email
                    AuthLib->>DB: Create admins/{user.uid} (Migrate data)
                    AuthLib->>DB: Delete old admins/{oldSanitizedUid}
                    AuthLib-->>AuthCtx: Returns 'admin'
                else No record matches
                    AuthLib-->>AuthCtx: Returns null
                end
            end
        end
    end

    alt Role matches portal
        AuthCtx->>UI: Allow access to dashboard
    else Role mismatch or null
        AuthCtx->>Auth: signOut()
        AuthCtx->>UI: Redirect to /access-denied or display mismatch toast
    end
```

---

## 4. Attendance Marking & Processing Architecture

```mermaid
flowchart TD
    Start([Employee clicks 'Mark Present' or 'Mark Out']) --> CheckRole{Marked by Self?}
    CheckRole -->|Yes| CheckType{Status = Present or Out Time?}
    CheckRole -->|No, Admin| BypassNetwork[Bypass Network Check]
    
    CheckType -->|Yes| FetchIP[Call getUserIP: ipify / my-ip.io / ipapi.co]
    CheckType -->|No, Leave/Off| BypassNetwork
    
    FetchIP --> ValidateIP{User IP == ALLOWED_IP '182.184.79.173'?}
    ValidateIP -->|No| RejectNetwork[Throw Error: Access denied. Must be on office WiFi]
    ValidateIP -->|Yes| CameraCheck{enableCameraCapture = true?}
    
    BypassNetwork --> CameraCheck
    
    CameraCheck -->|Yes| CaptureWebcam[Capture Video Frame via Canvas]
    CameraCheck -->|No| PrepRecord[Prepare Attendance Record]
    
    CaptureWebcam --> UploadStorage[Upload to Cloud Storage with 5s timeout]
    UploadStorage -->|Success or Graceful Fail| PrepRecord
    
    PrepRecord --> CheckExisting{Record exists for today?}
    
    CheckExisting -->|Is Early Off / Out Time| UpdateRecord["Update existing record:
    - outTime = now()
    - earlyLeaveHours = calculateEarlyLeaveHours()
    - overtimeHours = calculateOvertimeHours()"]
    
    CheckExisting -->|Mark Present & Exists| ErrorDuplicate[Throw Error: Attendance already marked for today]
    
    CheckExisting -->|New Record| EvalStatus["Determine status:
    - If diff > 60m: 'half-day'
    - Else if diff > lateBuffer: 'late'
    - Else: 'present'"]
    
    EvalStatus --> WriteDB["Write to Firestore:
    attendance_{salaryMonthKey}/{dateStr}/records/{uid}"]
    UpdateRecord --> WriteDB
    WriteDB --> Done([Attendance Recorded])
```

---

## 5. Database Access & Data Partitioning Patterns

Instead of storing all attendance records in a single monolithic collection with millions of rows, the architecture implements **Dynamic Root Partitioning**:
- Each salary billing cycle is assigned its own dedicated root collection:
  `attendance_{salaryMonthKey}` (e.g. `attendance_2025_12`).
- Each day within the cycle is stored as a document:
  `attendance_{salaryMonthKey}/{YYYY-MM-DD}`
- Individual attendance entries are stored in a nested subcollection:
  `attendance_{salaryMonthKey}/{YYYY-MM-DD}/records/{employeeUid}`

This partitioning ensures:
1. Fast parallel reads when rendering daily or monthly grids.
2. Natural historical archiving by month key.
3. High write concurrency across employees without document locking contention.

---

## 6. Architectural Constraints & Limitations
1. **Client-Side BaaS Model**: There is no custom backend service. All business rules and authorization policies executed in code are duplicated or must be secured by Firestore Security Rules.
2. **Synchronous Reporting Aggregation**: Monthly salary reports are computed on the client by fetching all daily attendance records in parallel for the month (`generateMonthlyReport` in `src/lib/firestore.ts:657`). For organizations with large numbers of employees, this causes high read volume.
3. **Hardcoded IP Constraint**: The authorized IP address (`182.184.79.173`) is hardcoded in `src/lib/ipRestriction.ts:6`, rather than loaded dynamically from Firestore settings.
