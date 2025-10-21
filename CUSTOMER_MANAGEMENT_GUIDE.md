# Customer Management Feature - Complete Guide

## Overview
The Customer Management system provides administrators with comprehensive tools to manage all registered users, including customers, delivery staff, and other admins.

## Features Implemented

### ✅ 1. View All Registered Users
- **Dashboard Stats**: 
  - Total Users
  - Total Customers
  - Total Admins
  - Blocked Users Count
- **User List Table** with columns:
  - User (Name + ID)
  - Contact (Email + Phone)
  - Role (Customer/Admin/Delivery)
  - Total Orders
  - Total Spent
  - Account Status (Active/Blocked)
  - Action Buttons

### ✅ 2. Edit Users
- Click the **Edit (pencil) icon** on any user row
- Edit Modal allows updating:
  - Name
  - Email
  - Phone
  - Role (Customer/Admin/Delivery)
- Changes are saved to the backend immediately
- Success/error notifications

### ✅ 3. Delete Users
- Click the **Delete (trash) icon** on any user row
- Confirmation modal prevents accidental deletion
- User is permanently removed from the system
- Success/error notifications

### ✅ 4. Block/Unblock Users
- Click the **Block/Unblock icon** on any user row
- Toggle between blocked and active status
- Blocked users cannot access the system (future implementation)
- Visual indicator shows blocked status
- Instant status update with confirmation

### ✅ 5. View User Order History
- Click the **View (eye) icon** on any user row
- Detailed modal displays:
  - Personal Information (Name, Email, Phone, Addresses, Join Date)
  - Account Status & Role
  - Loyalty Points
  - Order Statistics (Total Orders, Total Spent)
  - User Preferences (Language, Currency, Theme)
  - Recent Orders Table (last 5 orders with Order Number, Date, Amount, Status)

### ✅ 6. Search and Filter Users
- **Search Bar**: Search by name, email, or phone number
- **Role Filter**: Filter by Customer, Admin, or Delivery Staff
- **Status Filter**: Filter by Active or Blocked users
- **Results Counter**: Shows filtered vs total users
- **Refresh Button**: Reload data from server

## Backend API Endpoints

### User Management Routes (Admin Only)
All routes require admin authentication (`protect` + `isAdmin` middleware)

#### 1. Get All Users
```
GET /api/auth/users
Query Parameters:
  - role: customer|admin|delivery (optional)
  - search: string (optional) - searches name, email, phone
  - status: blocked|active (optional)
```

#### 2. Get Single User
```
GET /api/auth/users/:id
```

#### 3. Update User
```
PUT /api/auth/users/:id
Body: {
  name: string,
  email: string,
  phone: string,
  role: customer|admin|delivery,
  addresses: array,
  preferences: object
}
```

#### 4. Delete User
```
DELETE /api/auth/users/:id
```

#### 5. Block/Unblock User
```
PATCH /api/auth/users/:id/block
Body: {
  isBlocked: boolean
}
```

#### 6. Get User's Order History
```
GET /api/auth/users/:id/orders
```

## Database Schema Updates

### User Model
Added `isBlocked` field:
```javascript
{
  name: String,
  email: String,
  password: String,
  phone: String,
  role: String (customer|admin|delivery),
  isBlocked: Boolean (default: false), // NEW FIELD
  addresses: Array,
  preferences: Object,
  stats: {
    totalOrders: Number,
    totalSpent: Number,
    loyaltyPoints: Number,
    memberSince: Date
  }
}
```

## How to Access

### For Admins:
1. Log in to the admin dashboard
2. Navigate to "Customer Management" from the sidebar
3. View all registered users with statistics

### Main Interface Sections:

#### Statistics Cards (Top Row)
- **Total Users**: All registered users
- **Customers**: Users with 'customer' role
- **Admins**: Users with 'admin' role  
- **Blocked Users**: Users who are currently blocked

#### Search & Filter Bar
- **Search Box**: Real-time search across name, email, phone
- **Role Dropdown**: Filter by user role
- **Status Dropdown**: Filter by active/blocked status
- **Refresh Button**: Reload data from server

#### User Table
Each row shows user information with action buttons:
- 👁️ **View**: Open detailed user profile with order history
- ✏️ **Edit**: Modify user information
- 🚫/✅ **Block/Unblock**: Toggle user access
- 🗑️ **Delete**: Remove user (with confirmation)

## User Actions Guide

### Viewing User Details
1. Click the **eye icon** next to any user
2. View comprehensive user information:
   - Personal details
   - Account status and role
   - Order statistics
   - Recent order history (last 5 orders)
3. Click X or outside modal to close

### Editing a User
1. Click the **pencil icon** next to any user
2. Edit form appears with current data
3. Modify any of these fields:
   - Name
   - Email
   - Phone
   - Role
4. Click "Save Changes" to update
5. Success message confirms update

### Blocking a User
1. Click the **block icon** (🚫) next to any user
2. Status changes immediately to "Blocked"
3. Icon changes to checkmark (✅)
4. Click again to unblock
5. Success message confirms action

### Deleting a User
1. Click the **trash icon** next to any user
2. Confirmation modal appears
3. Review user name before confirming
4. Click "Delete" to confirm or "Cancel" to abort
5. User is permanently removed
6. Success message confirms deletion

## Technical Implementation

### Frontend Components
- **File**: `frontend/src/components/CustomerManagement.jsx`
- **Key Features**:
  - Real-time API integration
  - Modal-based UI for details/edit/delete
  - Loading states and error handling
  - Responsive design with Tailwind CSS
  - Search and filter functionality

### Backend Routes
- **File**: `backend/src/routes/auth.js`
- **Security**: Admin-only access with JWT authentication
- **Validation**: Email uniqueness, role validation
- **Error Handling**: Comprehensive error messages

### Data Flow
1. Component mounts → Fetches all users from API
2. User actions → API calls with loading states
3. Success → Updates local state + shows notification
4. Error → Shows error message, maintains data integrity

## Security Features
- ✅ JWT authentication required
- ✅ Admin role verification
- ✅ Password never exposed in API responses
- ✅ Email uniqueness validation
- ✅ Secure user deletion
- ✅ Protected endpoints

## Future Enhancements
- [ ] Bulk user operations (block/delete multiple)
- [ ] User activity logs
- [ ] Advanced filtering (date joined, spending tier)
- [ ] Export user data to CSV/Excel
- [ ] User notes/tags system
- [ ] Email notifications on block/unblock
- [ ] User statistics charts
- [ ] Pagination for large user lists

## Testing Checklist
- [x] View all users
- [x] Search users by name
- [x] Search users by email
- [x] Filter by role
- [x] Filter by status
- [x] View user details with orders
- [x] Edit user information
- [x] Block user
- [x] Unblock user
- [x] Delete user with confirmation
- [x] Refresh data
- [x] Error handling
- [x] Loading states
- [x] Responsive design

## Troubleshooting

### Users not loading
- Check backend server is running
- Verify admin authentication token
- Check browser console for errors
- Ensure MongoDB connection is active

### Edit/Delete not working
- Verify admin permissions
- Check API endpoint availability
- Review network tab for error responses
- Ensure user ID is valid

### Search not working
- Clear search field and try again
- Check for special characters
- Verify filter combinations

## API Response Examples

### Get All Users
```json
{
  "users": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a1",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "customer",
      "isBlocked": false,
      "stats": {
        "totalOrders": 15,
        "totalSpent": 450.75,
        "loyaltyPoints": 451
      },
      "createdAt": "2023-06-15T10:30:00.000Z"
    }
  ]
}
```

### Get User Orders
```json
{
  "orders": [
    {
      "_id": "60d5ec49f1b2c8b1f8e4e1a2",
      "orderNumber": "ORD-2024-001",
      "totalAmount": 89.99,
      "status": "delivered",
      "createdAt": "2024-01-20T14:30:00.000Z"
    }
  ]
}
```

## Conclusion
The Customer Management feature provides a complete solution for managing all users in the system. With comprehensive CRUD operations, search/filter capabilities, and detailed user insights, administrators have full control over user management.
