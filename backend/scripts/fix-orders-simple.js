/**
 * Script to fix orders with missing customer information (simplified version)
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

// Order Schema (simplified version)
const OrderSchema = new mongoose.Schema({
  orderNumber: String,
  customerInfo: {
    name: String,
    email: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    service: String
  }],
  totalAmount: Number,
  status: String,
  paymentStatus: String
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
      
      // Set default customer info
      const defaultEmail = `customer-${order._id}@example.com`;
      order.customerInfo = {
        name: order.customerInfo?.name || 'Customer',
        email: order.customerInfo?.email || defaultEmail,
        phone: order.customerInfo?.phone || 'N/A',
        address: {
          street: order.customerInfo?.address?.street || 'Unknown Street',
          city: order.customerInfo?.address?.city || 'Unknown City',
          state: order.customerInfo?.address?.state || 'Unknown State',
          zipCode: order.customerInfo?.address?.zipCode || '00000'
        }
      };
      
      // Generate a proper order number if missing
      if (!order.orderNumber) {
        order.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }
      
      // Set default status if missing
      if (!order.status) {
        order.status = 'order-placed';
      }
      
      // Set default payment status if missing
      if (!order.paymentStatus) {
        order.paymentStatus = 'pending';
      }
      
      // Set default items array if missing
      if (!order.items || order.items.length === 0) {
        order.items = [{
          name: 'Default Service',
          quantity: 1,
          price: order.totalAmount || 0,
          service: 'General Service'
        }];
      }
      
      // Save the fixed order
      try {
        await order.save();
        console.log(`✅ Fixed Order: ${order.orderNumber}`);
        fixedCount++;
      } catch (saveError) {
        console.log(`❌ Failed to save Order: ${order.orderNumber || order._id}`, saveError.message);
      }
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