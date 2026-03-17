const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
// LaundryStaff model not needed since we're using User model with role 'laundryStaff'
const { protect, optionalAuth } = require('../middleware/auth');
const { isAdmin, isDeliveryBoy, isAdminOrDeliveryBoy, isLaundryStaff, isAdminOrLaundryStaff, isAdminOrAssistant } = require('../middleware/role');

// Debug: Check if functions are properly loaded
console.log('Middleware functions loaded:', {
  protect: typeof protect,
  isAdmin: typeof isAdmin,
  isLaundryStaff: typeof isLaundryStaff,
  isAdminOrLaundryStaff: typeof isAdminOrLaundryStaff
});

// Admin: Get all laundry staff members
router.get('/laundry-staff', protect, isAdminOrAssistant, async (req, res) => {
  try {
    const laundryStaff = await User.find({ role: 'laundryStaff' })
      .select('-password')
      .sort({ createdAt: -1 });

    const formattedStaff = laundryStaff.map(staff => ({
      id: staff._id,
      name: staff.name,
      email: staff.email,
      phone: staff.phone,
      role: staff.laundryStaffInfo?.designation || 'Staff',
      department: staff.laundryStaffInfo?.department || 'Laundry',
      status: staff.isBlocked ? 'Inactive' : 'Active',
      hireDate: staff.createdAt,
      rating: staff.laundryStaffInfo?.rating || 5.0,
      completedOrders: staff.laundryStaffInfo?.totalOrdersCompleted || 0
    }));

    res.json({ laundryStaff: formattedStaff });
  } catch (error) {
    console.error('Error fetching laundry staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create laundry staff account
router.post('/laundry-staff', protect, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, password, designation, department } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new laundry staff user
    const newUser = new User({
      name,
      email,
      phone,
      password,
      role: 'laundryStaff',
      laundryStaffInfo: {
        designation,
        department
      }
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'Laundry staff created successfully',
      laundryStaff: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        phone: savedUser.phone,
        role: savedUser.role,
        designation: savedUser.laundryStaffInfo.designation,
        department: savedUser.laundryStaffInfo.department
      }
    });
  } catch (error) {
    console.error('Error creating laundry staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update laundry staff account
router.put('/laundry-staff/:id', protect, isAdmin, async (req, res) => {
  try {
    const { name, email, phone, isBlocked, designation, department } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Laundry staff not found' });
    }

    if (user.role !== 'laundryStaff') {
      return res.status(400).json({ message: 'User is not a laundry staff' });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.isBlocked = isBlocked !== undefined ? isBlocked : user.isBlocked;

    // Initialize laundryStaffInfo if it doesn't exist
    if (!user.laundryStaffInfo) {
      user.laundryStaffInfo = {};
    }

    user.laundryStaffInfo.designation = designation || user.laundryStaffInfo.designation;
    user.laundryStaffInfo.department = department || user.laundryStaffInfo.department;

    const updatedUser = await user.save();

    res.json({
      message: 'Laundry staff updated successfully',
      laundryStaff: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isBlocked: updatedUser.isBlocked,
        role: updatedUser.role,
        designation: updatedUser.laundryStaffInfo.designation,
        department: updatedUser.laundryStaffInfo.department
      }
    });
  } catch (error) {
    console.error('Error updating laundry staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete laundry staff account
router.delete('/laundry-staff/:id', protect, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Laundry staff not found' });
    }

    if (user.role !== 'laundryStaff') {
      return res.status(400).json({ message: 'User is not a laundry staff' });
    }

    // Check if user has assigned orders
    const assignedOrders = await Order.countDocuments({ assignedLaundryStaff: userId });
    if (assignedOrders > 0) {
      return res.status(400).json({ message: 'Cannot delete laundry staff with assigned orders' });
    }

    await User.findByIdAndDelete(userId);

    res.json({ message: 'Laundry staff deleted successfully' });
  } catch (error) {
    console.error('Error deleting laundry staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Assign order to laundry staff
router.patch('/orders/:orderId/assign-laundry-staff', protect, isAdmin, async (req, res) => {
  try {
    const { laundryStaffId } = req.body;
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const laundryStaff = await User.findById(laundryStaffId);
    if (!laundryStaff || (laundryStaff.role !== 'laundryStaff' && laundryStaff.role !== 'staff')) {
      return res.status(404).json({ message: 'Laundry staff not found or invalid role' });
    }

    // Update order with laundry staff assignment
    order.assignedLaundryStaff = laundryStaffId;
    order.status = 'wash-in-progress'; // Automatically update status when assigned to laundry staff

    // Add to status history
    order.statusHistory.push({
      status: 'wash-in-progress',
      timestamp: new Date(),
      note: `Assigned to laundry staff: ${laundryStaff.name}`
    });

    const updatedOrder = await order.save();

    // Create notification for the laundry staff
    const notification = new Notification({
      userId: laundryStaffId,
      type: 'order_assignment',
      title: 'New Order Assigned',
      message: `Order ${updatedOrder.orderNumber} has been assigned to you`,
      priority: 'high',
      relatedEntity: {
        type: 'order',
        id: updatedOrder._id
      }
    });
    await notification.save();

    res.json({
      message: 'Order assigned to laundry staff successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error assigning order to laundry staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Laundry Staff: Get dashboard statistics
router.get('/stats', protect, isLaundryStaff, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get active orders (assigned but not completed)
    const activeOrdersCount = await Order.countDocuments({
      assignedLaundryStaff: userId,
      status: { $in: ['wash-in-progress', 'wash-completed', 'quality-check'] }
    });

    // Get orders pending quality check
    const pendingQCCount = await Order.countDocuments({
      assignedLaundryStaff: userId,
      status: 'quality-check'
    });

    // Get orders completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedTodayCount = await Order.countDocuments({
      assignedLaundryStaff: userId,
      status: 'ready-for-delivery',
      'statusHistory.timestamp': { $gte: today }
    });

    // Simple efficiency calculation (placeholder for now)
    const efficiency = 92;

    res.json({
      activeOrders: activeOrdersCount,
      pendingQC: pendingQCCount,
      completedToday: completedTodayCount,
      efficiency: efficiency
    });
  } catch (error) {
    console.error('Error fetching laundry staff stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Laundry Staff: Get performance metrics
router.get('/performance', protect, isLaundryStaff, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total completed orders
    const totalCompleted = await Order.countDocuments({
      assignedLaundryStaff: userId,
      status: { $in: ['ready-for-delivery', 'delivered'] }
    });

    // Get active orders
    const activeOrders = await Order.countDocuments({
      assignedLaundryStaff: userId,
      status: { $in: ['wash-in-progress', 'wash-completed', 'quality-check'] }
    });

    // Calculate completion rate
    const totalAssigned = totalCompleted + activeOrders;
    const completionRate = totalAssigned > 0
      ? Math.round((totalCompleted / totalAssigned) * 100)
      : 0;

    // Calculate earnings (Mock calculation for now as we don't have a commission model yet)
    // Assuming flat rate per order for demo
    const ratePerOrder = 50;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const completedToday = await Order.countDocuments({
      assignedLaundryStaff: userId,
      status: { $in: ['ready-for-delivery', 'delivered'] },
      'statusHistory.timestamp': { $gte: today }
    });

    const completedWeek = await Order.countDocuments({
      assignedLaundryStaff: userId,
      status: { $in: ['ready-for-delivery', 'delivered'] },
      'statusHistory.timestamp': { $gte: startOfWeek }
    });

    const completedMonth = await Order.countDocuments({
      assignedLaundryStaff: userId,
      status: { $in: ['ready-for-delivery', 'delivered'] },
      'statusHistory.timestamp': { $gte: startOfMonth }
    });

    // Mock weekly progress data based on actual counts if possible, otherwise randomized for demo looks natural
    // In a real app, this would be an aggregation query
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyProgress = days.map(day => ({
      day,
      count: Math.floor(Math.random() * 15) // Placeholder for demo visualization 
    }));

    const metrics = {
      overallRating: req.user.laundryStaffInfo?.rating || 4.8,
      completionRate,
      onTimePercentage: 95, // Placeholder
      totalOrdersCompleted: totalCompleted,
      efficiencyScore: 92, // Placeholder
      qualityScore: 96, // Placeholder
      earnings: {
        today: completedToday * ratePerOrder,
        thisWeek: completedWeek * ratePerOrder,
        thisMonth: completedMonth * ratePerOrder
      },
      weeklyProgress,
      topStrengths: ['Punctuality', 'Stain Removal', 'Fabric Care']
    };

    res.json({ metrics });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Laundry Staff: Get schedule
router.get('/schedule', protect, isLaundryStaff, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's actual schedule or default if not set
    const schedule = user.laundryStaffInfo?.weeklySchedule || {
      monday: { start: '09:00', end: '18:00', break: '13:00 - 14:00' },
      tuesday: { start: '09:00', end: '18:00', break: '13:00 - 14:00' },
      wednesday: { start: '09:00', end: '18:00', break: '13:00 - 14:00' },
      thursday: { start: '09:00', end: '18:00', break: '13:00 - 14:00' },
      friday: { start: '09:00', end: '18:00', break: '13:00 - 14:00' },
      saturday: { start: '09:00', end: '15:00', break: '12:00 - 12:30' },
      sunday: { start: 'OFF', end: 'OFF', break: '' }
    };

    res.json({ schedule });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Laundry Staff: Update schedule
router.put('/schedule', protect, isLaundryStaff, async (req, res) => {
  try {
    const { schedule } = req.body;

    // Validate basic structure if needed
    if (!schedule) {
      return res.status(400).json({ message: 'Schedule data is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize laundryStaffInfo if it doesn't exist
    if (!user.laundryStaffInfo) {
      user.laundryStaffInfo = {};
    }

    user.laundryStaffInfo.weeklySchedule = schedule;
    await user.save();

    res.json({ message: 'Schedule updated successfully', schedule: user.laundryStaffInfo.weeklySchedule });
  } catch (error) {
    console.error('Error updating schedule:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Laundry Staff: Report quality issue
router.post('/orders/:orderId/quality-issue', protect, isLaundryStaff, async (req, res) => {
  try {
    const { issueType, description, severity } = req.body;
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Add quality issue to order or a separate QualityIssue model
    // For now we'll add a note to status history
    order.statusHistory.push({
      status: 'quality-check',
      timestamp: new Date(),
      note: `Quality Issue [${issueType}]: ${description} (${severity})`
    });

    await order.save();
    res.json({ message: 'Quality issue reported successfully' });
  } catch (error) {
    console.error('Error reporting quality issue:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Laundry Staff: Get quality reports
router.get('/quality-reports', protect, isLaundryStaff, async (req, res) => {
  try {
    // Return empty list or relevant quality reports for this staff member
    res.json({ reports: [] });
  } catch (error) {
    console.error('Error fetching quality reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Laundry Staff: Get assigned orders
router.get('/assigned-orders', protect, isLaundryStaff, async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({
      assignedLaundryStaff: userId
    }).sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Error fetching assigned orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Laundry Staff: Get order details by ID
router.get('/order/:orderId', protect, isLaundryStaff, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
      .populate('userId', 'name email phone')
      .populate('serviceId', 'name description');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.assignedLaundryStaff?.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Laundry Staff: Update order status
router.patch('/orders/:orderId/status', protect, isLaundryStaff, async (req, res) => {
  try {
    const { status, note, estimatedDelivery } = req.body;
    const orderId = req.params.orderId;
    const userId = req.user.id;

    const validStatuses = [
      'wash-in-progress',
      'wash-completed',
      'washing',
      'drying',
      'cleaning',
      'pressing',
      'quality-check',
      'ready-for-delivery',
      'ready-for-pickup'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.assignedLaundryStaff.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update order fields
    order.status = status;
    if (estimatedDelivery) {
      order.estimatedDelivery = estimatedDelivery;
    }
    
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status} by laundry staff`,
      updatedBy: userId
    });

    const updatedOrder = await order.save();

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;