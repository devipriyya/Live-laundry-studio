require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./src/models/User');

// Check delivery boy roles
const checkDeliveryBoyRoles = async () => {
  try {
    // Find all users with role containing 'delivery'
    const deliveryUsers = await User.find({ 
      role: { $regex: /delivery/i } 
    }).select('-password');
    
    console.log('Delivery-related users in database:');
    deliveryUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}): role = '${user.role}'`);
    });
    
    // Also check a specific user if exists
    const specificUser = await User.findOne({ email: 'test.delivery@fabrico.com' });
    if (specificUser) {
      console.log(`\nSpecific test user:`);
      console.log(`- ${specificUser.name} (${specificUser.email}): role = '${specificUser.role}'`);
    }
  } catch (err) {
    console.error('Error checking delivery boy roles:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

checkDeliveryBoyRoles();