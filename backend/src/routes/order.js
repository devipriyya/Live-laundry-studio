const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/role');

// create order (customer)
router.post('/', async (req, res) => {
  try {
    // For now, create a temporary user ID if not authenticated
    const mongoose = require('mongoose');
    const userId = req.user?._id || new mongoose.Types.ObjectId();
    
    const orderData = {
      ...req.body,
      userId: userId,
      orderNumber: req.body.orderNumber || `ORD-${Date.now()}`,
      statusHistory: [{
        status: 'order-placed',
        timestamp: new Date(),
        updatedBy: userId,
        note: 'Order placed by customer'
      }]
    };
    
    const order = new Order(orderData);
    await order.save();
    res.json(order);
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
    
    const orders = await Order.find({ 'customerInfo.email': email })
      .populate('serviceId')
      .populate('deliveryBoyId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
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
    
    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .populate('serviceId')
      .populate('deliveryBoyId', 'name email')
      .populate('statusHistory.updatedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
      
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
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
    const isAssignedDelivery = req.user.role === 'delivery' && 
      order.deliveryBoyId?.toString() === req.user._id.toString();
    
    if (!isAdminUser && !isAssignedDelivery) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }
    
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
    
    res.json({ 
      message: `Updated ${result.modifiedCount} orders`,
      modifiedCount: result.modifiedCount 
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

module.exports = router;
