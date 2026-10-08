# PROJECT STRUCTURE — ATTENDANCE PORTAL

## 1. Directory Tree Map

```
d:\attendance\
├── brain/                             # UNIVERSAL BRAIN Knowledge System (Root)
│   ├── README.md                      # Index and navigation map
│   ├── ...                            # Canonical architecture and domain specs
│   └── tasks/                         # Task memory records & templates
├── AGENTS.md                          # Persistent agent rules & operating contract
└── attendance-portal-v2/              # Primary Application Repository
    ├── .env.example                   # Environment variable template
    ├── .gitignore                     # Git ignore rules (ignores .env, dist, logs)
    ├── cors.json                      # Firebase Cloud Storage CORS configuration
    ├── eslint.config.js               # ESLint configuration
    ├── fix-imports.cjs                # Legacy CommonJS import migration script
    ├── fix-imports.ps1                # Legacy PowerShell import migration script
    ├── fix-imports.py                 # Legacy Python import migration script
    ├── index.html                     # HTML5 SPA entry point and root mounting div
    ├── jsconfig.json                  # Editor JS path alias mapping
    ├── package.json                   # Dependencies, devDependencies, npm scripts
    ├── package-lock.json              # Pinned dependency lockfile
    ├── postcss.config.js              # PostCSS plugin registration (Tailwind, Autoprefixer)
    ├── README.md                      # Project setup & getting started guide
    ├── tailwind.config.js             # Tailwind CSS theme configuration & palette
    ├── tsconfig.json                  # TypeScript compiler settings & path alias
    ├── tsconfig.node.json             # TypeScript compiler settings for Vite config
    ├── vite.config.js                 # Redundant Vite config (legacy)
    ├── vite.config.ts                 # Active Vite config with '@' alias
    ├── public/                        # Static assets served at root
    │   ├── favicon.ico                # Browser tab icon
    │   └── logo.png                   # Default portal logo asset
    └── src/                           # Application source code
        ├── App.tsx                    # Root React component: Router, Providers, Routes
        ├── index.css                  # Global CSS tokens, Tailwind directives, dark mode
        ├── main.tsx                   # React DOM root render entry point
        ├── vite-env.d.ts              # Vite client types declaration
        ├── assets/                    # Bundled frontend assets
        │   └── react.svg              # React logo SVG
        ├── components/                # Reusable UI components
        │   ├── ThemeToggle.tsx        # Light/Dark mode switcher button
        │   ├── auth/
        │   │   └── RequireAuth.tsx    # Role-based route guard component
        │   └── ui/                    # shadcn/ui inspired atomic widgets
        │       ├── badge.tsx          # Status badges (present, late, leave, etc.)
        │       ├── button.tsx         # Styled button with CVA variants
        │       ├── card.tsx           # Card containers (Header, Content, Title)
        │       ├── dialog.tsx         # Modal dialog wrapper (used for popups)
        │       ├── input.tsx          # Form text inputs
        │       ├── label.tsx          # Form field labels
        │       ├── select.tsx         # Styled dropdown select element
        │       ├── skeleton.tsx       # Loading skeleton placeholders
        │       ├── table.tsx          # Data tables (Header, Body, Row, Cell)
        │       ├── tabs.tsx           # Radix UI tabs (used in Settings)
        │       └── textarea.tsx       # Multiline text input
        ├── context/                   # Global React state providers
        │   ├── AuthContext.tsx        # Firebase auth state & user profile context
        │   ├── SettingsContext.tsx    # Portal settings & branding context
        │   └── ThemeContext.tsx       # Dark/Light theme state & local storage sync
        ├── lib/                       # Core service layer & domain utilities
        │   ├── auth.ts                # Google sign-in/out, role checks & UID migration
        │   ├── firebase.ts            # Firebase App, Auth, Firestore, Storage init
        │   ├── firestore.ts           # All Firestore CRUD operations & aggregations
        │   ├── holidays.ts            # Sundays generator and month holiday utilities
        │   ├── ipRestriction.ts       # Public IP lookup and office WiFi validation
        │   ├── salary.ts              # Salary deductions, overtime, late math formulas
        │   ├── storage.ts             # Base64 photo upload to Cloud Storage
        │   ├── utils.ts               # clsx and tailwind-merge helper (cn function)
        │   └── weekHolidays.ts        # Weekly holiday range calculation & display
        ├── routes/                    # Page components & routed layouts
        │   ├── shared/                # Public access routes
        │   │   ├── Login.tsx          # Employee login portal
        │   │   ├── AdminLogin.tsx     # Administrator login portal
        │   │   └── AccessDenied.tsx   # Unauthorized user screen
        │   ├── employee/              # Authenticated employee views
        │   │   ├── Layout.tsx         # Employee navigation header and layout shell
        │   │   ├── Dashboard.tsx      # Main employee view (marking, stats, camera)
        │   │   ├── Calendar.tsx       # Employee personal attendance calendar
        │   │   └── Salary.tsx         # Employee salary payment history
        │   └── admin/                 # Authenticated admin views
        │       ├── Layout.tsx         # Admin navigation sidebar/header and layout shell
        │       ├── dashboard/
        │       │   └── Dashboard.tsx  # Executive metrics, recent activity, quick actions
        │       ├── employees/
        │       │   ├── EmployeeList.tsx        # Employee table with activate/deactivate
        │       │   ├── AddEmployeeDialog.tsx   # Modal to pre-register new employees
        │       │   └── EditEmployeeDialog.tsx  # Modal to update employee details
        │       ├── admins/
        │       │   └── AdminList.tsx  # Admin user management table and add modal
        │       ├── attendance/
        │       │   └── AttendanceView.tsx      # Daily attendance sheet & admin upsert
        │       ├── calendar/
        │       │   └── CalendarView.tsx        # Organization-wide monthly calendar
        │       ├── holidays/
        │       │   └── HolidayManagement.tsx   # Add/delete holidays & auto-mark Sundays
        │       ├── overtime/
        │       │   └── Overtime.tsx   # Overtime hours list & reject dialog
        │       ├── reports/
        │       │   ├── SalaryReports.tsx       # Monthly payroll report with CSV export
        │       │   └── PaidSalaries.tsx        # Payment disbursement records & filter
        │       └── settings/
        │           └── Settings.tsx   # Portal hours, logos, currency, maintenance
        └── types/
            └── index.ts               # TypeScript data models and entity definitions
```

---

## 2. Application Entry Points & Bootstrapping

1. **HTML Shell (`index.html`)**: Defines `<div id="root"></div>` and imports `/src/main.tsx`.
2. **Mounting Script (`src/main.tsx`)**: Mounts `<App />` under `React.StrictMode`.
3. **Provider Tree (`src/App.tsx`)**: Sets up the cascade of global contexts:
   ```tsx
   <ThemeProvider>
     <AuthProvider>
       <SettingsProvider>
         <BrowserRouter>
           <Routes>...</Routes>
         </BrowserRouter>
         <Toaster />
       </SettingsProvider>
     </AuthProvider>
   </ThemeProvider>
   ```
4. **Route Guarding (`src/components/auth/RequireAuth.tsx`)**: Enforces authentication state and role isolation (`employee` vs `admin`).
