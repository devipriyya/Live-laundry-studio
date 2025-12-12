const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  deliveryBoyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true,
    index: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number, // Accuracy in meters
    default: null
  },
  altitude: {
    type: Number,
    default: null
  },
  speed: {
    type: Number, // Speed in m/s
    default: null
  },
  heading: {
    type: Number, // Direction in degrees
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  isLive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Index for efficient querying
LocationSchema.index({ deliveryBoyId: 1, orderId: 1, timestamp: -1 });
LocationSchema.index({ orderId: 1, timestamp: -1 });

module.exports = mongoose.model('Location', LocationSchema);