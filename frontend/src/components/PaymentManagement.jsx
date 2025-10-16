import React, { useState, useEffect } from 'react';
import {
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Mock payment data
  const mockPayments = [
    {
      id: 'PAY-2024-001',
      orderId: 'ORD-2024-001',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      amount: 89.99,
      method: 'Credit Card',
      cardLast4: '4532',
      status: 'Completed',
      transactionId: 'TXN-789456123',
      paymentDate: '2024-01-20T14:30:00',
      processingFee: 2.70,
      netAmount: 87.29,
      gateway: 'Stripe',
      currency: 'USD',
      refundable: true,
      notes: 'Premium service payment'
    },
    {
      id: 'PAY-2024-002',
      orderId: 'ORD-2024-002',
      customerName: 'Michael Chen',
      customerEmail: 'mchen@email.com',
      amount: 34.50,
      method: 'Digital Wallet',
      cardLast4: null,
      status: 'Pending',
      transactionId: 'TXN-789456124',
      paymentDate: '2024-01-19T16:45:00',
      processingFee: 1.04,
      netAmount: 33.46,
      gateway: 'PayPal',
      currency: 'USD',
      refundable: false,
      notes: 'Regular wash & fold service'
    },
    {
      id: 'PAY-2024-003',
      orderId: 'ORD-2024-003',
      customerName: 'Emma Wilson',
      customerEmail: 'emma.w@email.com',
      amount: 45.00,
      method: 'Bank Transfer',
      cardLast4: null,
      status: 'Failed',
      transactionId: 'TXN-789456125',
      paymentDate: '2024-01-18T11:20:00',
      processingFee: 0.00,
      netAmount: 0.00,
      gateway: 'Bank Direct',
      currency: 'USD',
      refundable: false,
      notes: 'Express service - payment failed, retry required'
    },
    {
      id: 'PAY-2024-004',
      orderId: 'ORD-2024-004',
      customerName: 'David Brown',
      customerEmail: 'david.b@email.com',
      amount: 67.50,
      method: 'Credit Card',
      cardLast4: '8901',
      status: 'Refunded',
      transactionId: 'TXN-789456126',
      paymentDate: '2024-01-17T09:15:00',
      processingFee: 2.03,
      netAmount: 65.47,
      gateway: 'Stripe',
      currency: 'USD',
      refundable: false,
      notes: 'Customer requested refund due to service issue'
    }
  ];

  useEffect(() => {
    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
  }, []);

  // Filter payments
  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => 
        payment.status.toLowerCase() === statusFilter
      );
    }

    setFilteredPayments(filtered);
  }, [searchTerm, statusFilter, payments]);

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircleIcon
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: ClockIcon
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircleIcon
        };
      case 'refunded':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: ArrowPathIcon
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: ExclamationTriangleIcon
        };
    }
  };

  // Calculate totals
  const totalRevenue = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount = payments.filter(p => p.status === 'Refunded').reduce((sum, p) => sum + p.amount, 0);
  const processingFees = payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + p.processingFee, 0);

  // Payment Detail Modal
  const PaymentDetailModal = ({ payment, onClose }) => {
    if (!payment) return null;

    const statusInfo = getStatusInfo(payment.status);
    const StatusIcon = statusInfo.icon;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-medium">{payment.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{payment.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium text-sm">{payment.transactionId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-4 w-4" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{payment.method}</span>
                    </div>
                    {payment.cardLast4 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Card:</span>
                        <span className="font-medium">****{payment.cardLast4}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gateway:</span>
                      <span className="font-medium">{payment.gateway}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">{payment.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-700">{payment.customerEmail}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-700">
                        {new Date(payment.paymentDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Amount Breakdown</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">${payment.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-medium">-${payment.processingFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Net Amount:</span>
                        <span className="text-green-600">${payment.netAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {payment.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700">{payment.notes}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              {payment.status === 'Completed' && payment.refundable && (
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Process Refund
                </button>
              )}
              {payment.status === 'Failed' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Retry Payment
                </button>
              )}
              {payment.status === 'Pending' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Mark as Completed
                </button>
              )}
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                Send Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">Track payments, process refunds, and manage transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Refunded Amount</p>
                <p className="text-2xl font-bold text-purple-600">${refundedAmount.toFixed(2)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ArrowPathIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Processing Fees</p>
                <p className="text-2xl font-bold text-red-600">${processingFees.toFixed(2)}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <DocumentArrowDownIcon className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => {
                  const statusInfo = getStatusInfo(payment.status);
                  const StatusIcon = statusInfo.icon;
                  
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                          <div className="text-sm text-gray-500">{payment.orderId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.customerName}</div>
                          <div className="text-sm text-gray-500">{payment.customerEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${payment.amount.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">Fee: ${payment.processingFee.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CreditCardIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900">{payment.method}</div>
                            {payment.cardLast4 && (
                              <div className="text-sm text-gray-500">****{payment.cardLast4}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon className="h-4 w-4 mr-2" />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusInfo.color}`}>
                            {payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Detail Modal */}
        {showModal && (
          <PaymentDetailModal
            payment={selectedPayment}
            onClose={() => {
              setShowModal(false);
              setSelectedPayment(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;
