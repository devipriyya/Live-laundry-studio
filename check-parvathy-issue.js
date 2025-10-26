const mongoose = require('mongoose');

// Connect to MongoDB
async function checkParvathyIssue() {
  try {
    await mongoose.connect('mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0');
    console.log('✅ Connected to MongoDB');

    // Check if user exists
    const User = require('./backend/src/models/User');
    const user = await User.findOne({ email: 'parvathy@gmail.com' });

    if (user) {
      console.log('✅ User found:');
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
    } else {
      console.log('❌ User parvathy@gmail.com does not exist in the database');
    }

    // Check orders
    const Order = require('./backend/src/models/Order');
    const orders = await Order.find({ 'customerInfo.email': 'parvathy@gmail.com' })
      .sort({ createdAt: -1 });

    console.log(`\n📋 Orders for parvathy@gmail.com: ${orders.length} found`);

    if (orders.length > 0) {
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order: ${order.orderNumber}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Total: ₹${order.totalAmount}`);
        console.log(`   Items: ${order.items.length}`);
        console.log(`   Created: ${order.createdAt}`);

        // Check for shoe polishing
        const hasShoeService = order.items.some(item =>
          item.service && item.service.toLowerCase().includes('shoe')
        );
        console.log(`   Has shoe service: ${hasShoeService ? 'YES' : 'NO'}`);
        console.log('---');
      });
    } else {
      console.log('❌ No orders found for parvathy@gmail.com');
    }

    // Check total orders in database
    const totalOrders = await Order.countDocuments();
    console.log(`\n📊 Total orders in database: ${totalOrders}`);

    mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkParvathyIssue();