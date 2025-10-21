# Customer Management - Visual Guide

## 📱 User Interface Overview

### Main Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    Customer Management                          │
│  Manage customer relationships and track customer data         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 👥 Total     │ 👤 Customers │ ⭐ Admins    │ 🚫 Blocked  │
│    Users     │              │              │    Users     │
│    125       │     118      │      5       │      2       │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  🔍 Search by name, email, or phone...                          │
│  [All Roles ▼]  [All Status ▼]  [🔄 Refresh]                  │
│  Showing 125 of 125 users                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ User         │ Contact       │ Role     │ Orders │ Spent │ ...  │
├─────────────────────────────────────────────────────────────────┤
│ 👤 John Doe  │ john@mail.com │ Customer │   12   │ $450  │ 👁️✏️🚫🗑️│
│    ID: 5a7b  │ +1-555-1234   │          │        │       │      │
├─────────────────────────────────────────────────────────────────┤
│ 👤 Jane Smith│ jane@mail.com │ Customer │    8   │ $320  │ 👁️✏️🚫🗑️│
│    ID: 7c9d  │ +1-555-5678   │          │        │       │      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Statistics Cards

### 1. Total Users Card
```
┌──────────────────┐
│ 👥               │
│ Total Users      │
│                  │
│      125         │
│                  │
└──────────────────┘
```
- **Color**: Blue background
- **Icon**: User icon
- **Shows**: Count of all users except admin@gmail.com

### 2. Customers Card
```
┌──────────────────┐
│ 👤               │
│ Customers        │
│                  │
│      118         │
│                  │
└──────────────────┘
```
- **Color**: Blue background
- **Icon**: Single user icon
- **Shows**: Users with role 'customer'

### 3. Admins Card
```
┌──────────────────┐
│ ⭐               │
│ Admins           │
│                  │
│       5          │
│                  │
└──────────────────┘
```
- **Color**: Purple background
- **Icon**: Star icon
- **Shows**: Users with role 'admin' (except admin@gmail.com)

### 4. Blocked Users Card
```
┌──────────────────┐
│ 🚫               │
│ Blocked Users    │
│                  │
│       2          │
│                  │
└──────────────────┘
```
- **Color**: Red background
- **Icon**: No symbol icon
- **Shows**: Users with isBlocked = true

---

## 🔍 Search and Filter Bar

### Search Box
```
┌────────────────────────────────────────┐
│ 🔍 Search by name, email, or phone...  │
└────────────────────────────────────────┘
```
- Real-time filtering as you type
- Searches: name, email, phone fields

### Role Filter
```
┌──────────────┐
│ All Roles  ▼ │
├──────────────┤
│ All Roles    │ ← Default
│ Customers    │
│ Admins       │
│ Delivery Staff│
└──────────────┘
```

### Status Filter
```
┌──────────────┐
│ All Status ▼ │
├──────────────┤
│ All Status   │ ← Default
│ Active       │
│ Blocked      │
└──────────────┘
```

### Refresh Button
```
┌──────────┐
│ 🔄 Refresh│
└──────────┘
```
- Reloads user data from server

---

## 📊 User Table

### Table Headers
```
┌──────────┬──────────┬──────┬────────┬────────┬────────┬─────────┐
│ User     │ Contact  │ Role │ Orders │ Spent  │ Status │ Actions │
└──────────┴──────────┴──────┴────────┴────────┴────────┴─────────┘
```

### Sample Row (Active Customer)
```
┌───────────────────────────────────────────────────────────────────┐
│ 👤 John Doe          │ john@example.com  │ [Customer] │  12  │... │
│    ID: abc12345      │ +1 (555) 123-4567 │            │      │   │
│                      │                   │            │      │   │
│  Orders: 12          │  Total Spent: $450.00                     │
│  Status: [Active 🟢] │  Actions: [👁️] [✏️] [🚫] [🗑️]              │
└───────────────────────────────────────────────────────────────────┘
```

### Sample Row (Blocked Customer)
```
┌───────────────────────────────────────────────────────────────────┐
│ 👤 Jane Smith        │ jane@example.com  │ [Customer] │   8  │... │
│    ID: def67890      │ +1 (555) 234-5678 │            │      │   │
│                      │                   │            │      │   │
│  Orders: 8           │  Total Spent: $320.00                     │
│  Status: [Blocked 🔴]│  Actions: [👁️] [✏️] [✅] [🗑️]              │
└───────────────────────────────────────────────────────────────────┘
```

### Sample Row (Admin)
```
┌───────────────────────────────────────────────────────────────────┐
│ 👤 Admin User        │ admin2@mail.com   │ [Admin ⭐] │   0  │... │
│    ID: ghi11223      │ +1 (555) 345-6789 │            │      │   │
│                      │                   │            │      │   │
│  Orders: 0           │  Total Spent: $0.00                       │
│  Status: [Active 🟢] │  Actions: [👁️] [✏️] [🚫] [🗑️]              │
└───────────────────────────────────────────────────────────────────┘
```

**Note**: admin@gmail.com will NOT appear in this list!

---

## 🎯 Action Buttons

### 1. View Details (👁️)
```
[👁️]  ← Blue icon, opens detail modal
```

### 2. Edit User (✏️)
```
[✏️]  ← Green icon, opens edit form
```

### 3. Block/Unblock
**Active User**:
```
[🚫]  ← Orange/Red icon, blocks user
```

**Blocked User**:
```
[✅]  ← Green icon, unblocks user
```

### 4. Delete (🗑️)
```
[🗑️]  ← Red icon, shows confirmation
```

---

## 📱 Modal Windows

### 1. View Details Modal

```
┌─────────────────────────────────────────────────────────────┐
│  Customer Details                                      [✕]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PERSONAL INFORMATION                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  👤 John Doe                                                │
│     Customer ID: abc12345                                   │
│                                                             │
│  ✉️  john@example.com                                       │
│  📞 +1 (555) 123-4567                                       │
│  📍 123 Main St, New York, NY 10001                         │
│  📅 Joined: January 15, 2024                                │
│                                                             │
│  STATUS & ROLE                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  Role:              [Customer]                              │
│  Account Status:    [Active 🟢]                             │
│  Loyalty Points:    1250                                    │
│                                                             │
│  ORDER STATISTICS                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ 🛍️           │  │ 💰           │                        │
│  │    12        │  │  $450.00     │                        │
│  │ Total Orders │  │ Total Spent  │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                             │
│  RECENT ORDERS                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Order   │ Date       │ Amount  │ Status             │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ #12345  │ 2024-10-15 │ $45.00  │ Delivered          │   │
│  │ #12344  │ 2024-10-10 │ $38.50  │ Delivered          │   │
│  │ #12343  │ 2024-10-05 │ $52.00  │ In Progress        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Edit User Modal

```
┌─────────────────────────────────────────────────────────────┐
│  Edit Customer                                         [✕]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Name *                                                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ John Doe                                              │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Email *                                                    │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ john@example.com                                      │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Phone                                                      │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ +1 (555) 123-4567                                     │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Role *                                                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Customer                                            ▼ │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│                                                             │
│                     ┌────────┐  ┌────────────┐             │
│                     │ Cancel │  │ Save Changes│             │
│                     └────────┘  └────────────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Delete Confirmation Modal

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      ┌────────┐                             │
│                      │   ⚠️   │                             │
│                      └────────┘                             │
│                                                             │
│                   Delete Customer                           │
│                                                             │
│       Are you sure you want to delete John Doe?             │
│           This action cannot be undone.                     │
│                                                             │
│                                                             │
│              ┌────────┐  ┌────────┐                         │
│              │ Cancel │  │ Delete │                         │
│              └────────┘  └────────┘                         │
│               (Gray)      (Red)                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Color Coding

### Role Badges
```
[Customer]     ← Blue background, blue text
[Admin    ⭐]  ← Purple background, purple text
[Delivery 🚚]  ← Green background, green text
```

### Status Badges
```
[Active   🟢]  ← Green background, green text
[Blocked  🔴]  ← Red background, red text
```

### Action Buttons
```
[👁️]  View     ← Blue (hover: darker blue)
[✏️]  Edit     ← Green (hover: darker green)
[🚫]  Block    ← Orange/Red (hover: darker)
[✅]  Unblock  ← Green (hover: darker green)
[🗑️]  Delete   ← Red (hover: darker red)
```

---

## 📱 Responsive Design

### Desktop View (> 1024px)
- Full table with all columns visible
- Statistics in 4-column grid
- Modals centered with max-width

### Tablet View (768px - 1024px)
- Table scrolls horizontally
- Statistics in 2-column grid
- Modals take 90% width

### Mobile View (< 768px)
- Table scrolls horizontally
- Statistics stack vertically
- Modals full width
- Actions dropdown instead of buttons

---

## 🔔 Notifications and Feedback

### Success Messages
```
┌─────────────────────────────────────────┐
│ ✅ Customer updated successfully!       │
└─────────────────────────────────────────┘
```

### Error Messages
```
┌─────────────────────────────────────────┐
│ ❌ Failed to update customer. Try again │
└─────────────────────────────────────────┘
```

### Loading State
```
┌─────────────────────────────────────────┐
│         🔄 Loading customers...         │
│            (spinning icon)              │
└─────────────────────────────────────────┘
```

### Empty State
```
┌─────────────────────────────────────────┐
│              👤                         │
│         No customers found              │
└─────────────────────────────────────────┘
```

---

## 🔐 Security Indicators

### Protected Admin Account
```
⚠️ IMPORTANT: admin@gmail.com is NOT visible in this list
              This prevents accidental deletion or modification
```

### Admin-Only Access
```
🔒 This page is only accessible to administrators
   Regular users will be redirected to their dashboard
```

### Confirmation Required
```
⚠️ Deleting a user is permanent and cannot be undone
   A confirmation dialog will appear before deletion
```

---

## 📊 User Flow Diagrams

### Flow 1: View User Details
```
Customer Management
        ↓
   Click 👁️ (View)
        ↓
   Detail Modal Opens
        ↓
   View Information
        ↓
   Click ✕ or outside
        ↓
   Modal Closes
```

### Flow 2: Edit User
```
Customer Management
        ↓
   Click ✏️ (Edit)
        ↓
   Edit Modal Opens
        ↓
   Modify Fields
        ↓
   Click "Save Changes"
        ↓
   API Call (PUT /users/:id)
        ↓
   Success Message
        ↓
   Table Updates
        ↓
   Modal Closes
```

### Flow 3: Block User
```
Customer Management
        ↓
   Click 🚫 (Block)
        ↓
   API Call (PATCH /users/:id/block)
        ↓
   User Status → Blocked
        ↓
   Badge → Red [Blocked]
        ↓
   Icon → ✅ (Unblock)
        ↓
   Success Message
```

### Flow 4: Delete User
```
Customer Management
        ↓
   Click 🗑️ (Delete)
        ↓
   Confirmation Modal
        ↓
   User Confirms
        ↓
   API Call (DELETE /users/:id)
        ↓
   User Removed from List
        ↓
   Success Message
```

---

## 🎯 Key Features Visual Summary

### ✅ What Admin Can See
- All users except admin@gmail.com
- User details (name, email, phone, addresses)
- Order statistics (count, total spent)
- Account status (active/blocked)
- User role (customer/admin/delivery)
- Recent order history

### ✅ What Admin Can Do
- Search users by name, email, phone
- Filter by role (customer/admin/delivery)
- Filter by status (active/blocked)
- View comprehensive user details
- Edit user information
- Block (suspend) users
- Unblock (restore) users
- Delete users permanently

### ❌ What Admin Cannot Do
- View or modify admin@gmail.com
- Change user passwords (future feature)
- View user password (security)
- Restore deleted users
- Bulk operations (future feature)

---

## 📸 Screenshot Descriptions

### Screenshot 1: Main Dashboard
**Shows**:
- Statistics cards at top
- Search and filter bar
- User table with multiple rows
- Action buttons for each user

### Screenshot 2: Detail Modal
**Shows**:
- User personal information
- Account status and role
- Order statistics with visual cards
- Recent orders table

### Screenshot 3: Edit Modal
**Shows**:
- Form with pre-filled user data
- Name, email, phone, role fields
- Cancel and Save buttons

### Screenshot 4: Delete Confirmation
**Shows**:
- Warning icon
- User name to be deleted
- Warning message
- Cancel and Delete buttons

### Screenshot 5: Search in Action
**Shows**:
- Search box with query
- Filtered results
- Result count indicator

### Screenshot 6: Blocked User
**Shows**:
- User with red [Blocked] badge
- Green ✅ (Unblock) button
- Different visual treatment

---

## 🎨 Branding and Styling

### Colors
- **Primary Blue**: #3B82F6 (buttons, customer badges)
- **Success Green**: #10B981 (active status, unblock)
- **Warning Orange**: #F59E0B (block action)
- **Danger Red**: #EF4444 (blocked status, delete)
- **Purple**: #8B5CF6 (admin badges)
- **Gray**: #6B7280 (neutral elements)

### Fonts
- **Headings**: Bold, 24-32px
- **Body**: Regular, 14-16px
- **Small Text**: 12-14px
- **Font Family**: System fonts (sans-serif)

### Spacing
- **Cards**: Padding 24px
- **Table Cells**: Padding 16px
- **Modals**: Padding 24px
- **Buttons**: Padding 8px 16px

---

This visual guide helps administrators understand what they'll see and how to interact with the Customer Management feature!
