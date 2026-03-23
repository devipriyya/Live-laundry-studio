const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Category = require('../models/Category');
const Inventory = require('../models/Inventory');

const initialCategories = [
  { name: 'Detergent', description: 'Washing powders and liquids' },
  { name: 'Softener', description: 'Fabric softeners and conditioners' },
  { name: 'Stain Remover', description: 'Specialized stain removal products' },
  { name: 'Laundry Bag', description: 'Bags for carrying laundry' },
  { name: 'Hanger', description: 'Cloths hangers' },
  { name: 'Garment Cover', description: 'Covers for protected storage' },
  { name: 'Bedsheet', description: 'Various bedsheets' },
  { name: 'Towel', description: 'Bath and face towels' },
  { name: 'Curtain', description: 'Window and door curtains' },
  { name: 'Uniform', description: 'Work and school uniforms' },
  { name: 'Packaging', description: 'Materials for packaging finished laundry' },
  { name: 'Equipment', description: 'Laundry machines and tools' },
  { name: 'Other', description: 'Miscellaneous items' }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const categoryMap = {};

    for (const catData of initialCategories) {
      let category = await Category.findOne({ name: catData.name });
      if (!category) {
        category = new Category(catData);
        await category.save();
        console.log(`Created category: ${catData.name}`);
      } else {
        console.log(`Category already exists: ${catData.name}`);
      }
      categoryMap[catData.name.toLowerCase().replace(' ', '-')] = category._id;
    }

    // Special handling for some mappings
    categoryMap['stain-remover'] = categoryMap['stain remover'];
    categoryMap['laundry-bag'] = categoryMap['laundry bag'];
    categoryMap['garment-cover'] = categoryMap['garment cover'];

    console.log('Category mapping completed.');

    // Now update existing inventory items (if they still have string categories)
    const inventoryCollection = mongoose.connection.db.collection('inventories');
    const items = await inventoryCollection.find({}).toArray();
    console.log(`Found ${items.length} inventory items to check.`);

    let updatedCount = 0;
    for (const item of items) {
      // If category is a string and matches one of our old keys
      if (typeof item.category === 'string' || item.category instanceof String) {
        const oldCat = item.category.toLowerCase();
        const newCatId = categoryMap[oldCat];

        if (newCatId) {
          await inventoryCollection.updateOne({ _id: item._id }, { $set: { category: newCatId } });
          updatedCount++;
        } else {
          console.warn(`No mapping found for category: ${item.category} on item ${item.itemName}`);
          // Assign to "Other" if no mapping found
          await inventoryCollection.updateOne({ _id: item._id }, { $set: { category: categoryMap['other'] } });
          updatedCount++;
        }
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} items.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
