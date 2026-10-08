# INTEGRATIONS & THIRD-PARTY SERVICES — ATTENDANCE PORTAL

This document specifies all third-party services, APIs, and cloud infrastructure integrated into the **Attendance Portal**.

---

## 1. Google Firebase BaaS

- **Connected Project ID**: `attendance-portal-39006`
- **Project Number / Sender ID**: `530798570358`
- **Web App ID**: `1:530798570358:web:6e6c234da0cda1dec5a857`
- **SDK Package**: `firebase` (`^10.7.1`)
- **Initialization Module**: [src/lib/firebase.ts](file:///d:/attendance/attendance-portal-v2/src/lib/firebase.ts)
- **Configuration Contract**: Loaded via Vite environment variables (`import.meta.env.VITE_FIREBASE_*`) in `.env`.

### 1.1 Firebase Authentication
- **Service**: Google Identity Platform / Firebase Auth
- **Sign-in Method**: Google OAuth (`google.com` provider enabled)
- **Authorized Domains**: `localhost`, `attendance-portal-39006.firebaseapp.com`, `attendance-portal-39006.web.app`
- **Interaction**: Web popup (`signInWithPopup`)
- **Purpose**: Authenticates employee and admin identities without password storage.

### 1.2 Cloud Firestore
- **Service**: NoSQL Cloud Database (Region: `asia-south1` / Mumbai)
- **Status**: Database `(default)` active and online.
- **Rules File**: [firestore.rules](file:///d:/attendance/attendance-portal-v2/firestore.rules)
- **Interaction**: Direct client SDK connection using WebSockets / HTTP channels.
- **Root Collections**: `admins`, `employees`, `settings`, `holidays`, `attendance_{salaryMonthKey}`, `salary_payments`.
- **Purpose**: Real-time database storing all application state, profiles, punches, and financial records.

### 1.3 Firebase Cloud Storage
- **Service**: Google Cloud Object Storage
- **Bucket Path**: `attendance_images/{userId}/{timestamp}.jpg`
- **Data Transfer**: Base64 data URL upload (`uploadString(..., 'data_url')`)
- **CORS Configuration**: Controlled by [cors.json](file:///d:/attendance/attendance-portal-v2/cors.json):
  ```json
  [
    {
      "origin": ["*"],
      "method": ["GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS"],
      "maxAgeSeconds": 3600
    }
  ]
  ```

---

## 2. Public IP Resolution Services

Used by [src/lib/ipRestriction.ts](file:///d:/attendance/attendance-portal-v2/src/lib/ipRestriction.ts) to verify whether the client is connecting from the authorized office WiFi router.

| Provider | Endpoint | Rate Limiting / Constraints | Reliability Tier |
|---|---|---|---|
| **ipify** | `https://api.ipify.org?format=json` | Free public tier, IPv4 format | Primary |
| **my-ip.io** | `https://api.my-ip.io/ip.json` | Free public tier | Fallback 1 |
| **ipapi.co** | `https://ipapi.co/json/` | Free tier (1,000 requests/day) | Fallback 2 |

---

## 3. Firebase Cloud Messaging (FCM) — Status Note

- A configuration slot for `VITE_FIREBASE_MESSAGING_SENDER_ID` is present in [src/lib/firebase.ts:11](file:///d:/attendance/attendance-portal-v2/src/lib/firebase.ts#L11).
- Push notification handling (`getMessaging`, `getToken`, service worker registration) is **not implemented** in the current codebase.
