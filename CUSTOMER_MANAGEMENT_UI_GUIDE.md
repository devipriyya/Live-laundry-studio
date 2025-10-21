# Customer Management - UI Guide

## 🎨 User Interface Overview

This guide shows the visual layout and user interface elements of the Customer Management system.

---

## 📊 Main Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Customer Management                                           │
│  Manage customer relationships and track customer data        │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ 👤       │  │ 👥       │  │ ⭐       │  │ 🚫       │     │
│  │ Total    │  │ Total    │  │ Total    │  │ Blocked  │     │
│  │ Users    │  │Customers │  │ Admins   │  │ Users    │     │
│  │   150    │  │   120    │  │    25    │  │     5    │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  🔍 Search                    │ Role ▼  │ Status ▼ │ 🔄      │
│  Search by name, email...     │ All     │ All      │ Refresh │
│                                                                │
│  Showing 150 of 150 users                                     │
├────────────────────────────────────────────────────────────────┤
│  User          │ Contact      │ Role │ Orders │ Spent │ Status│
├────────────────────────────────────────────────────────────────┤
│  🅰️ John Doe   │ john@...     │ 🔵   │   23   │ $456  │ ✅   │
│  ID: abc123    │ +1234567890  │Customer│       │       │Active│
│                │              │      │        │       │ 👁️✏️🚫🗑️│
├────────────────────────────────────────────────────────────────┤
│  🅱️ Jane Smith │ jane@...     │ 🟣   │    5   │ $890  │ ✅   │
│  ID: def456    │ +9876543210  │Admin │        │       │Active│
│                │              │      │        │       │ 👁️✏️🚫🗑️│
├────────────────────────────────────────────────────────────────┤
│  🅲 Bob Jones  │ bob@...      │ 🟢   │   45   │ $1.2k │ 🔴   │
│  ID: ghi789    │ +5555555555  │Delivery│      │       │Blocked│
│                │              │      │        │       │ 👁️✏️✅🗑️│
└────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Action Buttons Explained

### In the Table Row:

| Icon | Action | Description |
|------|--------|-------------|
| 👁️ | **View** | Opens detailed user profile with order history |
| ✏️ | **Edit** | Opens edit modal to modify user information |
| 🚫 | **Block** | Blocks user access (changes to ✅ when blocked) |
| ✅ | **Unblock** | Restores user access (for blocked users) |
| 🗑️ | **Delete** | Opens confirmation modal to delete user |

---

## 📋 View Details Modal

```
┌─────────────────────────────────────────────────────────┐
│  Customer Details                                    ✖️ │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Personal Information         │  Order Statistics      │
│  ┌───────────────────┐       │  ┌──────────────┐      │
│  │ 👤 John Doe       │       │  │ 🛍️ Total:  23 │      │
│  │ ID: abc12345      │       │  └──────────────┘      │
│  │                   │       │  ┌──────────────┐      │
│  │ ✉️ john@email.com │       │  │ 💰 Spent: $456│      │
│  │                   │       │  └──────────────┘      │
│  │ 📞 +1234567890    │       │                        │
│  │                   │       │  Preferences:          │
│  │ 📍 123 Main St    │       │  Language: EN          │
│  │    City, ST 12345 │       │  Currency: INR         │
│  │                   │       │  Theme: Light          │
│  │ 📅 Joined:        │       │                        │
│  │    Jan 15, 2024   │       │                        │
│  └───────────────────┘       │                        │
│                                                         │
│  Status & Role                                         │
│  Role: 🔵 Customer                                     │
│  Account: ✅ Active                                     │
│  Loyalty Points: 456                                   │
│                                                         │
│  Recent Orders (Last 5)                                │
│  ┌─────────────────────────────────────────────────┐  │
│  │ Order #   │ Date      │ Amount │ Status         │  │
│  ├─────────────────────────────────────────────────┤  │
│  │ ORD-001   │ Oct 15    │ $89.99 │ ✅ Delivered  │  │
│  │ ORD-002   │ Oct 10    │ $45.00 │ 🔵 In Progress│  │
│  │ ORD-003   │ Oct 5     │ $120   │ ✅ Delivered  │  │
│  └─────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## ✏️ Edit User Modal

```
┌────────────────────────────────────────┐
│  Edit Customer                      ✖️ │
├────────────────────────────────────────┤
│                                        │
│  Name                                  │
│  ┌────────────────────────────────┐   │
│  │ John Doe                       │   │
│  └────────────────────────────────┘   │
│                                        │
│  Email                                 │
│  ┌────────────────────────────────┐   │
│  │ john@email.com                 │   │
│  └────────────────────────────────┘   │
│                                        │
│  Phone                                 │
│  ┌────────────────────────────────┐   │
│  │ +1234567890                    │   │
│  └────────────────────────────────┘   │
│                                        │
│  Role                                  │
│  ┌────────────────────────────────┐   │
│  │ Customer               ▼       │   │
│  └────────────────────────────────┘   │
│                                        │
├────────────────────────────────────────┤
│           [Cancel] [Save Changes]      │
└────────────────────────────────────────┘
```

---

## 🗑️ Delete Confirmation Modal

```
┌─────────────────────────────────┐
│                                 │
│         ⚠️                      │
│                                 │
│     Delete Customer             │
│                                 │
│  Are you sure you want to       │
│  delete John Doe?               │
│  This action cannot be undone.  │
│                                 │
│  [Cancel]    [Delete]           │
└─────────────────────────────────┘
```

---

## 🔍 Search and Filter Section

```
┌─────────────────────────────────────────────────────────────┐
│  🔍 Search                                                   │
│  ┌──────────────────────┐  ┌────────┐  ┌────────┐  ┌────┐ │
│  │ Search by name...    │  │ Role ▼ │  │Status ▼│  │ 🔄 │ │
│  └──────────────────────┘  └────────┘  └────────┘  └────┘ │
│                                                             │
│  Showing 45 of 150 users                                   │
└─────────────────────────────────────────────────────────────┘

Role Dropdown Options:
┌──────────────────┐
│ All Roles        │
│ Customers        │
│ Admins           │
│ Delivery Staff   │
└──────────────────┘

Status Dropdown Options:
┌──────────────────┐
│ All Status       │
│ Active           │
│ Blocked          │
└──────────────────┘
```

---

## 🎨 Color Coding

### Role Badges:
- 🔵 **Customer** - Blue badge with white text
- 🟣 **Admin** - Purple badge with white text
- 🟢 **Delivery** - Green badge with white text

### Status Badges:
- ✅ **Active** - Green badge (bg-green-100, text-green-800)
- 🔴 **Blocked** - Red badge (bg-red-100, text-red-800)

### Order Status:
- ✅ **Delivered** - Green
- 🔵 **In Progress** - Blue
- 🟡 **Pending** - Yellow
- 🔴 **Cancelled** - Red

---

## 📱 Responsive Design

### Desktop (> 768px):
- Full table view with all columns
- Side-by-side filter controls
- Multi-column layouts in modals

### Tablet (768px - 1024px):
- Condensed table columns
- Stacked filter controls
- Adjusted modal widths

### Mobile (< 768px):
- Card-based user list
- Full-width controls
- Vertical stacks
- Simplified modals

---

## 🎭 Loading States

### Initial Load:
```
┌──────────────────────────────┐
│                              │
│          ⏳                  │
│   Loading customers...       │
│                              │
└──────────────────────────────┘
```

### Empty State:
```
┌──────────────────────────────┐
│                              │
│          👤                  │
│   No customers found         │
│                              │
└──────────────────────────────┘
```

### Error State:
```
┌──────────────────────────────────────┐
│  ⚠️ Failed to load customers.        │
│     Please try again.                │
└──────────────────────────────────────┘
```

---

## 💡 User Interaction Flow

### Viewing User Details:
```
1. User clicks 👁️ icon
   ↓
2. Modal opens with loading spinner
   ↓
3. User details + order history load
   ↓
4. Full information displayed
   ↓
5. User clicks ✖️ or outside modal to close
```

### Editing a User:
```
1. User clicks ✏️ icon
   ↓
2. Edit modal opens with current data
   ↓
3. User modifies fields
   ↓
4. User clicks "Save Changes"
   ↓
5. Validation + API call
   ↓
6. Success message + modal closes
   ↓
7. Table updates with new data
```

### Blocking a User:
```
1. User clicks 🚫 icon
   ↓
2. Instant API call
   ↓
3. Icon changes to ✅
   ↓
4. Badge changes to 🔴 Blocked
   ↓
5. Success notification appears
```

### Deleting a User:
```
1. User clicks 🗑️ icon
   ↓
2. Confirmation modal appears
   ↓
3. User reviews and clicks "Delete"
   ↓
4. API call executes
   ↓
5. User removed from table
   ↓
6. Success notification appears
   ↓
7. Stats update automatically
```

---

## 🎯 Keyboard Shortcuts (Future Enhancement)

Potential keyboard shortcuts:
- `Ctrl/Cmd + F` - Focus search
- `Esc` - Close modal
- `Enter` - Submit form (in modals)
- `Tab` - Navigate between fields

---

## ♿ Accessibility Features

- ✅ Semantic HTML
- ✅ ARIA labels on icons
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ Color contrast compliance
- ✅ Alt text for icons

---

## 🎨 Design System

### Spacing:
- Padding: p-4, p-6
- Margins: mb-2, mb-4, mb-6
- Gaps: gap-2, gap-4, gap-6

### Border Radius:
- Small: rounded-lg (0.5rem)
- Large: rounded-xl (0.75rem)
- Full: rounded-full (9999px)

### Shadows:
- Cards: shadow-sm
- Modals: shadow-lg
- Hover: hover:shadow-md

### Transitions:
- All buttons: transition-colors
- Hover states: duration-200
- Smooth animations

---

This UI guide provides a visual representation of the Customer Management interface. All elements are designed for clarity, usability, and modern aesthetics.
