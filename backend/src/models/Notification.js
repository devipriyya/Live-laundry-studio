const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  recipientEmail: {
    type: String,
    required: true
  },
  recipientRole: {
    type: String,
    enum: ['customer', 'admin', 'deliveryBoy'],
    default: 'customer'
  },
  type: {
    type: String,
    enum: [
      'order', 'payment', 'delivery', 'system', 'promotion', 'review', 'support-ticket',
      // Delivery Boy specific types
      'new-assignment', 'order-status-update', 'admin-message', 
      'pickup-reminder', 'delivery-reminder', 'earnings-update'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  // Reference to related order for delivery notifications
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  expiresAt: Date
}, { timestamps: true });

// Indexes
NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ recipientEmail: 1, read: 1 });
NotificationSchema.index({ recipientRole: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', NotificationSchema);
