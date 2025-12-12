// Simple script to check database connection and find users
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fabrico', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  firebaseUid: String,
  isBlocked: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

async function checkUsers() {
  try {
    console.log('=== CHECKING DATABASE CONNECTION ===\n');
    
    // Count total users
    const userCount = await User.countDocuments();
    console.log('Total users in database:', userCount);
    
    // Find admin users
    const admins = await User.find({ role: 'admin' });
    console.log('Admin users found:', admins.length);
    
    if (admins.length > 0) {
      console.log('\nAdmin details:');
      admins.forEach(admin => {
        console.log(`- ${admin.name} (${admin.email}) - Blocked: ${admin.isBlocked}`);
      });
    }
    
    // Find delivery boy users
    const deliveryBoys = await User.find({ role: 'deliveryBoy' });
    console.log('\nDelivery boys found:', deliveryBoys.length);
    
    if (deliveryBoys.length > 0) {
      console.log('\nDelivery boy details:');
      deliveryBoys.slice(0, 3).forEach(boy => {
        console.log(`- ${boy.name} (${boy.email}) - Blocked: ${boy.isBlocked}`);
      });
    }
    
  } catch (error) {
    console.log('❌ Error checking users:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

checkUsers();