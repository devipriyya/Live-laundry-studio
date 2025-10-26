const mongoose = require('mongoose');
require('dotenv').config();

async function cleanupFirebaseIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/ecowashdb');
    console.log('Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // List all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Check if firebaseUid_1 index exists and drop it
    const firebaseUidIndex = indexes.find(idx => idx.name === 'firebaseUid_1');
    if (firebaseUidIndex) {
      console.log('Found problematic firebaseUid_1 index, dropping it...');
      await collection.dropIndex('firebaseUid_1');
      console.log('Successfully dropped firebaseUid_1 index');
    } else {
      console.log('firebaseUid_1 index not found');
    }

    // List indexes after cleanup
    const updatedIndexes = await collection.indexes();
    console.log('Updated indexes:', updatedIndexes.map(idx => idx.name));

    console.log('Firebase index cleanup completed successfully');
  } catch (error) {
    console.error('Error during firebase index cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupFirebaseIndex();