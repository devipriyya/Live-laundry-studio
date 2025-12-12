# Delivery Boy Login Instructions

This document explains how delivery boys can log into the Fabrico Laundry Service system.

## Login Options for Delivery Boys

Delivery boys can login through the main login page using the same credentials as other users.

### 1. Main Login Page (Recommended)

Delivery boys can use the main login page at `http://localhost:5173/login`:

1. Visit the main login page: `http://localhost:5173/login`
2. Enter the email and password provided by your administrator
3. Click "Sign in"
4. You'll be automatically redirected to the delivery dashboard at `/delivery-dashboard`

The system will automatically detect that you're a delivery boy based on your account role and redirect you to the appropriate dashboard.

### 2. Demo Login (For Testing)

For testing purposes, you can use the demo login page:

1. Visit the demo login page: `http://localhost:5173/admin-login-debug`
2. Click on the green "Delivery Boy" card
3. You'll be automatically logged in and redirected to the delivery dashboard at `/delivery-dashboard`

## Troubleshooting Login Issues

If you're unable to login as a delivery boy, check the following:

1. **Verify Account Creation**: Ensure an administrator has created your account in the system
2. **Check Credentials**: Make sure you're using the exact email and password provided by the administrator
3. **Account Status**: Contact your administrator to verify your account is not blocked
4. **Browser Issues**: Try clearing your browser cache or using an incognito/private window

## What Happens After Login?

Once logged in as a delivery boy, you'll be directed to the **Delivery Boy Dashboard** where you can:
- View all orders assigned to you
- Update order statuses (pickup, delivery, etc.)
- See your performance statistics
- Access customer information for assigned orders

The dashboard is optimized for mobile devices, making it easy to use while on the go for pickups and deliveries.