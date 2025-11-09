// Simple API test script
const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test the notifications endpoint directly
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${API_URL}/notifications/user/demo@fabrico.com`);
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Response data:', data);
    } else {
      console.error('API request failed with status:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Run the test
testAPI();

export default testAPI;