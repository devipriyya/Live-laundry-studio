# 🚀 How to Use Staff Management Features

## 📍 Accessing Staff Management

### Step 1: Navigate to Staff Management
1. Log in to your Fabrico admin dashboard
2. Look for **"Staff Management"** in the navigation menu
3. Click to open the staff management page

**Direct Route**: `/staff-management`

---

## ✨ Feature 1: Add or Edit Staff Profiles

### ➕ Adding a New Staff Member

1. **Open the Form**
   - Click the blue **"Add Staff"** button in the top-right corner
   - A modal form will appear

2. **Fill Basic Information** (Section with 👤 icon)
   - Enter **Full Name**
   - Enter **Email Address**
   - Enter **Phone Number**
   - Select **Role** from dropdown:
     - Manager
     - Technician
     - Driver
     - Customer Service
     - Washer
     - Quality Inspector
     - Supervisor
   - Enter **Department** (e.g., "Operations", "Dry Cleaning")
   - Select **Status** (Active, On Leave, Inactive)
   - Choose **Hire Date** using date picker
   - Enter **Annual Salary** in dollars

3. **Add Contact & Address** (Section with 📍 icon)
   - Enter full **Address** in text area
   - Add **Emergency Contact** (Name - Phone Number format)

4. **Add Skills** (Section with 🎓 icon)
   - Type a skill in the input field (e.g., "Dry Cleaning")
   - Click **"Add"** button OR press **Enter**
   - Skill appears as a blue tag
   - Add multiple skills
   - Remove any skill by clicking the **X** on its tag

5. **Save**
   - Click **"Add Staff Member"** button at bottom
   - Staff member is added to the table
   - Modal closes automatically

### ✏️ Editing Existing Staff

1. **Locate the Staff Member**
   - Find them in the staff table
   - You can use search or filters

2. **Open Edit Form**
   - Click the **blue pencil icon** (✏️) in the Actions column
   - Form opens with all current information pre-filled

3. **Make Changes**
   - Update any fields you want to change
   - Add or remove skills
   - Modify any section

4. **Save Changes**
   - Click **"Update Staff Member"** button
   - Changes are saved immediately

### 🗑️ Deleting Staff

1. Click the **red trash icon** (🗑️) in Actions column
2. Confirm deletion in the popup dialog
3. Staff member is removed from the system

---

## ✨ Feature 2: Assign Orders to Staff Members

### 📋 How to Assign Orders

1. **Select Staff Member**
   - Find the staff member in the table
   - Click the **indigo clipboard icon** (📋) in Actions column
   - Assignment modal opens

2. **View Current Assignments** (if any)
   - Top section shows currently assigned orders
   - Blue badges display order numbers

3. **Search for Orders** (optional)
   - Use search bar at top of modal
   - Type order number (e.g., "ORD-001")
   - OR type customer name
   - Results filter in real-time

4. **Select Orders to Assign**
   - Click on any order card to select it
   - Order card turns blue when selected
   - Checkbox appears checked
   - Select multiple orders by clicking more cards
   - Click again to deselect

5. **Review Order Information**
   Each order shows:
   - Order Number (e.g., ORD-001)
   - Customer Name
   - Total Amount (₹)
   - Current Status

6. **Assign Selected Orders**
   - Click **"Assign (X) Order(s)"** button at bottom
   - X shows number of selected orders
   - Button is disabled if nothing selected
   - Success message appears
   - Orders are added to staff member's workload

7. **Cancel**
   - Click **"Cancel"** button to close without assigning

### 💡 Assignment Tips

- ✅ Only unassigned orders appear
- ✅ Orders must be in assignable status:
  - order-placed
  - order-accepted
  - wash-in-progress
- ✅ Can't assign duplicate orders
- ✅ Can assign multiple orders at once

---

## ✨ Feature 3: Track Performance & Completed Tasks

### 📊 Viewing Performance Analytics

1. **Open Performance Dashboard**
   - Find the staff member in the table
   - Click the **green chart icon** (📊) in Actions column
   - Performance modal opens

2. **Review Overview Statistics** (Top Section)
   
   **Four Stat Cards Display:**
   
   - 🔵 **Tasks Completed**
     - Total number of orders completed
     - Lifetime count
   
   - 🟢 **Efficiency**
     - Work efficiency percentage (0-100%)
     - How productive the staff is
   
   - 🟣 **Quality Score**
     - Quality of work delivered (0-100%)
     - Based on standards compliance
   
   - 🟠 **Average Time**
     - Average time to complete each task
     - Shown in hours

3. **Analyze Performance Metrics** (Left Panel)
   
   **Four Progress Bars Show:**
   
   - **Efficiency** (Blue bar)
     - Percentage of optimal performance
     - Higher is better
   
   - **On-Time Delivery** (Green bar)
     - Percentage of timely completions
     - Target: 95%+
   
   - **Quality Score** (Purple bar)
     - Quality metrics percentage
     - Target: 90%+
   
   - **Customer Satisfaction** (Yellow bar)
     - Average customer rating (0-5 stars)
     - Shown as percentage of 5.0

4. **Review Task Summary** (Right Panel)
   
   **Summary Box Shows:**
   
   - **Total Tasks Completed**
     - Lifetime completion count
   
   - **Current Assigned Orders**
     - Active orders in progress
   
   - **Overall Rating**
     - Staff rating with star icon
     - 0-5 scale
   
   - **Average Completion Time**
     - Typical time per task

5. **View Skills & Expertise** (Bottom Section)
   - All staff skills displayed as tags
   - Shows areas of expertise

6. **Close Dashboard**
   - Click **"Close"** button at bottom
   - OR click **X** in top-right corner

### 📈 Understanding the Metrics

| Metric | Good Range | Needs Improvement |
|--------|-----------|-------------------|
| **Efficiency** | 90-100% | Below 85% |
| **On-Time Delivery** | 95-100% | Below 90% |
| **Quality Score** | 90-100% | Below 85% |
| **Customer Satisfaction** | 4.5-5.0 ⭐ | Below 4.0 ⭐ |
| **Avg Completion Time** | Varies by role | Consistently slower than team average |

### 💡 Performance Tracking Tips

- ✅ Check performance weekly
- ✅ Compare across team members
- ✅ Use data for:
  - Performance reviews
  - Bonus calculations
  - Training needs
  - Workload adjustments
- ✅ Look for trends over time
- ✅ Address low scores promptly

---

## 🔍 Additional Features

### Search Staff
1. Use search bar at top of page
2. Type name, email, or role
3. Results filter instantly
4. Clear search to see all staff

### Filter by Role
1. Click **"Role"** dropdown
2. Select specific role (Manager, Driver, etc.)
3. Table shows only that role
4. Select "All Roles" to reset

### Filter by Status
1. Click **"Status"** dropdown
2. Select status (Active, On Leave, Inactive)
3. Table shows only that status
4. Select "All Status" to reset

### View Schedule
1. Click **purple calendar icon** (📅)
2. See weekly work hours
3. View break times
4. Check days off
5. Close modal when done

---

## 📊 Dashboard Overview

### Top Statistics Cards
- **Total Staff**: All registered staff
- **Active**: Currently working staff
- **On Leave**: Staff on leave
- **Avg Rating**: Team average rating

### Staff Table Columns
- **Staff Member**: Avatar, name, email
- **Role**: Color-coded badge
- **Department**: Assigned department
- **Status**: Employment status
- **Rating**: Star rating
- **Orders**: Completed count
- **Actions**: 5 action buttons

---

## 🎯 Common Workflows

### Daily Operations
```
1. Check staff availability (status column)
2. Assign today's orders to available staff
3. Monitor assigned orders count
4. Balance workload across team
```

### Weekly Review
```
1. Review each staff member's performance
2. Check completion rates
3. Identify training needs
4. Adjust schedules if needed
```

### Monthly Evaluation
```
1. Compare performance metrics
2. Calculate performance bonuses
3. Plan promotions or training
4. Update job descriptions
```

---

## ⚡ Quick Tips

1. **Keyboard Shortcuts**
   - Press Enter to add skills quickly
   - Use Tab to navigate form fields

2. **Batch Operations**
   - Assign multiple orders at once
   - Saves time vs one-by-one

3. **Visual Cues**
   - Green = Good/Active
   - Yellow = Warning/On Leave
   - Red = Issue/Inactive
   - Blue = Information

4. **Mobile Use**
   - All features work on mobile
   - Swipe table to see all columns
   - Tap icons to trigger actions

---

## ❓ FAQ

**Q: Can I assign the same order to multiple staff?**  
A: No, each order can only be assigned once to prevent conflicts.

**Q: How do I update performance metrics?**  
A: Metrics update automatically based on completed tasks and customer feedback.

**Q: Can staff see their own performance?**  
A: Currently admin-only. Staff portal coming in future update.

**Q: What happens to assigned orders when I delete staff?**  
A: Orders should be reassigned first. System will warn you.

**Q: How many skills can I add?**  
A: No limit! Add as many relevant skills as needed.

**Q: Can I edit someone's schedule?**  
A: Schedule editing coming soon. Currently view-only.

---

## 🎓 Best Practices

### For Adding Staff
- ✅ Complete all fields accurately
- ✅ Add relevant skills
- ✅ Set correct role and department
- ✅ Verify emergency contact

### For Assigning Orders
- ✅ Match orders to staff skills
- ✅ Balance workload evenly
- ✅ Consider current assignments
- ✅ Check staff availability

### For Performance Tracking
- ✅ Review metrics weekly
- ✅ Act on low scores
- ✅ Recognize high performers
- ✅ Use data for decisions

---

## 🚨 Troubleshooting

**Problem**: Can't find "Add Staff" button  
**Solution**: Scroll to top-right of page

**Problem**: Order assignment modal is empty  
**Solution**: All orders might be assigned already

**Problem**: Can't see performance data  
**Solution**: Performance updates after task completion

**Problem**: Search not working  
**Solution**: Check spelling, clear filters first

**Problem**: Modal won't close  
**Solution**: Click Cancel or X button, avoid clicking outside

---

## 📞 Getting Help

1. **Hover over icons** for tooltips
2. **Check the full guide**: STAFF_MANAGEMENT_GUIDE.md
3. **Quick reference**: STAFF_MANAGEMENT_QUICK_REF.md
4. **Contact admin** if issues persist

---

## ✅ Quick Checklist

Before adding new staff:
- [ ] Have all required information
- [ ] Know their role and department
- [ ] Have emergency contact
- [ ] List of their skills

Before assigning orders:
- [ ] Check staff current workload
- [ ] Verify staff skills match order needs
- [ ] Confirm staff availability
- [ ] Review order details

For performance reviews:
- [ ] Review all metrics
- [ ] Compare to team average
- [ ] Note areas for improvement
- [ ] Plan follow-up actions

---

**You're all set! Start managing your staff efficiently! 🚀**

