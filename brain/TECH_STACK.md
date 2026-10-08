# TECH STACK — ATTENDANCE PORTAL

## 1. Verified Core Technologies & Versions

All versions verified directly from [package.json](file:///d:/attendance/attendance-portal-v2/package.json) and lockfile.

### 1.1 Frontend Framework & Runtime
| Technology | Version | Purpose |
|---|---|---|
| **React** | `^18.2.0` | UI component rendering & lifecycle management |
| **React DOM** | `^18.2.0` | Virtual DOM rendering for browser platform |
| **TypeScript** | `^5.3.3` | Static typing, interface definitions, compiler checking |
| **Vite** | `^5.0.8` | Next-generation frontend tooling and HMR dev server |
| **React Router DOM** | `^6.20.0` | Client-side routing, protected route guards, navigation |

### 1.2 Backend as a Service (BaaS)
| Technology | Version | Purpose |
|---|---|---|
| **Firebase Web SDK** | `^10.7.1` | Unified client SDK for Auth, Firestore, and Storage |
| **Firebase Authentication** | `10.7.1` (bundled) | Google OAuth popup authentication (`signInWithPopup`) |
| **Cloud Firestore** | `10.7.1` (bundled) | Real-time NoSQL document database and subcollections |
| **Firebase Cloud Storage** | `10.7.1` (bundled) | Object storage for employee attendance JPEG snapshots |

### 1.3 UI Primitives, Styling & Icons
| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | `^3.3.6` | Utility-first styling framework with custom theme tokens |
| **PostCSS** | `^8.4.32` | CSS transformation pipeline |
| **Autoprefixer** | `^10.4.16` | Automated vendor prefixing for modern CSS rules |
| **@radix-ui/react-tabs** | `^1.1.13` | Accessible tab primitive used in Settings view |
| **class-variance-authority** | `^0.7.0` | Component variant schema management (`cva`) |
| **clsx** | `^2.0.0` | Conditional CSS className constructor |
| **tailwind-merge** | `^2.1.0` | Intelligent conflict-free merging of Tailwind classes |
| **Lucide React** | `^0.294.0` | Comprehensive icon library for UI widgets |
| **Sonner** | `^1.2.0` | Opinionated, accessible toast notifications |

### 1.4 Utilities & Date Handling
| Technology | Version | Purpose |
|---|---|---|
| **date-fns** | `^3.0.0` | Date arithmetic, range intervals, formatting, ISO parsing |

### 1.5 External APIs & Network Services
| Service | Endpoint | Purpose |
|---|---|---|
| **ipify API** | `https://api.ipify.org?format=json` | Primary public IPv4 resolution |
| **my-ip.io API** | `https://api.my-ip.io/ip.json` | Secondary fallback IP resolution |
| **ipapi.co API** | `https://ipapi.co/json/` | Tertiary fallback IP resolution |

---

## 2. Development Tooling & Configuration

### 2.1 Compilers & Type Checkers
- **Target**: `ES2020` (specified in `tsconfig.json`)
- **Module Resolution**: `bundler` (Vite)
- **JSX Mode**: `react-jsx`
- **Strict Mode**: Enabled (`strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`)
- **Path Aliases**:
  - Defined in `tsconfig.json`: `"@/*": ["./src/*"]`
  - Configured in `vite.config.ts`: `resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }`

### 2.2 Linters
- **ESLint**: `^8.55.0`
- **@typescript-eslint/parser**: `^6.14.0`
- **@typescript-eslint/eslint-plugin**: `^6.14.0`
- **Config**: Flat config in `eslint.config.js`

### 2.3 Scripts & Commands
```json
{
  "dev": "vite --host",
  "build": "tsc && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

---

## 3. Stack Observations & Technical Notes

1. **Dual Vite Configuration**:
   - `vite.config.ts`: The active TypeScript config specifying React plugin and `@` path alias.
   - `vite.config.js`: A redundant vanilla JS config without path alias support.
   - *Recommendation*: Remove `vite.config.js` to avoid configuration ambiguity.
2. **Automated Testing Stack**:
   - Currently **missing**. There is no test runner (`vitest`, `jest`) or test utility (`@testing-library/react`) installed in `package.json`.
3. **Migration Scripts Present**:
   - Three migration scripts exist in the project root: `fix-imports.cjs`, `fix-imports.ps1`, `fix-imports.py`. These were used historically to migrate `@/` imports to relative paths.
