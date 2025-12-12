require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test creating a delivery boy
const testCreateDeliveryBoy = async () => {
  try {
    // Create a new delivery boy
    console.log('Creating test delivery boy...');
    
    const deliveryBoy = new User({
      name: 'Test Delivery Boy',
      email: 'test.delivery@example.com',
      phone: '1234567890',
      password: 'delivery123',
      role: 'deliveryBoy'
    });
    
    console.log('Before save - Password:', deliveryBoy.password);
    
    await deliveryBoy.save();
    
    console.log('After save - Password:', deliveryBoy.password);
    console.log('Password length:', deliveryBoy.password.length);
    
    // Test password verification
    console.log('\nTesting password verification...');
    const isMatch = await deliveryBoy.matchPassword('delivery123');
    console.log('Password match result:', isMatch);
    
    // Clean up - delete the test user
    await User.deleteOne({ email: 'test.delivery@example.com' });
    console.log('Test user deleted');
    
  } catch (err) {
    console.error('Error testing delivery boy creation:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

testCreateDeliveryBoy();