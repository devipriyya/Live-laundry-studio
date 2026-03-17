const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { protect } = require('../middleware/auth');
const { isAdmin, isAdminOrAssistant } = require('../middleware/role');
const { notifyCustomerTicketUpdate } = require('../utils/notificationService');

// @route   GET /api/support-tickets
// @desc    Get all support tickets (Admin Only)
// @access  Private/Admin
router.get('/', protect, isAdminOrAssistant, async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status && status !== 'all') query.status = status;
    if (category && category !== 'all') query.category = category;
    if (priority && priority !== 'all') query.priority = priority;

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'name email phone')
      .populate('relatedOrderId', 'orderNumber status');

    const total = await SupportTicket.countDocuments(query);

    res.json({
      success: true,
      tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/support-tickets/:id
// @desc    Get single support ticket (Admin Only)
// @access  Private/Admin
router.get('/:id', protect, isAdminOrAssistant, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('relatedOrderId', 'orderNumber status')
      .populate('messages.sender', 'name');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/support-tickets/:id
// @desc    Update ticket status and resolution (Admin Only)
// @access  Private/Admin
router.put('/:id', protect, isAdminOrAssistant, async (req, res) => {
  try {
    const { status, resolution, message } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (resolution) {
      ticket.resolution = resolution;
      ticket.resolvedAt = new Date();
      ticket.resolvedBy = req.user._id;
    }

    if (message) {
      ticket.messages.push({
        sender: 'support',
        senderName: req.user.name,
        message,
        createdAt: new Date()
      });
      ticket.lastActivityAt = new Date();
    }

    await ticket.save();

    // Trigger notification
    if (message || resolution) {
      const updateType = resolution ? 'resolution' : 'response';
      try {
        await notifyCustomerTicketUpdate(ticket, updateType);
      } catch (notifError) {
        console.error(`Error sending ticket notification for ${ticket.ticketId}:`, notifError);
      }
    }

    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/support-tickets
// @desc    Create a new support ticket
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { category, subject, description, relatedOrderId, priority } = req.body;
    
    let orderId = null;
    let orderNumberStr = '';

    // If relatedOrderId is provided, check if it's an ObjectId or an order number string
    if (relatedOrderId) {
      if (relatedOrderId.match(/^[0-9a-fA-F]{24}$/)) {
        orderId = relatedOrderId;
      } else {
        // Try to find the order by orderNumber
        const Order = require('../models/Order');
        const order = await Order.findOne({ orderNumber: relatedOrderId });
        if (order) {
          orderId = order._id;
        } else {
          // If not found, just don't link it or handle error
          // For now, let's keep it as is or log it
          console.log(`Order not found for number: ${relatedOrderId}`);
        }
      }
    }

    const ticket = new SupportTicket({
      userId: req.user._id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role,
      category,
      subject,
      description,
      relatedOrderId: orderId || undefined,
      priority: priority || 'medium',
      messages: [{
        sender: 'user',
        senderName: req.user.name,
        message: description
      }]
    });

    await ticket.save();
    res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/support-tickets/my
// @desc    Get current user's support tickets
// @access  Private
router.get('/my', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const result = await SupportTicket.getUserTickets(req.user._id, { status, page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/support-tickets/:id
// @desc    Delete a ticket (Admin Only)
// @access  Private/Admin
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
