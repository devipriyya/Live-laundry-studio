const mongoose = require('mongoose');

const BreakSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number, default: 0 } // in seconds
});

const ShiftSchema = new mongoose.Schema({
  deliveryBoyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  
  // Shift timing
  date: { 
    type: Date, 
    required: true,
    index: true
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  
  // Duration calculations (in seconds)
  totalDuration: { type: Number, default: 0 },
  workingDuration: { type: Number, default: 0 }, // Total - breaks
  
  // Breaks
  breaks: [BreakSchema],
  totalBreakTime: { type: Number, default: 0 }, // in seconds
  
  // Status
  status: { 
    type: String, 
    enum: ['active', 'on-break', 'completed', 'cancelled'],
    default: 'active'
  },
  
  // Performance metrics for this shift
  deliveriesCompleted: { type: Number, default: 0 },
  pickupsCompleted: { type: Number, default: 0 },
  totalTasks: { type: Number, default: 0 },
  
  // Earnings for this shift
  earnings: { type: Number, default: 0 },
  tips: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  
  // Distance and location
  totalDistance: { type: Number, default: 0 }, // in km
  startLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String }
  },
  endLocation: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String }
  },
  
  // Rating
  averageRating: { type: Number, default: 5.0, min: 0, max: 5 },
  ratingsCount: { type: Number, default: 0 },
  
  // Notes
  notes: { type: String }
  
}, { timestamps: true });

// Index for efficient queries
ShiftSchema.index({ deliveryBoyId: 1, date: -1 });
ShiftSchema.index({ deliveryBoyId: 1, status: 1 });
ShiftSchema.index({ deliveryBoyId: 1, startTime: -1 });

// Virtual for formatted duration
ShiftSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.workingDuration / 3600);
  const minutes = Math.floor((this.workingDuration % 3600) / 60);
  return `${hours}h ${minutes}m`;
});

// Pre-save middleware to calculate totals
ShiftSchema.pre('save', function(next) {
  // Calculate total break time
  if (this.breaks && this.breaks.length > 0) {
    this.totalBreakTime = this.breaks.reduce((total, br) => {
      return total + (br.duration || 0);
    }, 0);
  }
  
  // Calculate working duration
  if (this.endTime && this.startTime) {
    this.totalDuration = Math.floor((this.endTime - this.startTime) / 1000);
    this.workingDuration = this.totalDuration - this.totalBreakTime;
  }
  
  // Calculate total earnings
  this.totalEarnings = (this.earnings || 0) + (this.tips || 0) + (this.bonuses || 0);
  
  next();
});

// Static method to get active shift for a delivery boy
ShiftSchema.statics.getActiveShift = async function(deliveryBoyId) {
  return this.findOne({
    deliveryBoyId,
    status: { $in: ['active', 'on-break'] }
  }).sort({ startTime: -1 });
};

// Static method to get shift history with pagination
ShiftSchema.statics.getShiftHistory = async function(deliveryBoyId, options = {}) {
  const {
    page = 1,
    limit = 10,
    dateFrom,
    dateTo,
    status
  } = options;
  
  const query = { deliveryBoyId };
  
  // Date range filter
  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) query.date.$lte = new Date(dateTo);
  }
  
  // Status filter
  if (status) {
    query.status = status;
  }
  
  const shifts = await this.find(query)
    .sort({ date: -1, startTime: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
    
  const total = await this.countDocuments(query);
  
  return {
    shifts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

// Static method to get shift stats for a period
ShiftSchema.statics.getShiftStats = async function(deliveryBoyId, dateFrom, dateTo) {
  const result = await this.aggregate([
    {
      $match: {
        deliveryBoyId: new mongoose.Types.ObjectId(deliveryBoyId),
        date: { $gte: new Date(dateFrom), $lte: new Date(dateTo) },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalShifts: { $sum: 1 },
        totalHoursWorked: { $sum: '$workingDuration' },
        totalDeliveries: { $sum: '$deliveriesCompleted' },
        totalPickups: { $sum: '$pickupsCompleted' },
        totalEarnings: { $sum: '$totalEarnings' },
        totalDistance: { $sum: '$totalDistance' },
        avgRating: { $avg: '$averageRating' },
        totalBreakTime: { $sum: '$totalBreakTime' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : {
    totalShifts: 0,
    totalHoursWorked: 0,
    totalDeliveries: 0,
    totalPickups: 0,
    totalEarnings: 0,
    totalDistance: 0,
    avgRating: 5.0,
    totalBreakTime: 0
  };
};

module.exports = mongoose.model('Shift', ShiftSchema);
