// Test Case 3: Service Booking Functionality
const axios = require('axios');

const testServiceBookingFunctionality = async () => {
  const baseURL = 'http://localhost:5000/api';
  const api = axios.create({ baseURL });

  console.log('🧪 Running Test Case 3: Service Booking Functionality\n');

  // Test data
  const validUserCredentials = {
    email: 'test@example.com',
    password: 'TestPassword123!'
  };

  const serviceBookingData = {
    serviceType: 'dry-cleaning',
    items: [
      {
        name: 'Suit',
        quantity: 2,
        price: 25.99
      },
      {
        name: 'Shirt',
        quantity: 5,
        price: 5.99
      }
    ],
    totalAmount: 81.93,
    pickupDate: '2023-12-15',
    timeSlot: '10:00 AM - 12:00 PM',
    customerInfo: {
      name: 'Test User',
      email: 'test@example.com',
      phone: '+1234567890',
      address: {
        street: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        instructions: 'Leave at front door'
      }
    }
  };

  try {
    // Test 1: Successful Service Booking
    console.log('Test 1: Successful Service Booking');
    try {
      // First, login to get a token
      const loginResponse = await api.post('/auth/login', validUserCredentials);
      const token = loginResponse.data.token;

      // Create a service booking
      const bookingResponse = await api.post('/orders', serviceBookingData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (bookingResponse.status === 201 && bookingResponse.data.order) {
        console.log('✅ Test 1 PASSED: Successful Service Booking');
        console.log(`   Order ID: ${bookingResponse.data.order._id}`);
        console.log(`   Service Type: ${bookingResponse.data.order.serviceType}`);
        console.log(`   Total Items: ${bookingResponse.data.order.totalItems}`);
        console.log(`   Total Amount: $${bookingResponse.data.order.totalAmount}`);
        console.log(`   Status: ${bookingResponse.data.order.status}\n`);
      } else {
        console.log('❌ Test 1 FAILED: Unexpected response format');
        console.log(`   Response: ${JSON.stringify(bookingResponse.data)}\n`);
      }
    } catch (error) {
      console.log('❌ Test 1 FAILED: Service booking request failed');
      if (error.response) {
        console.log(`   Response status: ${error.response.status}`);
        console.log(`   Response data: ${JSON.stringify(error.response.data)}\n`);
      } else {
        console.log(`   Error message: ${error.message}`);
        console.log(`   Error code: ${error.code}\n`);
      }
    }

    // Test 2: Service Booking with Invalid Token
    console.log('Test 2: Service Booking with Invalid Token');
    try {
      const invalidToken = 'invalid.token.here';
      await api.post('/orders', serviceBookingData, {
        headers: {
          'Authorization': `Bearer ${invalidToken}`
        }
      });
      console.log('❌ Test 2 FAILED: Booking should have failed with invalid token\n');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Test 2 PASSED: Service Booking with Invalid Token');
        console.log(`   Error message: ${error.response.data.message}\n`);
      } else {
        console.log('❌ Test 2 FAILED: Unexpected error');
        if (error.response) {
          console.log(`   Response status: ${error.response.status}`);
          console.log(`   Response data: ${JSON.stringify(error.response.data)}\n`);
        } else {
          console.log(`   Error message: ${error.message}`);
          console.log(`   Error code: ${error.code}\n`);
        }
      }
    }

    // Test 3: Service Booking without Required Fields
    console.log('Test 3: Service Booking without Required Fields');
    try {
      // First, login to get a token
      const loginResponse = await api.post('/auth/login', validUserCredentials);
      const token = loginResponse.data.token;

      // Create incomplete booking data
      const incompleteBookingData = {
        serviceType: 'dry-cleaning',
        // Missing items, totalAmount, pickupDate, etc.
        customerInfo: {
          name: 'Test User'
          // Missing email, phone, address
        }
      };

      await api.post('/orders', incompleteBookingData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('❌ Test 3 FAILED: Booking should have failed with incomplete data\n');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Test 3 PASSED: Service Booking without Required Fields');
        console.log(`   Error message: ${error.response.data.message}\n`);
      } else {
        console.log('❌ Test 3 FAILED: Unexpected error');
        if (error.response) {
          console.log(`   Response status: ${error.response.status}`);
          console.log(`   Response data: ${JSON.stringify(error.response.data)}\n`);
        } else {
          console.log(`   Error message: ${error.message}`);
          console.log(`   Error code: ${error.code}\n`);
        }
      }
    }

    // Test 4: Retrieve User's Booked Services
    console.log('Test 4: Retrieve User\'s Booked Services');
    try {
      // First, login to get a token
      const loginResponse = await api.post('/auth/login', validUserCredentials);
      const token = loginResponse.data.token;

      // Get user's orders
      const ordersResponse = await api.get('/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (ordersResponse.status === 200 && ordersResponse.data.orders) {
        console.log('✅ Test 4 PASSED: Retrieve User\'s Booked Services');
        console.log(`   Total orders: ${ordersResponse.data.orders.length}`);
        if (ordersResponse.data.orders.length > 0) {
          console.log(`   Latest order ID: ${ordersResponse.data.orders[0]._id}`);
          console.log(`   Latest order status: ${ordersResponse.data.orders[0].status}\n`);
        } else {
          console.log('   No orders found for this user\n');
        }
      } else {
        console.log('❌ Test 4 FAILED: Unexpected response format');
        console.log(`   Response: ${JSON.stringify(ordersResponse.data)}\n`);
      }
    } catch (error) {
      console.log('❌ Test 4 FAILED: Retrieve orders request failed');
      if (error.response) {
        console.log(`   Response status: ${error.response.status}`);
        console.log(`   Response data: ${JSON.stringify(error.response.data)}\n`);
      } else {
        console.log(`   Error message: ${error.message}`);
        console.log(`   Error code: ${error.code}\n`);
      }
    }

    // Test 5: Service Booking with Negative Quantity
    console.log('Test 5: Service Booking with Negative Quantity');
    try {
      // First, login to get a token
      const loginResponse = await api.post('/auth/login', validUserCredentials);
      const token = loginResponse.data.token;

      // Create booking data with negative quantity
      const negativeQuantityData = {
        serviceType: 'dry-cleaning',
        items: [
          {
            name: 'Suit',
            quantity: -2, // Negative quantity
            price: 25.99
          }
        ],
        totalAmount: -51.98,
        pickupDate: '2023-12-15',
        timeSlot: '10:00 AM - 12:00 PM',
        customerInfo: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          address: {
            street: '123 Main St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            instructions: 'Leave at front door'
          }
        }
      };

      await api.post('/orders', negativeQuantityData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('❌ Test 5 FAILED: Booking should have failed with negative quantity\n');
    } catch (error) {
      if (error.response && (error.response.status === 400 || error.response.status === 422)) {
        console.log('✅ Test 5 PASSED: Service Booking with Negative Quantity');
        console.log(`   Error message: ${error.response.data.message}\n`);
      } else {
        console.log('❌ Test 5 FAILED: Unexpected error');
        if (error.response) {
          console.log(`   Response status: ${error.response.status}`);
          console.log(`   Response data: ${JSON.stringify(error.response.data)}\n`);
        } else {
          console.log(`   Error message: ${error.message}`);
          console.log(`   Error code: ${error.code}\n`);
        }
      }
    }

  } catch (error) {
    console.error('💥 Test Case 3 encountered an unexpected error:');
    console.error(error);
  }
};

// Run the test
testServiceBookingFunctionality();

module.exports = testServiceBookingFunctionality;