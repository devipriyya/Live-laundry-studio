const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Category = require('./src/models/Category');
const Inventory = require('./src/models/Inventory');

const verifyDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const categories = await Category.find({});
    console.log(`\n1. Categories (${categories.length}):`);
    categories.forEach(c => console.log(`- ${c.name} (${c._id})`));

    const inventoryItems = await Inventory.find({}).populate('category');
    console.log(`\n2. Inventory Items (${inventoryItems.length}):`);
    inventoryItems.slice(0, 5).forEach(item => {
      console.log(`- ${item.itemName}: Category = ${item.category ? item.category.name : 'MISSING'}`);
    });

    if (inventoryItems.length > 5) console.log('... (and more)');

    const productsWithCats = inventoryItems.filter(item => item.category);
    console.log(`\n3. Integration Status:`);
    console.log(`${productsWithCats.length}/${inventoryItems.length} items have category references.`);

    process.exit(0);
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
};

verifyDB();
