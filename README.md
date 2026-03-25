# Attendance Portal

A production-ready Attendance Management System with separate Employee and Admin portals built with React + Vite, TypeScript, Tailwind CSS, shadcn/ui, and Firebase.

## Features

### Employee Portal (/)

- ✅ Google Sign-In authentication
- ✅ Mark attendance (Present/Leave/Off)
- ✅ Mark early off
- ✅ View monthly statistics (present, leave, off, late days)
- ✅ Estimated net salary calculation
- ✅ Color-coded monthly calendar
- ✅ Last 10 days attendance history

### Admin Portal (/admin)

- ✅ Complete employee management (Add/Edit/Delete)
- ✅ Admin management (Add new admins)
- ✅ View attendance by date or employee
- ✅ Employee calendar view
- ✅ Holiday management (auto-marks Sundays)
- ✅ Monthly salary reports with deductions
- ✅ Dashboard with today's attendance summary

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Authentication**: Firebase Auth (Google Sign-In only)
- **Database**: Firebase Firestore
- **Notifications**: Sonner
- **Date Utilities**: date-fns

## Business Rules

- **Office Hours**: 10:00 AM - 6:00 PM
- **Late**: After 10:15 AM
- **Salary Month**: 6th of current month to 5th of next month
- **Deductions**:
  - Off: 1.2 × (monthly salary / 30)
  - Late: Every 3 lates = half-day deduction
  - Early Leave: (monthly salary / 30 / 8) per hour
- **Sundays**: Auto-marked as holidays

## Prerequisites

- Node.js 18+ and npm
- Firebase account
- Google account for authentication

## Installation

1. **Clone the repository**

   ```bash
   cd "f:/React Work/Attendance Portal"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Google Authentication:
     - Go to Authentication → Sign-in method
     - Enable Google provider
   - Create Firestore database:
     - Go to Firestore Database → Create database
     - Start in production mode
   - Get your Firebase config:
     - Go to Project Settings → General
     - Scroll to "Your apps" → Web app
     - Copy the config values

4. **Configure environment variables**

   - Copy `.env.example` to `.env`

   ```bash
   cp .env.example .env
   ```

   - Fill in your Firebase credentials in `.env`:

   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Add first admin manually**
   - In Firebase Console -> Firestore Database, create a document in `admins` with your Google UID.
   - Example document id: your uid, fields: `email`, `name`, `role: "admin"`.

6. **Deploy Firestore Security Rules**
   - Configure and publish Firestore rules from Firebase Console -> Firestore Database -> Rules.

## Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Deployment

### Vercel

1. Install Vercel CLI:

   ```bash
   npm i -g vercel
   ```

2. Deploy:

   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard

### Netlify

1. Install Netlify CLI:

   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:

   ```bash
   netlify deploy --prod
   ```

3. Add environment variables in Netlify dashboard

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── RequireAuth.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── context/
│   └── AuthContext.tsx
├── lib/
│   ├── firebase.ts
│   ├── auth.ts
│   ├── firestore.ts
│   ├── salary.ts
│   ├── weekHolidays.ts
│   └── utils.ts
├── routes/
│   ├── shared/
│   │   ├── Login.tsx
│   │   └── AccessDenied.tsx
│   ├── employee/
│   │   ├── Layout.tsx
│   │   ├── Dashboard.tsx
│   │   └── Calendar.tsx
│   └── admin/
│       ├── Layout.tsx
│       ├── dashboard/
│       ├── employees/
│       ├── admins/
│       ├── attendance/
│       ├── calendar/
│       ├── holidays/
│       └── reports/
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Firestore Collections

- `admins` - Admin user documents
- `employees` - Employee user documents
- `attendance_YYYY_MM` - Monthly attendance collections
  - `YYYY-MM-DD` - Date documents
    - `records` - Subcollection with employee records
- `holidays` - Holiday documents

## Support

For issues or questions, please create an issue in the repository.

## License

MIT
