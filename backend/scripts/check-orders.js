/**
 * Script to check existing orders in the database
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// Order Schema (copy from your Order model)
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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
      'wash-in-progress',
      'wash-completed',
      'drying',
      'quality-check',
      'out-for-delivery',
      'delivery-completed',
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
  recurring: { type: Boolean, default: false },
  frequency: String,
  
  // Status History
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String
  }]
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

// Check orders
const checkOrders = async () => {
  try {
    console.log('\n📋 Checking Orders in Database...\n');
    
    // Get total count
    const totalOrders = await Order.countDocuments();
    console.log(`Total orders in database: ${totalOrders}`);
    
    if (totalOrders === 0) {
      console.log('No orders found in database.');
      return;
    }
    
    // Get sample orders
    const sampleOrders = await Order.find().limit(5).sort({ createdAt: -1 });
    console.log(`\nShowing ${Math.min(5, totalOrders)} most recent orders:`);
    console.log('────────────────────────────────────────────────────────────────────────');
    
    sampleOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order Number: ${order.orderNumber}`);
      console.log(`   Customer Email: ${order.customerInfo?.email}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Total Amount: ₹${order.totalAmount}`);
      console.log(`   Items: ${order.items.length}`);
      console.log(`   Created: ${order.createdAt}`);
      console.log('────────────────────────────────────────────────────────────────────────');
    });
    
    // Group orders by customer email
    console.log('\n📊 Orders by Customer Email:');
    const emailGroups = await Order.aggregate([
      {
        $group: {
          _id: '$customerInfo.email',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    emailGroups.forEach(group => {
      console.log(`   ${group._id}: ${group.count} order(s), ₹${group.totalAmount} total`);
    });
    
  } catch (err) {
    console.error('❌ Error checking orders:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed\n');
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await checkOrders();
};

run();