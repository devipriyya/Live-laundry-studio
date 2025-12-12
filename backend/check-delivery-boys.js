require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./src/models/User');

// Check delivery boys
const checkDeliveryBoys = async () => {
  try {
    const deliveryBoys = await User.find({ role: 'deliveryBoy' }).select('-password');
    console.log('Delivery Boys in DB:');
    console.log(JSON.stringify(deliveryBoys, null, 2));
    
    // Also check if the specific user exists
    const user = await User.findOne({ email: 'mike.delivery@fabrico.com' });
    console.log('\nSpecific user check:');
    if (user) {
      console.log(`User found: ${user.name} (${user.email}) with role: ${user.role}`);
    } else {
      console.log('User not found');
    }
  } catch (err) {
    console.error('Error checking delivery boys:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

checkDeliveryBoys();