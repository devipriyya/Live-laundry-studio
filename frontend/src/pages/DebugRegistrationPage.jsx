import React from 'react';
import DebugRegisterForm from '../components/DebugRegisterForm';

const DebugRegistrationPage = () => {
  const handleSwitchToLogin = () => {
    alert('Switch to login clicked');
  };
  
  const handleClose = () => {
    alert('Close clicked');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <DebugRegisterForm 
          onSwitchToLogin={handleSwitchToLogin}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

export default DebugRegistrationPage;