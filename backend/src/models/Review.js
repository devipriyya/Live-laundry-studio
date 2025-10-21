const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  serviceQuality: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  deliverySpeed: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  customerService: { 
    type: Number, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    maxlength: 1000 
  },
  photos: [{
    url: String,
    caption: String
  }],
  helpful: { 
    type: Number, 
    default: 0 
  },
  verified: { 
    type: Boolean, 
    default: true 
  },
  response: {
    text: String,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    respondedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, { timestamps: true });

// Indexes
ReviewSchema.index({ orderId: 1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ createdAt: -1 });

// Calculate average rating
ReviewSchema.statics.getAverageRating = async function() {
  const result = await this.aggregate([
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  return result[0] || { averageRating: 0, totalReviews: 0 };
};

module.exports = mongoose.model('Review', ReviewSchema);
