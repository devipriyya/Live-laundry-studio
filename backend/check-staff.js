const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = 'mongodb+srv://devipriyasijikumar2026_db_user:devutty1234@cluster0.zsxfzwj.mongodb.net/ecowashdb?retryWrites=true&w=majority&appName=Cluster0';

async function checkStaff() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Dynamically define a simple User schema
    const User = mongoose.model('User', new mongoose.Schema({
      name: String,
      role: String,
      isBlocked: { type: Boolean, default: false }
    }), 'users');

    const allUsers = await User.find({});
    console.log(`Total users in DB: ${allUsers.length}`);
    
    const roles = [...new Set(allUsers.map(u => u.role))];
    console.log('Available roles in DB:', roles);

    const targetStaff = await User.find({
      role: { $in: ['laundryStaff', 'staff'] },
      isBlocked: { $ne: true }
    });

    console.log(`Staff matches found: ${targetStaff.length}`);
    targetStaff.forEach(s => {
      console.log(`- ID: ${s._id}, Name: ${s.name}, Role: ${s.role}`);
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

checkStaff();
