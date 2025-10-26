const axios = require('axios');

async function testDryCleaningOrder() {
  try {
    console.log('Testing dry cleaning order creation...');

    const orderData = {
      shoeType: 'Running Shoes',
      serviceType: 'shoe-care',
      numberOfPairs: 2,
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
      }
    };

    const response = await axios.post('http://localhost:5000/api/orders/dry-cleaning', orderData);

    console.log('✅ Order created successfully!');
    console.log('Response:', response.data);

    // Now test fetching the order
    console.log('\nTesting order retrieval...');
    const fetchResponse = await axios.get(`http://localhost:5000/api/orders/my?email=${orderData.contactInfo.email}`);
    console.log('Orders found:', fetchResponse.data.length);
    console.log('Orders:', fetchResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
  }
}

testDryCleaningOrder();