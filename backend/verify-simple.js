const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function verify() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const Category = mongoose.model('Category', new mongoose.Schema({ name: String }));
    const categories = await Category.find({});
    console.log('Categories found:', categories.length);
    categories.forEach(c => console.log(' -', c.name));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

verify();
