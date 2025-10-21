# Customer Management - Quick Reference

## 🎯 Key Features
✅ View all registered users  
✅ Edit user information  
✅ Delete users  
✅ Block/Unblock users  
✅ View user order history  
✅ Search and filter users  

## 🚀 Quick Actions

### View User Details
👁️ Click the **eye icon** → See full profile + order history

### Edit User
✏️ Click the **pencil icon** → Modify name, email, phone, role → Save

### Block/Unblock User
🚫 Click the **block icon** → Toggle status instantly

### Delete User
🗑️ Click the **trash icon** → Confirm → User removed

## 🔍 Search & Filter

**Search**: Type name, email, or phone in search box  
**Role Filter**: Customer | Admin | Delivery Staff | All  
**Status Filter**: Active | Blocked | All  

## 📊 Statistics Displayed
- Total Users
- Total Customers  
- Total Admins
- Blocked Users

## 🔐 Admin Access Only
All features require admin authentication

## 📱 User Table Columns
- User (Name + ID)
- Contact (Email + Phone)
- Role
- Total Orders
- Total Spent
- Status (Active/Blocked)
- Actions

## 🔗 API Endpoints (Admin Only)

```
GET    /api/auth/users              - Get all users
GET    /api/auth/users/:id          - Get single user
PUT    /api/auth/users/:id          - Update user
DELETE /api/auth/users/:id          - Delete user
PATCH  /api/auth/users/:id/block    - Block/Unblock user
GET    /api/auth/users/:id/orders   - Get user's orders
```

## 💡 Tips
- Use search for quick user lookup
- Combine filters for precise results
- View details before editing/deleting
- Block instead of delete for temporary access restriction
- Check order history to understand user activity
