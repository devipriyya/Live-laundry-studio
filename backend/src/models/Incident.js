const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true
  },
  deliveryBoyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  // Incident details
  type: {
    type: String,
    enum: [
      'customer-not-available',
      'address-incorrect',
      'clothes-not-ready',
      'unable-to-deliver',
      'vehicle-issue',
      'weather-issue',
      'other'
    ],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  // Proof photo
  photoUrl: {
    type: String
  },
  // Location where incident occurred
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  // Status of the incident
  status: {
    type: String,
    enum: ['reported', 'under-review', 'resolved', 'dismissed'],
    default: 'reported'
  },
  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  // Admin notes/resolution
  resolutionNotes: {
    type: String
  },
  resolvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  resolvedAt: Date,
  // Timestamps
  reportedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes for better query performance
IncidentSchema.index({ deliveryBoyId: 1 });
IncidentSchema.index({ orderId: 1 });
IncidentSchema.index({ status: 1 });
IncidentSchema.index({ priority: 1 });
IncidentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Incident', IncidentSchema);