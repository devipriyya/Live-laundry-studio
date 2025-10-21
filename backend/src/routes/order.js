const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { isAdmin, isDeliveryBoy, isAdminOrDeliveryBoy } = require('../middleware/role');

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
    const isAssignedDeliveryBoy = req.user.role === 'deliveryBoy' && 
      order.deliveryBoyId?.toString() === req.user._id.toString();
    
    if (!isAdminUser && !isAssignedDeliveryBoy) {
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
    await order.populate('userId', 'name email');
    await order.populate('serviceId');
    await order.populate('deliveryBoyId', 'name email');
    
    res.json({ message: 'Status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
