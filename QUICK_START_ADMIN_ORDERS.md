# Quick Start Guide - Admin Order Management Testing

## 🚀 Quick Setup & Testing

### Step 1: Start the Application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Step 2: Access Admin Order Management

1. **Login as Admin**:
   - Go to: `http://localhost:5173/`
   - Click "Login" or "Admin Login"
   - Use credentials:
     ```
     Email: admin@fabrico.com
     Password: admin123
     ```

2. **Navigate to Order Management**:
   - Direct URL: `http://localhost:5173/admin-orders`
   - Or from Admin Dashboard, find the Orders section

### Step 3: Test Features

#### A. View Orders
- ✅ Check if orders are displayed in the table
- ✅ Verify statistics cards show correct counts
- ✅ Test responsive design by resizing browser

#### B. Filter Orders
1. **By Status**:
   - Select different statuses from dropdown
   - Verify table updates accordingly

2. **By Search**:
   - Type order number, customer name, or email
   - Check real-time filtering works

#### C. Update Order Status
1. Click eye icon (👁️) on any order
2. Review order details modal
3. Check progress tracker visualization
4. Click "Move to: [Next Status]" button
5. Verify status updates and history is recorded

#### D. Assign Staff
1. Click user icon (👤+) on an order
2. Select a staff member from dropdown
3. Click "Assign"
4. Verify assignment success message
5. Check order shows assigned staff

#### E. Generate Invoice
1. Click document icon (📄) on any order
2. New window should open with invoice
3. Verify all details are correct:
   - Company info
   - Customer details
   - Order items
   - Pricing and totals
4. Test print functionality

## 🧪 Test Scenarios

### Scenario 1: Complete Order Workflow
1. Start with "Order Placed" status
2. Progress through each step:
   - Order Placed → Order Accepted
   - Order Accepted → Out for Pickup
   - Out for Pickup → Picked Up
   - Picked Up → Washing
   - Washing → Drying
   - Drying → Quality Check
   - Quality Check → Out for Delivery
   - Out for Delivery → Completed
3. Verify status history shows all transitions

### Scenario 2: Staff Assignment
1. Find an order without assigned staff
2. Assign a delivery person
3. View order details to confirm
4. Try reassigning to different staff

### Scenario 3: Invoice Generation
1. Select a completed order
2. Generate invoice
3. Review all invoice sections
4. Test print preview
5. Close and generate another

### Scenario 4: Filtering & Search
1. Apply status filter: "Pending"
2. Count results
3. Search for specific customer
4. Clear filters
5. Try combination of filters

## 📊 Expected Behavior

### Status Colors
- 🟨 Yellow: Order Placed
- 🟦 Blue: Order Accepted
- 🟪 Purple: Out for Pickup
- 🟦 Indigo: Picked Up
- 🟦 Cyan: Washing
- 🟦 Sky: Drying
- 🟪 Pink: Quality Check
- 🟧 Orange: Out for Delivery
- 🟩 Green: Completed
- 🟥 Red: Cancelled

### Statistics Cards
Should show accurate counts for:
- Total Orders (all filtered orders)
- Pending (order-placed status)
- In Progress (washing, drying, quality-check)
- Completed (delivery-completed status)

## 🐛 Troubleshooting Quick Fixes

### Orders Not Showing
```bash
# Check backend is running
curl http://localhost:5000/api/orders

# Check authentication
# Verify JWT token in localStorage
console.log(localStorage.getItem('token'))
```

### Staff List Empty
```bash
# Create a delivery staff member
# In backend or through API:
POST http://localhost:5000/api/auth/register
{
  "name": "Delivery Person",
  "email": "delivery@fabrico.com",
  "password": "delivery123",
  "role": "delivery"
}
```

### Invoice Not Opening
- Check popup blocker in browser
- Allow popups for localhost
- Check console for errors

## 🎯 Success Checklist

After testing, you should be able to:

- [ ] View all orders in a table
- [ ] Filter orders by status
- [ ] Search orders by ID, name, or email
- [ ] See correct statistics in cards
- [ ] Open order details modal
- [ ] View order progress tracker
- [ ] Update order status step-by-step
- [ ] See status history with timestamps
- [ ] Assign staff to orders
- [ ] View assigned staff in order details
- [ ] Generate invoices
- [ ] Print invoices
- [ ] Navigate between different order statuses
- [ ] See real-time updates after actions
- [ ] Experience smooth UI/UX on desktop
- [ ] Test responsive design on mobile view

## 📱 Mobile Testing

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device preset
4. Test all features on mobile view
5. Verify:
   - Tables scroll horizontally
   - Modals are full-screen
   - Buttons are touch-friendly
   - Text is readable
   - Actions work on touch

## 🔄 Refresh & Reload

If something doesn't work:
1. Click "Refresh" button in the app
2. Hard reload browser (Ctrl+Shift+R)
3. Clear localStorage and login again
4. Restart backend server
5. Check browser console for errors

## 📝 Sample Test Data

If you need test orders, you can create them through the customer interface or directly via API:

```javascript
// Create test order via API
POST http://localhost:5000/api/orders
{
  "orderNumber": "ORD-TEST-001",
  "customerInfo": {
    "name": "Test Customer",
    "email": "test@customer.com",
    "phone": "1234567890",
    "address": {
      "street": "123 Test St",
      "city": "Test City",
      "state": "Test State",
      "zipCode": "12345"
    }
  },
  "items": [
    {
      "name": "Shirt",
      "quantity": 2,
      "price": 50
    }
  ],
  "totalAmount": 100,
  "status": "order-placed"
}
```

## ✨ Key Features to Demonstrate

1. **Real-time Updates**: Show status changes immediately
2. **Visual Progress**: Highlight the workflow tracker
3. **Quick Actions**: Demonstrate one-click operations
4. **Professional Invoices**: Show invoice generation
5. **Staff Management**: Display staff assignment flow
6. **Filtering Power**: Show how filters refine results
7. **Responsive Design**: Switch between desktop and mobile views

## 🎉 Success!

Once all tests pass, your Admin Order Management system is fully operational!

**Main Features Working:**
✅ Order viewing with filters
✅ Step-by-step status workflow
✅ Staff assignment
✅ Invoice generation
✅ Real-time updates
✅ Mobile responsive

**Access Again At:**
`http://localhost:5173/admin-orders`

---

**Need Help?**
- Check ADMIN_ORDER_MANAGEMENT_GUIDE.md for detailed documentation
- Review browser console for errors
- Verify backend API responses
- Test with different browsers
