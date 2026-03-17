const mongoose = require('mongoose');

const TicketMessageSchema = new mongoose.Schema({
  sender: { 
    type: String, 
    enum: ['user', 'support', 'system'],
    required: true 
  },
  senderName: { type: String },
  message: { type: String, required: true },
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const SupportTicketSchema = new mongoose.Schema({
  ticketId: { 
    type: String, 
    unique: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  userEmail: { type: String, required: true },
  userName: { type: String },
  userRole: {
    type: String,
    enum: ['customer', 'admin', 'deliveryBoy'],
    default: 'deliveryBoy'
  },
  
  // Ticket details
  category: {
    type: String,
    enum: [
      'order-issue',
      'payment-issue', 
      'delivery-issue',
      'app-bug',
      'account-issue',
      'earnings-issue',
      'schedule-issue',
      'customer-complaint',
      'vehicle-issue',
      'safety-concern',
      'general-inquiry',
      'other'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  
  // Related order if applicable
  relatedOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['open', 'in-progress', 'waiting-response', 'resolved', 'closed'],
    default: 'open'
  },
  
  // Messages/conversation
  messages: [TicketMessageSchema],
  
  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedToName: String,
  
  // Resolution
  resolution: String,
  resolvedAt: Date,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Feedback
  rating: { type: Number, min: 1, max: 5 },
  feedback: String,
  
  // Timestamps
  lastActivityAt: { type: Date, default: Date.now },
  firstResponseAt: Date
  
}, { timestamps: true });

// Indexes
SupportTicketSchema.index({ userId: 1, status: 1 });
SupportTicketSchema.index({ ticketId: 1 });
SupportTicketSchema.index({ status: 1, priority: 1 });
SupportTicketSchema.index({ createdAt: -1 });
SupportTicketSchema.index({ category: 1 });

// Generate ticket ID before save
SupportTicketSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketId) {
    const count = await mongoose.model('SupportTicket').countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    this.ticketId = `TKT-${year}${month}-${(count + 1).toString().padStart(5, '0')}`;
  }
  next();
});

// Static methods
SupportTicketSchema.statics.getUserTickets = async function(userId, options = {}) {
  const { status, page = 1, limit = 10 } = options;
  
  const query = { userId };
  if (status && status !== 'all') {
    query.status = status;
  }
  
  const tickets = await this.find(query)
    .sort({ lastActivityAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('relatedOrderId', 'orderId status')
    .lean();
    
  const total = await this.countDocuments(query);
  
  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

SupportTicketSchema.statics.getTicketStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  };
  
  stats.forEach(s => {
    result.total += s.count;
    if (s._id === 'open') result.open = s.count;
    if (s._id === 'in-progress') result.inProgress = s.count;
    if (s._id === 'resolved') result.resolved = s.count;
    if (s._id === 'closed') result.closed = s.count;
  });
  
  return result;
};

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
