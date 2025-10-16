const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quantity: Number,
  pickupDate: Date,
  deliveryDate: Date,
  status: {
    type: String,
    enum: ['pending','picked','washing','completed','out-for-delivery','delivered'],
    default: 'pending'
  },
  paymentStatus: { type: String, enum: ['pending','paid'], default: 'pending' }
}, { timestamps: true });
module.exports = mongoose.model('Order', OrderSchema);
