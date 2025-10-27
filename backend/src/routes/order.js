const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Order = require('../models/Order');
const { protect, optionalAuth } = require('../middleware/auth');
const { isAdmin, isDeliveryBoy, isAdminOrDeliveryBoy } = require('../middleware/role');
const { sendOrderStatusUpdateEmail } = require('../utils/emailService');

// Admin: Get order trends (last 7 days)
router.get('/analytics/orders', protect, isAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);
    
    // Aggregate orders by day
    const orderTrends = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          orders: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);
    
    // Create an array of all days in the range
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Format the response data
    const formattedData = dates.map(date => {
      const dateString = date.toISOString().split('T')[0];
      const dayData = orderTrends.find(item => item._id === dateString);
      
      // Get day name (e.g., "Mon", "Tue")
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      
      return {
        day: dayName,
        date: dateString,
        orders: dayData ? dayData.orders : 0,
        revenue: dayData ? parseFloat(dayData.revenue.toFixed(2)) : 0
      };
    });
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching order trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get monthly income trends
router.get('/analytics/income', protect, isAdmin, async (req, res) => {
  try {
    const { months = 6 } = req.query;
    
    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    
    // Aggregate income by month
    const monthlyIncome = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt"
            }
          },
          income: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);
    
    // Create an array of all months in the range
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsData = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const monthString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      const monthData = monthlyIncome.find(item => item._id === monthString);
      
      monthsData.push({
        month: monthNames[currentDate.getMonth()],
        income: monthData ? parseFloat(monthData.income.toFixed(2)) : 0
      });
      
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    res.json(monthsData);
  } catch (error) {
    console.error('Error fetching monthly income:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get service performance analytics
router.get('/analytics/services', protect, isAdmin, async (req, res) => {
  try {
    // Aggregate orders by service type to get performance metrics
    const servicePerformance = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          orders: { $sum: 1 },
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          totalQuantity: { $sum: '$items.quantity' }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);
    
    // Calculate percentages and format data
    const totalRevenue = servicePerformance.reduce((sum, service) => sum + service.revenue, 0);
    
    const formattedData = servicePerformance.map((service, index) => {
      const percentage = totalRevenue > 0 ? (service.revenue / totalRevenue) * 100 : 0;
      
      // Define colors for different services
      const colors = [
        'bg-blue-500',
        'bg-green-500', 
        'bg-purple-500',
        'bg-orange-500',
        'bg-red-500',
        'bg-indigo-500',
        'bg-pink-500',
        'bg-yellow-500'
      ];
      
      return {
        service: service._id,
        revenue: parseFloat(service.revenue.toFixed(2)),
        orders: service.orders,
        quantity: service.totalQuantity,
        percentage: parseFloat(percentage.toFixed(1)),
        color: colors[index % colors.length]
      };
    });
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching service performance data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// create order (customer)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const authenticatedUserId = req.user?._id;

    const { customerInfo, items, totalAmount, pickupDate, timeSlot } = req.body;

    if (!customerInfo || !items || !totalAmount || !pickupDate || !timeSlot) {
      return res.status(400).json({
        message: 'Missing required fields for order creation'
      });
    }

    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      return res.status(400).json({
        message: 'Customer name, email, and phone are required'
      });
    }

    if (items.some(item => item.service === 'shoe-care')) {
      const { address } = customerInfo;
      if (!address || !address.street || !address.city || !address.state || !address.zipCode) {
        return res.status(400).json({
          message: 'Complete pickup address is required for shoe care orders'
        });
      }
    }

    const orderNumber = req.body.orderNumber || `ORD-${Date.now()}`;

    const orderData = {
      ...req.body,
      userId: authenticatedUserId || null,
      orderNumber,
      paymentStatus: req.body.paymentId ? 'paid' : 'pending', // Set payment status based on payment ID
      statusHistory: [{
        status: 'order-placed',
        timestamp: new Date(),
        updatedBy: authenticatedUserId || null,
        note: 'Order placed by customer'
      }]
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create dry cleaning order with specific validation
router.post('/dry-cleaning', optionalAuth, async (req, res) => {
  try {
    const authenticatedUserId = req.user?._id;

    const {
      shoeType,
      serviceType,
      numberOfPairs,
      pickupDate,
      pickupTime,
      pickupAddress,
      contactInfo
    } = req.body;

    if (!shoeType || !serviceType || !numberOfPairs || !pickupDate || !pickupTime || !pickupAddress || !contactInfo) {
      return res.status(400).json({
        message: 'All fields are required for dry cleaning order'
      });
    }

    if (!contactInfo.name || !contactInfo.phone || !contactInfo.email) {
      return res.status(400).json({
        message: 'Contact name, phone, and email are required'
      });
    }

    if (!pickupAddress.street || !pickupAddress.city || !pickupAddress.state || !pickupAddress.zipCode) {
      return res.status(400).json({
        message: 'Complete pickup address is required'
      });
    }

    const orderData = {
      userId: authenticatedUserId || null,
      orderNumber: `ORD-${Date.now()}`,
      customerInfo: {
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: {
          street: pickupAddress.street,
          city: pickupAddress.city,
          state: pickupAddress.state,
          zipCode: pickupAddress.zipCode,
          instructions: pickupAddress.instructions || ''
        }
      },
      items: [{
        name: shoeType,
        quantity: numberOfPairs,
        price: 15.99,
        service: 'shoe-care'
      }],
      totalAmount: 15.99 * numberOfPairs,
      totalItems: numberOfPairs,
      pickupDate,
      timeSlot: pickupTime,
      specialInstructions: pickupAddress.instructions || '',
      status: 'order-placed',
      paymentStatus: 'paid', // Set to 'paid' since payment was successful
      paymentId: req.body.paymentId, // Include payment ID from frontend
      statusHistory: [{
        status: 'order-placed',
        timestamp: new Date(),
        updatedBy: authenticatedUserId || null,
        note: 'Dry cleaning order placed by customer'
      }]
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      message: 'Dry cleaning order created successfully',
      order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create dry cleaning order for clothes
router.post('/dry-cleaning-clothes', optionalAuth, async (req, res) => {
  try {
    const authenticatedUserId = req.user?._id;

    const {
      items,
      pickupDate,
      pickupTime,
      pickupAddress,
      contactInfo,
      totalAmount
    } = req.body;

    if (!items || !pickupDate || !pickupTime || !pickupAddress || !contactInfo || !totalAmount) {
      return res.status(400).json({
        message: 'All fields are required for dry cleaning order'
      });
    }

    if (!contactInfo.name || !contactInfo.phone || !contactInfo.email) {
      return res.status(400).json({
        message: 'Contact name, phone, and email are required'
      });
    }

    if (!pickupAddress.street || !pickupAddress.city || !pickupAddress.state || !pickupAddress.zipCode) {
      return res.status(400).json({
        message: 'Complete pickup address is required'
      });
    }

    const orderData = {
      userId: authenticatedUserId || null,
      orderNumber: `ORD-${Date.now()}`,
      customerInfo: {
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        address: {
          street: pickupAddress.street,
          city: pickupAddress.city,
          state: pickupAddress.state,
          zipCode: pickupAddress.zipCode,
          instructions: pickupAddress.instructions || ''
        }
      },
      items,
      totalAmount,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      pickupDate,
      timeSlot: pickupTime,
      specialInstructions: pickupAddress.instructions || '',
      status: 'order-placed',
      paymentStatus: 'paid', // Set to 'paid' since payment was successful
      paymentId: req.body.paymentId, // Include payment ID from frontend
      statusHistory: [{
        status: 'order-placed',
        timestamp: new Date(),
        updatedBy: authenticatedUserId || null,
        note: 'Dry cleaning order placed by customer'
      }]
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json({
      message: 'Dry cleaning order created successfully',
      order
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// my orders - fetch by email (no auth required)
router.get('/my', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    console.log(`Fetching orders for email: ${email}`);
    
    // Find orders with the specified email
    const orders = await Order.find({ 'customerInfo.email': email })
      .populate('serviceId')
      .populate('deliveryBoyId', 'name email')
      .sort({ createdAt: -1 });
      
    console.log(`Found ${orders.length} orders for email: ${email}`);
      
    // Filter out orders with missing critical data
    const validOrders = orders.filter(order => {
      return order._id && 
             order.orderNumber && 
             order.customerInfo && 
             order.customerInfo.email === email;
    });
    
    console.log(`Returning ${validOrders.length} valid orders for email: ${email}`);
    
    res.json(validOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// my orders (authenticated) - for future use when proper auth is implemented
router.get('/my-auth', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('serviceId')
      .populate('deliveryBoyId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// admin: get all orders with filtering and pagination
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      paymentStatus,
      page = 1, 
      limit = 20, 
      search,
      startDate,
      endDate 
    } = req.query;
    
    let query = {};
    
    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Filter by priority
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    // Filter by payment status
    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.email': { $regex: search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // Log query for debugging
    console.log('Order query:', JSON.stringify(query, null, 2));
    
    // Count orders with null userId for debugging
    const nullUserIdCount = await Order.countDocuments({ userId: null });
    console.log(`Found ${nullUserIdCount} orders with null userId`);
    
    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('serviceId')
      .populate('deliveryBoyId', 'name email')
      .populate('statusHistory.updatedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    // Log first order for debugging
    if (orders.length > 0) {
      console.log('First order userId:', orders[0].userId);
      console.log('First order userId type:', typeof orders[0].userId);
    }
      
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error in orders endpoint:', error);
    res.status(500).json({ message: error.message });
  }
});

// admin: get order statistics
router.get('/stats', protect, isAdmin, async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);
    
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      statusStats: stats,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// admin: get single order details
router.get('/:id', protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('serviceId')
      .populate('deliveryBoyId', 'name email')
      .populate('statusHistory.updatedBy', 'name');
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// admin: assign to delivery boy
router.patch('/:id/assign', protect, isAdmin, async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { 
        deliveryBoyId,
        $push: {
          statusHistory: {
            status: order.status,
            timestamp: new Date(),
            updatedBy: req.user._id,
            note: `Assigned to delivery person`
          }
        }
      }, 
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// admin/delivery: update order status
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, paymentStatus, note } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check permissions
    const isAdminUser = req.user.role === 'admin';
    const isAssignedDeliveryBoy = req.user.role === 'deliveryBoy' && 
      order.deliveryBoyId?.toString() === req.user._id.toString();
    
    if (!isAdminUser && !isAssignedDeliveryBoy) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    // Store old status for email notification
    const oldStatus = order.status;
    
    // Update status if provided
    if (status) {
      order.status = status;
      order.statusHistory.push({
        status: status,
        timestamp: new Date(),
        updatedBy: req.user._id,
        note: note || `Status updated to ${status}`
      });
    }
    
    // Update payment status if provided
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    
    await order.save();
    
    // Send email notification if status changed
    if (status && status !== oldStatus) {
      // Get the service name from the first item or default to 'Laundry Service'
      const serviceName = order.items && order.items.length > 0 ? order.items[0].name : 'Laundry Service';
      
      // Send email notification
      try {
        const emailResult = await sendOrderStatusUpdateEmail(order, status, serviceName);
        if (emailResult) {
          console.log(`Email notification sent for order ${order.orderNumber}`);
        } else {
          console.warn(`Failed to send email notification for order ${order.orderNumber}`);
        }
      } catch (emailError) {
        console.error(`Error sending email notification for order ${order.orderNumber}:`, emailError);
        // Don't fail the request if email sending fails
      }
    }
    
    // Populate the response
    await order.populate('userId', 'name email');
    await order.populate('serviceId');
    await order.populate('deliveryBoyId', 'name email');
    await order.populate('statusHistory.updatedBy', 'name');
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// admin: bulk status update
router.patch('/bulk/status', protect, isAdmin, async (req, res) => {
  try {
    const { orderIds, status, note } = req.body;
    
    // Find orders to get customer info before updating
    const orders = await Order.find({ _id: { $in: orderIds } });
    
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { 
        status,
        $push: {
          statusHistory: {
            status: status,
            timestamp: new Date(),
            updatedBy: req.user._id,
            note: note || `Bulk status update to ${status}`
          }
        }
      }
    );
    
    // Send email notifications for each order
    let emailSuccessCount = 0;
    let emailFailCount = 0;
    
    for (const order of orders) {
      // Get the service name from the first item or default to 'Laundry Service'
      const serviceName = order.items && order.items.length > 0 ? order.items[0].name : 'Laundry Service';
      
      // Send email notification
      try {
        const emailResult = await sendOrderStatusUpdateEmail(order, status, serviceName);
        if (emailResult) {
          emailSuccessCount++;
          console.log(`Email notification sent for order ${order.orderNumber}`);
        } else {
          emailFailCount++;
          console.warn(`Failed to send email notification for order ${order.orderNumber}`);
        }
      } catch (emailError) {
        emailFailCount++;
        console.error(`Error sending email notification for order ${order.orderNumber}:`, emailError);
        // Continue with other emails even if one fails
      }
    }
    
    console.log(`Bulk email notifications: ${emailSuccessCount} sent, ${emailFailCount} failed`);
    
    res.json({ 
      message: `Updated ${result.modifiedCount} orders. Email notifications: ${emailSuccessCount} sent, ${emailFailCount} failed`,
      modifiedCount: result.modifiedCount,
      emailSuccessCount,
      emailFailCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// admin: delete order
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel order (customer or admin)
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { reason, email } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order can be cancelled
    const cancellableStatuses = ['order-placed', 'order-accepted'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({ 
        message: 'Order cannot be cancelled at this stage' 
      });
    }

    // Verify ownership (for customer cancellation)
    if (email && order.customerInfo.email !== email) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: `Order cancelled. Reason: ${reason || 'Customer request'}`
    });

    // If payment was made, initiate refund
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refund-pending';
    }

    await order.save();
    
    // Send email notification for cancellation
    try {
      // Get the service name from the first item or default to 'Laundry Service'
      const serviceName = order.items && order.items.length > 0 ? order.items[0].name : 'Laundry Service';
      const emailResult = await sendOrderStatusUpdateEmail(order, 'cancelled', serviceName);
      if (emailResult) {
        console.log(`Cancellation email notification sent for order ${order.orderNumber}`);
      } else {
        console.warn(`Failed to send cancellation email notification for order ${order.orderNumber}`);
      }
    } catch (emailError) {
      console.error(`Error sending cancellation email notification for order ${order.orderNumber}:`, emailError);
      // Don't fail the request if email sending fails
    }
    
    res.json({ 
      message: 'Order cancelled successfully', 
      order 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Process refund (admin only)
router.patch('/:id/refund', protect, isAdmin, async (req, res) => {
  try {
    const { refundAmount, refundMethod, refundId } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentStatus !== 'refund-pending' && order.status !== 'cancelled') {
      return res.status(400).json({ 
        message: 'Order is not eligible for refund' 
      });
    }

    order.paymentStatus = 'refunded';
    order.refundInfo = {
      amount: refundAmount || order.totalAmount,
      method: refundMethod || order.paymentMethod,
      refundId: refundId,
      processedAt: new Date(),
      processedBy: req.user._id
    };

    order.statusHistory.push({
      status: order.status,
      timestamp: new Date(),
      updatedBy: req.user._id,
      note: `Refund processed: ₹${refundAmount || order.totalAmount}`
    });

    await order.save();
    res.json({ 
      message: 'Refund processed successfully', 
      order 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delivery Boy Routes

// Get all delivery boys (admin only)
router.get('/delivery-boys/list', protect, isAdmin, async (req, res) => {
  try {
    const User = require('../models/User');
    const deliveryBoys = await User.find({ role: 'deliveryBoy' })
      .select('name email phone profilePicture')
      .sort({ name: 1 });
    
    // Get order count for each delivery boy
    const deliveryBoysWithStats = await Promise.all(
      deliveryBoys.map(async (boy) => {
        const activeOrders = await Order.countDocuments({
          deliveryBoyId: boy._id,
          status: { $in: ['out-for-pickup', 'pickup-completed', 'out-for-delivery'] }
        });
        
        const completedOrders = await Order.countDocuments({
          deliveryBoyId: boy._id,
          status: 'delivery-completed'
        });
        
        return {
          _id: boy._id,
          name: boy.name,
          email: boy.email,
          phone: boy.phone,
          profilePicture: boy.profilePicture,
          activeOrders,
          completedOrders
        };
      })
    );
    
    res.json({ deliveryBoys: deliveryBoysWithStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get assigned orders for delivery boy
router.get('/my-deliveries', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = { deliveryBoyId: req.user._id };
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .populate('serviceId')
      .sort({ createdAt: -1 });
    
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get delivery boy statistics
router.get('/my-deliveries/stats', protect, isDeliveryBoy, async (req, res) => {
  try {
    const totalDeliveries = await Order.countDocuments({ 
      deliveryBoyId: req.user._id 
    });
    
    const activeDeliveries = await Order.countDocuments({
      deliveryBoyId: req.user._id,
      status: { $in: ['out-for-pickup', 'pickup-completed', 'out-for-delivery'] }
    });
    
    const completedToday = await Order.countDocuments({
      deliveryBoyId: req.user._id,
      status: 'delivery-completed',
      updatedAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    
    const pendingPickups = await Order.countDocuments({
      deliveryBoyId: req.user._id,
      status: 'out-for-pickup'
    });
    
    const pendingDeliveries = await Order.countDocuments({
      deliveryBoyId: req.user._id,
      status: 'out-for-delivery'
    });
    
    res.json({
      totalDeliveries,
      activeDeliveries,
      completedToday,
      pendingPickups,
      pendingDeliveries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update delivery status (delivery boy only)
router.patch('/:id/delivery-status', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { status, note, location } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if this delivery boy is assigned to this order
    if (order.deliveryBoyId?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
    // Store old status for email notification
    const oldStatus = order.status;
    
    // Allowed status transitions for delivery boy
    const allowedStatuses = [
      'out-for-pickup',
      'pickup-completed',
      'out-for-delivery',
      'delivery-completed'
    ];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Delivery boys can only update pickup and delivery statuses.' 
      });
    }
    
    order.status = status;
    order.statusHistory.push({
      status: status,
      timestamp: new Date(),
      updatedBy: req.user._id,
      note: note || `Status updated to ${status} by delivery boy`
    });
    
    await order.save();
    
    // Send email notification if status changed
    if (status && status !== oldStatus) {
      // Get the service name from the first item or default to 'Laundry Service'
      const serviceName = order.items && order.items.length > 0 ? order.items[0].name : 'Laundry Service';
      
      // Send email notification
      try {
        await sendOrderStatusUpdateEmail(order, status, serviceName);
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email sending fails
      }
    }
    
    await order.populate('userId', 'name email');
    await order.populate('serviceId');
    await order.populate('deliveryBoyId', 'name email');
    
    res.json({ message: 'Status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Fix order user associations
router.post('/fix-user-associations', protect, isAdmin, async (req, res) => {
  try {
    console.log('Admin requested to fix order user associations');
    
    // Get all orders to check
    console.log('Finding all orders...');
    const allOrders = await Order.find({});
    console.log(`Total orders in database: ${allOrders.length}`);
    
    // Get orders without userId
    console.log('Finding orders without userId...');
    const ordersWithoutUser = await Order.find({ userId: { $exists: false } });
    console.log(`Found ${ordersWithoutUser.length} orders without userId field`);
    
    // Also check for orders with explicit null userId
    const ordersWithNullUserId = await Order.find({ userId: null });
    console.log(`Found ${ordersWithNullUserId.length} orders with null userId`);
    
    const allOrdersWithoutUser = [...ordersWithoutUser, ...ordersWithNullUserId];
    console.log(`Total orders to process: ${allOrdersWithoutUser.length}`);
    
    if (allOrdersWithoutUser.length === 0) {
      return res.json({ 
        message: 'No orders need fixing', 
        fixedCount: 0,
        totalOrders: 0,
        databaseTotal: allOrders.length
      });
    }
    
    let fixedCount = 0;
    const User = require('../models/User');
    
    // For each order, try to find and associate the user
    console.log('Processing orders...');
    for (const order of allOrdersWithoutUser) {
      try {
        // Find user by email
        const user = await User.findOne({ email: order.customerInfo.email });
        if (user) {
          console.log(`Associating order ${order.orderNumber} with user ${user.email} (${user._id})`);
          order.userId = user._id;
          await order.save();
          fixedCount++;
        } else {
          console.log(`No user found for order ${order.orderNumber} with email ${order.customerInfo.email}`);
        }
      } catch (error) {
        console.error(`Error fixing order ${order.orderNumber}:`, error.message);
      }
    }
    
    res.json({ 
      message: `Successfully fixed ${fixedCount} orders`, 
      fixedCount,
      totalOrders: allOrdersWithoutUser.length,
      databaseTotal: allOrders.length
    });
  } catch (error) {
    console.error('Error fixing order user associations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Fix order user associations (improved version)
router.post('/fix-user-associations-improved', protect, isAdmin, async (req, res) => {
  try {
    console.log('Admin requested to fix order user associations (improved version)');
    
    // Get all orders
    console.log('Finding all orders...');
    const allOrders = await Order.find({});
    console.log(`Total orders in database: ${allOrders.length}`);
    
    // Get orders with null or missing userId
    console.log('Finding orders with null or missing userId...');
    const ordersWithNullUserId = await Order.find({ userId: null });
    console.log(`Found ${ordersWithNullUserId.length} orders with null userId`);
    
    const ordersWithMissingUserId = await Order.find({ userId: { $exists: false } });
    console.log(`Found ${ordersWithMissingUserId.length} orders with missing userId field`);
    
    const allOrdersWithoutUser = [...ordersWithNullUserId, ...ordersWithMissingUserId];
    console.log(`Total orders to process: ${allOrdersWithoutUser.length}`);
    
    if (allOrdersWithoutUser.length === 0) {
      return res.json({ 
        message: 'No orders need fixing', 
        fixedCount: 0,
        totalOrders: 0,
        databaseTotal: allOrders.length
      });
    }
    
    let fixedCount = 0;
    const User = require('../models/User');
    
    // For each order, try to find and associate the user
    console.log('Processing orders...');
    for (const order of allOrdersWithoutUser) {
      try {
        // Skip if customer info is missing
        if (!order.customerInfo || !order.customerInfo.email) {
          console.log(`Skipping order ${order.orderNumber} - missing customer info`);
          continue;
        }
        
        // Find user by email
        const user = await User.findOne({ email: order.customerInfo.email });
        if (user) {
          console.log(`Associating order ${order.orderNumber} with user ${user.email} (${user._id})`);
          order.userId = user._id;
          await order.save();
          fixedCount++;
        } else {
          console.log(`No user found for order ${order.orderNumber} with email ${order.customerInfo.email}`);
        }
      } catch (error) {
        console.error(`Error fixing order ${order.orderNumber}:`, error.message);
      }
    }
    
    res.json({ 
      message: `Successfully fixed ${fixedCount} orders`, 
      fixedCount,
      totalOrders: allOrdersWithoutUser.length,
      databaseTotal: allOrders.length
    });
  } catch (error) {
    console.error('Error fixing order user associations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Export all orders as CSV
router.get('/export/csv', protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('deliveryBoyId', 'name')
      .sort({ createdAt: -1 });

    // Create CSV header
    const csvHeader = [
      'Order ID',
      'Customer Name',
      'Email',
      'Products',
      'Quantity',
      'Price',
      'Total',
      'Order Date',
      'Payment Status',
      'Delivery Status'
    ].join(',');

    // Create CSV rows
    const csvRows = orders.map(order => {
      // Combine all items into a single string
      const products = order.items.map(item => item.name).join('; ');
      const quantities = order.items.map(item => item.quantity).join('; ');
      const prices = order.items.map(item => item.price).join('; ');
      
      return [
        `"${order.orderNumber}"`,
        `"${order.customerInfo.name}"`,
        `"${order.customerInfo.email}"`,
        `"${products}"`,
        `"${quantities}"`,
        `"${prices}"`,
        `"${order.totalAmount}"`,
        `"${new Date(order.createdAt).toLocaleDateString()}"`,
        `"${order.paymentStatus}"`,
        `"${order.status}"`
      ].join(',');
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Set headers for CSV download
    res.header('Content-Type', 'text/csv');
    res.attachment('orders-export.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error exporting orders as CSV:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Export all orders as PDF
router.get('/export/pdf', protect, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('deliveryBoyId', 'name')
      .sort({ createdAt: -1 });

    // Calculate summary statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Create a document
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=orders-export.pdf');
    
    // Pipe the PDF into the response
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('Orders Export', { align: 'center' });
    doc.moveDown();

    // Summary section
    doc.fontSize(12);
    doc.text(`Total Orders: ${totalOrders}`);
    doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`);
    doc.moveDown();
    doc.moveDown();

    // Table headers
    const tableTop = doc.y;
    const rowHeight = 20;
    const startX = 30;
    
    doc.fontSize(10);
    doc.font('Helvetica-Bold');
    doc.text('Order ID', startX, tableTop);
    doc.text('Customer', startX + 80, tableTop);
    doc.text('Email', startX + 160, tableTop);
    doc.text('Products', startX + 240, tableTop);
    doc.text('Total', startX + 320, tableTop);
    doc.text('Date', startX + 380, tableTop);
    doc.text('Payment', startX + 440, tableTop);
    doc.text('Status', startX + 500, tableTop);
    doc.font('Helvetica');

    // Draw table rows
    let y = tableTop + rowHeight;
    
    for (const order of orders) {
      if (y > 750) { // Create new page if needed
        doc.addPage();
        y = 50;
      }
      
      const products = order.items.map(item => item.name).join(', ');
      
      doc.text(order.orderNumber, startX, y);
      doc.text(order.customerInfo.name, startX + 80, y);
      doc.text(order.customerInfo.email, startX + 160, y);
      doc.text(products, startX + 240, y, { width: 80 });
      doc.text(`₹${order.totalAmount.toFixed(2)}`, startX + 320, y);
      doc.text(new Date(order.createdAt).toLocaleDateString(), startX + 380, y);
      doc.text(order.paymentStatus, startX + 440, y);
      doc.text(order.status, startX + 500, y);
      
      y += rowHeight;
    }

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Error exporting orders as PDF:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
