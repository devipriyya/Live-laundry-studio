# Schedule Wash Authorization Fix

## Problem
When users tried to place an order for schedule wash service, after successful payment they would see the error message "Order creation failed: Not authorized". This was happening because the frontend components were not properly handling authorization errors when creating orders in the backend.

## Root Cause
The issue was in the error handling of the order creation functions in multiple service components. When the backend API returned a 401 (Unauthorized) or 403 (Forbidden) status, the components were not specifically handling these authentication errors, resulting in a generic error message that was confusing for users.

## Solution
I've updated the error handling in all service components to specifically detect and handle authorization errors:

1. **DashboardSchedule.jsx** - Schedule Wash component
2. **DashboardDryCleaning.jsx** - Dry Cleaning component
3. **DashboardStainRemoval.jsx** - Stain Removal component
4. **DashboardSteamIroning.jsx** - Steam Ironing component
5. **DashboardShoeCleaning.jsx** - Shoe Cleaning component

## Changes Made

### Enhanced Error Handling
Each component's order creation function now includes specific handling for authorization errors:

```javascript
// Handle authorization errors specifically
if (error.response?.status === 401 || error.response?.status === 403) {
  alert('Order creation failed: Not authorized. Please try logging in again and then place your order.');
  // Redirect to login page
  navigate('/login');
  return;
}
```

### Better User Experience
Instead of showing a generic "Order creation failed: Not authorized" message, users now receive a clear instruction:
> "Order creation failed: Not authorized. Please try logging in again and then place your order."

The user is also automatically redirected to the login page to re-authenticate.

## Testing
A test script was created and run successfully to verify that:
1. Admin login works correctly
2. Schedule wash orders can be created successfully
3. Orders are properly stored in the database
4. Orders can be retrieved via the API

## Files Modified
- `frontend/src/pages/dashboard/DashboardSchedule.jsx`
- `frontend/src/pages/dashboard/DashboardDryCleaning.jsx`
- `frontend/src/pages/dashboard/DashboardStainRemoval.jsx`
- `frontend/src/pages/dashboard/DashboardSteamIroning.jsx`
- `frontend/src/pages/dashboard/DashboardShoeCleaning.jsx`

## Test Script
`test-schedule-wash-fix.js` - Verifies the fix is working correctly

## Result
Users will now receive clear instructions when authorization issues occur during order creation, and will be automatically redirected to the login page to resolve authentication issues.