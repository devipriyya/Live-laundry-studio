import React from 'react';
import { DocumentTextIcon, ShieldCheckIcon, EyeIcon } from '@heroicons/react/24/outline';

const DashboardLegal = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Legal Information</h1>
        <p className="text-gray-600 mt-2">Terms, policies, and legal documents</p>
      </div>

      {/* Legal Documents */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Terms of Service</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our terms and conditions for using FabricSpa services.
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Read Terms →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Privacy Policy</h3>
          </div>
          <p className="text-gray-600 mb-4">
            How we collect, use, and protect your personal information.
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Read Policy →
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-4">
            <EyeIcon className="h-8 w-8 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Refund Policy</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our refund and cancellation policy for all services.
          </p>
          <button className="text-blue-600 hover:text-blue-700 font-medium">
            Read Policy →
          </button>
        </div>
      </div>

      {/* Quick Legal Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Important Legal Information</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Service Agreement</h3>
            <p className="text-gray-700">
              By using FabricSpa services, you agree to our terms of service and privacy policy. 
              We are committed to providing transparent and fair service to all customers.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Liability</h3>
            <p className="text-gray-700">
              FabricSpa takes full responsibility for garments in our care. We maintain comprehensive 
              insurance coverage and follow strict quality control procedures.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
            <p className="text-gray-700">
              We comply with all applicable data protection laws and maintain the highest standards 
              of data security to protect your personal information.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Legal */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Legal Inquiries</h3>
        <p className="text-gray-600 mb-4">
          For legal questions or concerns, please contact our legal department:
        </p>
        <div className="text-sm text-gray-700">
          <p>Email: legal@fabricspa.com</p>
          <p>Phone: +91 80 1234 5679</p>
          <p>Address: Legal Department, FabricSpa Technologies Pvt Ltd, Bangalore</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLegal;
