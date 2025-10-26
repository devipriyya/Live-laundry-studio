/**
 * Script to check specific customer orders in the database
 */

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Mongo URI:', process.env.MONGO_URI);
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    
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

// Check what the API is actually returning for a specific order
const axios = require('axios');

async function checkSpecificOrder() {
  try {
    console.log('=== CHECKING SPECIFIC ORDER DATA ===');
    
    // Login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Fetch orders
    console.log('\n🔍 Fetching orders...');
    const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        limit: 5 // Just get a few orders
      }
    });
    
    const orders = ordersResponse.data.orders;
    console.log(`📊 Fetched ${orders.length} orders`);
    
    // Check the first few orders in detail
    for (let i = 0; i < Math.min(3, orders.length); i++) {
      const order = orders[i];
      console.log(`\n📋 ORDER ${i + 1}:`);
      console.log(`   Order Number: ${order.orderNumber}`);
      console.log(`   Customer: ${order.customerInfo?.name} <${order.customerInfo?.email}>`);
      console.log(`   User ID: ${order.userId}`);
      console.log(`   User ID Type: ${typeof order.userId}`);
      console.log(`   User ID Value: ${JSON.stringify(order.userId)}`);
      
      // Check if userId is actually null or just missing
      if (order.userId === null) {
        console.log(`   ❌ User ID is explicitly null`);
      } else if (order.userId === undefined) {
        console.log(`   ❓ User ID is undefined`);
      } else if (order.userId === '') {
        console.log(`   🔢 User ID is empty string`);
      } else {
        console.log(`   ✅ User ID is valid: ${order.userId}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

checkSpecificOrder();

// Run the script
const run = async () => {
  await connectDB();
  await checkOrdersForEmail('paravathy@gmail.com');
};

run();