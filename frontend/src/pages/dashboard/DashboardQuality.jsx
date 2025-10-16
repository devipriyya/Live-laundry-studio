import React, { useState } from 'react';
import {
  CheckCircleIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const DashboardQuality = () => {
  const [qualityReports] = useState([
    {
      id: 'QR-001',
      orderId: 'ORD-001',
      service: 'Dry Cleaning',
      rating: 5,
      status: 'Approved',
      date: '2024-01-15',
      feedback: 'Excellent service, clothes came back perfectly clean!'
    },
    {
      id: 'QR-002',
      orderId: 'ORD-002',
      service: 'Wash & Press',
      rating: 4,
      status: 'Approved',
      date: '2024-01-14',
      feedback: 'Good quality work, minor wrinkles on one shirt.'
    }
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quality Approval</h1>
        <p className="text-gray-600 mt-2">Review and approve the quality of your completed orders</p>
      </div>

      {/* Quality Reports */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Quality Reports</h2>
        
        <div className="space-y-6">
          {qualityReports.map((report) => (
            <div key={report.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Order #{report.orderId}</h3>
                  <p className="text-sm text-gray-600">{report.service} • {report.date}</p>
                </div>
                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  {report.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < report.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600">({report.rating}/5)</span>
              </div>
              
              <p className="text-gray-700 mb-4">{report.feedback}</p>
              
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  <PhotoIcon className="h-4 w-4" />
                  <span>View Photos</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  <span>Add Feedback</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Guidelines */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quality Standards</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <CheckCircleIcon className="h-8 w-8 text-blue-600 mx-auto" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Stain Removal</h3>
            <p className="text-sm text-gray-600">Complete removal of all visible stains</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600 mx-auto" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Pressing Quality</h3>
            <p className="text-sm text-gray-600">Crisp, wrinkle-free finish</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <CheckCircleIcon className="h-8 w-8 text-purple-600 mx-auto" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fabric Care</h3>
            <p className="text-sm text-gray-600">Gentle treatment preserving fabric quality</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardQuality;
