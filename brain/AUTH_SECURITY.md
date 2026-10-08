# AUTHENTICATION & SECURITY — ATTENDANCE PORTAL

## 1. Authentication Architecture

- **Provider**: Google Identity via Firebase Authentication (`GoogleAuthProvider`).
- **Mode**: Popup authentication (`signInWithPopup(auth, googleProvider)` in [src/lib/auth.ts:23](file:///d:/attendance/attendance-portal-v2/src/lib/auth.ts#L23)).
- **Session Persistence**: Managed automatically by the Firebase Web SDK in browser `IndexedDB`/`localStorage`.
- **State Listener**: Subscribed in [src/context/AuthContext.tsx:42](file:///d:/attendance/attendance-portal-v2/src/context/AuthContext.tsx#L42) using `onAuthStateChanged(auth, ...)`.

---

## 2. Authorization & Roles

The system recognizes three primary authorization states:
1. `'admin'`: Full system access across `/admin/*`.
2. `'employee'`: Access to personal employee views across `/dashboard`, `/calendar`, `/salary`.
3. `null` / Unauthorized: User authenticated via Google, but has no active document in `admins` or `employees`, or has `isActive: false`.

### 2.1 Role Determination Matrix
Implemented in `checkUserRole(user: User)` ([src/lib/auth.ts:42-151](file:///d:/attendance/attendance-portal-v2/src/lib/auth.ts#L42-L151)):

```
1. Check `admins/{user.uid}` -> If exists => Return 'admin'
2. Check `employees/{user.uid}` -> If exists:
     If employee.isActive === false => Sign out user & Return null
     Else => Return 'employee'
3. Query `employees` where `email == user.email`:
     If exists => Migrate document to `employees/{user.uid}`, Delete old doc, Return 'employee'
4. Query `admins` where `email == user.email`:
     If exists => Migrate document to `admins/{user.uid}`, Delete old doc, Return 'admin'
5. If no match => Return null
```

---

## 3. Route Guarding & Boundary Enforcement

### 3.1 Route Guard (`RequireAuth.tsx`)
All private routes are wrapped in `<RequireAuth role="...">`:
- If authentication is loading -> Renders loading `<Skeleton />`.
- If user is not logged in:
  - If target role is `admin` -> Navigates to `/admin/login`.
  - Else -> Navigates to `/login`.
- If user's resolved role does not match required role -> Navigates to `/access-denied`.

### 3.2 Portal Login Boundaries
To prevent cross-portal confusion:
- If an admin logs in at the employee portal (`/login`), the system signs them out and displays:
  `"This is the Employee Portal. Please use the Admin Login."` ([src/routes/shared/Login.tsx:42](file:///d:/attendance/attendance-portal-v2/src/routes/shared/Login.tsx#L42)).
- If an employee logs in at the admin portal (`/admin/login`), the system signs them out and displays:
  `"This is the Admin Portal. Please use the Employee Login."` ([src/routes/shared/AdminLogin.tsx:42](file:///d:/attendance/attendance-portal-v2/src/routes/shared/AdminLogin.tsx#L42)).

---

## 4. Security Considerations & Threat Assessment

1. **Firestore Security Rules Reliance**:
   - Because this application is a pure client-side SPA without an intermediary backend server, all authorization and data validation must be enforced via Cloud Firestore Security Rules in Firebase Console.
   - Without published Firestore rules, malicious clients could theoretically write directly to `admins` or modify attendance punch times.
2. **Client-Side Network Verification**:
   - The office WiFi verification (`verifyNetworkAccess`) runs in the employee's browser. While sufficient for preventing casual out-of-office marking, client-side IP checks can be intercepted or bypassed by sophisticated users using local proxy tools or VPNs.
3. **Hardcoded IP Address**:
   - The allowed office IP `182.184.79.173` is hardcoded in source code (`src/lib/ipRestriction.ts:6`). If the office internet connection acquires a new dynamic IP, the check will fail for all employees until code is updated.
   - *Recommendation*: Move allowed IP into `settings/portal` Firestore document.
4. **Credentials & Secrets**:
   - Firebase API keys used in `src/lib/firebase.ts` are client identifiers (not private server secrets). However, all runtime `.env` files are properly git-ignored in `.gitignore`.
