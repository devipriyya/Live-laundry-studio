const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Changed to false to allow null values during migration
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryBoyAssignedAt: Date,
  assignedLaundryStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  laundryStaffAssignedAt: Date,
  orderNumber: { type: String, unique: true, required: true },
  
  // Customer Details
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      instructions: String
    }
  },
  
  // Order Items
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    service: String
  }],
  
  // Dates and Scheduling
  orderDate: { type: Date, default: Date.now },
  pickupDate: Date,
  deliveryDate: Date,
  estimatedDelivery: String,
  timeSlot: String,
  
  // Order Details
  totalAmount: { type: Number, required: true },
  totalItems: Number,
  weight: String,
  
  // Status Management
  status: {
    type: String,
    enum: [
      'order-placed',
      'order-accepted', 
      'out-for-pickup',
      'pickup-completed',
      'received-at-facility',
      'washing',
      'wash-in-progress',
      'wash-completed',
      'drying',
      'cleaning',
      'pressing',
      'quality-check',
      'ready-for-pickup',
      'ready-for-delivery',
      'out-for-delivery',
      'delivery-completed',
      'delivered',
      'cancelled'
    ],
    default: 'order-placed'
  },
  
  // Payment Information
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded', 'refund-pending'], 
    default: 'pending' 
  },
  paymentId: String,
  paymentMethod: String,
  
  // Refund Information
  refundInfo: {
    amount: Number,
    method: String,
    refundId: String,
    processedAt: Date,
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // Additional Information
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  specialInstructions: String,
  notes: String,
  pickupNote: String,
  pickupPhoto: String,
  deliveryNote: String,
  deliveryPhoto: String,
  recurring: { type: Boolean, default: false },
  frequency: String,
  
  // Cloth Damage Insurance
  insurance: {
    enabled: { type: Boolean, default: false },
    cost: { type: Number, default: 0 },
    coverageAmount: { type: Number, default: 0 },
    policyType: { type: String, enum: ['none', 'basic', 'premium'], default: 'none' }
  },

  // Delivery OTP Verification
  deliveryOTP: {
    code: { type: String }, // Hashed OTP code
    generatedAt: { type: Date },
    expiresAt: { type: Date },
    attempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date }
  },
  
  // Status History
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String
  }],
  rlAssignmentData: {
    state: Object,
    actionIndex: Number,
    assignedAt: Date
  },
  isReviewed: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

// Add index for faster queries (removed duplicate orderNumber index)
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

// Ensure no conflicting orderId field exists
OrderSchema.set('strict', true);

// Pre-save middleware to add status history
OrderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: `Status updated to ${this.status}`
    });
  }
  next();
});

// Ensure shoe care items have proper validation
OrderSchema.pre('save', function(next) {
  // If this order contains shoe care items, ensure address is complete
  const hasShoeCare = this.items.some(item => item.service === 'shoe-care');
  if (hasShoeCare) {
    const address = this.customerInfo?.address;
    if (!address || !address.street || !address.city || !address.state || !address.zipCode) {
      return next(new Error('Complete pickup address is required for shoe care orders'));
    }
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);