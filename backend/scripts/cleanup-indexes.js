const mongoose = require('mongoose');
require('dotenv').config();

async function cleanupIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/ecowashdb');
    console.log('Connected to MongoDB');

    // Get the orders collection
    const db = mongoose.connection.db;
    const collection = db.collection('orders');

    // List all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Check if orderId_1 index exists and drop it
    const orderIdIndex = indexes.find(idx => idx.name === 'orderId_1');
    if (orderIdIndex) {
      console.log('Found problematic orderId_1 index, dropping it...');
      await collection.dropIndex('orderId_1');
      console.log('Successfully dropped orderId_1 index');
    } else {
      console.log('orderId_1 index not found');
    }

    // List indexes after cleanup
    const updatedIndexes = await collection.indexes();
    console.log('Updated indexes:', updatedIndexes.map(idx => idx.name));

    console.log('Index cleanup completed successfully');
  } catch (error) {
    console.error('Error during index cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the cleanup
cleanupIndexes();
