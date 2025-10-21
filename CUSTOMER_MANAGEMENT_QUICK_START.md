# Customer Management - Quick Start Guide

## Accessing Customer Management

### Step 1: Login as Admin
1. Navigate to the login page
2. Login with admin credentials:
   - Email: `admin@gmail.com`
   - Password: (your admin password)

### Step 2: Open Customer Management
1. After logging in, you'll be on the Admin Dashboard
2. Look for the sidebar menu
3. Click on **"Customer Management"** or **"Customers"** option

## What You'll See

### Dashboard Overview
When you open Customer Management, you'll see:

1. **Statistics Cards** (Top of the page)
   - Total Users count
   - Customers count
   - Admins count
   - Blocked Users count

2. **Search and Filters**
   - Search bar: Search by name, email, or phone
   - Role Filter: Filter by All/Customers/Admins/Delivery Staff
   - Status Filter: Filter by All/Active/Blocked
   - Refresh button: Reload the user list

3. **User Table**
   Columns displayed:
   - User (Name and ID)
   - Contact (Email and Phone)
   - Role (Customer/Admin/Delivery Staff)
   - Orders (Total number)
   - Total Spent (Amount in INR)
   - Status (Active/Blocked)
   - Actions (View/Edit/Block/Delete buttons)

## Key Features

### 1. View User Details 👁️
- Click the **eye icon** (👁️) in the Actions column
- A modal opens showing:
  - Personal information (name, email, phone, addresses)
  - Account status and role
  - Order statistics
  - User preferences
  - Recent order history (last 5 orders)

### 2. Edit User Information ✏️
- Click the **pencil icon** (✏️) in the Actions column
- A form opens where you can update:
  - Name
  - Email
  - Phone
  - Role
- Click **"Save Changes"** to update
- Click **"Cancel"** to close without saving

### 3. Suspend/Unsuspend Users 🚫
- Click the **block/unblock icon** in the Actions column
- **To Suspend**: Click when user is Active (shows orange/red icon)
- **To Unsuspend**: Click when user is Blocked (shows green checkmark)
- The status badge will update immediately:
  - Green badge = Active user
  - Red badge = Blocked user
- Blocked users cannot login to the system

### 4. Delete Users 🗑️
- Click the **trash icon** (🗑️) in the Actions column
- A confirmation modal appears warning:
  - "Are you sure you want to delete [User Name]?"
  - "This action cannot be undone."
- Click **"Cancel"** to abort
- Click **"Delete"** to permanently remove the user
- The user will be removed from the table

## Important Notes

### Protected Admin Account
- The admin user with email `admin@gmail.com` **WILL NOT** appear in the customer list
- This prevents accidental deletion or modification of the main admin account
- You'll see all other users including other admins (if any)

### User Roles
The system supports three roles:
- **Customer**: Regular users who place orders
- **Admin**: Administrators with full access
- **Delivery Staff**: Delivery personnel who handle deliveries

### Blocked Users
- Blocked users cannot login
- Their existing orders remain in the system
- They can be unblocked at any time
- Blocking is reversible, deleting is not

## Common Actions

### Search for a Specific User
1. Type in the search box:
   - User's name
   - Email address
   - Phone number (if available)
2. The table updates automatically as you type

### View Only Customers
1. Click the **Role Filter** dropdown
2. Select **"Customers"**
3. Only customer accounts will be displayed

### View Only Blocked Users
1. Click the **Status Filter** dropdown
2. Select **"Blocked"**
3. Only blocked users will be shown

### Unblock Multiple Users
1. Filter to show only blocked users
2. Click the green checkmark icon for each user you want to unblock
3. Each user will be unblocked individually

## Troubleshooting

### No Users Displayed
- **Check**: Are you logged in as admin?
- **Try**: Click the Refresh button
- **Verify**: Check your internet connection
- **Check**: Look for error messages at the top of the page

### Cannot Edit/Delete Users
- **Verify**: You're logged in as admin
- **Check**: The user is not admin@gmail.com (this user is protected)
- **Try**: Refresh the page and try again

### Search Not Working
- **Check**: You're typing in the search box correctly
- **Try**: Clear the search and try again
- **Verify**: The user exists in the database

### Changes Not Saving
- **Check**: All required fields are filled
- **Verify**: Email is unique (not used by another user)
- **Check**: Internet connection
- **Look**: For error messages in the modal

## API Endpoints Used

The frontend calls these backend APIs:

```
GET    /api/auth/users              - Fetch all users
GET    /api/auth/users/:id          - Get single user
PUT    /api/auth/users/:id          - Update user
DELETE /api/auth/users/:id          - Delete user
PATCH  /api/auth/users/:id/block    - Block/unblock user
GET    /api/auth/users/:id/orders   - Get user's orders
```

All these endpoints require admin authentication.

## Sample Workflow: Managing a Customer

### Scenario: Customer requests account suspension

1. **Find the customer**
   - Use search box to find customer by name or email
   
2. **View their details** (optional)
   - Click eye icon to review their account
   - Check their order history
   - Note their total spent
   
3. **Suspend the account**
   - Click the block icon (orange/red)
   - Confirm the customer is now blocked (red badge)
   
4. **Later: Reactivate the account**
   - Find the customer again (filter by "Blocked" status)
   - Click the unblock icon (green checkmark)
   - Verify the customer is now active (green badge)

### Scenario: Delete inactive customer account

1. **Identify the customer**
   - Search for the customer
   - Verify they have 0 orders (or minimal activity)
   
2. **Delete the account**
   - Click trash icon
   - Read the warning message
   - Confirm deletion
   - Customer is removed from the system

## Security Features

✅ **Authentication Required**: Only logged-in admins can access this page  
✅ **Protected Admin Account**: admin@gmail.com cannot be modified/deleted  
✅ **Confirmation Dialogs**: Prevents accidental deletions  
✅ **Email Validation**: Prevents duplicate emails  
✅ **Password Protection**: Passwords never shown in the UI  

## Getting Help

If you encounter issues:
1. Check the browser console for error messages (F12)
2. Verify backend server is running
3. Check network tab for failed API calls
4. Review the CUSTOMER_MANAGEMENT_IMPLEMENTATION.md for technical details

## Testing the Feature

To thoroughly test:

1. ✅ Login as admin
2. ✅ Verify user list loads
3. ✅ Verify admin@gmail.com is NOT in the list
4. ✅ Test search functionality
5. ✅ Test role filters
6. ✅ Test status filters
7. ✅ View user details
8. ✅ Edit a user's information
9. ✅ Block a user
10. ✅ Unblock a user
11. ✅ Delete a user (with confirmation)
12. ✅ Refresh the list

All features should work smoothly!

## Conclusion

The Customer Management feature provides administrators with complete control over user accounts while protecting the main admin account from accidental modification. Use this feature to maintain your user base, manage customer relationships, and ensure system security.
