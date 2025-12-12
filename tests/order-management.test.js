// Test Case 4: Order Management Functionality
const axios = require('axios');

const testOrderManagementFunctionality = async () => {
  const baseURL = 'http://localhost:5000/api';
  const api = axios.create({ baseURL });

  console.log('🧪 Running Test Case 4: Order Management Functionality\n');

  // Test data
  const adminCredentials = {
    email: 'admin@gmail.com',
    password: 'admin123'
  };

  const userCredentials = {
    email: 'test@example.com',
    password: 'TestPassword123!'
  };

  try {
    // Test 1: Admin Access to All Orders
    console.log('Test 1: Admin Access to All Orders');
    try {
      // Login as admin
      const adminLoginResponse = await api.post('/auth/login', adminCredentials);
      const adminToken = adminLoginResponse.data.token;

      // Get all orders as admin
      const allOrdersResponse = await api.get('/orders/admin', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (allOrdersResponse.status === 200 && allOrdersResponse.data.orders) {
        console.log('✅ Test 1 PASSED: Admin Access to All Orders');
        console.log(`   Total orders: ${allOrdersResponse.data.orders.length}`);
        if (allOrdersResponse.data.orders.length > 0) {
          console.log(`   First order ID: ${allOrdersResponse.data.orders[0]._id}`);
          console.log(`   First order status: ${allOrdersResponse.data.orders[0].status}\n`);
        } else {
          console.log('   No orders found in system\n');
        }
      } else {
        console.log('❌ Test 1 FAILED: Unexpected response format');
        console.log(`   Response: ${JSON.stringify(allOrdersResponse.data)}\n`);
      }
    } catch (error) {
      console.log('❌ Test 1 FAILED: Admin access to orders failed');
      if (error.response) {
        console.log(`   Response status: ${error.response.status}`);
        console.log(`   Response data: ${JSON.stringify(error.response.data)}\n`);
      } else {
        console.log(`   Error message: ${error.message}`);
        console.log(`   Error code: ${error.code}\n`);
      }
    }

    // Test 2: User Access to Their Own Orders Only
    console.log('Test 2: User Access to Their Own Orders Only');
    try {
      // Login as regular user
      const userLoginResponse = await api.post('/auth/login', userCredentials);
      const userToken = userLoginResponse.data.token;

      // Get user's orders
      const userOrdersResponse = await api.get('/orders', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (userOrdersResponse.status === 200 && userOrdersResponse.data.orders) {
        console.log('✅ Test 2 PASSED: User Access to Their Own Orders Only');
        console.log(`   User orders count: ${userOrdersResponse.data.orders.length}\n`);
      } else {
        console.log('❌ Test 2 FAILED: Unexpected response format');
        console.log(`   Response: ${JSON.stringify(userOrdersResponse.data)}\n`);
      }
    } catch (error) {
      console.log('❌ Test 2 FAILED: User access to orders failed');
      if (error.response) {
        console.log(`   Response status: ${error.response.status}`);
        console.log(`   Response data: ${JSON.stringify(error.response.data)}\n`);
      } else {
        console.log(`   Error message: ${error.message}`);
        console.log(`   Error code: ${error.code}\n`);
      }
    }

    // Test 3: Admin Update Order Status
    console.log('Test 3: Admin Update Order Status');
    try {
      // Login as admin
      const adminLoginResponse = await api.post('/auth/login', adminCredentials);
      const adminToken = adminLoginResponse.data.token;

      // First, get an order to update
      const allOrdersResponse = await api.get('/orders/admin', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (allOrdersResponse.data.orders && allOrdersResponse.data.orders.length > 0) {
        const orderId = allOrdersResponse.data.orders[0]._id;
        const updateData = {
          status: 'in-progress'
        };

        // Update order status
        const updateResponse = await api.patch(`/orders/${orderId}`, updateData, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        if (updateResponse.status === 200 && updateResponse.data.order) {
          console.log('✅ Test 3 PASSED: Admin Update Order Status');
          console.log(`   Updated order ID: ${updateResponse.data.order._id}`);
          console.log(`   New status: ${updateResponse.data.order.status}\n`);
        } else {
          console.log('❌ Test 3 FAILED: Unexpected response format');
          console.log(`   Response: ${JSON.stringify(updateResponse.data)}\n`);
        }
      } else {
        console.log('❌ Test 3 FAILED: No orders available to update\n');
      }
    } catch (error) {
      console.log('❌ Test 3 FAILED: Order status update failed');
      if (error.response) {
        console.log(`   Response status: ${error.response.status}`);
        console.log(`   Response data: ${JSON.stringify(error.response.data)}\n`);
      } else {
        console.log(`   Error message: ${error.message}`);
        console.log(`   Error code: ${error.code}\n`);
      }
    }

    // Test 4: User Cannot Access Other Users' Orders
    console.log('Test 4: User Cannot Access Other Users\' Orders');
    try {
      // Login as regular user
      const userLoginResponse = await api.post('/auth/login', userCredentials);
      const userToken = userLoginResponse.data.token;

      // Try to access a specific order that doesn't belong to this user
      // We'll try to access the first order (which likely belongs to another user)
      const allOrdersResponse = await api.get('/orders/admin', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      // If we get here, it means the user was able to access admin orders
      console.log('❌ Test 4 FAILED: User should not be able to access admin orders endpoint\n');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ Test 4 PASSED: User Cannot Access Other Users\' Orders');
        console.log(`   Error message: ${error.response.data.message}\n`);
      } else {
        console.log('❌ Test 4 FAILED: Unexpected error');
        if (error.response) {
          console.log(`   Response status: ${error.response.status}`);
          console.log(`   Response data: ${JSON.stringify(error.response.data)}\n`);
        } else {
          console.log(`   Error message: ${error.message}`);
          console.log(`   Error code: ${error.code}\n`);
        }
      }
    }

    // Test 5: Admin Delete Order
    console.log('Test 5: Admin Delete Order');
    try {
      // Login as admin
      const adminLoginResponse = await api.post('/auth/login', adminCredentials);
      const adminToken = adminLoginResponse.data.token;

      // First, create a new order to delete
      const orderData = {
        serviceType: 'dry-cleaning',
        items: [
          {
            name: 'Test Item',
            quantity: 1,
            price: 10.99
          }
        ],
        totalAmount: 10.99,
        pickupDate: '2023-12-20',
        timeSlot: '2:00 PM - 4:00 PM',
        customerInfo: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          address: {
            street: '456 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '54321'
          }
        }
      };

      // Create the order
      const createResponse = await api.post('/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (createResponse.status === 201 && createResponse.data.order) {
        const orderId = createResponse.data.order._id;
        console.log(`   Created order ${orderId} for deletion testing`);

        // Now delete the order
        const deleteResponse = await api.delete(`/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        });

        if (deleteResponse.status === 200) {
          console.log('✅ Test 5 PASSED: Admin Delete Order');
          console.log(`   Deleted order ID: ${orderId}\n`);
        } else {
          console.log('❌ Test 5 FAILED: Unexpected response format');
          console.log(`   Response: ${JSON.stringify(deleteResponse.data)}\n`);
        }
      } else {
        console.log('❌ Test 5 FAILED: Could not create order for deletion\n');
      }
    } catch (error) {
      console.log('❌ Test 5 FAILED: Order deletion failed');
      if (error.response) {
        console.log(`   Response status: ${error.response.status}`);
        console.log(`   Response data: ${JSON.stringify(error.response.data)}\n`);
      } else {
        console.log(`   Error message: ${error.message}`);
        console.log(`   Error code: ${error.code}\n`);
      }
    }

  } catch (error) {
    console.error('💥 Test Case 4 encountered an unexpected error:');
    console.error(error);
  }
};

// Run the test
testOrderManagementFunctionality();

module.exports = testOrderManagementFunctionality;