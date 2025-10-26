const axios = require('axios');

async function testStainRemovalValidation() {
  try {
    console.log('Testing stain removal order creation with missing fields...');

    // Test with missing phone number
    const testData1 = {
      items: [
        {
          name: 'Shirt',
          quantity: 2,
          price: 150,
          service: 'stain-removal'
        }
      ],
      pickupDate: '2023-12-15',
      pickupTime: '10:00 AM',
      pickupAddress: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        instructions: 'Ring doorbell'
      },
      contactInfo: {
        name: 'John Doe',
        phone: '', // Missing phone number
        email: 'john.doe@example.com'
      },
      totalAmount: 300
    };

    console.log('Test 1 - Missing phone number:');
    await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', testData1);
    console.log('✅ Test 1 passed (unexpected)');

  } catch (error) {
    console.log('❌ Test 1 failed as expected:', error.response ? error.response.data : error.message);
  }

  try {
    // Test with missing email
    const testData2 = {
      items: [
        {
          name: 'Shirt',
          quantity: 2,
          price: 150,
          service: 'stain-removal'
        }
      ],
      pickupDate: '2023-12-15',
      pickupTime: '10:00 AM',
      pickupAddress: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        instructions: 'Ring doorbell'
      },
      contactInfo: {
        name: 'John Doe',
        phone: '+1234567890',
        email: '' // Missing email
      },
      totalAmount: 300
    };

    console.log('\nTest 2 - Missing email:');
    await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', testData2);
    console.log('✅ Test 2 passed (unexpected)');

  } catch (error) {
    console.log('❌ Test 2 failed as expected:', error.response ? error.response.data : error.message);
  }

  try {
    // Test with missing address fields
    const testData3 = {
      items: [
        {
          name: 'Shirt',
          quantity: 2,
          price: 150,
          service: 'stain-removal'
        }
      ],
      pickupDate: '2023-12-15',
      pickupTime: '10:00 AM',
      pickupAddress: {
        street: '', // Missing street
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        instructions: 'Ring doorbell'
      },
      contactInfo: {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john.doe@example.com'
      },
      totalAmount: 300
    };

    console.log('\nTest 3 - Missing address street:');
    await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', testData3);
    console.log('✅ Test 3 passed (unexpected)');

  } catch (error) {
    console.log('❌ Test 3 failed as expected:', error.response ? error.response.data : error.message);
  }

  try {
    // Test with missing items
    const testData4 = {
      items: [], // No items
      pickupDate: '2023-12-15',
      pickupTime: '10:00 AM',
      pickupAddress: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        instructions: 'Ring doorbell'
      },
      contactInfo: {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john.doe@example.com'
      },
      totalAmount: 300
    };

    console.log('\nTest 4 - No items:');
    await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', testData4);
    console.log('✅ Test 4 passed (unexpected)');

  } catch (error) {
    console.log('❌ Test 4 failed as expected:', error.response ? error.response.data : error.message);
  }
}

testStainRemovalValidation();