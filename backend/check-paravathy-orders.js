/**
 * Script to check specific customer orders in the database
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Mongo URI:', process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGO_URI);
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

// Check orders for specific email
const checkOrdersForEmail = async (email) => {
  try {
    console.log(`\n📋 Checking Orders for Email: ${email}\n`);
    
    // Find orders with the specified email
    const orders = await Order.find({ 'customerInfo.email': email })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${orders.length} orders for email: ${email}`);
    
    if (orders.length === 0) {
      console.log('No orders found for this email.');
      return;
    }
    
    console.log('\nShowing all orders:');
    console.log('────────────────────────────────────────────────────────────────────────');
    
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order Number: ${order.orderNumber}`);
      console.log(`   Customer Email: ${order.customerInfo?.email}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Total Amount: ₹${order.totalAmount}`);
      console.log(`   Items: ${order.items.length}`);
      console.log(`   Created: ${order.createdAt}`);
      
      // Check if any item has shoe/polish service
      const hasShoeService = order.items.some(item => {
        const serviceName = item.service ? item.service.toLowerCase() : '';
        return serviceName.includes('shoe') || serviceName.includes('polish');
      });
      
      console.log(`   Has Shoe Service: ${hasShoeService ? 'YES' : 'NO'}`);
      
      // Show items details
      console.log('   Items:');
      order.items.forEach((item, itemIndex) => {
        console.log(`     ${itemIndex + 1}. ${item.name} (Service: ${item.service || 'N/A'})`);
      });
      
      console.log('────────────────────────────────────────────────────────────────────────');
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
  
  // First check if there are any orders at all
  const totalOrders = await Order.countDocuments();
  console.log(`Total orders in database: ${totalOrders}`);
  
  if (totalOrders === 0) {
    console.log('No orders found in the database at all.');
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed\n');
    return;
  }
  
  // Show all orders grouped by email
  console.log('\n📊 All Orders by Customer Email:');
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
  
  // Then check for specific email
  await checkOrdersForEmail('paravathy@gmail.com');
};

run();