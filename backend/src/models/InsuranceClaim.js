const mongoose = require('mongoose');

const InsuranceClaimSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  claimNumber: { type: String, unique: true, required: true },

  // Customer info snapshot
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }
  },

  // Damaged items
  damagedItems: [{
    itemName: { type: String, required: true },
    description: { type: String, required: true },
    estimatedValue: { type: Number, required: true },
    damageType: {
      type: String,
      enum: ['torn', 'discolored', 'shrunk', 'stained', 'lost', 'burned', 'other'],
      required: true
    },
    imageUrls: [{ type: String }]
  }],

  // Claim totals
  totalClaimAmount: { type: Number, required: true },
  approvedAmount: { type: Number, default: 0 },

  // Insurance policy info from the order
  policyType: { type: String, enum: ['basic', 'premium'], required: true },
  coverageAmount: { type: Number, required: true },

  // Claim lifecycle
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'approved', 'partially-approved', 'rejected', 'compensated'],
    default: 'submitted'
  },

  // Admin review
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  adminNotes: { type: String },
  rejectionReason: { type: String },

  // Compensation
  compensationMethod: { type: String, enum: ['refund', 'credit', 'replacement', 'none'], default: 'none' },
  compensationProcessedAt: { type: Date },

  // History
  history: [{
    action: { type: String, required: true },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
    note: { type: String }
  }]
}, { timestamps: true });

InsuranceClaimSchema.index({ orderId: 1 });
InsuranceClaimSchema.index({ status: 1 });
InsuranceClaimSchema.index({ 'customerInfo.email': 1 });

module.exports = mongoose.model('InsuranceClaim', InsuranceClaimSchema);
