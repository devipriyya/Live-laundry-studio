import api from './api';

// Simple test function to verify API connectivity
export const testLaundryStaffAPI = async () => {
  try {
    console.log('Testing laundry staff API...');
    
    // Test GET request
    const response = await api.get('/laundry-staff/laundry-staff');
    console.log('API Response:', response.data);
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
};

// Test POST request (create laundry staff)
export const testCreateLaundryStaff = async (staffData) => {
  try {
    console.log('Creating test laundry staff...', staffData);
    
    const response = await api.post('/laundry-staff/laundry-staff', staffData);
    console.log('Create Response:', response.data);
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Create Error:', error);
    return { success: false, error: error.message };
  }
};