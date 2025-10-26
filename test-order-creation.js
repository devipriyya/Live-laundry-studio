const axios = require('axios');

async function testOrderCreation() {
  console.log('Testing order creation API...\n');

  try {
    const orderData = {
      orderNumber: `SHOE-${Date.now()}`,
      customerInfo: {
        name: 'Test Customer',
        email: 'parvathy@gmail.com',
        phone: '+1234567890',
        address: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345'
        }
      },
      items: [{
        name: 'Running Shoes',
        quantity: 1,
        price: 50,
        service: 'Shoe Polish'
      }],
      totalAmount: 50,
      totalItems: 1,
      pickupDate: new Date().toISOString().split('T')[0],
      timeSlot: '10:00',
      status: 'order-placed',
      paymentStatus: 'paid',
      paymentId: 'pay_RWdGKGZ0vxuoCt',
      paymentMethod: 'razorpay'
    };

    console.log('Sending order data:', JSON.stringify(orderData, null, 2));

    const response = await axios.post('http://localhost:5000/api/orders', orderData);

    console.log('✅ Order created successfully!');
    console.log('Response:', response.data);

  } catch (error) {
    console.log('❌ Order creation failed');
    console.log('Status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message || error.message);

    if (error.response?.data) {
      console.log('Full error response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testOrderCreation();