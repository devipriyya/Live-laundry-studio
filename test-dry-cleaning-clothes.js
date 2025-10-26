const axios = require('axios');

async function testDryCleaningClothesOrder() {
  try {
    console.log('Testing dry cleaning clothes order creation...');

    const orderData = {
      items: [
        {
          name: 'Suit (2-piece)',
          quantity: 1,
          price: 600,
          service: 'dry-cleaning'
        },
        {
          name: 'Dress Shirt',
          quantity: 2,
          price: 180,
          service: 'dry-cleaning'
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
      totalAmount: 960
    };

    console.log('Sending order data:', JSON.stringify(orderData, null, 2));

    const response = await axios.post('http://localhost:5000/api/orders/dry-cleaning-clothes', orderData);

    console.log('✅ Order created successfully!');
    console.log('Response:', response.data);

    // Now test fetching the order
    console.log('\nTesting order retrieval...');
    const fetchResponse = await axios.get(`http://localhost:5000/api/orders/my?email=${orderData.contactInfo.email}`);
    console.log('Orders found:', fetchResponse.data.length);
    console.log('Orders:', JSON.stringify(fetchResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testDryCleaningClothesOrder();