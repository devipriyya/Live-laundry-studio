# Firebase Authentication Setup Guide

## Issue: "Email/password accounts are not enabled"

This error occurs when email/password authentication is not enabled in the Firebase console. Follow these steps to fix it:

## Steps to Enable Email/Password Authentication:

1. **Go to Firebase Console**
   - Visit https://console.firebase.google.com/
   - Select your project: `ecowashtracker`

2. **Navigate to Authentication**
   - In the left sidebar, click on **Authentication**
   - Click on the **Sign-in method** tab

3. **Enable Email/Password Provider**
   - Find "Email/Password" in the list of providers
   - Click on it to open the configuration
   - Toggle the **Enable** switch to ON
   - Click **Save**

4. **Optional: Enable Google Sign-In**
   - Find "Google" in the list of providers
   - Click on it to configure
   - Toggle the **Enable** switch to ON
   - Add your project support email
   - Click **Save**

## Verification:

After enabling email/password authentication, the registration form should work without the "operation-not-allowed" error.

## Admin Access:

- Admin users should login directly using the Login page at `/login`
- The admin option has been removed from the registration form
- Admin accounts should be created manually in the Firebase console or through backend admin tools

## Test Users:

You can create test users directly in the Firebase console:
1. Go to Authentication > Users
2. Click "Add user"
3. Enter email, password, and user ID
4. Save the user

## Current Configuration:

- Project ID: ecowashtracker
- Auth Domain: ecowashtracker.firebaseapp.com
- Supported roles: Customer, Delivery Person (Admin login only)