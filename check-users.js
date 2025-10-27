const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// Import the actual User model
const User = require('./backend/src/models/User');

async function checkUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // List all users
    const users = await User.find({}, 'name email role createdAt firebaseUid');
    console.log('Users in database:');
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - ${user.role} - Firebase UID: ${user.firebaseUid || 'None'} - Created: ${user.createdAt}`);
      });
    }
    
    console.log(`\nTotal users: ${users.length}`);
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the function
checkUsers();