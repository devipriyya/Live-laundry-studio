const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Reported', 'Under Review', 'Item Found', 'Returned'],
    default: 'Reported'
  },
  adminNotes: {
    type: String
  },
  resolvedAt: {
    type: Date
  }
}, { timestamps: true });

// Index for faster queries
LostItemSchema.index({ user: 1 });
LostItemSchema.index({ status: 1 });
LostItemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('LostItem', LostItemSchema);
