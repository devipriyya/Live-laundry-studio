const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Shift = require('../models/Shift');
const SupportTicket = require('../models/SupportTicket');
const { protect } = require('../middleware/auth');
const { isDeliveryBoy } = require('../middleware/role');
const { 
  generateDeliveryOTP, 
  verifyOTP, 
  isOTPExpired, 
  isMaxAttemptsExceeded,
  isValidOTPFormat,
  getRemainingAttempts,
  OTP_EXPIRY_MINUTES 
} = require('../utils/otpService');
const { sendDeliveryOTPEmail, sendDeliveryOTPSMS } = require('../utils/emailService');
const {
  getDeliveryBoyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications
} = require('../utils/notificationService');

/**
 * @route   GET /api/delivery-boy/stats
 * @desc    Get dashboard stats for logged-in delivery boy
 * @access  Private (Delivery Boy only)
 */
router.get('/stats', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    
    // Get start of today (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get end of today (11:59:59 PM)
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Today's Pickups - Orders with status 'out-for-pickup' or 'pickup-completed' 
    // that were updated today OR orders where pickup was scheduled for today
    const todayPickups = await Order.countDocuments({
      deliveryBoyId: deliveryBoyId,
      status: { $in: ['out-for-pickup', 'pickup-completed'] },
      $or: [
        { updatedAt: { $gte: today, $lte: endOfToday } },
        { pickupDate: { $gte: today, $lte: endOfToday } }
      ]
    });

    // Today's Deliveries - Orders with status 'out-for-delivery' or 'delivery-completed'
    // that were updated today OR orders where delivery was scheduled for today
    const todayDeliveries = await Order.countDocuments({
      deliveryBoyId: deliveryBoyId,
      status: { $in: ['out-for-delivery', 'delivery-completed'] },
      $or: [
        { updatedAt: { $gte: today, $lte: endOfToday } },
        { deliveryDate: { $gte: today, $lte: endOfToday } }
      ]
    });

    // Pending Tasks - Orders assigned to delivery boy that are not yet completed
    // Includes: out-for-pickup, pickup-completed, out-for-delivery
    const pendingTasks = await Order.countDocuments({
      deliveryBoyId: deliveryBoyId,
      status: { $in: ['out-for-pickup', 'pickup-completed', 'out-for-delivery'] }
    });

    // Completed Tasks Today - Orders completed (delivered) today
    const completedTasksToday = await Order.countDocuments({
      deliveryBoyId: deliveryBoyId,
      status: 'delivery-completed',
      updatedAt: { $gte: today, $lte: endOfToday }
    });

    // Additional stats for comprehensive dashboard
    const totalDeliveries = await Order.countDocuments({
      deliveryBoyId: deliveryBoyId
    });

    const activeDeliveries = await Order.countDocuments({
      deliveryBoyId: deliveryBoyId,
      status: { $in: ['out-for-pickup', 'pickup-completed', 'out-for-delivery'] }
    });

    // Pending Pickups (specific)
    const pendingPickups = await Order.countDocuments({
      deliveryBoyId: deliveryBoyId,
      status: 'out-for-pickup'
    });

    // Pending Deliveries (specific) 
    const pendingDeliveries = await Order.countDocuments({
      deliveryBoyId: deliveryBoyId,
      status: 'out-for-delivery'
    });

    // Calculate earnings today (sum of totalAmount for completed orders today)
    const earningsResult = await Order.aggregate([
      {
        $match: {
          deliveryBoyId: deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: today, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    const earningsToday = earningsResult.length > 0 ? earningsResult[0].total : 0;

    // Calculate weekly earnings
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const weeklyEarningsResult = await Order.aggregate([
      {
        $match: {
          deliveryBoyId: deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: weekStart, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    const weeklyEarnings = weeklyEarningsResult.length > 0 ? weeklyEarningsResult[0].total : 0;

    // Calculate monthly earnings
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyEarningsResult = await Order.aggregate([
      {
        $match: {
          deliveryBoyId: deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: monthStart, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    const monthlyEarnings = monthlyEarningsResult.length > 0 ? monthlyEarningsResult[0].total : 0;

    // Get user availability status
    const deliveryBoy = await User.findById(deliveryBoyId).select('isAvailable');
    const isAvailable = deliveryBoy?.isAvailable || false;

    // Return all stats
    res.json({
      // Primary Dashboard Cards
      todayPickups,
      todayDeliveries,
      pendingTasks,
      completedTasksToday,
      
      // Legacy stats for backward compatibility
      totalDeliveries,
      activeDeliveries,
      completedToday: completedTasksToday,
      pendingPickups,
      pendingDeliveries,
      
      // Earnings
      earningsToday,
      weeklyEarnings,
      monthlyEarnings,
      
      // Performance (placeholder values - can be enhanced later)
      rating: 5.0,
      onTimePercentage: 100,
      
      // Status
      isAvailable
    });
  } catch (error) {
    console.error('Error fetching delivery boy stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

/**
 * @route   GET /api/delivery-boy/notifications
 * @desc    Get notifications for logged-in delivery boy
 * @access  Private (Delivery Boy only)
 */
router.get('/notifications', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = 'false', type } = req.query;
    
    const result = await getDeliveryBoyNotifications(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true',
      type: type || null
    });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
  }
});

/**
 * @route   PATCH /api/delivery-boy/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private (Delivery Boy only)
 */
router.patch('/notifications/:id/read', protect, isDeliveryBoy, async (req, res) => {
  try {
    const notification = await markAsRead(req.params.id, req.user._id);
    
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    res.json({ success: true, message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, message: 'Error updating notification', error: error.message });
  }
});

/**
 * @route   PATCH /api/delivery-boy/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private (Delivery Boy only)
 */
router.patch('/notifications/read-all', protect, isDeliveryBoy, async (req, res) => {
  try {
    const result = await markAllAsRead(req.user._id);
    res.json({ success: true, message: 'All notifications marked as read', modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, message: 'Error updating notifications', error: error.message });
  }
});

/**
 * @route   DELETE /api/delivery-boy/notifications/:id
 * @desc    Delete a notification
 * @access  Private (Delivery Boy only)
 */
router.delete('/notifications/:id', protect, isDeliveryBoy, async (req, res) => {
  try {
    const result = await deleteNotification(req.params.id, req.user._id);
    
    if (!result) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Error deleting notification', error: error.message });
  }
});

/**
 * @route   DELETE /api/delivery-boy/notifications/clear-read
 * @desc    Clear all read notifications
 * @access  Private (Delivery Boy only)
 */
router.delete('/notifications/clear-read', protect, isDeliveryBoy, async (req, res) => {
  try {
    const result = await clearReadNotifications(req.user._id);
    res.json({ success: true, message: 'Read notifications cleared', deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error clearing read notifications:', error);
    res.status(500).json({ success: false, message: 'Error clearing notifications', error: error.message });
  }
});

/**
 * @route   PATCH /api/delivery-boy/availability
 * @desc    Update delivery boy availability status
 * @access  Private (Delivery Boy only)
 */
router.patch('/availability', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, { isAvailable });
    
    res.json({ success: true, isAvailable });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ message: 'Error updating availability', error: error.message });
  }
});

/**
 * @route   GET /api/delivery-boy/assigned-orders
 * @desc    Get all orders assigned to the logged-in delivery boy with comprehensive details
 * @access  Private (Delivery Boy only)
 */
router.get('/assigned-orders', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { 
      status, 
      search, 
      sortBy, 
      sortOrder, 
      page = 1, 
      limit = 20,
      orderType,      // 'pickup' or 'delivery'
      priority,       // 'low', 'normal', 'high'
      dateFrom,       // Filter by date range
      dateTo
    } = req.query;
    
    // Build query
    let query = { deliveryBoyId: deliveryBoyId };
    
    // Filter by order type (pickup phase vs delivery phase)
    if (orderType === 'pickup') {
      query.status = { $in: ['order-placed', 'order-accepted', 'out-for-pickup', 'pickup-completed'] };
    } else if (orderType === 'delivery') {
      query.status = { $in: ['wash-completed', 'drying', 'quality-check', 'out-for-delivery'] };
    }
    
    // Filter by status if provided (overrides orderType if both provided)
    if (status && status !== 'all') {
      if (status === 'pending') {
        // Pending includes active pickup and delivery statuses
        query.status = { $in: ['out-for-pickup', 'pickup-completed', 'out-for-delivery'] };
      } else if (status === 'completed') {
        query.status = 'delivery-completed';
      } else if (status === 'pickup-pending') {
        query.status = { $in: ['order-placed', 'order-accepted', 'out-for-pickup'] };
      } else if (status === 'pickup-done') {
        query.status = 'pickup-completed';
      } else if (status === 'delivery-pending') {
        query.status = 'out-for-delivery';
      } else {
        query.status = status;
      }
    }
    
    // Filter by priority
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    // Filter by date range
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query.createdAt.$lte = endDate;
      }
    }
    
    // Search by order number, booking ID, or customer name/phone
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        { orderNumber: searchRegex },
        { 'customerInfo.name': searchRegex },
        { 'customerInfo.phone': searchRegex },
        { 'customerInfo.email': searchRegex }
      ];
    }
    
    // Build sort options
    let sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortOptions.createdAt = -1; // Default: newest first
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Fetch orders with populated fields
    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('serviceId', 'name description pricePerKg')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const totalOrders = await Order.countDocuments(query);
    
    // Transform orders to include all required fields
    const transformedOrders = orders.map(order => {
      // Extract service types from items
      const serviceTypes = [...new Set(order.items?.map(item => item.service || item.name) || [])];
      
      // Calculate total quantity
      const totalQuantity = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      
      // Determine address based on order status (pickup or delivery address)
      const isPickupPhase = ['out-for-pickup', 'pickup-completed'].includes(order.status);
      const addressLabel = isPickupPhase ? 'Pickup Address' : 'Delivery Address';
      
      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        bookingId: order.orderNumber, // Alias for booking ID
        
        // Customer Information
        customerInfo: {
          name: order.customerInfo?.name || 'N/A',
          email: order.customerInfo?.email || 'N/A',
          phone: order.customerInfo?.phone || 'N/A',
          address: order.customerInfo?.address || {}
        },
        
        // Address with context
        addressLabel: addressLabel,
        fullAddress: order.customerInfo?.address 
          ? `${order.customerInfo.address.street || ''}, ${order.customerInfo.address.city || ''}, ${order.customerInfo.address.state || ''} ${order.customerInfo.address.zipCode || ''}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '')
          : 'Address not available',
        addressInstructions: order.customerInfo?.address?.instructions || '',
        
        // Service Information
        serviceTypes: serviceTypes,
        serviceTypeDisplay: serviceTypes.length > 0 ? serviceTypes.join(', ') : 'General Service',
        serviceName: order.serviceId?.name || serviceTypes[0] || 'Laundry Service',
        
        // Items and Quantity
        items: order.items || [],
        totalItems: order.totalItems || totalQuantity,
        totalQuantity: totalQuantity,
        weight: order.weight || 'N/A',
        
        // Pricing
        totalAmount: order.totalAmount || 0,
        
        // Status
        status: order.status,
        paymentStatus: order.paymentStatus || 'pending',
        priority: order.priority || 'normal',
        
        // Dates
        orderDate: order.orderDate || order.createdAt,
        pickupDate: order.pickupDate,
        deliveryDate: order.deliveryDate,
        estimatedDelivery: order.estimatedDelivery,
        timeSlot: order.timeSlot || 'Not specified',
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        
        // Additional info
        specialInstructions: order.specialInstructions || '',
        notes: order.notes || '',
        
        // Status history for tracking
        statusHistory: order.statusHistory || []
      };
    });
    
    res.json({
      success: true,
      orders: transformedOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / parseInt(limit)),
        totalOrders: totalOrders,
        hasMore: skip + orders.length < totalOrders
      }
    });
  } catch (error) {
    console.error('Error fetching assigned orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching assigned orders', 
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/delivery-boy/order/:id
 * @desc    Get complete order details by order ID or order number for delivery boy
 * @access  Private (Delivery Boy only)
 */
router.get('/order/:id', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const orderId = req.params.id;
    
    // Build query - support both MongoDB ObjectId and order number
    let query = { deliveryBoyId: deliveryBoyId };
    
    if (orderId.length === 24 && /^[0-9a-fA-F]{24}$/.test(orderId)) {
      // It's a valid MongoDB ObjectId
      query._id = orderId;
    } else {
      // It's likely an order number
      query.orderNumber = orderId;
    }
    
    // Fetch order with all populated fields
    const order = await Order.findOne(query)
      .populate('userId', 'name email phone')
      .populate('serviceId', 'name description pricePerKg')
      .populate('statusHistory.updatedBy', 'name')
      .lean();
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or not assigned to you' 
      });
    }
    
    // Extract service types from items
    const serviceTypes = [...new Set(order.items?.map(item => item.service || item.name) || [])];
    
    // Calculate total quantity
    const totalQuantity = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
    
    // Determine phase based on order status
    const isPickupPhase = ['order-placed', 'order-accepted', 'out-for-pickup', 'pickup-completed'].includes(order.status);
    const isDeliveryPhase = ['wash-completed', 'drying', 'quality-check', 'out-for-delivery', 'delivery-completed'].includes(order.status);
    const currentPhase = isPickupPhase ? 'pickup' : (isDeliveryPhase ? 'delivery' : 'processing');
    
    // Build full address
    const address = order.customerInfo?.address || {};
    const fullAddress = [
      address.street,
      address.city,
      address.state,
      address.zipCode
    ].filter(Boolean).join(', ');
    
    // Generate Google Maps link
    const mapsLink = fullAddress 
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
      : null;
    
    // Build comprehensive order details response
    const orderDetails = {
      success: true,
      order: {
        // Basic Order Info
        _id: order._id,
        orderNumber: order.orderNumber,
        bookingId: order.orderNumber,
        
        // Customer Details
        customer: {
          name: order.customerInfo?.name || 'N/A',
          email: order.customerInfo?.email || 'N/A',
          phone: order.customerInfo?.phone || 'N/A',
          phoneLink: order.customerInfo?.phone ? `tel:${order.customerInfo.phone}` : null
        },
        
        // Address Information
        address: {
          street: address.street || '',
          city: address.city || '',
          state: address.state || '',
          zipCode: address.zipCode || '',
          fullAddress: fullAddress || 'Address not available',
          mapsLink: mapsLink,
          instructions: address.instructions || ''
        },
        
        // Current Phase Info
        currentPhase: currentPhase,
        phaseLabel: currentPhase === 'pickup' ? 'Pickup Phase' : (currentPhase === 'delivery' ? 'Delivery Phase' : 'Processing Phase'),
        
        // Laundry Instructions & Notes
        laundryInstructions: order.specialInstructions || '',
        pickupNotes: order.notes || '',
        deliveryNotes: order.deliveryNote || order.notes || '',
        deliveryPhoto: order.deliveryPhoto || null,
        addressInstructions: address.instructions || '',
        
        // Service Information
        serviceTypes: serviceTypes,
        serviceTypeDisplay: serviceTypes.length > 0 ? serviceTypes.join(', ') : 'General Service',
        serviceName: order.serviceId?.name || serviceTypes[0] || 'Laundry Service',
        serviceDescription: order.serviceId?.description || '',
        
        // Items Details
        items: (order.items || []).map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          service: item.service || 'general',
          total: item.quantity * item.price
        })),
        totalItems: order.totalItems || totalQuantity,
        totalQuantity: totalQuantity,
        weight: order.weight || 'N/A',
        
        // Pricing
        totalAmount: order.totalAmount || 0,
        paymentStatus: order.paymentStatus || 'pending',
        paymentMethod: order.paymentMethod || 'N/A',
        
        // Status Information
        status: order.status,
        statusLabel: getStatusLabel(order.status),
        priority: order.priority || 'normal',
        priorityLabel: getPriorityLabel(order.priority),
        
        // Schedule Information
        orderDate: order.orderDate || order.createdAt,
        pickupDate: order.pickupDate,
        deliveryDate: order.deliveryDate,
        estimatedDelivery: order.estimatedDelivery || 'N/A',
        timeSlot: order.timeSlot || 'Not specified',
        
        // Status History
        statusHistory: (order.statusHistory || []).map(history => ({
          status: history.status,
          statusLabel: getStatusLabel(history.status),
          timestamp: history.timestamp,
          updatedBy: history.updatedBy?.name || 'System',
          note: history.note || ''
        })),
        
        // Timestamps
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    };
    
    res.json(orderDetails);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching order details', 
      error: error.message 
    });
  }
});

// Helper function to get human-readable status label
function getStatusLabel(status) {
  const labels = {
    'order-placed': 'Order Placed',
    'order-accepted': 'Order Accepted',
    'out-for-pickup': 'Out for Pickup',
    'pickup-completed': 'Pickup Completed',
    'wash-in-progress': 'Wash in Progress',
    'wash-completed': 'Wash Completed',
    'drying': 'Drying',
    'quality-check': 'Quality Check',
    'out-for-delivery': 'Out for Delivery',
    'delivery-completed': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return labels[status] || status;
}

// Helper function to get priority label
function getPriorityLabel(priority) {
  const labels = {
    'low': 'Low Priority',
    'normal': 'Normal Priority',
    'high': 'High Priority'
  };
  return labels[priority] || 'Normal Priority';
}

/**
 * @route   POST /api/delivery-boy/order/:id/generate-otp
 * @desc    Generate and send delivery OTP to customer
 * @access  Private (Delivery Boy only)
 */
router.post('/order/:id/generate-otp', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryBoyId = req.user._id;
    
    // Build query - support both ObjectId and orderNumber
    let query = { deliveryBoyId };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }
    
    // Find the order
    const order = await Order.findOne(query);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or not assigned to you' 
      });
    }
    
    // Check if order is in correct status for delivery
    if (!['out-for-delivery'].includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP can only be generated for orders that are out for delivery',
        currentStatus: order.status
      });
    }
    
    // Check if OTP was already verified
    if (order.deliveryOTP?.verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Delivery OTP has already been verified for this order'
      });
    }
    
    // Check if valid OTP already exists (not expired)
    if (order.deliveryOTP?.code && 
        order.deliveryOTP?.expiresAt && 
        !isOTPExpired(order.deliveryOTP.expiresAt) &&
        !isMaxAttemptsExceeded(order.deliveryOTP.attempts, order.deliveryOTP.maxAttempts)) {
      return res.status(400).json({ 
        success: false, 
        message: 'A valid OTP already exists. Please wait for it to expire or verify it.',
        expiresAt: order.deliveryOTP.expiresAt,
        remainingAttempts: getRemainingAttempts(order.deliveryOTP.attempts, order.deliveryOTP.maxAttempts)
      });
    }
    
    // Generate new OTP
    const { plainOTP, otpData } = generateDeliveryOTP();
    
    // Update order with new OTP data
    order.deliveryOTP = otpData;
    await order.save();
    
    // Send OTP to customer via email
    const emailResult = await sendDeliveryOTPEmail(order, plainOTP, OTP_EXPIRY_MINUTES);
    
    // Also send via SMS if phone is available
    let smsResult = { success: false };
    if (order.customerInfo?.phone) {
      smsResult = await sendDeliveryOTPSMS(
        order.customerInfo.phone, 
        plainOTP, 
        order.orderNumber
      );
    }
    
    res.json({
      success: true,
      message: 'Delivery OTP generated and sent to customer',
      otpSent: {
        email: emailResult.success,
        sms: smsResult.success
      },
      expiresAt: otpData.expiresAt,
      expiresInMinutes: OTP_EXPIRY_MINUTES,
      customerEmail: order.customerInfo?.email ? 
        order.customerInfo.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : null,
      customerPhone: order.customerInfo?.phone ?
        order.customerInfo.phone.replace(/(\d{2})(\d+)(\d{2})/, '$1****$3') : null
    });
    
  } catch (error) {
    console.error('Error generating delivery OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error generating delivery OTP', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/delivery-boy/order/:id/verify-otp
 * @desc    Verify delivery OTP and mark order as delivered
 * @access  Private (Delivery Boy only)
 */
router.post('/order/:id/verify-otp', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { id } = req.params;
    const { otp, deliveryNote, deliveryPhoto } = req.body;
    const deliveryBoyId = req.user._id;
    
    // Validate OTP input
    if (!otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP is required' 
      });
    }
    
    if (!isValidOTPFormat(otp)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP format. Please enter a 6-digit OTP.' 
      });
    }
    
    // Build query - support both ObjectId and orderNumber
    let query = { deliveryBoyId };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }
    
    // Find the order
    const order = await Order.findOne(query);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or not assigned to you' 
      });
    }
    
    // Check if order is in correct status
    if (order.status !== 'out-for-delivery') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order is not out for delivery',
        currentStatus: order.status
      });
    }
    
    // Check if OTP exists
    if (!order.deliveryOTP?.code) {
      return res.status(400).json({ 
        success: false, 
        message: 'No OTP generated for this order. Please generate OTP first.' 
      });
    }
    
    // Check if already verified
    if (order.deliveryOTP.verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has already been verified' 
      });
    }
    
    // Check if OTP expired
    if (isOTPExpired(order.deliveryOTP.expiresAt)) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP has expired. Please generate a new OTP.',
        expired: true
      });
    }
    
    // Check max attempts
    if (isMaxAttemptsExceeded(order.deliveryOTP.attempts, order.deliveryOTP.maxAttempts)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum verification attempts exceeded. Please generate a new OTP.',
        maxAttemptsExceeded: true
      });
    }
    
    // Increment attempt counter
    order.deliveryOTP.attempts += 1;
    
    // Verify OTP
    const isValid = verifyOTP(otp.toString().trim(), order.deliveryOTP.code);
    
    if (!isValid) {
      await order.save();
      const remainingAttempts = getRemainingAttempts(
        order.deliveryOTP.attempts, 
        order.deliveryOTP.maxAttempts
      );
      
      return res.status(400).json({ 
        success: false, 
        message: `Invalid OTP. ${remainingAttempts} attempt(s) remaining.`,
        remainingAttempts,
        attemptsExhausted: remainingAttempts === 0
      });
    }
    
    // OTP verified successfully - mark order as delivered
    order.deliveryOTP.verified = true;
    order.deliveryOTP.verifiedAt = new Date();
    order.status = 'delivery-completed';
    
    // Add delivery note and photo if provided
    if (deliveryNote) {
      order.deliveryNote = deliveryNote;
    }
    if (deliveryPhoto) {
      order.deliveryPhoto = deliveryPhoto;
    }
    
    // Add to status history
    order.statusHistory.push({
      status: 'delivery-completed',
      timestamp: new Date(),
      updatedBy: deliveryBoyId,
      note: deliveryNote ? `Delivery completed. OTP verified. Note: ${deliveryNote}` : 'Delivery completed. OTP verified successfully.'
    });
    
    await order.save();
    
    res.json({
      success: true,
      message: 'OTP verified successfully. Order marked as delivered!',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        deliveryCompletedAt: order.deliveryOTP.verifiedAt,
        customerName: order.customerInfo?.name
      }
    });
    
  } catch (error) {
    console.error('Error verifying delivery OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error verifying delivery OTP', 
      error: error.message 
    });
  }
});

/**
 * @route   POST /api/delivery-boy/order/:id/resend-otp
 * @desc    Resend delivery OTP to customer (generates new OTP)
 * @access  Private (Delivery Boy only)
 */
router.post('/order/:id/resend-otp', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryBoyId = req.user._id;
    
    // Build query
    let query = { deliveryBoyId };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }
    
    const order = await Order.findOne(query);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or not assigned to you' 
      });
    }
    
    if (order.status !== 'out-for-delivery') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order is not out for delivery' 
      });
    }
    
    if (order.deliveryOTP?.verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP already verified for this order' 
      });
    }
    
    // Generate new OTP
    const { plainOTP, otpData } = generateDeliveryOTP();
    order.deliveryOTP = otpData;
    await order.save();
    
    // Send OTP
    const emailResult = await sendDeliveryOTPEmail(order, plainOTP, OTP_EXPIRY_MINUTES);
    let smsResult = { success: false };
    if (order.customerInfo?.phone) {
      smsResult = await sendDeliveryOTPSMS(order.customerInfo.phone, plainOTP, order.orderNumber);
    }
    
    res.json({
      success: true,
      message: 'New OTP generated and sent to customer',
      otpSent: {
        email: emailResult.success,
        sms: smsResult.success
      },
      expiresAt: otpData.expiresAt,
      expiresInMinutes: OTP_EXPIRY_MINUTES
    });
    
  } catch (error) {
    console.error('Error resending delivery OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error resending delivery OTP', 
      error: error.message 
    });
  }
});

/**
 * @route   GET /api/delivery-boy/order/:id/otp-status
 * @desc    Get OTP status for an order
 * @access  Private (Delivery Boy only)
 */
router.get('/order/:id/otp-status', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryBoyId = req.user._id;
    
    // Build query
    let query = { deliveryBoyId };
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }
    
    const order = await Order.findOne(query).select('orderNumber status deliveryOTP customerInfo');
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found or not assigned to you' 
      });
    }
    
    const otpData = order.deliveryOTP || {};
    const hasOTP = !!otpData.code;
    const isExpired = hasOTP ? isOTPExpired(otpData.expiresAt) : false;
    const attemptsExhausted = hasOTP ? isMaxAttemptsExceeded(otpData.attempts, otpData.maxAttempts) : false;
    
    res.json({
      success: true,
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      otp: {
        generated: hasOTP,
        verified: otpData.verified || false,
        verifiedAt: otpData.verifiedAt || null,
        expired: isExpired,
        expiresAt: otpData.expiresAt || null,
        attempts: otpData.attempts || 0,
        maxAttempts: otpData.maxAttempts || 3,
        remainingAttempts: hasOTP ? getRemainingAttempts(otpData.attempts, otpData.maxAttempts) : 3,
        attemptsExhausted,
        canGenerateNew: !hasOTP || isExpired || attemptsExhausted,
        canVerify: hasOTP && !otpData.verified && !isExpired && !attemptsExhausted
      },
      customer: {
        email: order.customerInfo?.email ? 
          order.customerInfo.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : null,
        phone: order.customerInfo?.phone ?
          order.customerInfo.phone.replace(/(\d{2})(\d+)(\d{2})/, '$1****$3') : null
      }
    });
    
  } catch (error) {
    console.error('Error fetching OTP status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching OTP status', 
      error: error.message 
    });
  }
});

// ============================================
// PROFILE MANAGEMENT ROUTES
// ============================================

/**
 * @route   GET /api/delivery-boy/profile
 * @desc    Get delivery boy profile details
 * @access  Private (Delivery Boy only)
 */
router.get('/profile', protect, isDeliveryBoy, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Calculate delivery statistics
    const totalDeliveries = await Order.countDocuments({
      deliveryBoyId: req.user._id,
      status: 'delivery-completed'
    });

    const totalPickups = await Order.countDocuments({
      deliveryBoyId: req.user._id,
      status: { $in: ['pickup-completed', 'wash-in-progress', 'wash-completed', 'out-for-delivery', 'delivery-completed'] }
    });

    const pendingOrders = await Order.countDocuments({
      deliveryBoyId: req.user._id,
      status: { $in: ['out-for-pickup', 'out-for-delivery'] }
    });

    // Calculate earnings (this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyEarnings = await Order.aggregate([
      {
        $match: {
          deliveryBoyId: req.user._id,
          status: 'delivery-completed',
          updatedAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$totalAmount', 0.1] } } // 10% delivery fee
        }
      }
    ]);

    const userData = user.toObject();
    userData.deliveryStats = {
      totalDeliveries,
      totalPickups,
      pendingOrders,
      monthlyEarnings: monthlyEarnings[0]?.total || 0,
      rating: user.deliveryBoyInfo?.rating || 5.0,
      memberSince: user.createdAt
    };

    res.json({
      success: true,
      profile: userData
    });
  } catch (error) {
    console.error('Error fetching delivery boy profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
});

/**
 * @route   PUT /api/delivery-boy/profile
 * @desc    Update delivery boy profile
 * @access  Private (Delivery Boy only)
 */
router.put('/profile', protect, isDeliveryBoy, async (req, res) => {
  try {
    const {
      name,
      phone,
      dateOfBirth,
      gender,
      bio,
      // Delivery boy specific fields
      vehicleType,
      vehicleNumber,
      licenseNumber,
      licenseExpiry,
      emergencyContact,
      emergencyContactName,
      bankAccountNumber,
      bankName,
      ifscCode,
      upiId,
      workingHours,
      availableDays,
      isAvailable
    } = req.body;

    const updateData = {};
    
    // Basic profile fields
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (gender !== undefined) updateData.gender = gender;
    if (bio !== undefined) updateData.bio = bio;

    // Delivery boy specific fields - using dot notation for nested updates
    if (vehicleType !== undefined) updateData['deliveryBoyInfo.vehicleType'] = vehicleType;
    if (vehicleNumber !== undefined) updateData['deliveryBoyInfo.vehicleNumber'] = vehicleNumber;
    if (licenseNumber !== undefined) updateData['deliveryBoyInfo.licenseNumber'] = licenseNumber;
    if (licenseExpiry !== undefined) updateData['deliveryBoyInfo.licenseExpiry'] = licenseExpiry;
    if (emergencyContact !== undefined) updateData['deliveryBoyInfo.emergencyContact'] = emergencyContact;
    if (emergencyContactName !== undefined) updateData['deliveryBoyInfo.emergencyContactName'] = emergencyContactName;
    if (bankAccountNumber !== undefined) updateData['deliveryBoyInfo.bankAccountNumber'] = bankAccountNumber;
    if (bankName !== undefined) updateData['deliveryBoyInfo.bankName'] = bankName;
    if (ifscCode !== undefined) updateData['deliveryBoyInfo.ifscCode'] = ifscCode;
    if (upiId !== undefined) updateData['deliveryBoyInfo.upiId'] = upiId;
    if (workingHours !== undefined) updateData['deliveryBoyInfo.workingHours'] = workingHours;
    if (availableDays !== undefined) updateData['deliveryBoyInfo.availableDays'] = availableDays;
    if (isAvailable !== undefined) updateData['deliveryBoyInfo.isAvailable'] = isAvailable;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: user
    });
  } catch (error) {
    console.error('Error updating delivery boy profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile', 
      error: error.message 
    });
  }
});

/**
 * @route   PUT /api/delivery-boy/profile/change-password
 * @desc    Change delivery boy password
 * @access  Private (Delivery Boy only)
 */
router.put('/profile/change-password', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'All password fields are required' 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password and confirm password do not match' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be at least 6 characters long' 
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Verify current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }

    // Update password (the pre-save hook will hash it)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error changing password', 
      error: error.message 
    });
  }
});

/**
 * @route   PUT /api/delivery-boy/profile/photo
 * @desc    Update delivery boy profile photo (base64)
 * @access  Private (Delivery Boy only)
 */
router.put('/profile/photo', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ 
        success: false, 
        message: 'Profile picture is required' 
      });
    }

    // Validate base64 image format
    const validFormats = ['data:image/jpeg', 'data:image/png', 'data:image/gif', 'data:image/webp'];
    const isValidFormat = validFormats.some(format => profilePicture.startsWith(format));
    
    if (!isValidFormat) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid image format. Please use JPEG, PNG, GIF, or WebP' 
      });
    }

    // Check file size (base64 is ~33% larger than original)
    const sizeInBytes = Buffer.from(profilePicture.split(',')[1] || '', 'base64').length;
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (sizeInBytes > maxSize) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image size must be less than 5MB' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile photo updated successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Error updating profile photo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating profile photo', 
      error: error.message 
    });
  }
});

/**
 * @route   DELETE /api/delivery-boy/profile/photo
 * @desc    Remove delivery boy profile photo
 * @access  Private (Delivery Boy only)
 */
router.delete('/profile/photo', protect, isDeliveryBoy, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: null },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Profile photo removed successfully'
    });
  } catch (error) {
    console.error('Error removing profile photo:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error removing profile photo', 
      error: error.message 
    });
  }
});

/**
 * @route   PUT /api/delivery-boy/profile/availability
 * @desc    Toggle delivery boy availability status
 * @access  Private (Delivery Boy only)
 */
router.put('/profile/availability', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        message: 'isAvailable must be a boolean' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 'deliveryBoyInfo.isAvailable': isAvailable },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Emit real-time status update
    const io = req.app.get('io');
    if (io) {
      io.emit('status-updated', { 
        userId: user._id, 
        role: user.role, 
        isAvailable: isAvailable 
      });
    }

    res.json({
      success: true,
      message: `Availability ${isAvailable ? 'enabled' : 'disabled'} successfully`,
      isAvailable: user.deliveryBoyInfo?.isAvailable
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating availability', 
      error: error.message 
    });
  }
});

/**
 * @route   PUT /api/delivery-boy/profile/location
 * @desc    Update delivery boy current location
 * @access  Private (Delivery Boy only)
 */
router.put('/profile/location', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid latitude and longitude are required' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        'deliveryBoyInfo.currentLocation': {
          latitude,
          longitude,
          lastUpdated: new Date()
        }
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Location updated successfully',
      location: user.deliveryBoyInfo?.currentLocation
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating location', 
      error: error.message 
    });
  }
});

// ==========================================
// SHIFT MANAGEMENT ENDPOINTS
// ==========================================

/**
 * @route   POST /api/delivery-boy/shift/start
 * @desc    Start a new shift
 * @access  Private (Delivery Boy only)
 */
router.post('/shift/start', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { latitude, longitude, address } = req.body;
    
    // Check if there's already an active shift
    const activeShift = await Shift.getActiveShift(deliveryBoyId);
    if (activeShift) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active shift. Please end it first.',
        shift: activeShift
      });
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Create new shift
    const shift = new Shift({
      deliveryBoyId,
      date: today,
      startTime: now,
      status: 'active',
      startLocation: {
        latitude,
        longitude,
        address
      }
    });
    
    await shift.save();
    
    // Update user availability
    await User.findByIdAndUpdate(deliveryBoyId, {
      'deliveryBoyInfo.isAvailable': true
    });
    
    res.status(201).json({
      success: true,
      message: 'Shift started successfully',
      shift
    });
  } catch (error) {
    console.error('Error starting shift:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting shift',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/delivery-boy/shift/end
 * @desc    End the current shift
 * @access  Private (Delivery Boy only)
 */
router.post('/shift/end', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { latitude, longitude, address, notes } = req.body;
    
    // Get active shift
    const shift = await Shift.getActiveShift(deliveryBoyId);
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'No active shift found'
      });
    }
    
    const now = new Date();
    
    // If on break, end the break first
    if (shift.status === 'on-break' && shift.breaks.length > 0) {
      const lastBreak = shift.breaks[shift.breaks.length - 1];
      if (!lastBreak.endTime) {
        lastBreak.endTime = now;
        lastBreak.duration = Math.floor((now - lastBreak.startTime) / 1000);
      }
    }
    
    // Calculate deliveries and earnings for this shift
    const shiftOrders = await Order.find({
      deliveryBoyId,
      status: 'delivery-completed',
      updatedAt: { $gte: shift.startTime, $lte: now }
    });
    
    const deliveriesCompleted = shiftOrders.length;
    const earnings = shiftOrders.reduce((sum, order) => sum + (order.deliveryFee || 0), 0);
    
    // Count pickups completed during shift
    const pickupsCompleted = await Order.countDocuments({
      deliveryBoyId,
      status: { $in: ['pickup-completed', 'processing', 'wash-completed', 'drying', 'quality-check', 'out-for-delivery', 'delivery-completed'] },
      updatedAt: { $gte: shift.startTime, $lte: now }
    });
    
    // Update shift
    shift.endTime = now;
    shift.status = 'completed';
    shift.deliveriesCompleted = deliveriesCompleted;
    shift.pickupsCompleted = pickupsCompleted;
    shift.totalTasks = deliveriesCompleted + pickupsCompleted;
    shift.earnings = earnings;
    shift.notes = notes;
    shift.endLocation = {
      latitude,
      longitude,
      address
    };
    
    await shift.save();
    
    // Update user availability
    await User.findByIdAndUpdate(deliveryBoyId, {
      'deliveryBoyInfo.isAvailable': false
    });
    
    res.json({
      success: true,
      message: 'Shift ended successfully',
      shift
    });
  } catch (error) {
    console.error('Error ending shift:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending shift',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/delivery-boy/shift/break/start
 * @desc    Start a break during shift
 * @access  Private (Delivery Boy only)
 */
router.post('/shift/break/start', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    
    const shift = await Shift.getActiveShift(deliveryBoyId);
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'No active shift found'
      });
    }
    
    if (shift.status === 'on-break') {
      return res.status(400).json({
        success: false,
        message: 'Already on break'
      });
    }
    
    const now = new Date();
    shift.breaks.push({
      startTime: now
    });
    shift.status = 'on-break';
    
    await shift.save();
    
    res.json({
      success: true,
      message: 'Break started',
      shift
    });
  } catch (error) {
    console.error('Error starting break:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting break',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/delivery-boy/shift/break/end
 * @desc    End break and resume shift
 * @access  Private (Delivery Boy only)
 */
router.post('/shift/break/end', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    
    const shift = await Shift.getActiveShift(deliveryBoyId);
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'No active shift found'
      });
    }
    
    if (shift.status !== 'on-break') {
      return res.status(400).json({
        success: false,
        message: 'Not currently on break'
      });
    }
    
    const now = new Date();
    const lastBreak = shift.breaks[shift.breaks.length - 1];
    
    if (lastBreak && !lastBreak.endTime) {
      lastBreak.endTime = now;
      lastBreak.duration = Math.floor((now - lastBreak.startTime) / 1000);
    }
    
    shift.status = 'active';
    await shift.save();
    
    res.json({
      success: true,
      message: 'Break ended',
      shift
    });
  } catch (error) {
    console.error('Error ending break:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending break',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/shift/current
 * @desc    Get current active shift
 * @access  Private (Delivery Boy only)
 */
router.get('/shift/current', protect, isDeliveryBoy, async (req, res) => {
  try {
    const shift = await Shift.getActiveShift(req.user._id);
    
    res.json({
      success: true,
      shift: shift || null,
      hasActiveShift: !!shift
    });
  } catch (error) {
    console.error('Error getting current shift:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting current shift',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/shift/history
 * @desc    Get shift history with filters
 * @access  Private (Delivery Boy only)
 */
router.get('/shift/history', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { 
      page = 1, 
      limit = 10, 
      dateFrom, 
      dateTo, 
      status,
      period // 'today', '7days', '30days', 'custom'
    } = req.query;
    
    let fromDate, toDate;
    const now = new Date();
    
    // Handle period presets
    if (period === 'today') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (period === '7days') {
      fromDate = new Date(now);
      fromDate.setDate(fromDate.getDate() - 7);
      fromDate.setHours(0, 0, 0, 0);
      toDate = now;
    } else if (period === '30days') {
      fromDate = new Date(now);
      fromDate.setDate(fromDate.getDate() - 30);
      fromDate.setHours(0, 0, 0, 0);
      toDate = now;
    } else if (dateFrom || dateTo) {
      fromDate = dateFrom ? new Date(dateFrom) : undefined;
      toDate = dateTo ? new Date(dateTo) : undefined;
    }
    
    const result = await Shift.getShiftHistory(deliveryBoyId, {
      page: parseInt(page),
      limit: parseInt(limit),
      dateFrom: fromDate,
      dateTo: toDate,
      status
    });
    
    // Format shifts for frontend
    const formattedShifts = result.shifts.map(shift => ({
      id: shift._id,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      status: shift.status,
      hoursWorked: shift.workingDuration ? (shift.workingDuration / 3600).toFixed(2) : 0,
      totalDuration: shift.totalDuration ? (shift.totalDuration / 3600).toFixed(2) : 0,
      breakTime: shift.totalBreakTime ? Math.floor(shift.totalBreakTime / 60) : 0, // in minutes
      deliveries: shift.deliveriesCompleted,
      pickups: shift.pickupsCompleted,
      totalTasks: shift.totalTasks,
      earnings: shift.totalEarnings,
      distance: shift.totalDistance,
      rating: shift.averageRating,
      ratingsCount: shift.ratingsCount
    }));
    
    res.json({
      success: true,
      shifts: formattedShifts,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting shift history:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting shift history',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/shift/stats
 * @desc    Get shift statistics for a period
 * @access  Private (Delivery Boy only)
 */
router.get('/shift/stats', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { period = '7days', dateFrom, dateTo } = req.query;
    
    let fromDate, toDate;
    const now = new Date();
    
    if (period === 'today') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (period === '7days') {
      fromDate = new Date(now);
      fromDate.setDate(fromDate.getDate() - 7);
      fromDate.setHours(0, 0, 0, 0);
      toDate = now;
    } else if (period === '30days') {
      fromDate = new Date(now);
      fromDate.setDate(fromDate.getDate() - 30);
      fromDate.setHours(0, 0, 0, 0);
      toDate = now;
    } else {
      fromDate = dateFrom ? new Date(dateFrom) : new Date(now.setDate(now.getDate() - 7));
      toDate = dateTo ? new Date(dateTo) : new Date();
    }
    
    const stats = await Shift.getShiftStats(deliveryBoyId, fromDate, toDate);
    
    res.json({
      success: true,
      stats: {
        totalShifts: stats.totalShifts,
        totalHoursWorked: (stats.totalHoursWorked / 3600).toFixed(2),
        totalDeliveries: stats.totalDeliveries,
        totalPickups: stats.totalPickups,
        totalEarnings: stats.totalEarnings,
        totalDistance: stats.totalDistance,
        avgRating: stats.avgRating ? stats.avgRating.toFixed(1) : '5.0',
        totalBreakTime: Math.floor(stats.totalBreakTime / 60), // in minutes
        avgHoursPerShift: stats.totalShifts > 0 
          ? ((stats.totalHoursWorked / 3600) / stats.totalShifts).toFixed(2) 
          : 0,
        avgEarningsPerShift: stats.totalShifts > 0 
          ? (stats.totalEarnings / stats.totalShifts).toFixed(2) 
          : 0
      },
      period: {
        from: fromDate,
        to: toDate,
        label: period
      }
    });
  } catch (error) {
    console.error('Error getting shift stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting shift stats',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/shift/:id
 * @desc    Get a specific shift by ID
 * @access  Private (Delivery Boy only)
 */
router.get('/shift/:id', protect, isDeliveryBoy, async (req, res) => {
  try {
    const shift = await Shift.findOne({
      _id: req.params.id,
      deliveryBoyId: req.user._id
    });
    
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'Shift not found'
      });
    }
    
    res.json({
      success: true,
      shift
    });
  } catch (error) {
    console.error('Error getting shift:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting shift',
      error: error.message
    });
  }
});

/**
 * @route   PATCH /api/delivery-boy/shift/:id
 * @desc    Update a shift (notes, etc.)
 * @access  Private (Delivery Boy only)
 */
router.patch('/shift/:id', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { notes } = req.body;
    
    const shift = await Shift.findOneAndUpdate(
      { _id: req.params.id, deliveryBoyId: req.user._id },
      { notes },
      { new: true }
    );
    
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'Shift not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Shift updated',
      shift
    });
  } catch (error) {
    console.error('Error updating shift:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating shift',
      error: error.message
    });
  }
});

// ==========================================
// SUPPORT TICKET ENDPOINTS
// ==========================================

/**
 * @route   POST /api/delivery-boy/support/tickets
 * @desc    Create a new support ticket
 * @access  Private (Delivery Boy only)
 */
router.post('/support/tickets', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { category, subject, description, priority, relatedOrderId } = req.body;
    
    if (!category || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'Category, subject, and description are required'
      });
    }
    
    const ticket = new SupportTicket({
      userId: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: 'deliveryBoy',
      category,
      subject,
      description,
      priority: priority || 'medium',
      relatedOrderId: relatedOrderId || undefined,
      messages: [{
        sender: 'user',
        senderName: req.user.name,
        message: description
      }]
    });
    
    await ticket.save();
    
    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      ticket: {
        id: ticket._id,
        ticketId: ticket.ticketId,
        category: ticket.category,
        subject: ticket.subject,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating support ticket',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/support/tickets
 * @desc    Get all support tickets for the delivery boy
 * @access  Private (Delivery Boy only)
 */
router.get('/support/tickets', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const result = await SupportTicket.getUserTickets(req.user._id, {
      status,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching support tickets',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/support/tickets/stats
 * @desc    Get support ticket statistics
 * @access  Private (Delivery Boy only)
 */
router.get('/support/tickets/stats', protect, isDeliveryBoy, async (req, res) => {
  try {
    const stats = await SupportTicket.getTicketStats(req.user._id);
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching ticket stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket stats',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/support/tickets/:id
 * @desc    Get a specific support ticket
 * @access  Private (Delivery Boy only)
 */
router.get('/support/tickets/:id', protect, isDeliveryBoy, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('relatedOrderId', 'orderId status totalAmount');
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    res.json({
      success: true,
      ticket
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticket',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/delivery-boy/support/tickets/:id/messages
 * @desc    Add a message to a support ticket
 * @access  Private (Delivery Boy only)
 */
router.post('/support/tickets/:id/messages', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    // Don't allow messages on closed tickets
    if (ticket.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot add messages to closed tickets'
      });
    }
    
    ticket.messages.push({
      sender: 'user',
      senderName: req.user.name,
      message
    });
    ticket.lastActivityAt = new Date();
    
    // If ticket was waiting for response, update status
    if (ticket.status === 'waiting-response') {
      ticket.status = 'in-progress';
    }
    
    await ticket.save();
    
    res.json({
      success: true,
      message: 'Message added successfully',
      ticket
    });
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding message',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/delivery-boy/support/tickets/:id/close
 * @desc    Close a support ticket
 * @access  Private (Delivery Boy only)
 */
router.post('/support/tickets/:id/close', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }
    
    ticket.status = 'closed';
    if (rating) ticket.rating = rating;
    if (feedback) ticket.feedback = feedback;
    ticket.lastActivityAt = new Date();
    
    await ticket.save();
    
    res.json({
      success: true,
      message: 'Ticket closed successfully',
      ticket
    });
  } catch (error) {
    console.error('Error closing ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error closing ticket',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/delivery-boy/support/tickets/:id/reopen
 * @desc    Reopen a closed ticket
 * @access  Private (Delivery Boy only)
 */
router.post('/support/tickets/:id/reopen', protect, isDeliveryBoy, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: { $in: ['resolved', 'closed'] }
    });
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found or not eligible for reopening'
      });
    }
    
    ticket.status = 'open';
    ticket.lastActivityAt = new Date();
    ticket.messages.push({
      sender: 'system',
      message: 'Ticket reopened by user'
    });
    
    await ticket.save();
    
    res.json({
      success: true,
      message: 'Ticket reopened successfully',
      ticket
    });
  } catch (error) {
    console.error('Error reopening ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Error reopening ticket',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/support/faqs
 * @desc    Get FAQs for delivery boys
 * @access  Private (Delivery Boy only)
 */
router.get('/support/faqs', protect, isDeliveryBoy, async (req, res) => {
  try {
    // Static FAQs for delivery boys
    const faqs = [
      {
        id: 1,
        category: 'orders',
        question: 'How do I update order status?',
        answer: 'Navigate to My Orders, select the order you want to update, and click on the status button (e.g., "Mark as Picked Up" or "Mark as Delivered"). You may need to verify with OTP for delivery confirmation.'
      },
      {
        id: 2,
        category: 'orders',
        question: 'What should I do if customer is not available?',
        answer: 'Try contacting the customer using the phone number provided. If unreachable, report the issue through the app and contact support. Do not leave the order unattended.'
      },
      {
        id: 3,
        category: 'earnings',
        question: 'When do I receive my earnings?',
        answer: 'Earnings are calculated daily and transferred to your registered bank account within 2-3 business days. You can view your earnings breakdown in the Earnings section.'
      },
      {
        id: 4,
        category: 'earnings',
        question: 'How is my delivery bonus calculated?',
        answer: 'Delivery bonus depends on factors like distance, time slot, weather conditions, and order value. Peak hour deliveries and express orders earn higher bonuses.'
      },
      {
        id: 5,
        category: 'schedule',
        question: 'How do I set my availability?',
        answer: 'Go to Shift Management and set your working hours and available days. You can update this anytime, but changes apply from the next day.'
      },
      {
        id: 6,
        category: 'schedule',
        question: 'Can I take breaks during my shift?',
        answer: 'Yes, you can take breaks by using the "Take Break" button in Shift Management. During breaks, you won\'t receive new order assignments. Resume work when ready.'
      },
      {
        id: 7,
        category: 'account',
        question: 'How do I update my vehicle information?',
        answer: 'Go to Profile Settings, scroll to Vehicle Information section, and update your vehicle details. Keep your documents updated for compliance.'
      },
      {
        id: 8,
        category: 'account',
        question: 'How do I change my password?',
        answer: 'Go to Profile Settings, find the Security section, and click "Change Password". You\'ll need to enter your current password for verification.'
      },
      {
        id: 9,
        category: 'issues',
        question: 'What if I encounter a safety issue?',
        answer: 'Your safety is priority. If you face any dangerous situation, move to safety first, then report the incident through the app. For emergencies, call local emergency services immediately.'
      },
      {
        id: 10,
        category: 'issues',
        question: 'What if the items are damaged?',
        answer: 'Document the damage with photos before delivery. Report through the Incident Report feature in the app. Do not deliver visibly damaged items without customer acknowledgment.'
      }
    ];
    
    res.json({
      success: true,
      faqs
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching FAQs',
      error: error.message
    });
  }
});

// ==========================================
// PERFORMANCE ANALYTICS ENDPOINTS
// ==========================================

/**
 * @route   GET /api/delivery-boy/performance/stats
 * @desc    Get comprehensive performance statistics
 * @access  Private (Delivery Boy only)
 */
router.get('/performance/stats', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { period = '7days' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7days':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '30days':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date();
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
    }
    
    // Total deliveries in period
    const totalDeliveriesInPeriod = await Order.countDocuments({
      deliveryBoyId,
      status: 'delivery-completed',
      updatedAt: { $gte: startDate }
    });
    
    // Total pickups completed in period
    const totalPickupsInPeriod = await Order.countDocuments({
      deliveryBoyId,
      status: { $in: ['pickup-completed', 'out-for-delivery', 'delivery-completed'] },
      updatedAt: { $gte: startDate }
    });
    
    // All-time stats
    const allTimeDeliveries = await Order.countDocuments({
      deliveryBoyId,
      status: 'delivery-completed'
    });
    
    const allTimeOrders = await Order.countDocuments({
      deliveryBoyId
    });
    
    // Calculate average rating from reviews
    const Review = require('../models/Review');
    const reviewStats = await Review.aggregate([
      { $match: { deliveryBoyId: deliveryBoyId } },
      { 
        $group: { 
          _id: null, 
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    
    const avgRating = reviewStats.length > 0 ? reviewStats[0].avgRating : 5.0;
    const totalReviews = reviewStats.length > 0 ? reviewStats[0].totalReviews : 0;
    
    // Calculate on-time percentage (orders completed within estimated time)
    // For now, we'll use a calculation based on orders that were delivered same day as scheduled
    const onTimeOrders = await Order.countDocuments({
      deliveryBoyId,
      status: 'delivery-completed',
      updatedAt: { $gte: startDate },
      $expr: {
        $lte: [
          { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          { $dateToString: { format: '%Y-%m-%d', date: '$deliveryDate' } }
        ]
      }
    });
    
    const onTimePercentage = totalDeliveriesInPeriod > 0 
      ? Math.round((onTimeOrders / totalDeliveriesInPeriod) * 100)
      : 100;
    
    // Earnings in period
    const earningsResult = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);
    
    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].totalEarnings : 0;
    const avgOrderValue = earningsResult.length > 0 ? earningsResult[0].avgOrderValue : 0;
    
    // Daily breakdown for chart
    const dailyStats = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
          deliveries: { $sum: 1 },
          earnings: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Performance by hour (best performing hours)
    const hourlyStats = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $hour: '$updatedAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Recent completed orders
    const recentOrders = await Order.find({
      deliveryBoyId,
      status: 'delivery-completed'
    })
    .select('orderId totalAmount updatedAt contactInfo status')
    .sort({ updatedAt: -1 })
    .limit(10)
    .lean();
    
    // Calculate efficiency score (based on multiple factors)
    const deliveryRate = allTimeOrders > 0 ? (allTimeDeliveries / allTimeOrders) * 100 : 100;
    const efficiencyScore = Math.round((onTimePercentage * 0.4) + (avgRating * 12) + (deliveryRate * 0.2));
    
    // Get shift stats if available
    const Shift = require('../models/Shift');
    const shiftStats = await Shift.getShiftStats(deliveryBoyId, startDate, now);
    
    res.json({
      success: true,
      stats: {
        // Summary stats
        totalDeliveriesInPeriod,
        totalPickupsInPeriod,
        allTimeDeliveries,
        allTimeOrders,
        
        // Performance metrics
        rating: parseFloat(avgRating.toFixed(1)),
        totalReviews,
        onTimePercentage,
        efficiencyScore: Math.min(100, efficiencyScore),
        
        // Earnings
        totalEarnings: parseFloat(totalEarnings.toFixed(2)),
        avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
        
        // Charts data
        dailyStats: dailyStats.map(d => ({
          date: d._id,
          deliveries: d.deliveries,
          earnings: parseFloat(d.earnings.toFixed(2))
        })),
        
        // Best hours
        bestHours: hourlyStats.map(h => ({
          hour: h._id,
          deliveries: h.count
        })),
        
        // Recent orders
        recentOrders: recentOrders.map(o => ({
          orderId: o.orderId,
          amount: o.totalAmount,
          completedAt: o.updatedAt,
          customerName: o.contactInfo?.name || 'Customer'
        })),
        
        // Shift data
        shiftsWorked: shiftStats?.totalShifts || 0,
        totalHoursWorked: shiftStats?.totalHoursWorked || 0,
        
        // Period info
        period,
        startDate,
        endDate: now
      }
    });
  } catch (error) {
    console.error('Error fetching performance stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching performance stats',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/performance/leaderboard
 * @desc    Get delivery boy leaderboard
 * @access  Private (Delivery Boy only)
 */
router.get('/performance/leaderboard', protect, isDeliveryBoy, async (req, res) => {
  try {
    // Get all delivery boys with their completed order counts
    const leaderboard = await Order.aggregate([
      {
        $match: {
          status: 'delivery-completed',
          deliveryBoyId: { $exists: true }
        }
      },
      {
        $group: {
          _id: '$deliveryBoyId',
          totalDeliveries: { $sum: 1 },
          totalEarnings: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalDeliveries: -1 } },
      { $limit: 10 }
    ]);
    
    // Get user details for each delivery boy
    const leaderboardWithDetails = await Promise.all(
      leaderboard.map(async (entry, index) => {
        const user = await User.findById(entry._id).select('name profilePicture');
        return {
          rank: index + 1,
          userId: entry._id,
          name: user?.name || 'Unknown',
          profilePicture: user?.profilePicture,
          totalDeliveries: entry.totalDeliveries,
          totalEarnings: parseFloat(entry.totalEarnings.toFixed(2)),
          isCurrentUser: entry._id.toString() === req.user._id.toString()
        };
      })
    );
    
    // Find current user's rank if not in top 10
    const currentUserInTop = leaderboardWithDetails.find(e => e.isCurrentUser);
    let currentUserRank = null;
    
    if (!currentUserInTop) {
      const allDeliveryBoys = await Order.aggregate([
        {
          $match: {
            status: 'delivery-completed',
            deliveryBoyId: { $exists: true }
          }
        },
        {
          $group: {
            _id: '$deliveryBoyId',
            totalDeliveries: { $sum: 1 }
          }
        },
        { $sort: { totalDeliveries: -1 } }
      ]);
      
      const userIndex = allDeliveryBoys.findIndex(
        e => e._id.toString() === req.user._id.toString()
      );
      
      if (userIndex !== -1) {
        currentUserRank = {
          rank: userIndex + 1,
          totalDeliveries: allDeliveryBoys[userIndex].totalDeliveries
        };
      }
    }
    
    res.json({
      success: true,
      leaderboard: leaderboardWithDetails,
      currentUserRank
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/performance/achievements
 * @desc    Get delivery boy achievements and badges
 * @access  Private (Delivery Boy only)
 */
router.get('/performance/achievements', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    
    // Get all-time stats for achievements
    const totalDeliveries = await Order.countDocuments({
      deliveryBoyId,
      status: 'delivery-completed'
    });
    
    // Calculate achievements based on milestones
    const achievements = [
      {
        id: 'first-delivery',
        title: 'First Delivery',
        description: 'Complete your first delivery',
        icon: '🎉',
        unlocked: totalDeliveries >= 1,
        progress: Math.min(1, totalDeliveries),
        target: 1
      },
      {
        id: 'delivery-10',
        title: 'Rising Star',
        description: 'Complete 10 deliveries',
        icon: '⭐',
        unlocked: totalDeliveries >= 10,
        progress: Math.min(10, totalDeliveries),
        target: 10
      },
      {
        id: 'delivery-50',
        title: 'Delivery Pro',
        description: 'Complete 50 deliveries',
        icon: '🚀',
        unlocked: totalDeliveries >= 50,
        progress: Math.min(50, totalDeliveries),
        target: 50
      },
      {
        id: 'delivery-100',
        title: 'Century Champion',
        description: 'Complete 100 deliveries',
        icon: '💯',
        unlocked: totalDeliveries >= 100,
        progress: Math.min(100, totalDeliveries),
        target: 100
      },
      {
        id: 'delivery-500',
        title: 'Delivery Legend',
        description: 'Complete 500 deliveries',
        icon: '🏆',
        unlocked: totalDeliveries >= 500,
        progress: Math.min(500, totalDeliveries),
        target: 500
      },
      {
        id: 'delivery-1000',
        title: 'Master Deliverer',
        description: 'Complete 1000 deliveries',
        icon: '👑',
        unlocked: totalDeliveries >= 1000,
        progress: Math.min(1000, totalDeliveries),
        target: 1000
      }
    ];
    
    // Count unlocked achievements
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    
    res.json({
      success: true,
      achievements,
      summary: {
        totalAchievements: achievements.length,
        unlockedCount,
        nextMilestone: achievements.find(a => !a.unlocked)
      }
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching achievements',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/earnings/stats
 * @desc    Get comprehensive earnings statistics for delivery boy
 * @access  Private (Delivery Boy only)
 */
router.get('/earnings/stats', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { period = '30days' } = req.query;
    
    // Calculate date ranges
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);
    
    // Calculate period start date
    let periodStart;
    switch (period) {
      case 'today':
        periodStart = todayStart;
        break;
      case '7days':
        periodStart = weekStart;
        break;
      case '30days':
        periodStart = new Date(todayStart);
        periodStart.setDate(periodStart.getDate() - 30);
        break;
      case 'month':
        periodStart = monthStart;
        break;
      case 'year':
        periodStart = yearStart;
        break;
      default:
        periodStart = new Date(todayStart);
        periodStart.setDate(periodStart.getDate() - 30);
    }
    
    // Get today's earnings
    const todayEarningsResult = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: todayStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);
    
    // Get weekly earnings
    const weeklyEarningsResult = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: weekStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get monthly earnings
    const monthlyEarningsResult = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: monthStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get yearly earnings
    const yearlyEarningsResult = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: yearStart }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get all-time earnings
    const allTimeEarningsResult = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get daily breakdown for chart (last 30 days or selected period)
    const dailyEarnings = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: periodStart }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' }
          },
          earnings: { $sum: '$totalAmount' },
          deliveries: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: '$_id',
          earnings: 1,
          deliveries: 1
        }
      }
    ]);
    
    // Get weekly breakdown (last 4 weeks)
    const fourWeeksAgo = new Date(todayStart);
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    
    const weeklyBreakdown = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: fourWeeksAgo }
        }
      },
      {
        $group: {
          _id: { $week: '$updatedAt' },
          earnings: { $sum: '$totalAmount' },
          deliveries: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 4 }
    ]);
    
    // Calculate targets (configurable - using defaults)
    const dailyTarget = 2000;
    const weeklyTarget = 10000;
    const monthlyTarget = 40000;
    
    const todayEarnings = todayEarningsResult[0]?.total || 0;
    const weeklyEarnings = weeklyEarningsResult[0]?.total || 0;
    const monthlyEarnings = monthlyEarningsResult[0]?.total || 0;
    const yearlyEarnings = yearlyEarningsResult[0]?.total || 0;
    const allTimeEarnings = allTimeEarningsResult[0]?.total || 0;
    
    // Calculate comparison with previous period
    let previousPeriodStart, previousPeriodEnd;
    const periodDays = Math.ceil((now - periodStart) / (1000 * 60 * 60 * 24));
    previousPeriodEnd = new Date(periodStart);
    previousPeriodStart = new Date(periodStart);
    previousPeriodStart.setDate(previousPeriodStart.getDate() - periodDays);
    
    const previousEarningsResult = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: previousPeriodStart, $lt: previousPeriodEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const previousEarnings = previousEarningsResult[0]?.total || 0;
    const currentPeriodEarnings = dailyEarnings.reduce((sum, d) => sum + d.earnings, 0);
    const growthPercentage = previousEarnings > 0 
      ? Math.round(((currentPeriodEarnings - previousEarnings) / previousEarnings) * 100) 
      : 0;
    
    res.json({
      success: true,
      earnings: {
        today: {
          amount: todayEarnings,
          deliveries: todayEarningsResult[0]?.count || 0,
          avgOrderValue: Math.round(todayEarningsResult[0]?.avgOrderValue || 0),
          target: dailyTarget,
          progress: Math.min(100, Math.round((todayEarnings / dailyTarget) * 100))
        },
        weekly: {
          amount: weeklyEarnings,
          deliveries: weeklyEarningsResult[0]?.count || 0,
          target: weeklyTarget,
          progress: Math.min(100, Math.round((weeklyEarnings / weeklyTarget) * 100))
        },
        monthly: {
          amount: monthlyEarnings,
          deliveries: monthlyEarningsResult[0]?.count || 0,
          target: monthlyTarget,
          progress: Math.min(100, Math.round((monthlyEarnings / monthlyTarget) * 100))
        },
        yearly: {
          amount: yearlyEarnings,
          deliveries: yearlyEarningsResult[0]?.count || 0
        },
        allTime: {
          amount: allTimeEarnings,
          deliveries: allTimeEarningsResult[0]?.count || 0
        },
        growth: {
          percentage: growthPercentage,
          previousPeriod: previousEarnings,
          currentPeriod: currentPeriodEarnings,
          isPositive: growthPercentage >= 0
        }
      },
      charts: {
        daily: dailyEarnings,
        weekly: weeklyBreakdown.map((w, idx) => ({
          week: `Week ${idx + 1}`,
          earnings: w.earnings,
          deliveries: w.deliveries
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching earnings stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching earnings statistics',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/earnings/transactions
 * @desc    Get earnings transaction history for delivery boy
 * @access  Private (Delivery Boy only)
 */
router.get('/earnings/transactions', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { page = 1, limit = 20, filter = 'all' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build filter query
    let matchQuery = {
      deliveryBoyId,
      status: 'delivery-completed'
    };
    
    // Date filters
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (filter === 'today') {
      matchQuery.updatedAt = { $gte: todayStart };
    } else if (filter === 'week') {
      const weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - 7);
      matchQuery.updatedAt = { $gte: weekStart };
    } else if (filter === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      matchQuery.updatedAt = { $gte: monthStart };
    }
    
    // Get total count
    const totalTransactions = await Order.countDocuments(matchQuery);
    
    // Get transactions with pagination
    const transactions = await Order.find(matchQuery)
      .populate('userId', 'name email phone')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('orderId totalAmount status paymentStatus paymentMethod updatedAt createdAt services userId');
    
    // Format transactions
    const formattedTransactions = transactions.map(order => ({
      id: order._id,
      orderId: order.orderId || `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
      amount: order.totalAmount || 0,
      status: 'completed',
      paymentStatus: order.paymentStatus || 'pending',
      paymentMethod: order.paymentMethod || 'cash',
      completedAt: order.updatedAt,
      createdAt: order.createdAt,
      customerName: order.userId?.name || 'Customer',
      customerPhone: order.userId?.phone || '',
      services: order.services?.length || 0
    }));
    
    // Calculate summary for filtered transactions
    const summaryResult = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgAmount: { $avg: '$totalAmount' }
        }
      }
    ]);
    
    res.json({
      success: true,
      transactions: formattedTransactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalTransactions / parseInt(limit)),
        totalTransactions,
        hasMore: skip + transactions.length < totalTransactions
      },
      summary: {
        totalAmount: summaryResult[0]?.totalAmount || 0,
        totalOrders: summaryResult[0]?.totalOrders || 0,
        avgAmount: Math.round(summaryResult[0]?.avgAmount || 0)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/delivery-boy/earnings/breakdown
 * @desc    Get earnings breakdown by service type, payment method, etc.
 * @access  Private (Delivery Boy only)
 */
router.get('/earnings/breakdown', protect, isDeliveryBoy, async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { period = '30days' } = req.query;
    
    // Calculate period start
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let periodStart;
    
    switch (period) {
      case 'today':
        periodStart = todayStart;
        break;
      case '7days':
        periodStart = new Date(todayStart);
        periodStart.setDate(periodStart.getDate() - 7);
        break;
      case '30days':
        periodStart = new Date(todayStart);
        periodStart.setDate(periodStart.getDate() - 30);
        break;
      case 'month':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        periodStart = new Date(todayStart);
        periodStart.setDate(periodStart.getDate() - 30);
    }
    
    // Breakdown by payment method
    const paymentMethodBreakdown = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: periodStart }
        }
      },
      {
        $group: {
          _id: { $ifNull: ['$paymentMethod', 'cash'] },
          amount: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          method: '$_id',
          amount: 1,
          count: 1
        }
      }
    ]);
    
    // Breakdown by day of week
    const dayOfWeekBreakdown = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: periodStart }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: '$updatedAt' },
          amount: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const formattedDayBreakdown = dayOfWeekBreakdown.map(d => ({
      day: dayNames[d._id - 1],
      dayIndex: d._id,
      amount: d.amount,
      count: d.count
    }));
    
    // Breakdown by hour of day
    const hourlyBreakdown = await Order.aggregate([
      {
        $match: {
          deliveryBoyId,
          status: 'delivery-completed',
          updatedAt: { $gte: periodStart }
        }
      },
      {
        $group: {
          _id: { $hour: '$updatedAt' },
          amount: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const formattedHourlyBreakdown = hourlyBreakdown.map(h => ({
      hour: h._id,
      timeSlot: `${h._id}:00 - ${h._id + 1}:00`,
      amount: h.amount,
      count: h.count
    }));
    
    // Find best performing day and hour
    const bestDay = formattedDayBreakdown.reduce((best, current) => 
      current.amount > (best?.amount || 0) ? current : best, null);
    
    const bestHour = formattedHourlyBreakdown.reduce((best, current) => 
      current.amount > (best?.amount || 0) ? current : best, null);
    
    res.json({
      success: true,
      breakdown: {
        byPaymentMethod: paymentMethodBreakdown,
        byDayOfWeek: formattedDayBreakdown,
        byHour: formattedHourlyBreakdown
      },
      insights: {
        bestDay: bestDay ? {
          day: bestDay.day,
          amount: bestDay.amount,
          deliveries: bestDay.count
        } : null,
        bestHour: bestHour ? {
          hour: bestHour.hour,
          timeSlot: bestHour.timeSlot,
          amount: bestHour.amount,
          deliveries: bestHour.count
        } : null
      }
    });
  } catch (error) {
    console.error('Error fetching earnings breakdown:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching earnings breakdown',
      error: error.message
    });
  }
});

module.exports = router;
