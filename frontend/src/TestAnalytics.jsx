import React, { useState } from 'react';
import testAnalyticsEndpoints from './test-analytics';

const TestAnalytics = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  const runTest = async () => {
    setLoading(true);
    setTestResults(null);
    setErrorDetails(null);
    try {
      const results = await testAnalyticsEndpoints();
      setTestResults(`Test completed successfully!
      
Order Trends Data Points: ${results.orderTrends?.length || 0}
Monthly Income Data Points: ${results.monthlyIncome?.length || 0}

Check browser console for full details.`);
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      const errorStatus = error.response?.status || 'N/A';
      const errorData = error.response?.data?.message || 'No additional error details';
      
      setTestResults(`Test failed: ${errorMessage}`);
      setErrorDetails({
        status: errorStatus,
        message: errorData,
        fullError: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics API Test</h1>
      <button
        onClick={runTest}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Run Analytics Test'}
      </button>
      
      {testResults && (
        <div className={`mt-4 p-4 rounded-lg ${errorDetails ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          <p className={`font-medium ${errorDetails ? 'text-red-800' : 'text-green-800'}`}>{testResults}</p>
        </div>
      )}
      
      {errorDetails && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Details</h3>
          <div className="space-y-2 text-red-700">
            <p><span className="font-medium">Status:</span> {errorDetails.status}</p>
            <p><span className="font-medium">Message:</span> {errorDetails.message}</p>
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>If you get an "Unauthorized" error, you need to log in as an admin first</li>
          <li>Go to <a href="/admin-login-debug" className="text-blue-600 hover:underline">Admin Login Debug Page</a></li>
          <li>Click on the "Admin" card to log in with admin privileges</li>
          <li>Return to this page and run the test again</li>
        </ol>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Debugging Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Click the "Run Analytics Test" button above</li>
          <li>Open browser developer tools (F12) and go to the Console tab</li>
          <li>Check the console output for API request/response details</li>
          <li>If successful, you should see the analytics data in the console</li>
        </ol>
      </div>
    </div>
  );
};

export default TestAnalytics;