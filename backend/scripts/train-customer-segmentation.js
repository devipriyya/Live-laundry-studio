const axios = require('axios');

// Sample customer data for training the segmentation model
const trainingData = [
  // Premium customers
  {
    orderFrequency: 25,
    avgOrderValue: 3500,
    daysSinceLastOrder: 5,
    serviceVariety: 4,
    satisfactionScore: 4.8,
    referralCount: 8,
    discountUsage: 2,
    complaintCount: 0,
    segment: 'premium'
  },
  {
    orderFrequency: 22,
    avgOrderValue: 3200,
    daysSinceLastOrder: 7,
    serviceVariety: 4,
    satisfactionScore: 4.7,
    referralCount: 6,
    discountUsage: 3,
    complaintCount: 0,
    segment: 'premium'
  },
  {
    orderFrequency: 28,
    avgOrderValue: 3800,
    daysSinceLastOrder: 3,
    serviceVariety: 5,
    satisfactionScore: 4.9,
    referralCount: 10,
    discountUsage: 1,
    complaintCount: 0,
    segment: 'premium'
  },
  // Regular customers
  {
    orderFrequency: 12,
    avgOrderValue: 1800,
    daysSinceLastOrder: 15,
    serviceVariety: 3,
    satisfactionScore: 4.2,
    referralCount: 3,
    discountUsage: 5,
    complaintCount: 1,
    segment: 'regular'
  },
  {
    orderFrequency: 10,
    avgOrderValue: 1500,
    daysSinceLastOrder: 20,
    serviceVariety: 3,
    satisfactionScore: 4.0,
    referralCount: 2,
    discountUsage: 6,
    complaintCount: 1,
    segment: 'regular'
  },
  {
    orderFrequency: 15,
    avgOrderValue: 2000,
    daysSinceLastOrder: 12,
    serviceVariety: 4,
    satisfactionScore: 4.3,
    referralCount: 4,
    discountUsage: 4,
    complaintCount: 0,
    segment: 'regular'
  },
  // Budget customers
  {
    orderFrequency: 5,
    avgOrderValue: 900,
    daysSinceLastOrder: 45,
    serviceVariety: 2,
    satisfactionScore: 3.5,
    referralCount: 0,
    discountUsage: 8,
    complaintCount: 2,
    segment: 'budget'
  },
  {
    orderFrequency: 3,
    avgOrderValue: 600,
    daysSinceLastOrder: 60,
    serviceVariety: 1,
    satisfactionScore: 3.0,
    referralCount: 0,
    discountUsage: 10,
    complaintCount: 3,
    segment: 'budget'
  },
  {
    orderFrequency: 7,
    avgOrderValue: 750,
    daysSinceLastOrder: 35,
    serviceVariety: 2,
    satisfactionScore: 3.2,
    referralCount: 1,
    discountUsage: 9,
    complaintCount: 1,
    segment: 'budget'
  },
  // Inactive customers
  {
    orderFrequency: 1,
    avgOrderValue: 500,
    daysSinceLastOrder: 120,
    serviceVariety: 1,
    satisfactionScore: 2.8,
    referralCount: 0,
    discountUsage: 1,
    complaintCount: 3,
    segment: 'inactive'
  },
  {
    orderFrequency: 2,
    avgOrderValue: 400,
    daysSinceLastOrder: 90,
    serviceVariety: 1,
    satisfactionScore: 2.5,
    referralCount: 0,
    discountUsage: 0,
    complaintCount: 4,
    segment: 'inactive'
  },
  {
    orderFrequency: 1,
    avgOrderValue: 300,
    daysSinceLastOrder: 150,
    serviceVariety: 1,
    satisfactionScore: 2.0,
    referralCount: 0,
    discountUsage: 0,
    complaintCount: 5,
    segment: 'inactive'
  }
];

async function trainCustomerSegmentationModel() {
  try {
    console.log('=== Training Customer Segmentation Model ===\n');
    
    // Base URL for the API
    const baseURL = 'http://localhost:5000/api/ml';
    
    // Train the SVM model
    console.log('Sending training data to the server...');
    const trainResponse = await axios.post(`${baseURL}/train-segmenter`, {
      customers: trainingData
    });
    
    console.log('✅ Training response:', trainResponse.data.message);
    console.log('   Training samples:', trainResponse.data.sampleCount);
    
    // Test the model with a sample customer
    console.log('\nTesting the trained model with a sample customer...');
    const testCustomer = {
      orderFrequency: 18,
      avgOrderValue: 2800,
      daysSinceLastOrder: 8,
      serviceVariety: 4,
      satisfactionScore: 4.6,
      referralCount: 5,
      discountUsage: 2,
      complaintCount: 0
    };
    
    const testResponse = await axios.post(`${baseURL}/segment`, {
      customerData: testCustomer
    });
    
    console.log('\n=== Prediction Result ===');
    console.log('Segment:', testResponse.data.segment.segment);
    console.log('Confidence:', Math.round(testResponse.data.segment.confidence * 100) + '%');
    
    console.log('\n=== Model Training Complete ===');
    console.log('The customer segmentation model is now ready for use!');
    
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('❌ Network Error: Could not connect to the API. Make sure the server is running.');
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Run the training
trainCustomerSegmentationModel();