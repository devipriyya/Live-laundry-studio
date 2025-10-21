# Customer Management - Test Plan

## 📋 Overview
This document provides a comprehensive test plan for the Customer Management feature.

---

## ✅ Pre-Test Setup

### 1. Database Setup
- [ ] MongoDB is running
- [ ] Database has test data
- [ ] At least 5 test users exist
- [ ] Admin account (admin@gmail.com) exists

### 2. Backend Setup
- [ ] Backend server is running (`npm run dev`)
- [ ] Port 5000 is accessible
- [ ] Environment variables are set (`.env` file)
- [ ] Migration script has been run (if needed)

### 3. Frontend Setup
- [ ] Frontend server is running (`npm run dev`)
- [ ] Port 5173 (or configured port) is accessible
- [ ] Can access login page
- [ ] No console errors on page load

---

## 🧪 Test Cases

### Category 1: Authentication & Access

#### Test 1.1: Admin Login
**Steps**:
1. Navigate to login page
2. Enter admin credentials (admin@gmail.com)
3. Click login

**Expected Result**:
- ✅ Login successful
- ✅ Redirected to admin dashboard
- ✅ No errors in console

**Status**: [ ]

---

#### Test 1.2: Non-Admin Access Denied
**Steps**:
1. Login as customer (non-admin)
2. Try to navigate to `/customer-management` or equivalent

**Expected Result**:
- ✅ Access denied or redirected
- ✅ Error message shown
- ✅ Cannot view customer management page

**Status**: [ ]

---

#### Test 1.3: Access Without Login
**Steps**:
1. Logout if logged in
2. Try to access customer management URL directly

**Expected Result**:
- ✅ Redirected to login page
- ✅ Cannot access the page

**Status**: [ ]

---

### Category 2: User List Display

#### Test 2.1: Load User List
**Steps**:
1. Login as admin
2. Navigate to Customer Management
3. Wait for page to load

**Expected Result**:
- ✅ User list loads successfully
- ✅ Statistics cards show correct numbers
- ✅ Table displays users
- ✅ No loading spinner after load
- ✅ No error messages

**Status**: [ ]

---

#### Test 2.2: Admin Account Hidden
**Steps**:
1. On Customer Management page
2. Search for "admin@gmail.com"
3. Check user list

**Expected Result**:
- ✅ admin@gmail.com does NOT appear in list
- ✅ Search returns no results for admin@gmail.com
- ✅ Admin statistics exclude admin@gmail.com

**Status**: [ ]

---

#### Test 2.3: Statistics Accuracy
**Steps**:
1. Note the numbers in statistics cards
2. Count manually or check database
3. Compare

**Expected Result**:
- ✅ Total Users = actual count (minus admin@gmail.com)
- ✅ Customers = users with role 'customer'
- ✅ Admins = users with role 'admin' (minus admin@gmail.com)
- ✅ Blocked = users with isBlocked = true

**Status**: [ ]

---

### Category 3: Search Functionality

#### Test 3.1: Search by Name
**Steps**:
1. Enter a user's name in search box
2. Check results

**Expected Result**:
- ✅ Results filter in real-time
- ✅ Only matching users shown
- ✅ Partial matches work
- ✅ Case-insensitive search

**Status**: [ ]

---

#### Test 3.2: Search by Email
**Steps**:
1. Enter a user's email in search box
2. Check results

**Expected Result**:
- ✅ User with matching email shown
- ✅ Partial email matches work
- ✅ Case-insensitive search

**Status**: [ ]

---

#### Test 3.3: Search by Phone
**Steps**:
1. Enter a phone number in search box
2. Check results

**Expected Result**:
- ✅ User with matching phone shown
- ✅ Partial phone matches work

**Status**: [ ]

---

#### Test 3.4: Search No Results
**Steps**:
1. Enter non-existent search term
2. Check results

**Expected Result**:
- ✅ "No customers found" message
- ✅ Empty table
- ✅ No errors

**Status**: [ ]

---

#### Test 3.5: Clear Search
**Steps**:
1. Perform a search
2. Clear search box
3. Check results

**Expected Result**:
- ✅ All users displayed again
- ✅ Result count updates

**Status**: [ ]

---

### Category 4: Filter Functionality

#### Test 4.1: Filter by Role - Customers
**Steps**:
1. Select "Customers" from role filter
2. Check results

**Expected Result**:
- ✅ Only users with role 'customer' shown
- ✅ Result count updates
- ✅ No admins or delivery staff visible

**Status**: [ ]

---

#### Test 4.2: Filter by Role - Admins
**Steps**:
1. Select "Admins" from role filter
2. Check results

**Expected Result**:
- ✅ Only users with role 'admin' shown
- ✅ admin@gmail.com still NOT shown
- ✅ Result count updates

**Status**: [ ]

---

#### Test 4.3: Filter by Role - Delivery Staff
**Steps**:
1. Select "Delivery Staff" from role filter
2. Check results

**Expected Result**:
- ✅ Only users with role 'delivery' shown
- ✅ Result count updates

**Status**: [ ]

---

#### Test 4.4: Filter by Status - Active
**Steps**:
1. Select "Active" from status filter
2. Check results

**Expected Result**:
- ✅ Only users with isBlocked = false shown
- ✅ All have green "Active" badge
- ✅ Result count updates

**Status**: [ ]

---

#### Test 4.5: Filter by Status - Blocked
**Steps**:
1. Select "Blocked" from status filter
2. Check results

**Expected Result**:
- ✅ Only users with isBlocked = true shown
- ✅ All have red "Blocked" badge
- ✅ Result count updates

**Status**: [ ]

---

#### Test 4.6: Combined Filters
**Steps**:
1. Select role filter (e.g., "Customers")
2. Select status filter (e.g., "Active")
3. Check results

**Expected Result**:
- ✅ Only active customers shown
- ✅ Both filters applied
- ✅ Result count accurate

**Status**: [ ]

---

#### Test 4.7: Filter + Search
**Steps**:
1. Apply a filter
2. Enter search term
3. Check results

**Expected Result**:
- ✅ Both filter and search applied
- ✅ Results match both criteria
- ✅ Result count accurate

**Status**: [ ]

---

### Category 5: View User Details

#### Test 5.1: Open Detail Modal
**Steps**:
1. Click eye icon (👁️) on any user
2. Wait for modal to load

**Expected Result**:
- ✅ Modal opens
- ✅ User details displayed
- ✅ Personal info shown
- ✅ Order statistics shown
- ✅ No errors

**Status**: [ ]

---

#### Test 5.2: View User Personal Info
**Steps**:
1. Open user detail modal
2. Check personal information section

**Expected Result**:
- ✅ Name displayed correctly
- ✅ Email displayed correctly
- ✅ Phone displayed (if available)
- ✅ Addresses displayed (if available)
- ✅ Join date displayed

**Status**: [ ]

---

#### Test 5.3: View User Statistics
**Steps**:
1. Open user detail modal
2. Check statistics section

**Expected Result**:
- ✅ Total orders count shown
- ✅ Total spent amount shown
- ✅ Loyalty points shown (if available)
- ✅ Numbers match database

**Status**: [ ]

---

#### Test 5.4: View User Orders
**Steps**:
1. Open user detail modal
2. Scroll to recent orders section
3. Wait for orders to load

**Expected Result**:
- ✅ Recent orders table shown
- ✅ Up to 5 orders displayed
- ✅ Order number, date, amount, status shown
- ✅ Orders sorted by date (newest first)

**Status**: [ ]

---

#### Test 5.5: Close Detail Modal
**Steps**:
1. Open detail modal
2. Click X button or click outside modal
3. Check modal closes

**Expected Result**:
- ✅ Modal closes
- ✅ Returns to user list
- ✅ No errors

**Status**: [ ]

---

### Category 6: Edit User

#### Test 6.1: Open Edit Modal
**Steps**:
1. Click edit icon (✏️) on any user
2. Wait for modal to load

**Expected Result**:
- ✅ Edit modal opens
- ✅ Form displayed
- ✅ Fields pre-populated with current data
- ✅ No errors

**Status**: [ ]

---

#### Test 6.2: Edit User Name
**Steps**:
1. Open edit modal
2. Change name field
3. Click "Save Changes"

**Expected Result**:
- ✅ Name updated successfully
- ✅ Success message shown
- ✅ Modal closes
- ✅ Table updates with new name
- ✅ Database updated

**Status**: [ ]

---

#### Test 6.3: Edit User Email
**Steps**:
1. Open edit modal
2. Change email field (to unique email)
3. Click "Save Changes"

**Expected Result**:
- ✅ Email updated successfully
- ✅ Success message shown
- ✅ Modal closes
- ✅ Table updates with new email

**Status**: [ ]

---

#### Test 6.4: Edit with Duplicate Email
**Steps**:
1. Open edit modal
2. Change email to existing user's email
3. Click "Save Changes"

**Expected Result**:
- ✅ Error message shown
- ✅ "Email already in use" message
- ✅ Update fails
- ✅ Modal remains open

**Status**: [ ]

---

#### Test 6.5: Edit User Phone
**Steps**:
1. Open edit modal
2. Change phone field
3. Click "Save Changes"

**Expected Result**:
- ✅ Phone updated successfully
- ✅ Success message shown
- ✅ Table updates

**Status**: [ ]

---

#### Test 6.6: Edit User Role
**Steps**:
1. Open edit modal
2. Change role (e.g., customer to admin)
3. Click "Save Changes"

**Expected Result**:
- ✅ Role updated successfully
- ✅ Role badge updates in table
- ✅ Statistics cards update

**Status**: [ ]

---

#### Test 6.7: Cancel Edit
**Steps**:
1. Open edit modal
2. Make changes to fields
3. Click "Cancel"

**Expected Result**:
- ✅ Modal closes
- ✅ Changes NOT saved
- ✅ Original data still shown

**Status**: [ ]

---

#### Test 6.8: Edit with Empty Required Fields
**Steps**:
1. Open edit modal
2. Clear name or email field
3. Try to save

**Expected Result**:
- ✅ Validation error shown
- ✅ Form not submitted
- ✅ Required field highlighted

**Status**: [ ]

---

### Category 7: Block/Unblock Users

#### Test 7.1: Block Active User
**Steps**:
1. Find active user (green badge)
2. Click block icon (🚫)
3. Wait for update

**Expected Result**:
- ✅ User blocked successfully
- ✅ Badge changes to red "Blocked"
- ✅ Icon changes to ✅ (unblock)
- ✅ Success message shown
- ✅ Blocked count increases by 1

**Status**: [ ]

---

#### Test 7.2: Unblock Blocked User
**Steps**:
1. Find blocked user (red badge)
2. Click unblock icon (✅)
3. Wait for update

**Expected Result**:
- ✅ User unblocked successfully
- ✅ Badge changes to green "Active"
- ✅ Icon changes to 🚫 (block)
- ✅ Success message shown
- ✅ Blocked count decreases by 1

**Status**: [ ]

---

#### Test 7.3: Blocked User Cannot Login
**Steps**:
1. Block a user
2. Logout as admin
3. Try to login as blocked user

**Expected Result**:
- ✅ Login fails
- ✅ Error message shown
- ✅ User cannot access system

**Status**: [ ]

---

#### Test 7.4: Unblocked User Can Login
**Steps**:
1. Unblock a user
2. Login as that user

**Expected Result**:
- ✅ Login succeeds
- ✅ User can access system

**Status**: [ ]

---

### Category 8: Delete Users

#### Test 8.1: Click Delete Button
**Steps**:
1. Click delete icon (🗑️) on any user
2. Check modal appears

**Expected Result**:
- ✅ Confirmation modal opens
- ✅ Warning icon shown
- ✅ User name displayed in message
- ✅ Warning about permanence shown

**Status**: [ ]

---

#### Test 8.2: Cancel Delete
**Steps**:
1. Click delete icon
2. In confirmation modal, click "Cancel"

**Expected Result**:
- ✅ Modal closes
- ✅ User NOT deleted
- ✅ User still in list

**Status**: [ ]

---

#### Test 8.3: Confirm Delete
**Steps**:
1. Note total user count
2. Click delete icon
3. In confirmation modal, click "Delete"
4. Wait for completion

**Expected Result**:
- ✅ User deleted successfully
- ✅ Success message shown
- ✅ User removed from list
- ✅ Total user count decreases by 1
- ✅ Modal closes

**Status**: [ ]

---

#### Test 8.4: Verify Delete Persists
**Steps**:
1. Delete a user
2. Refresh the page
3. Check user list

**Expected Result**:
- ✅ Deleted user still NOT in list
- ✅ Delete was permanent
- ✅ Database updated

**Status**: [ ]

---

#### Test 8.5: Delete User with Orders
**Steps**:
1. Find user with orders (order count > 0)
2. Delete the user
3. Check if orders still exist

**Expected Result**:
- ✅ User deleted
- ✅ Orders remain in system (optional: depends on implementation)

**Status**: [ ]

---

### Category 9: Refresh Functionality

#### Test 9.1: Refresh Button
**Steps**:
1. Click refresh button
2. Wait for reload

**Expected Result**:
- ✅ Data reloads from server
- ✅ Loading indicator shows
- ✅ User list updates
- ✅ Statistics update

**Status**: [ ]

---

#### Test 9.2: Auto-Update After Actions
**Steps**:
1. Perform an action (edit, block, delete)
2. Check if list updates automatically

**Expected Result**:
- ✅ List updates without refresh
- ✅ Changes visible immediately
- ✅ Statistics update

**Status**: [ ]

---

### Category 10: Error Handling

#### Test 10.1: Network Error
**Steps**:
1. Disconnect from internet or stop backend
2. Try to load customer management
3. Check error handling

**Expected Result**:
- ✅ Error message shown
- ✅ User-friendly message displayed
- ✅ No crash or white screen

**Status**: [ ]

---

#### Test 10.2: Invalid Token
**Steps**:
1. Login as admin
2. Clear token from localStorage
3. Try to perform action

**Expected Result**:
- ✅ Redirected to login
- ✅ "Not authorized" message
- ✅ No data shown

**Status**: [ ]

---

#### Test 10.3: Server Error
**Steps**:
1. Simulate 500 error from backend
2. Check error handling

**Expected Result**:
- ✅ Error message shown
- ✅ Graceful degradation
- ✅ User can retry

**Status**: [ ]

---

### Category 11: UI/UX

#### Test 11.1: Responsive Design - Mobile
**Steps**:
1. Resize browser to mobile width (< 768px)
2. Check layout

**Expected Result**:
- ✅ Table scrolls horizontally
- ✅ Statistics stack vertically
- ✅ Modals fit screen
- ✅ Buttons accessible

**Status**: [ ]

---

#### Test 11.2: Responsive Design - Tablet
**Steps**:
1. Resize browser to tablet width (768-1024px)
2. Check layout

**Expected Result**:
- ✅ Layout adapts
- ✅ Statistics in 2 columns
- ✅ Table readable

**Status**: [ ]

---

#### Test 11.3: Loading States
**Steps**:
1. Check for loading indicators during data fetch
2. Check for loading during actions

**Expected Result**:
- ✅ Spinner shown while loading
- ✅ "Loading..." message clear
- ✅ No blank screens

**Status**: [ ]

---

#### Test 11.4: Empty States
**Steps**:
1. Filter to show no results
2. Check empty state

**Expected Result**:
- ✅ "No customers found" message
- ✅ User icon or illustration
- ✅ Helpful message

**Status**: [ ]

---

#### Test 11.5: Button Hover States
**Steps**:
1. Hover over action buttons
2. Check visual feedback

**Expected Result**:
- ✅ Buttons change color on hover
- ✅ Cursor changes to pointer
- ✅ Tooltips show (if implemented)

**Status**: [ ]

---

### Category 12: Performance

#### Test 12.1: Load Time - Small Dataset
**Steps**:
1. Clear cache
2. Navigate to customer management
3. Measure load time

**Expected Result**:
- ✅ Loads in < 2 seconds
- ✅ No lag or freeze

**Status**: [ ]
**Load Time**: _____ seconds

---

#### Test 12.2: Load Time - Large Dataset
**Steps**:
1. Test with 100+ users
2. Navigate to customer management
3. Measure load time

**Expected Result**:
- ✅ Loads in < 5 seconds
- ✅ Smooth scrolling

**Status**: [ ]
**Load Time**: _____ seconds

---

#### Test 12.3: Search Performance
**Steps**:
1. Type in search box
2. Check filtering speed

**Expected Result**:
- ✅ Real-time filtering
- ✅ No noticeable lag
- ✅ Smooth typing

**Status**: [ ]

---

### Category 13: Browser Compatibility

#### Test 13.1: Chrome
**Status**: [ ]
**Version**: _____
**Issues**: _____

---

#### Test 13.2: Firefox
**Status**: [ ]
**Version**: _____
**Issues**: _____

---

#### Test 13.3: Safari
**Status**: [ ]
**Version**: _____
**Issues**: _____

---

#### Test 13.4: Edge
**Status**: [ ]
**Version**: _____
**Issues**: _____

---

## 📊 Test Summary

### Test Statistics
- **Total Tests**: 75
- **Passed**: _____
- **Failed**: _____
- **Skipped**: _____
- **Pass Rate**: _____%

### Critical Issues Found
1. _____________________________________
2. _____________________________________
3. _____________________________________

### Minor Issues Found
1. _____________________________________
2. _____________________________________
3. _____________________________________

### Recommendations
1. _____________________________________
2. _____________________________________
3. _____________________________________

---

## ✅ Sign-Off

**Tested By**: _____________________
**Date**: _____________________
**Status**: [ ] PASS  [ ] FAIL  [ ] PASS WITH ISSUES
**Approved By**: _____________________
**Date**: _____________________

---

## 📝 Notes

_Use this space for any additional notes, observations, or comments during testing_

_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________
