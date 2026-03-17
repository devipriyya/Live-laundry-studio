const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Order = require('./src/models/Order');

async function createTestOrder() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const testOrder = new Order({
      orderNumber: 'ORD-001',
      status: 'washing',
      customerInfo: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345'
        }
      },
      totalItems: 5,
      totalAmount: 500,
      statusHistory: [
        {
          status: 'order-placed',
          timestamp: new Date(Date.now() - 86400000),
          note: 'Order received'
        },
        {
          status: 'washing',
          timestamp: new Date(),
          note: 'Items are being washed'
        }
      ]
    });

    await Order.deleteOne({ orderNumber: 'ORD-001' });
    await testOrder.save();
    console.log('Test order ORD-001 created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createTestOrder();
