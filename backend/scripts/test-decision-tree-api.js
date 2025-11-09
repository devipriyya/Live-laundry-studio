const axios = require('axios');

// Test data
const testCustomerData = {
  orderFrequency: 10,
  avgOrderValue: 2000,
  daysSinceLastOrder: 7,
  serviceVariety: 3,
  satisfactionScore: 4.2,
  referralCount: 2,
  discountUsage: 1,
  complaintCount: 0
};

async function testDecisionTreeAPI() {
  try {
    console.log('Testing Decision Tree API endpoints...\n');
    
    // Test 1: Check model status
    console.log('1. Checking model status...');
    const statusResponse = await axios.get('http://localhost:5000/api/ml/status');
    console.log('Status:', statusResponse.data);
    console.log('');
    
    // Test 2: Get feature importance
    console.log('2. Getting feature importance...');
    try {
      const importanceResponse = await axios.get('http://localhost:5000/api/ml/feature-importance');
      console.log('Feature Importance:', importanceResponse.data);
    } catch (error) {
      console.log('Feature importance not available yet (model not trained)');
    }
    console.log('');
    
    // Test 3: Make a prediction (this will use default values since model is not trained)
    console.log('3. Making a prediction with untrained model...');
    const predictResponse = await axios.post('http://localhost:5000/api/ml/segment-dt', {
      customerData: testCustomerData
    });
    console.log('Prediction:', predictResponse.data);
    console.log('');
    
    console.log('API tests completed successfully!');
    
  } catch (error) {
    console.error('Error testing Decision Tree API:', error.response?.data || error.message);
  }
}

// Run the tests
testDecisionTreeAPI();