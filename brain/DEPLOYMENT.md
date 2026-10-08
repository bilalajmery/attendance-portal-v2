# DEPLOYMENT GUIDE — ATTENDANCE PORTAL

## 1. Production Build Pipeline

The application is compiled into a static distribution bundle via Vite:

```bash
npm run build
```

This script performs two critical verification steps:
1. `tsc`: Executes TypeScript compiler in `noEmit` mode to ensure 100% type safety and error-free code across all source files.
2. `vite build`: Bundles React components, tree-shakes unused dependencies, minifies JavaScript and CSS, and writes static assets into the `dist/` directory.

---

## 2. Deployment Targets

Because the project produces pure static assets (HTML, CSS, JS, images), it can be hosted on any modern static web host or CDN:

### 2.1 Vercel Deployment
1. Import repository into Vercel.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Configure Environment Variables in Vercel Dashboard matching all six `VITE_FIREBASE_*` variables.
5. Deploy.

### 2.2 Firebase Hosting Deployment
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase Hosting in `attendance-portal-v2`:
   - Public directory: `dist`
   - Configure as single-page app (rewrite all URLs to `/index.html`): `Yes`
3. Deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

### 2.3 Netlify Deployment
1. Connect Git repository in Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add `_redirects` file with `/*  /index.html  200` to support client-side routing.
5. Set environment variables.

---

## 3. Firebase Cloud Storage CORS Deployment

If photo uploads to Cloud Storage encounter cross-origin resource sharing errors from the production domain, deploy the included [cors.json](file:///d:/attendance/attendance-portal-v2/cors.json) configuration:

```bash
gsutil cors set cors.json gs://<your-storage-bucket-name>
```

---

## 4. Firestore Security Rules Deployment

Prior to promoting to production, ensure that Firestore Security Rules are published in the Firebase Console to enforce role-based read/write access. Client applications must never operate in production test mode (`allow read, write: if true;`).
