import React from 'react';

const ProfileTest = () => {
  console.log('ProfileTest component rendering...');
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile Test Page</h1>
        <p className="text-lg text-gray-600 mb-8">This is a simple test to verify routing works.</p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">✅ Success!</h2>
          <p className="text-gray-700">The profile route is working correctly.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTest;
