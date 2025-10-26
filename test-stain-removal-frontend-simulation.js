const axios = require('axios');

async function testStainRemovalFrontendSimulation() {
  try {
    console.log('Testing stain removal order creation with frontend simulation...');

    // Simulate the exact data structure that the frontend might be sending
    const orderData = {
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
        email: 'john.doe@example.com'
      },
      totalAmount: 300
    };

    console.log('Sending order data:', JSON.stringify(orderData, null, 2));

    const response = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', orderData);

    console.log('✅ Order created successfully!');
    console.log('Response:', response.data);

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testStainRemovalFrontendSimulation();