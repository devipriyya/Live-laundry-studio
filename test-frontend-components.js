const axios = require('axios');

async function testFrontendComponents() {
  try {
    console.log('Testing frontend components with properly formatted data...');

    // Test data that simulates what the frontend components should send
    const testData = {
      items: [
        {
          name: 'Shirt',
          quantity: 2,
          price: 150,
          service: 'stain-removal'
        },
        {
          name: 'T-Shirt',
          quantity: 1,
          price: 120,
          service: 'stain-removal'
        }
      ],
      pickupDate: '2023-12-15',
      pickupTime: '10:00 AM - 12:00 PM',
      pickupAddress: {
        street: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        instructions: 'Ring doorbell'
      },
      contactInfo: {
        name: 'John Doe',
        phone: '1234567890',
        email: 'john.doe@gmail.com'
      },
      totalAmount: 420  // (2 * 150) + (1 * 120)
    };

    console.log('Sending order data:', JSON.stringify(testData, null, 2));

    const response = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', testData);

    console.log('✅ Order created successfully!');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testFrontendComponents();