const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');
const { isAdmin, isDeliveryBoy } = require('../middleware/role');

// Helper function to get locations with populated data
const getPopulatedLocations = async (query, limit = 100) => {
  return await Location.find(query)
    .populate('deliveryBoyId', 'name email phone')
    .populate('orderId', 'orderNumber status customerInfo')
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Delivery Boy: Get location history for a specific order
router.get('/order/:orderId', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { orderId } = req.params;
    
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
    
    const locations = await getPopulatedLocations({ orderId });
    
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all locations for a specific order
router.get('/order/:orderId/admin', protect, isAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const locations = await getPopulatedLocations({ orderId });
    
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get latest locations for all active orders
router.get('/latest', protect, isAdmin, async (req, res) => {
  try {
    // Get the latest location for each order
    const latestLocations = await Location.aggregate([
      // Sort by timestamp descending
      { $sort: { orderId: 1, timestamp: -1 } },
      // Group by orderId and get the first (latest) document for each
      {
        $group: {
          _id: '$orderId',
          location: { $first: '$$ROOT' }
        }
      },
      // Replace root with the location document
      { $replaceRoot: { newRoot: '$location' } },
      // Populate the delivery boy and order info
      {
        $lookup: {
          from: 'users',
          localField: 'deliveryBoyId',
          foreignField: '_id',
          as: 'deliveryBoyInfo'
        }
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'orderId',
          foreignField: '_id',
          as: 'orderInfo'
        }
      },
      // Limit to 50 latest locations
      { $limit: 50 }
    ]);
    
    res.json(latestLocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delivery Boy: Get active tracking sessions
router.get('/active', protect, isDeliveryBoy, async (req, res) => {
  try {
    const activeLocations = await Location.find({
      deliveryBoyId: req.user._id,
      isLive: true
    }).distinct('orderId');
    
    res.json(activeLocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delivery Boy: Create/update location
router.post('/', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { orderId, deliveryBoyId, latitude, longitude, accuracy, altitude, speed, heading, timestamp } = req.body;
    
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
    
    // Create new location record
    const location = new Location({
      orderId,
      deliveryBoyId: req.user._id,
      latitude,
      longitude,
      accuracy,
      altitude,
      speed,
      heading,
      timestamp: timestamp || new Date(),
      isLive: true
    });
    
    const savedLocation = await location.save();
    
    // Populate the response
    const populatedLocation = await Location.findById(savedLocation._id)
      .populate('deliveryBoyId', 'name email phone')
      .populate('orderId', 'orderNumber status customerInfo');
    
    res.status(201).json(populatedLocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delivery Boy: End location tracking for an order
router.put('/:orderId/end', protect, isDeliveryBoy, async (req, res) => {
  try {
    const { orderId } = req.params;
    
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
    
    // Update all locations for this order to set isLive to false
    await Location.updateMany(
      { orderId: orderId, deliveryBoyId: req.user._id },
      { $set: { isLive: false } }
    );
    
    res.json({ message: 'Location tracking ended successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;