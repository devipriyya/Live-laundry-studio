const mongoose = require('mongoose');

const LoyaltyTransactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  type: {
    type: String,
    enum: ['earned', 'redeemed', 'expired', 'refunded'],
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  amount: {
    type: Number, // Reference amount (spent or discounted)
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('LoyaltyTransaction', LoyaltyTransactionSchema);
