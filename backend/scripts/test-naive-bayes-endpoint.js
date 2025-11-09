// Test script to verify the Naive Bayes API endpoints work correctly
const http = require('http');

// Sample test data
const sampleOrders = [
  {
    userOrderCount: 15,
    totalAmount: 1250,
    createdAt: '2023-05-15T10:30:00Z',
    items: [{ serviceType: 'washAndPress' }]
  },
  {
    userOrderCount: 8,
    totalAmount: 2100,
    createdAt: '2023-05-10T14:15:00Z',
    items: [{ serviceType: 'dryCleaning' }]
  },
  {
    userOrderCount: 12,
    totalAmount: 800,
    createdAt: '2023-05-12T16:45:00Z',
    items: [{ serviceType: 'steamPress' }]
  }
];

const sampleUserHistory = [
  {
    userOrderCount: 6,
    totalAmount: 1300,
    createdAt: '2023-05-10T10:30:00Z',
    items: [{ serviceType: 'washAndPress' }]
  }
];

console.log('=== Testing Naive Bayes API Endpoints ===\n');

// Test 1: Train the Naive Bayes model
console.log('1. Testing /api/ml/train-naive-bayes endpoint...');

const trainData = JSON.stringify({ orders: sampleOrders });

const trainOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/ml/train-naive-bayes',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': trainData.length
  }
};

const trainReq = http.request(trainOptions, (res) => {
  let trainResponse = '';
  
  res.on('data', (chunk) => {
    trainResponse += chunk;
  });
  
  res.on('end', () => {
    console.log('Training response:', trainResponse);
    
    // Test 2: Make a prediction
    console.log('\n2. Testing /api/ml/predict-naive-bayes endpoint...');
    
    const predictData = JSON.stringify({ userOrderHistory: sampleUserHistory });
    
    const predictOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/ml/predict-naive-bayes',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': predictData.length
      }
    };
    
    const predictReq = http.request(predictOptions, (res) => {
      let predictResponse = '';
      
      res.on('data', (chunk) => {
        predictResponse += chunk;
      });
      
      res.on('end', () => {
        console.log('Prediction response:', predictResponse);
        
        // Test 3: Get prediction probabilities
        console.log('\n3. Testing /api/ml/predict-probabilities endpoint...');
        
        const probOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/ml/predict-probabilities',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': predictData.length
          }
        };
        
        const probReq = http.request(probOptions, (res) => {
          let probResponse = '';
          
          res.on('data', (chunk) => {
            probResponse += chunk;
          });
          
          res.on('end', () => {
            console.log('Probabilities response:', probResponse);
            console.log('\n✅ All API endpoint tests completed!');
          });
        });
        
        probReq.on('error', (error) => {
          console.error('Error with probabilities request:', error);
        });
        
        probReq.write(predictData);
        probReq.end();
      });
    });
    
    predictReq.on('error', (error) => {
      console.error('Error with prediction request:', error);
    });
    
    predictReq.write(predictData);
    predictReq.end();
  });
});

trainReq.on('error', (error) => {
  console.error('Error with training request:', error);
  console.log('Note: Make sure the backend server is running on port 5000');
});

trainReq.write(trainData);
trainReq.end();