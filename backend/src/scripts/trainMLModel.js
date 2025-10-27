const axios = require('axios');

// Sample training data
const sampleOrders = [
  {
    userOrderCount: 5,
    totalAmount: 120,
    orderDate: '2023-05-15T10:30:00Z',
    createdAt: '2023-05-15T10:30:00Z',
    items: [{ serviceType: 'washAndPress' }]
  },
  {
    userOrderCount: 3,
    totalAmount: 85,
    orderDate: '2023-05-18T14:15:00Z',
    createdAt: '2023-05-18T14:15:00Z',
    items: [{ serviceType: 'dryCleaning' }]
  },
  {
    userOrderCount: 8,
    totalAmount: 210,
    orderDate: '2023-05-20T16:45:00Z',
    createdAt: '2023-05-20T16:45:00Z',
    items: [{ serviceType: 'washAndPress' }]
  },
  {
    userOrderCount: 2,
    totalAmount: 65,
    orderDate: '2023-05-22T09:20:00Z',
    createdAt: '2023-05-22T09:20:00Z',
    items: [{ serviceType: 'stainRemoval' }]
  },
  {
    userOrderCount: 6,
    totalAmount: 150,
    orderDate: '2023-05-25T11:10:00Z',
    createdAt: '2023-05-25T11:10:00Z',
    items: [{ serviceType: 'steamPress' }]
  },
  {
    userOrderCount: 1,
    totalAmount: 45,
    orderDate: '2023-05-28T13:30:00Z',
    createdAt: '2023-05-28T13:30:00Z',
    items: [{ serviceType: 'shoeCare' }]
  },
  {
    userOrderCount: 4,
    totalAmount: 95,
    orderDate: '2023-05-30T15:45:00Z',
    createdAt: '2023-05-30T15:45:00Z',
    items: [{ serviceType: 'dryCleaning' }]
  },
  {
    userOrderCount: 7,
    totalAmount: 175,
    orderDate: '2023-06-01T08:15:00Z',
    createdAt: '2023-06-01T08:15:00Z',
    items: [{ serviceType: 'washAndPress' }]
  },
  {
    userOrderCount: 3,
    totalAmount: 75,
    orderDate: '2023-06-03T12:20:00Z',
    createdAt: '2023-06-03T12:20:00Z',
    items: [{ serviceType: 'stainRemoval' }]
  },
  {
    userOrderCount: 9,
    totalAmount: 220,
    orderDate: '2023-06-05T17:30:00Z',
    createdAt: '2023-06-05T17:30:00Z',
    items: [{ serviceType: 'washAndPress' }]
  }
];

const trainModel = async () => {
  try {
    console.log('Training ML model with sample data...');
    const response = await axios.post('http://localhost:5000/api/ml/train', {
      orders: sampleOrders
    });
    
    console.log('Training response:', response.data);
    
    // Also train the SVM customer segmenter with sample data
    const sampleCustomers = [
      {
        orderFrequency: 10,
        avgOrderValue: 150,
        preferredService: 'washAndPress',
        daysSinceLastOrder: 2,
        totalSpent: 1500,
        favoriteTimeSlot: 'evening',
        seasonalUsage: 'regular',
        paymentMethod: 'creditCard'
      },
      {
        orderFrequency: 3,
        avgOrderValue: 75,
        preferredService: 'dryCleaning',
        daysSinceLastOrder: 15,
        totalSpent: 225,
        favoriteTimeSlot: 'afternoon',
        seasonalUsage: 'occasional',
        paymentMethod: 'cash'
      },
      {
        orderFrequency: 15,
        avgOrderValue: 200,
        preferredService: 'washAndPress',
        daysSinceLastOrder: 1,
        totalSpent: 3000,
        favoriteTimeSlot: 'morning',
        seasonalUsage: 'frequent',
        paymentMethod: 'creditCard'
      }
    ];
    
    console.log('Training SVM Customer Segmenter...');
    const svmResponse = await axios.post('http://localhost:5000/api/ml/train-segmenter', {
      customers: sampleCustomers
    });
    
    console.log('SVM Training response:', svmResponse.data);
    console.log('ML models trained successfully!');
  } catch (error) {
    console.error('Error training ML models:', error.response?.data || error.message);
  }
};

trainModel();