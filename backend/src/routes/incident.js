const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');
const Order = require('../models/Order');
const { protect, optionalAuth } = require('../middleware/auth');
const { isAdmin, isDeliveryBoy, isAdminOrDeliveryBoy } = require('../middleware/role');

// Helper function to get incidents with populated data
const getPopulatedIncidents = async (query) => {
  return await Incident.find(query)
    .populate('orderId', 'orderNumber status customerInfo')
    .populate('deliveryBoyId', 'name email phone')
    .populate('customerId', 'name email phone')
    .populate('resolvedBy', 'name email')
    .sort({ createdAt: -1 });
};

// Delivery Boy: Report a new incident
router.post('/', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { orderId, type, description, photoUrl, location } = req.body;
    
    // Validate order exists and is assigned to this delivery boy
    const order = await Order.findOne({ 
      _id: orderId, 
      deliveryBoyId: req.user._id 
    });
    
    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found or not assigned to you' 
      });
    }
    
    // Create incident
    const incident = new Incident({
      orderId,
      deliveryBoyId: req.user._id,
      customerId: order.userId,
      type,
      description,
      photoUrl,
      location,
      // Auto-set priority based on incident type
      priority: type === 'unable-to-deliver' || type === 'customer-not-available' ? 'high' : 'medium'
    });
    
    const savedIncident = await incident.save();
    
    // Populate the response
    const populatedIncident = await getPopulatedIncidents({ _id: savedIncident._id });
    
    res.status(201).json(populatedIncident[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delivery Boy: Get my incidents
router.get('/my-incidents', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { status, priority } = req.query;
    const query = { deliveryBoyId: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    const incidents = await getPopulatedIncidents(query);
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all incidents
router.get('/', protect, isAdmin, async (req, res) => {
  try {
    const { status, priority, deliveryBoyId } = req.query;
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (deliveryBoyId) {
      query.deliveryBoyId = deliveryBoyId;
    }
    
    const incidents = await getPopulatedIncidents(query);
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get incident by ID
router.get('/:id', protect, isAdmin, async (req, res) => {
  try {
    const incident = await getPopulatedIncidents({ _id: req.params.id });
    
    if (!incident.length) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    res.json(incident[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update incident status/resolution
router.patch('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    // Update fields
    if (status) incident.status = status;
    if (resolutionNotes) incident.resolutionNotes = resolutionNotes;
    
    // If resolving, set resolved details
    if (status === 'resolved') {
      incident.resolvedBy = req.user._id;
      incident.resolvedAt = new Date();
    }
    
    const updatedIncident = await incident.save();
    
    // Populate the response
    const populatedIncident = await getPopulatedIncidents({ _id: updatedIncident._id });
    
    res.json(populatedIncident[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Delete incident (if needed)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    await incident.remove();
    res.json({ message: 'Incident removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get incident statistics
router.get('/stats', protect, isAdminOrDeliveryBoy, async (req, res) => {
  try {
    let query = {};
    
    // If delivery boy, only show their incidents
    if (req.user.role === 'deliveryBoy') {
      query = { deliveryBoyId: req.user._id };
    }
    
    const totalIncidents = await Incident.countDocuments(query);
    
    const unresolvedIncidents = await Incident.countDocuments({
      ...query,
      status: { $in: ['reported', 'under-review'] }
    });
    
    const highPriorityIncidents = await Incident.countDocuments({
      ...query,
      priority: 'high'
    });
    
    // Get recent incidents (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentIncidents = await Incident.countDocuments({
      ...query,
      createdAt: { $gte: oneWeekAgo }
    });
    
    res.json({
      totalIncidents,
      unresolvedIncidents,
      highPriorityIncidents,
      recentIncidents
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;