# Setting Up the First Admin

Since the system requires authentication and role-based access, you need to manually add the first admin to Firestore before anyone can access the admin portal.

## Steps

### 1. Sign in with Google

1. Run your application locally: `npm run dev`
2. Go to `http://localhost:5173/login`
3. Click "Sign in with Google"
4. Sign in with the Google account you want to make an admin
5. You'll see an "Access Denied" page - this is expected

### 2. Get Your User ID

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Authentication** → **Users**
4. Find your email in the list
5. Copy the **User UID** (it looks like: `abc123def456...`)

### 3. Add Admin Document to Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `admins`
4. Click **Next**
5. Document ID: Paste your **User UID** from step 2
6. Add the following fields:

   | Field       | Type      | Value                                                       |
   | ----------- | --------- | ----------------------------------------------------------- |
   | `name`      | string    | Your Full Name                                              |
   | `email`     | string    | your.email@example.com                                      |
   | `role`      | string    | admin                                                       |
   | `createdAt` | timestamp | (Click "Add field" → Select "timestamp" → Use current time) |

7. Click **Save**

### 4. Verify Access

1. Go back to your application
2. Sign out (if still on Access Denied page)
3. Sign in again with the same Google account
4. You should now be redirected to `/admin/dashboard` ✅

## Example Firestore Document

```
Collection: admins
Document ID: abc123def456ghi789 (your User UID)

Fields:
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "admin",
  "createdAt": Timestamp (Dec 5, 2025 at 1:00:00 PM UTC+5)
}
```

## Adding More Admins

Once you're logged in as an admin:

1. Go to **Admin Portal** → **Admins**
2. Click **Add Admin**
3. Enter the email and name
4. The new admin will be able to sign in with their Google account

## Troubleshooting

**Still seeing Access Denied?**

- Make sure the email in Firestore matches exactly with your Google account email
- Check that the document ID is your User UID (from Firebase Authentication)
- Clear browser cache and try again
- Check browser console for errors

**Can't find User UID?**

- Make sure you've signed in at least once
- Check Firebase Console → Authentication → Users
- The UID is the long string in the "User UID" column

**Firestore permissions error?**

- Make sure you've deployed the Firestore security rules (see FIRESTORE_RULES.md)
- For initial setup, you can temporarily set rules to allow all reads/writes, then restrict them after adding the first admin
