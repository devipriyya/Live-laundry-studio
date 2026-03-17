import React from 'react';
import ToastTest from '../components/ToastTest';

const ToastTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Toast Notification Test</h1>
        <ToastTest />
      </div>
    </div>
  );
};

export default ToastTestPage;
