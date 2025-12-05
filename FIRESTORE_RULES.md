# Firestore Security Rules

These security rules ensure that only authorized users can access and modify data.

## How to Deploy

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Copy and paste the rules below
5. Click **Publish**

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Helper function to check if user is an admin
    function isAdmin() {
      return isAuthenticated() &&
             exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // Helper function to check if user is an employee
    function isEmployee() {
      return isAuthenticated() &&
             exists(/databases/$(database)/documents/employees/$(request.auth.uid));
    }

    // Admins collection - only admins can read/write
    match /admins/{adminId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }

    // Employees collection - admins can read/write, employees can read their own
    match /employees/{employeeId} {
      allow read: if isAdmin() || (isEmployee() && request.auth.uid == employeeId);
      allow write: if isAdmin();
    }

    // Attendance collections - dynamic based on month
    match /attendance_{month}/{date}/records/{employeeId} {
      // Admins can read/write all records
      allow read, write: if isAdmin();

      // Employees can read/write only their own records
      allow read: if isEmployee() && request.auth.uid == employeeId;
      allow create: if isEmployee() &&
                      request.auth.uid == employeeId &&
                      request.resource.data.employeeUid == request.auth.uid;
      allow update: if isEmployee() &&
                      request.auth.uid == employeeId &&
                      resource.data.employeeUid == request.auth.uid;
    }

    // Holidays collection - admins can read/write, employees can read
    match /holidays/{holidayId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }

    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Rule Breakdown

### Admins Collection

- **Read**: Only admins can view admin documents
- **Write**: Only admins can create/update/delete admin documents

### Employees Collection

- **Read**: Admins can view all employees, employees can view only their own document
- **Write**: Only admins can create/update/delete employee documents

### Attendance Collections

- **Read**: Admins can view all attendance, employees can view only their own
- **Create**: Employees can create only their own attendance records
- **Update**: Employees can update only their own attendance records (for early off)
- **Write**: Admins have full write access

### Holidays Collection

- **Read**: All authenticated users can view holidays
- **Write**: Only admins can create/update/delete holidays

## Testing Rules

After deploying, test the rules:

1. **As Employee**:

   - ✅ Can mark own attendance
   - ✅ Can view own attendance
   - ✅ Can view holidays
   - ❌ Cannot view other employees' attendance
   - ❌ Cannot access admin collection

2. **As Admin**:
   - ✅ Can view all employees
   - ✅ Can view all attendance
   - ✅ Can modify any attendance
   - ✅ Can add/edit employees
   - ✅ Can manage holidays

## Important Notes

- These rules use the `exists()` function which checks if a document exists in the specified path
- The rules are evaluated on every read/write operation
- Make sure to deploy these rules BEFORE adding the first admin
- For initial setup, you may temporarily use permissive rules, then switch to these after adding the first admin

## Temporary Permissive Rules (For Initial Setup Only)

If you need to add the first admin manually, you can temporarily use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ WARNING**: These rules allow any authenticated user to read/write all data. Use only for initial setup, then immediately switch to the secure rules above.
