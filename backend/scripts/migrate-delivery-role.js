/**
 * Migration Script: Update deliveryBoy role to delivery
 * 
 * This script updates any existing users with role 'deliveryBoy' to 'delivery'
 * for consistency with the updated User model.
 * 
 * Run with: node scripts/migrate-delivery-role.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const migrateRoles = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    // Find all users with old 'deliveryBoy' role
    const usersToUpdate = await User.find({ role: 'deliveryBoy' });
    
    if (usersToUpdate.length === 0) {
      console.log('ℹ️  No users found with role "deliveryBoy". Migration not needed.');
      await mongoose.connection.close();
      return;
    }

    console.log(`📊 Found ${usersToUpdate.length} user(s) with role "deliveryBoy"`);
    console.log('🔄 Updating roles...');

    // Update each user's role
    let updated = 0;
    for (const user of usersToUpdate) {
      await User.updateOne(
        { _id: user._id },
        { $set: { role: 'delivery' } }
      );
      updated++;
      console.log(`   ✓ Updated user: ${user.name} (${user.email})`);
    }

    console.log(`\n✅ Successfully updated ${updated} user(s)`);
    console.log('🎉 Migration complete!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the migration
migrateRoles();
