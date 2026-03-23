const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, './.env') });

const API_URL = 'http://localhost:5000/api';

const debugAdmin = async () => {
  try {
    console.log('--- DEBUGGING ADMIN ENDPOINTS ---');
    
    // We need a token for /inventory. 
    // For debugging, let's check categories first which is public.
    console.log('\nChecking /categories (Public)...');
    try {
      const catRes = await axios.get(`${API_URL}/categories`);
      console.log('Status:', catRes.status);
      console.log('Data Type:', typeof catRes.data);
      console.log('Is Array:', Array.isArray(catRes.data));
      console.log('Count:', catRes.data.length);
      if (catRes.data.length > 0) {
        console.log('Sample:', catRes.data[0]);
      }
    } catch (e) {
      console.error('Categories API failed:', e.message);
    }

    // Now let's try to get a token and check /inventory
    // Assuming there's an admin user we can use or just check the code logic
    console.log('\nChecking /inventory logic locally...');
    const mongoose = require('mongoose');
    const Inventory = require('./src/models/Inventory');
    const Category = require('./src/models/Category');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const items = await Inventory.find({}).populate('category', 'name').limit(2);
    console.log('Populated items:', JSON.stringify(items, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Debug failed:', err);
    process.exit(1);
  }
};

debugAdmin();
