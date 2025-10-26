import React, { useState } from 'react';
import api from './api';

const AuthTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    setAuthStatus({
      tokenPresent: !!token,
      userPresent: !!user,
      token: token ? `${token.substring(0, 20)}...` : null,
      user: user ? JSON.parse(user)?.email || 'Invalid user data' : null
    });
  };

  const testProtectedEndpoint = async () => {
    setLoading(true);
    setTestResults(null);
    try {
      // First check auth status
      checkAuthStatus();
      
      // Test a simple protected endpoint
      console.log('Testing profile endpoint...');
      const profileResponse = await api.get('/profile');
      console.log('Profile response:', profileResponse);
      
      setTestResults(`Profile endpoint test successful!
      User: ${profileResponse.data?.email || profileResponse.data?.name || 'Unknown'}`);
    } catch (error) {
      console.error('Error testing protected endpoint:');
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      setTestResults(`Protected endpoint test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAnalyticsEndpoints = async () => {
    setLoading(true);
    setTestResults(null);
    try {
      // First check auth status
      checkAuthStatus();
      
      // Test orders analytics endpoint with corrected path
      console.log('Fetching order trends...');
      const orderTrends = await api.get('/orders/analytics/orders');
      console.log('Order trends response:', orderTrends);
      
      // Test income analytics endpoint with corrected path
      console.log('Fetching monthly income...');
      const monthlyIncome = await api.get('/orders/analytics/income');
      console.log('Monthly income response:', monthlyIncome);
      
      setTestResults(`Analytics endpoints test successful!
      
Order Trends Data Points: ${orderTrends.data?.length || 0}
Monthly Income Data Points: ${monthlyIncome.data?.length || 0}`);
    } catch (error) {
      console.error('Error testing analytics endpoints:');
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      setTestResults(`Analytics endpoints test failed: ${error.message}
      Status: ${error.response?.status || 'N/A'}
      Response: ${error.response?.data?.message || 'No details'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <button
          onClick={checkAuthStatus}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Check Auth Status
        </button>
        
        <button
          onClick={testProtectedEndpoint}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Protected Endpoint'}
        </button>
        
        <button
          onClick={testAnalyticsEndpoints}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 md:col-span-2"
        >
          {loading ? 'Testing...' : 'Test Analytics Endpoints'}
        </button>
      </div>
      
      {authStatus && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Status</h3>
          <div className="space-y-2 text-gray-700">
            <p><span className="font-medium">Token Present:</span> {authStatus.tokenPresent ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">User Data Present:</span> {authStatus.userPresent ? 'Yes' : 'No'}</p>
            {authStatus.token && (
              <p><span className="font-medium">Token (truncated):</span> {authStatus.token}</p>
            )}
            {authStatus.user && (
              <p><span className="font-medium">User Email:</span> {authStatus.user}</p>
            )}
          </div>
        </div>
      )}
      
      {testResults && (
        <div className={`mt-4 p-4 rounded-lg ${testResults.includes('failed') ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          <p className={`font-medium ${testResults.includes('failed') ? 'text-red-800' : 'text-green-800'}`}>{testResults}</p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>If you get an "Unauthorized" error, you need to log in as an admin first</li>
          <li>Go to <a href="/admin-login-debug" className="text-blue-600 hover:underline">Admin Login Debug Page</a></li>
          <li>Click on the "Admin" card to log in with admin privileges</li>
          <li>Return to this page and run the tests again</li>
          <li>Open browser developer tools (F12) and go to the Console tab for detailed logs</li>
        </ol>
      </div>
    </div>
  );
};

export default AuthTest;