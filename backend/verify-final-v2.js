const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });

const Inventory = require('./src/models/Inventory');
const Category = require('./src/models/Category');

const verifyFinal = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const items = await Inventory.find({ 
      status: { $in: ['in-stock', 'low-stock'] } 
    }).populate('category').lean();

    console.log(`Found ${items.length} items with status in-stock/low-stock.`);
    
    const validItems = items.filter(i => i.category && i.category.isActive);
    console.log(`Found ${validItems.length} valid items with active categories.`);

    validItems.forEach(i => {
      console.log(` - ${i.itemName}: Category = ${i.category.name}`);
    });

    if (validItems.length > 0) {
      console.log('SUCCESS: API should show these products.');
    } else {
      console.log('WARNING: No products will show because no active categories matched.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  }
};

verifyFinal();
