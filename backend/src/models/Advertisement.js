const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Advertisement title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL/banner is required']
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  offerText: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Check if advertisement is expired
AdvertisementSchema.methods.isExpired = function() {
  return this.expiryDate < new Date();
};

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
