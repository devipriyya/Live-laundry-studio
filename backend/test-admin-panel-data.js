require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test creating a delivery boy with the same data structure as the admin panel
const testAdminPanelData = async () => {
  try {
    console.log('Testing delivery boy creation with admin panel data structure...');
    
    // This simulates what the admin panel is sending
    const adminPanelData = {
      name: 'Test Delivery Boy',
      email: 'test.adminpanel@example.com',
      phone: '1234567890',
      password: 'delivery123',
      isBlocked: false  // This is the problematic field
    };
    
    console.log('Admin panel data:', adminPanelData);
    
    // Create a delivery boy with this data
    const deliveryBoy = new User(adminPanelData);
    
    console.log('Before save - Password:', deliveryBoy.password);
    
    await deliveryBoy.save();
    
    console.log('After save - Password:', deliveryBoy.password);
    console.log('Password length:', deliveryBoy.password.length);
    
    // Test password verification
    console.log('\nTesting password verification...');
    const isMatch = await deliveryBoy.matchPassword('delivery123');
    console.log('Password match result:', isMatch);
    
    // Clean up - delete the test user
    await User.deleteOne({ email: 'test.adminpanel@example.com' });
    console.log('Test user deleted');
    
  } catch (err) {
    console.error('Error testing admin panel data:', err.message);
    console.error('Error stack:', err.stack);
  } finally {
    mongoose.connection.close();
  }
};

testAdminPanelData();