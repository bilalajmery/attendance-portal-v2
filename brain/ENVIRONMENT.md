# ENVIRONMENT & CONFIGURATION — ATTENDANCE PORTAL

## 1. Required Environment Variables

All environment variables must be defined in `.env` (or `.env.local`) at the root of `attendance-portal-v2/`. They are injected by Vite at build/runtime using the `VITE_` prefix.

| Variable Name | Required | Example / Placeholder Format | Purpose |
|---|---|---|---|
| `VITE_FIREBASE_API_KEY` | **Yes** | `AIzaSy...` | Firebase Web Client API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | **Yes** | `your-app.firebaseapp.com` | Firebase Auth domain for OAuth callbacks |
| `VITE_FIREBASE_PROJECT_ID` | **Yes** | `attendance-portal-123` | Google Cloud / Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | **Yes** | `attendance-portal-123.appspot.com` | Google Cloud Storage Bucket for photos |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | **Yes** | `123456789012` | Firebase Cloud Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | **Yes** | `1:123456789012:web:abcdef...` | Firebase Web Application ID |

*Template Reference*: [.env.example](file:///d:/attendance/attendance-portal-v2/.env.example)

---

## 2. Local Environment Setup

### 2.1 Prerequisites
- **Node.js**: v18.x or v20.x recommended
- **npm**: v9.x or v10.x
- **Web Browser**: Chrome, Edge, Firefox, or Safari with webcam permission support

### 2.2 Initial Setup Steps
```bash
# 1. Navigate to the application folder
cd attendance-portal-v2

# 2. Copy the environment template
cp .env.example .env

# 3. Open .env and populate with credentials from Firebase Console:
#    Project Settings -> General -> Your apps -> Web app config

# 4. Install dependencies
npm install

# 5. Start the Vite development server
npm run dev
```

### 2.3 Available npm Commands
- `npm run dev`: Starts local development server on `http://localhost:5173` with `--host` enabled for network testing.
- `npm run build`: Executes TypeScript typecheck (`tsc`) followed by production bundle compilation (`vite build`).
- `npm run lint`: Runs ESLint across all `.ts` and `.tsx` source files.
- `npm run preview`: Starts local HTTP server previewing the generated `dist/` bundle.

---

## 3. Current Environment Audit State

- **Environment File**: **Configured** ([.env](file:///d:/attendance/attendance-portal-v2/.env)).
- **Connected Project**: `attendance-portal-39006`.
- **Git Protection**: Verified git-ignored in `.gitignore`.
- **Service Account Key**: Secured at `D:\attendance\serviceAccountKey.json` outside the Git repository. Excluded from version control.
- **Pending Local Step**: Run `npm install` to install local dependencies (`node_modules`) before executing `npm run dev` or `npm run build`.

