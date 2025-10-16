import React, { useState } from 'react';
import {
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const DashboardPayment = () => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [paymentHistory] = useState([
    {
      id: 'PAY-001',
      orderId: 'ORD-001',
      amount: '₹450',
      method: 'Credit Card',
      status: 'Completed',
      date: '2024-01-15',
      statusColor: 'text-green-600 bg-green-50'
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-002',
      amount: '₹320',
      method: 'UPI',
      status: 'Completed',
      date: '2024-01-14',
      statusColor: 'text-green-600 bg-green-50'
    },
    {
      id: 'PAY-003',
      orderId: 'ORD-003',
      amount: '₹275',
      method: 'Net Banking',
      status: 'Pending',
      date: '2024-01-13',
      statusColor: 'text-yellow-600 bg-yellow-50'
    }
  ]);

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCardIcon, color: 'blue' },
    { id: 'upi', name: 'UPI Payment', icon: DevicePhoneMobileIcon, color: 'green' },
    { id: 'netbanking', name: 'Net Banking', icon: BanknotesIcon, color: 'purple' },
    { id: 'wallet', name: 'Digital Wallet', icon: GlobeAltIcon, color: 'orange' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Online Payment</h1>
        <p className="text-gray-600 mt-2">Manage your payments and view transaction history</p>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                selectedMethod === method.id
                  ? `border-${method.color}-500 bg-${method.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <method.icon className={`h-8 w-8 mx-auto mb-3 ${
                selectedMethod === method.id ? `text-${method.color}-600` : 'text-gray-500'
              }`} />
              <h3 className="font-semibold text-gray-900 text-sm">{method.name}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Payment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Payment</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
            <input
              type="text"
              placeholder="Enter order ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input
              type="text"
              placeholder="₹0.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300">
          Proceed to Payment
        </button>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment History</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Payment ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Method</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{payment.id}</td>
                  <td className="py-4 px-4 text-gray-600">{payment.orderId}</td>
                  <td className="py-4 px-4 font-semibold text-gray-900">{payment.amount}</td>
                  <td className="py-4 px-4 text-gray-600">{payment.method}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${payment.statusColor}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{payment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPayment;
