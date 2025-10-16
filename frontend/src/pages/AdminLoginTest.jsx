import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLoginTest = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    // Directly set admin user without Firebase
    const adminUser = {
      uid: 'admin-test-user',
      email: 'admin@gmail.com',
      name: 'Admin User',
      role: 'admin',
    };
    
    console.log('AdminLoginTest: Setting admin user:', adminUser);
    setUser(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    
    // Navigate to admin dashboard
    navigate('/admin-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Admin Login Test
        </h2>
        
        <button
          onClick={handleAdminLogin}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Login as Admin (Test)
        </button>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginTest;
