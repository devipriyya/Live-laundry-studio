# Admin Order Management System - Complete Guide

## 🎯 Overview

The Admin Order Management System is a comprehensive solution for managing laundry orders with advanced workflow tracking, staff assignment, and invoice generation capabilities.

## ✨ Key Features

### 1. **View All Orders with Filters**
- **Filter by Status**: 
  - Order Placed
  - Order Accepted
  - Out for Pickup
  - Picked Up (Pickup Completed)
  - Washing (Wash in Progress)
  - Drying (Wash Completed)
  - Quality Check
  - Out for Delivery
  - Completed (Delivery Completed)
  - Cancelled

- **Search Functionality**: 
  - Search by Order ID
  - Search by Customer Name
  - Search by Customer Email

- **Real-time Statistics**:
  - Total Orders Count
  - Pending Orders
  - In Progress Orders
  - Completed Orders

### 2. **Step-by-Step Order Status Updates**

The system follows a comprehensive workflow:

```
Order Placed → Order Accepted → Out for Pickup → Picked Up → 
Washing → Drying → Quality Check → Out for Delivery → Completed
```

**Features**:
- Visual progress tracker showing current stage
- One-click status advancement
- Automatic status history logging
- Timestamps for each status change
- Admin notes for each transition

### 3. **Staff Assignment**

- **Assign Delivery Personnel**: 
  - Select from available staff members
  - Staff members with 'delivery' role are shown
  - Track assigned staff for each order
  
- **Staff Management**:
  - View assigned staff in order details
  - Reassign staff as needed
  - Track staff workload

### 4. **Invoice Generation**

- **Automatic Invoice Creation**:
  - Professional invoice layout
  - Company branding and details
  - Itemized order details
  - Tax calculations (10%)
  - Subtotal and total amounts
  
- **Invoice Features**:
  - Print-ready format
  - Opens in new window
  - Customer billing information
  - Payment details
  - Order reference number

## 🚀 How to Access

### For Admins:

1. **Login as Admin**:
   ```
   Email: admin@fabrico.com
   Password: admin123
   ```

2. **Navigate to Order Management**:
   ```
   URL: http://localhost:5173/admin-orders
   ```

3. **Alternative Access**:
   - From Admin Dashboard, click on "Order Management"
   - Direct link in admin navigation menu

## 📋 Usage Guide

### Viewing Orders

1. **Main Order Table**:
   - Displays all orders in a paginated table
   - Shows key information: Order ID, Customer, Status, Items, Amount, Date
   - Color-coded status badges for easy identification

2. **Filtering Orders**:
   - Use the status dropdown to filter by order status
   - Use search bar for quick lookups
   - Filters work in real-time

3. **Statistics Dashboard**:
   - Top cards show order metrics
   - Color-coded for different categories
   - Updates automatically based on filters

### Managing Order Status

1. **View Order Details**:
   - Click the eye icon (👁️) to view full order details
   - See order progress tracker
   - View customer information
   - Check order items and amounts

2. **Update Status**:
   - Click "Move to: [Next Status]" button
   - Status updates automatically
   - History is recorded with timestamp
   - Customer notifications can be triggered (if configured)

3. **Skip to Specific Status**:
   - In the order detail modal
   - Scroll to status history section
   - Click on any status button to jump directly

### Assigning Staff

1. **From Order Table**:
   - Click the user plus icon (👤+)
   - Select staff member from dropdown
   - Click "Assign"

2. **From Order Details**:
   - Open order detail modal
   - Click "Assign Staff" button
   - Choose delivery personnel
   - Confirm assignment

### Generating Invoices

1. **Single Invoice**:
   - Click the document icon (📄) in order table
   - OR click "Generate Invoice" in order details
   - Invoice opens in new window

2. **Invoice Contents**:
   - Company information
   - Customer billing details
   - Order items with quantities and prices
   - Tax breakdown
   - Total amount
   - Payment information

3. **Printing Invoice**:
   - Click "Print Invoice" button in the invoice window
   - Or use browser's print function (Ctrl+P / Cmd+P)

## 🎨 Visual Features

### Order Progress Tracker

- **Visual Workflow Display**:
  - Step-by-step progress icons
  - Completed steps in green
  - Current step highlighted
  - Pending steps in gray
  - Emojis for better visualization

### Color Coding

- **Status Colors**:
  - Yellow: Order Placed (Pending)
  - Blue: Order Accepted
  - Purple: Out for Pickup
  - Indigo: Picked Up
  - Cyan: Washing
  - Sky Blue: Drying
  - Pink: Quality Check
  - Orange: Out for Delivery
  - Green: Completed
  - Red: Cancelled

### Responsive Design

- **Mobile-Friendly**:
  - Scrollable tables on small screens
  - Responsive modals
  - Touch-friendly buttons
  - Optimized layouts for all devices

## 🔧 Technical Implementation

### Backend APIs

1. **Get All Orders**:
   ```javascript
   GET /api/orders
   Query params: status, search, page, limit
   Headers: Authorization Bearer token
   ```

2. **Update Order Status**:
   ```javascript
   PATCH /api/orders/:id/status
   Body: { status, note }
   Headers: Authorization Bearer token
   ```

3. **Assign Staff**:
   ```javascript
   PATCH /api/orders/:id/assign
   Body: { deliveryBoyId }
   Headers: Authorization Bearer token
   ```

4. **Generate Invoice**:
   ```javascript
   GET /api/invoice/:orderId
   Headers: Authorization Bearer token
   ```

5. **Get Staff Members**:
   ```javascript
   GET /api/auth/users?role=delivery
   Headers: Authorization Bearer token
   ```

### Frontend Components

- **Location**: `frontend/src/pages/AdminOrderManagement.jsx`
- **Route**: `/admin-orders`
- **Protected**: Admin role required

### Database Schema

**Order Model** (`backend/src/models/Order.js`):
- Enhanced with new statuses: `drying`, `quality-check`
- Status history tracking
- Staff assignment field
- Customer information
- Order items and pricing

## 📊 Order Workflow Details

### Standard Workflow

1. **Order Placed**: Customer creates order
2. **Order Accepted**: Admin confirms order
3. **Out for Pickup**: Delivery staff dispatched
4. **Picked Up**: Items collected from customer
5. **Washing**: Laundry process begins
6. **Drying**: Items in drying phase
7. **Quality Check**: Final inspection
8. **Out for Delivery**: Items being delivered
9. **Completed**: Order finished

### Special Cases

- **Cancellation**: Orders can be cancelled before "Picked Up" stage
- **Refunds**: Handled through separate refund process
- **Priority Orders**: Can be marked as high priority for faster processing

## 🎯 Best Practices

### For Order Management

1. **Regular Status Updates**:
   - Update order status promptly
   - Add meaningful notes for changes
   - Keep customers informed

2. **Staff Assignment**:
   - Assign staff early in the process
   - Consider workload distribution
   - Update if staff changes

3. **Quality Control**:
   - Use Quality Check status properly
   - Verify items before delivery
   - Address issues before completion

### For Invoice Generation

1. **Timing**:
   - Generate invoices after payment confirmation
   - Keep copies for records
   - Send to customers promptly

2. **Accuracy**:
   - Verify amounts before sending
   - Check customer details
   - Ensure correct tax calculations

## 🔐 Security & Permissions

- **Admin Only**: All features require admin authentication
- **Token-Based Auth**: JWT tokens for API security
- **Role Verification**: Server-side role checking
- **Protected Routes**: Frontend route protection

## 🚨 Troubleshooting

### Common Issues

1. **Orders Not Loading**:
   - Check backend server is running
   - Verify authentication token
   - Check network console for errors

2. **Staff List Empty**:
   - Ensure delivery staff exist in database
   - Check user roles are set correctly
   - Verify API endpoint

3. **Invoice Not Generating**:
   - Check order has all required data
   - Verify invoice route is working
   - Check browser popup blocker

### Error Messages

- **"Failed to update order status"**: Check authentication and order ID
- **"Failed to assign staff"**: Verify staff member exists and order ID
- **"Failed to generate invoice"**: Ensure order data is complete

## 📱 Mobile Experience

The Admin Order Management system is fully responsive:

- **Touch-Optimized**: Large, easy-to-tap buttons
- **Scrollable Tables**: Horizontal scroll on small screens
- **Modal Optimization**: Full-screen modals on mobile
- **Gesture Support**: Swipe and tap gestures

## 🔄 Integration Points

### With Other Systems

1. **Notification System**: Can trigger notifications on status changes
2. **Payment Gateway**: Links with payment status
3. **Customer Dashboard**: Customers see real-time updates
4. **Reporting**: Data feeds into analytics

## 📈 Future Enhancements

Potential improvements:

1. **Bulk Operations**: Update multiple orders at once
2. **Export Functionality**: Export orders to CSV/Excel
3. **Advanced Filters**: Date ranges, amount ranges
4. **SMS Notifications**: Auto-notify customers
5. **Email Integration**: Send invoices via email
6. **PDF Generation**: Server-side PDF creation
7. **Barcode Scanning**: For item tracking
8. **Route Optimization**: For delivery planning

## 💡 Tips & Tricks

1. **Keyboard Shortcuts**: Use Tab to navigate quickly
2. **Bulk Selection**: Select multiple orders for batch operations
3. **Quick Filters**: Save common filter combinations
4. **Status Notes**: Add detailed notes for better tracking
5. **Search Tips**: Use partial matches for faster results

## 📞 Support

For issues or questions:
- Check documentation first
- Review error logs in console
- Contact development team
- Report bugs with detailed steps to reproduce

---

## 🎉 Summary

The Admin Order Management System provides a complete solution for:
✅ Viewing and filtering all orders
✅ Step-by-step workflow management
✅ Staff assignment and tracking
✅ Professional invoice generation
✅ Real-time status updates
✅ Comprehensive order history
✅ Mobile-responsive interface
✅ Secure, role-based access

**Access URL**: `http://localhost:5173/admin-orders`

**Perfect for**: Laundry businesses, dry cleaners, and similar service providers needing robust order management.
