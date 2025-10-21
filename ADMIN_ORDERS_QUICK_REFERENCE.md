# 📋 Admin Order Management - Quick Reference Card

## 🚀 Quick Access
**URL**: `http://localhost:5173/admin-orders`  
**Login**: `admin@fabrico.com` / `admin123`

---

## 🎯 Main Actions

| Action | Icon | What It Does |
|--------|------|--------------|
| **View Details** | 👁️ | Opens full order information |
| **Assign Staff** | 👤+ | Assign delivery person to order |
| **Generate Invoice** | 📄 | Creates printable invoice |
| **Refresh** | 🔄 | Reload all orders |

---

## 🔄 Order Status Flow

```
📋 → ✅ → 🚗 → 📦 → 🧼 → 💨 → 🔍 → 🚚 → ✨
```

1. **📋 Order Placed** - New order
2. **✅ Order Accepted** - Confirmed
3. **🚗 Out for Pickup** - Going to customer
4. **📦 Picked Up** - Items collected
5. **🧼 Washing** - Being cleaned
6. **💨 Drying** - Being dried
7. **🔍 Quality Check** - Inspection
8. **🚚 Out for Delivery** - Delivering
9. **✨ Completed** - Done!

---

## 🔍 Search & Filter

### Search By:
- Order ID: `ORD-12345`
- Customer Name: `John Doe`
- Email: `customer@email.com`

### Filter By Status:
- All Status
- Order Placed
- Order Accepted
- Out for Pickup
- Picked Up
- Washing
- Drying
- Quality Check
- Out for Delivery
- Completed
- Cancelled

---

## 📊 Statistics Cards

| Metric | Shows |
|--------|-------|
| **Total Orders** | All filtered orders |
| **Pending** | Orders placed, not accepted |
| **In Progress** | Washing, drying, quality check |
| **Completed** | Successfully delivered |

---

## 🎨 Status Colors

- 🟨 **Yellow** = Order Placed (New)
- 🟦 **Blue** = Order Accepted
- 🟪 **Purple** = Out for Pickup
- 🟦 **Indigo** = Picked Up
- 🟦 **Cyan** = Washing
- 🟦 **Sky** = Drying
- 🟪 **Pink** = Quality Check
- 🟧 **Orange** = Out for Delivery
- 🟩 **Green** = Completed
- 🟥 **Red** = Cancelled

---

## ⚡ Quick Workflows

### Accept New Order:
1. Find "Order Placed" status
2. Click eye icon 👁️
3. Click "Move to: Order Accepted"
4. Assign staff 👤+

### Complete Delivery:
1. Filter by "Out for Delivery"
2. Click eye icon 👁️
3. Click "Move to: Completed"
4. Generate invoice 📄

### Assign Staff:
1. Click user icon 👤+ on order
2. Select staff from dropdown
3. Click "Assign"

### Generate Invoice:
1. Click document icon 📄
2. Review invoice in new window
3. Click "Print Invoice"

---

## 🔔 Status Update Buttons

In Order Detail Modal:

- **Move to: [Next Status]** - Advances to next step
- **Assign Staff** - Opens staff selection
- **Generate Invoice** - Creates invoice
- **Cancel Order** - Cancels order (before pickup only)

---

## 💡 Pro Tips

1. **Use Search** for quick lookups
2. **Filter First** before searching
3. **Assign Staff Early** for smoother workflow
4. **Update Status Promptly** for customer satisfaction
5. **Add Notes** when updating status
6. **Check Progress Tracker** for visual confirmation

---

## 🚨 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Orders not showing | Click Refresh button |
| Can't find order | Check filters, try search |
| Staff list empty | Create delivery staff users |
| Invoice won't open | Check popup blocker |
| Status won't update | Verify admin login |

---

## 📱 Keyboard Shortcuts

- **Tab** - Navigate between fields
- **Enter** - Confirm selection
- **Esc** - Close modals
- **Ctrl+F** - Browser search

---

## ⏱️ Typical Processing Times

| Service | Duration |
|---------|----------|
| **Express** | 6 hours (same day) |
| **Standard** | 24 hours (next day) |
| **Delicate** | 48 hours (2 days) |

---

## 📞 Emergency Actions

### Order Issues:
1. Open order details
2. Add note in status update
3. Contact customer
4. Update status accordingly

### Customer Not Available:
1. Update status note
2. Reschedule in notes
3. Contact customer

### Quality Issues:
1. At Quality Check stage
2. Return to Washing if needed
3. Document issue in notes

---

## 🎯 Daily Checklist

**Morning:**
- [ ] Check pending orders
- [ ] Accept new orders
- [ ] Assign staff for pickups
- [ ] Review priority orders

**Afternoon:**
- [ ] Monitor washing/drying
- [ ] Perform quality checks
- [ ] Schedule deliveries
- [ ] Update customer statuses

**Evening:**
- [ ] Complete deliveries
- [ ] Generate invoices
- [ ] Review cancelled orders
- [ ] Plan next day pickups

---

## 📊 Quick Stats Meaning

```
📊 Total Orders: 45    ← All orders in current filter
⏳ Pending: 12         ← Need acceptance
🔄 In Progress: 23     ← Being processed
✅ Completed: 10       ← Successfully delivered
```

---

## 🔄 Status Update Rules

**Can Update To Next:**
- Always allowed for normal flow

**Can Skip Statuses:**
- Yes, click any status in detail view

**Cannot Cancel After:**
- Picked Up stage (items already collected)

**Must Assign Staff:**
- Before or during "Out for Pickup"

---

## 💼 Invoice Details

**Generated Invoice Includes:**
- Company info
- Invoice number
- Customer details
- Order items & prices
- Tax calculation (10%)
- Total amount
- Payment info

**How to Print:**
1. Click "Print Invoice" in invoice window
2. Or use Ctrl+P / Cmd+P

---

## 🎨 UI Elements

**Table Icons:**
- 👁️ = View order details
- 👤+ = Assign staff
- 📄 = Generate invoice

**Status Badges:**
- Colored pills with icon + text
- Click for quick filter

**Progress Bar:**
- Visual workflow tracker
- Green = completed steps
- Gray = pending steps

---

## 📈 Best Practices

1. ✅ Update status within 15 minutes
2. ✅ Assign staff immediately after acceptance
3. ✅ Add notes for clarity
4. ✅ Generate invoice upon completion
5. ✅ Monitor quality check carefully
6. ✅ Keep customers informed

---

## 🔐 Access Levels

| Role | Can Do |
|------|--------|
| **Admin** | Everything |
| **Delivery** | Update assigned orders only |
| **Customer** | View own orders only |

---

## 💾 Important Data

**Orders Retained:**
- All statuses kept indefinitely
- Status history preserved
- Cancelled orders archived

**Refresh Rate:**
- Manual refresh only
- Click refresh button for updates
- Search/filter updates real-time

---

## 🎯 Quick Decision Guide

**New Order?** → Accept → Assign Staff  
**Picked Up?** → Start Washing  
**Washing Done?** → Move to Drying  
**Drying Done?** → Quality Check  
**Quality Pass?** → Out for Delivery  
**Delivered?** → Mark Complete → Invoice  

---

## 📞 Support Quick Links

- **Full Guide**: See `ADMIN_ORDER_MANAGEMENT_GUIDE.md`
- **Visual Workflow**: See `ORDER_WORKFLOW_VISUAL.md`
- **Testing Guide**: See `QUICK_START_ADMIN_ORDERS.md`
- **Summary**: See `ADMIN_ORDER_MANAGEMENT_SUMMARY.md`

---

## ⚡ Power User Tips

1. **Batch Processing**: Filter by status, process all similar orders
2. **Staff Efficiency**: Assign nearby orders to same staff
3. **Quality First**: Never skip quality check
4. **Communicate**: Add notes for team visibility
5. **Track Metrics**: Monitor completion times

---

## 🎉 Success Indicators

✅ All orders have assigned staff  
✅ No orders stuck in one status  
✅ Quality check completed for all  
✅ Invoices generated promptly  
✅ Customer satisfaction high  

---

**Print this for quick desk reference!** 📋
