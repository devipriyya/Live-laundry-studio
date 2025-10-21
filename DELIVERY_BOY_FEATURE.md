# 🚚 Delivery Boy Role - Feature Documentation

## Overview
The FabricSpa Laundry System now includes a comprehensive **Delivery Boy** role to streamline order pickup and delivery operations. This role works alongside Admin and Customer roles to provide efficient order management.

---

## 🎯 Key Features

### For Delivery Boys:
- ✅ **Dedicated Dashboard** - View all assigned orders in one place
- 📊 **Real-time Statistics** - Track daily performance metrics
- 📦 **Order Management** - Update pickup and delivery statuses
- 🗺️ **Customer Details** - Access customer information and addresses
- 📱 **Mobile-friendly Interface** - Easy to use on mobile devices

### For Admins:
- 👥 **Assign Orders** - Assign orders to specific delivery boys
- 📈 **Track Performance** - Monitor delivery boy statistics
- 🔍 **View Activity** - See all delivery-related updates
- 📋 **Manage Delivery Staff** - Add/remove delivery personnel

---

## 🏗️ Architecture

### Backend Implementation

#### 1. **User Model** (`backend/src/models/User.js`)
```javascript
role: { 
  type: String, 
  enum: ['customer', 'admin', 'deliveryBoy'], 
  default: 'customer' 
}
```

#### 2. **Role Middleware** (`backend/src/middleware/role.js`)
```javascript
// Delivery Boy only access
const isDeliveryBoy = (req, res, next) => {
  if (req.user && req.user.role === 'deliveryBoy') return next();
  return res.status(403).json({ message: 'Delivery boy only' });
};

// Admin OR Delivery Boy access
const isAdminOrDeliveryBoy = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'deliveryBoy')) 
    return next();
  return res.status(403).json({ message: 'Admin or delivery boy only' });
};
```

#### 3. **Delivery Boy Routes** (`backend/src/routes/order.js`)

##### Get Delivery Boys List (Admin Only)
```javascript
GET /api/orders/delivery-boys/list
Response: {
  deliveryBoys: [
    {
      _id, name, email, phone, 
      activeOrders, completedOrders
    }
  ]
}
```

##### Get Assigned Orders (Delivery Boy)
```javascript
GET /api/orders/my-deliveries?status=all
Response: { orders: [...] }
```

##### Get Statistics (Delivery Boy)
```javascript
GET /api/orders/my-deliveries/stats
Response: {
  totalDeliveries,
  activeDeliveries,
  completedToday,
  pendingPickups,
  pendingDeliveries
}
```

##### Update Delivery Status (Delivery Boy)
```javascript
PATCH /api/orders/:id/delivery-status
Body: { status, note, location }
Allowed Statuses:
  - out-for-pickup
  - pickup-completed
  - out-for-delivery
  - delivery-completed
```

##### Assign Delivery Boy (Admin)
```javascript
PATCH /api/orders/:id/assign
Body: { deliveryBoyId }
```

---

### Frontend Implementation

#### 1. **Authentication Context** (`frontend/src/context/AuthContext.jsx`)
```javascript
const deliveryBoyDemoLogin = () => {
  const deliveryBoyUser = {
    uid: 'delivery-demo-user',
    email: 'delivery@fabrico.com',
    name: 'Delivery Boy',
    role: 'deliveryBoy',
  };
  setUser(deliveryBoyUser);
  localStorage.setItem('user', JSON.stringify(deliveryBoyUser));
};
```

#### 2. **Delivery Boy Dashboard** (`frontend/src/pages/DeliveryBoyDashboard.jsx`)

**Key Components:**
- **Stats Cards** - Display performance metrics
- **Order Tabs** - Filter by pending/completed/all
- **Order Cards** - Show customer info and delivery details
- **Order Detail Modal** - Full order information with action buttons

**Features:**
- View assigned orders
- Update order status with one click
- Access customer contact information
- See order items and total amount
- Track order history

#### 3. **Routing** (`frontend/src/App.jsx`)
```javascript
<Route 
  path="/delivery-dashboard" 
  element={
    <ProtectedRoute roles={['deliveryBoy']}>
      <DeliveryBoyDashboard />
    </ProtectedRoute>
  } 
/>
```

#### 4. **Admin Order Management** (`frontend/src/pages/AdminOrderManagement.jsx`)
- Fetch delivery boys from API
- Assign delivery boys to orders
- View assigned delivery boy on order details

---

## 🚀 How to Use

### For Admins:

#### 1. **Create Delivery Boy Account**
```javascript
// Register via API or Admin Panel
POST /api/auth/register
{
  "name": "John Delivery",
  "email": "john@fabrico.com",
  "password": "password123",
  "role": "deliveryBoy"
}
```

#### 2. **Assign Order to Delivery Boy**
1. Navigate to Admin Dashboard → Orders
2. Click on an order
3. Click "Assign Staff" button
4. Select delivery boy from dropdown
5. Click "Assign" to confirm

#### 3. **Monitor Delivery Performance**
- View delivery boy statistics in the order list
- Track order status updates made by delivery boys
- See delivery completion times

---

### For Delivery Boys:

#### 1. **Login**
**Demo Access:**
- Visit: `http://localhost:5173/admin-login-debug`
- Click the green "Delivery Boy" card
- Redirects to: `/delivery-dashboard`

**Production Access:**
- Login with delivery boy credentials
- System automatically redirects based on role

#### 2. **View Assigned Orders**
- Dashboard shows all assigned orders
- Statistics at the top show:
  - Total Deliveries
  - Active Orders
  - Completed Today
  - Pending Pickups
  - Pending Deliveries

#### 3. **Update Order Status**

**Status Flow for Delivery Boys:**
```
out-for-pickup → pickup-completed → out-for-delivery → delivery-completed
```

**To Update:**
1. Click on an order card
2. Order detail modal opens
3. Click "Mark as [Next Status]" button
4. Status updates automatically
5. Customer and admin are notified

#### 4. **View Customer Details**
Each order displays:
- Customer name and phone number
- Full delivery address
- Order items and quantities
- Total amount to collect (if COD)

---

## 📊 Order Status Workflow

### Complete Order Lifecycle:

```
1. order-placed          ← Customer places order
2. order-accepted        ← Admin accepts
3. out-for-pickup        ← Delivery boy dispatched for pickup
4. pickup-completed      ← Delivery boy picks up items
5. wash-in-progress      ← Items being washed
6. wash-completed        ← Washing complete
7. drying                ← Items being dried
8. quality-check         ← Quality inspection
9. out-for-delivery      ← Delivery boy dispatched for delivery
10. delivery-completed   ← Order delivered to customer
```

**Delivery Boy Controls:** Steps 3, 4, 9, 10

---

## 🎨 UI/UX Features

### Dashboard Design:
- **Color-coded Stats Cards:**
  - Blue: Total Deliveries
  - Orange: Active Orders
  - Green: Completed Today
  - Yellow: Pending Pickups
  - Purple: Pending Deliveries

- **Responsive Tabs:**
  - Pending Orders (active deliveries)
  - Completed Orders
  - All Orders

- **Order Cards:**
  - Clean, card-based layout
  - Status badges with colors
  - Customer info preview
  - Quick action buttons

- **Order Detail Modal:**
  - Full customer information
  - Complete item list
  - Order history timeline
  - One-click status update

---

## 🔒 Security & Permissions

### Role-Based Access Control:

| Feature | Customer | Delivery Boy | Admin |
|---------|----------|--------------|-------|
| Place Orders | ✅ | ❌ | ❌ |
| View All Orders | ❌ | ❌ | ✅ |
| View Assigned Orders | ❌ | ✅ | ✅ |
| Update Delivery Status | ❌ | ✅ | ✅ |
| Assign Delivery Boys | ❌ | ❌ | ✅ |
| View Customer Details | Own Only | Assigned Only | All |

### Authentication Checks:
- Backend: JWT token validation + role middleware
- Frontend: Protected routes with role verification
- Order Updates: Verify delivery boy is assigned to order

---

## 📱 Mobile Responsiveness

The Delivery Boy Dashboard is fully optimized for mobile devices:
- Touch-friendly buttons and cards
- Responsive grid layout
- Easy-to-tap status update buttons
- Accessible phone number links (click-to-call)
- Optimized for on-the-go usage

---

## 🧪 Testing

### Test Scenarios:

#### 1. **Demo Login**
```
URL: /admin-login-debug
Action: Click "Delivery Boy" card
Expected: Redirect to /delivery-dashboard
```

#### 2. **View Orders**
```
Action: Login as delivery boy
Expected: See assigned orders with statistics
```

#### 3. **Update Status**
```
Action: Click order → Click "Mark as Pickup Completed"
Expected: Status updates, modal closes, stats refresh
```

#### 4. **Admin Assignment**
```
Action: Admin assigns order to delivery boy
Expected: Order appears in delivery boy's dashboard
```

---

## 🔧 Configuration

### Environment Variables:
```env
VITE_API_URL=http://localhost:5000/api
```

### Demo Credentials:
```javascript
// Delivery Boy Demo
Email: delivery@fabrico.com
UID: delivery-demo-user
Role: deliveryBoy
```

---

## 📈 Future Enhancements

### Potential Features:
- 📍 GPS tracking for live location
- 🗺️ Route optimization
- 📸 Photo proof of delivery
- ⏱️ Time tracking and analytics
- 💬 In-app chat with customers
- 🔔 Push notifications
- 📊 Performance leaderboards
- 💰 Earnings tracker
- 📅 Shift scheduling

---

## 🐛 Troubleshooting

### Common Issues:

**Issue: "Not authorized" error**
- Solution: Ensure user has 'deliveryBoy' role
- Check: `localStorage.getItem('user')` → role should be 'deliveryBoy'

**Issue: Orders not showing**
- Solution: Check if orders are assigned to this delivery boy
- Admin must assign orders via AdminOrderManagement

**Issue: Can't update status**
- Solution: Verify order is assigned to logged-in delivery boy
- Check token is valid in localStorage

---

## 📞 Support

For issues or questions:
- Check console logs for detailed error messages
- Verify API endpoints are accessible
- Ensure MongoDB is running for backend
- Check network tab for failed requests

---

## ✅ Summary

The Delivery Boy role enhancement provides:
1. ✨ Dedicated delivery personnel dashboard
2. 🎯 Streamlined order pickup/delivery workflow
3. 📊 Real-time performance tracking
4. 🔐 Secure role-based access control
5. 📱 Mobile-optimized interface
6. 🔄 Seamless integration with existing system

**Access the feature:**
- Delivery Boy Dashboard: `/delivery-dashboard`
- Demo Login: `/admin-login-debug` → Click "Delivery Boy"

---

**Last Updated:** January 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
