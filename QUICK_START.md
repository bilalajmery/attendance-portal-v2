# Quick Start Guide

## What's Been Built

✅ Complete Attendance Management System with:

- Employee Portal (mark attendance, view stats, calendar)
- Admin Portal (manage employees, attendance, reports)
- Firebase Authentication (Google Sign-In only)
- Role-based access control
- Salary calculations with deductions
- Monthly reports

## Next Steps to Get Started

### 1. Set Up Firebase (Required)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. **Enable Google Authentication**:

   - Go to Authentication → Get started
   - Click "Sign-in method" tab
   - Enable "Google" provider
   - Save

4. **Create Firestore Database**:

   - Go to Firestore Database → Create database
   - Choose "Start in production mode"
   - Select location (closest to your users)

5. **Get Firebase Config**:

   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Click Web icon (</>) to add web app
   - Register app with name "Attendance Portal"
   - Copy the config values

6. **Add Config to .env**:
   - Open `.env` file in the project root
   - Fill in the Firebase values:
   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

### 2. Deploy Firestore Security Rules

1. In Firebase Console, go to Firestore Database → Rules
2. Copy the rules from `FIRESTORE_RULES.md`
3. Paste and click "Publish"

### 3. Run the Application

```bash
npm run dev
```

Open http://localhost:5173

### 4. Add First Admin

1. Click "Sign in with Google"
2. Sign in with your Google account
3. You'll see "Access Denied" - this is expected
4. Follow the instructions in `SETUP_FIRST_ADMIN.md` to add yourself as admin
5. Sign in again - you should now access the admin portal

### 5. Start Using

**As Admin**:

1. Go to Employees → Add Employee
2. Add employees with their monthly salary
3. Employees can now sign in and mark attendance

**As Employee**:

1. Sign in with Google
2. Mark attendance (Present/Leave/Off)
3. View your calendar and stats

## File Structure

```
Attendance Portal/
├── src/                    # Source code
├── .env                    # Firebase config (fill this in!)
├── .env.example           # Template
├── README.md              # Full documentation
├── SETUP_FIRST_ADMIN.md   # How to add first admin
├── FIRESTORE_RULES.md     # Security rules
└── package.json           # Dependencies
```

## Important Files to Check

1. **`.env`** - Add your Firebase credentials here
2. **`SETUP_FIRST_ADMIN.md`** - Follow this to add yourself as admin
3. **`FIRESTORE_RULES.md`** - Deploy these rules to Firebase
4. **`README.md`** - Complete documentation

## Troubleshooting

**"Access Denied" after sign in?**

- Make sure you've added yourself as admin in Firestore
- Check that the email matches exactly

**Firebase errors?**

- Verify `.env` file has correct values
- Make sure Google Auth is enabled in Firebase Console
- Check Firestore security rules are deployed

**Build errors?**

- Run `npm install` again
- Check Node.js version (should be 18+)

## Need Help?

Check the detailed documentation:

- `README.md` - Full setup guide
- `SETUP_FIRST_ADMIN.md` - Admin setup
- `FIRESTORE_RULES.md` - Security rules
- `walkthrough.md` (in artifacts) - Complete feature walkthrough

## What's Next?

After testing locally:

1. Deploy to Vercel or Netlify
2. Add environment variables in hosting platform
3. Share the URL with your team

---

**Ready to start?** Follow steps 1-5 above! 🚀
