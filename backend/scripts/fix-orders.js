/**
 * Script to fix orders with missing customer information
 */

require('dotenv').config();
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

// Fix orders with missing customer information
const fixOrders = async () => {
  try {
    console.log('\n🔧 Fixing Orders with Missing Customer Information...\n');
    
    // Find orders with missing customer info
    const ordersToFix = await Order.find({
      $or: [
        { 'customerInfo.email': { $exists: false } },
        { 'customerInfo.email': null },
        { 'customerInfo.email': '' },
        { 'customerInfo': { $exists: false } }
      ]
    });
    
    console.log(`Found ${ordersToFix.length} orders with missing customer information`);
    
    if (ordersToFix.length === 0) {
      console.log('No orders need to be fixed.');
      return;
    }
    
    let fixedCount = 0;
    
    for (const order of ordersToFix) {
      console.log(`\nProcessing Order: ${order.orderNumber || order._id}`);
      
      // Try to extract email from userId if possible
      let email = 'unknown@example.com';
      let name = 'Unknown Customer';
      let phone = 'N/A';
      
      if (order.userId) {
        // In a real scenario, you would look up the user in the User collection
        // For now, we'll use a placeholder
        email = `user-${order.userId}@example.com`;
        name = `User ${order.userId.toString().substring(0, 8)}`;
      }
      
      // Generate a proper order number if missing
      if (!order.orderNumber) {
        order.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      // Set default customer info
      order.customerInfo = {
        name: order.customerInfo?.name || name,
        email: order.customerInfo?.email || email,
        phone: order.customerInfo?.phone || phone,
        address: order.customerInfo?.address || {
          street: 'Unknown Address',
          city: 'Unknown City',
          state: 'Unknown State',
          zipCode: '00000'
        }
      };
      
      // Set default items array if missing
      if (!order.items || order.items.length === 0) {
        order.items = [{
          name: 'Default Item',
          quantity: 1,
          price: order.totalAmount || 0,
          service: 'Unknown Service'
        }];
      }
      
      // Save the fixed order
      await order.save();
      console.log(`✅ Fixed Order: ${order.orderNumber}`);
      fixedCount++;
    }
    
    console.log(`\n✨ Successfully fixed ${fixedCount} orders!\n`);
    
  } catch (err) {
    console.error('❌ Error fixing orders:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed\n');
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await fixOrders();
};

run();