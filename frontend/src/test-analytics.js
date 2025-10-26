import api from './api';

const testAnalyticsEndpoints = async () => {
  try {
    console.log('Testing analytics endpoints...');
    
    // Check if we have a token
    const token = localStorage.getItem('token');
    console.log('Auth token present:', !!token);
    
    // Test orders analytics endpoint with corrected path
    console.log('Fetching order trends...');
    const orderTrends = await api.get('/orders/analytics/orders');
    console.log('Order trends response:', orderTrends);
    
    // Test income analytics endpoint with corrected path
    console.log('Fetching monthly income...');
    const monthlyIncome = await api.get('/orders/analytics/income');
    console.log('Monthly income response:', monthlyIncome);
    
    console.log('Analytics endpoints test completed successfully!');
    return { orderTrends: orderTrends.data, monthlyIncome: monthlyIncome.data };
  } catch (error) {
    console.error('Error testing analytics endpoints:');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    throw error;
  }
};

export default testAnalyticsEndpoints;