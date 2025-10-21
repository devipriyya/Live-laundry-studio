import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import {
  DocumentTextIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const Invoice = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoice();
  }, [orderId]);

  const loadInvoice = async () => {
    try {
      const response = await api.get(`/invoices/${orderId}`);
      setInvoice(response.data);
    } catch (error) {
      console.error('Error loading invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would trigger PDF download
    alert('PDF download functionality would be implemented here');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Invoice Not Found</h3>
          <button
            onClick={() => navigate('/my-orders')}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:bg-white">
      {/* Action Buttons (hidden when printing) */}
      <div className="max-w-4xl mx-auto px-4 mb-6 print:hidden">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PrinterIcon className="h-5 w-5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{invoice.companyInfo.name}</h1>
              <p className="text-gray-600">{invoice.companyInfo.address}</p>
              <p className="text-gray-600">Phone: {invoice.companyInfo.phone}</p>
              <p className="text-gray-600">Email: {invoice.companyInfo.email}</p>
              <p className="text-gray-600">Tax ID: {invoice.companyInfo.taxId}</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-purple-600 mb-2">INVOICE</h2>
              <p className="text-gray-900 font-semibold">{invoice.invoiceNumber}</p>
              <p className="text-gray-600">Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
              {invoice.paymentInfo.paymentStatus === 'paid' && (
                <div className="mt-2 inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">PAID</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer and Order Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Bill To:</h3>
              <p className="font-semibold text-gray-900">{invoice.customer.name}</p>
              <p className="text-gray-600">{invoice.customer.address.street}</p>
              <p className="text-gray-600">
                {invoice.customer.address.city}, {invoice.customer.address.state} {invoice.customer.address.zipCode}
              </p>
              <p className="text-gray-600 mt-2">
                <PhoneIcon className="h-4 w-4 inline mr-1" />
                {invoice.customer.phone}
              </p>
              <p className="text-gray-600">
                <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                {invoice.customer.email}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Order Details:</h3>
              <p className="text-gray-600">Order Number: <span className="font-semibold text-gray-900">{invoice.orderNumber}</span></p>
              <p className="text-gray-600">Order Date: {new Date(invoice.orderDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Pickup Date: {invoice.pickupDate ? new Date(invoice.pickupDate).toLocaleDateString() : 'TBD'}</p>
              <p className="text-gray-600">Delivery Date: {invoice.deliveryDate ? new Date(invoice.deliveryDate).toLocaleDateString() : 'TBD'}</p>
              <p className="text-gray-600">Status: <span className="font-semibold text-purple-600">{invoice.status}</span></p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Item</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Quantity</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, index) => (
                  <tr key={index}>
                    <td className="py-3 px-4 text-gray-900">{item.name}</td>
                    <td className="py-3 px-4 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-600">₹{item.price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-gray-900 font-semibold">₹{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 text-gray-600">
                <span>Subtotal:</span>
                <span>₹{invoice.pricing.subtotal}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-600">
                <span>Tax (10%):</span>
                <span>₹{invoice.pricing.tax}</span>
              </div>
              {parseFloat(invoice.pricing.discount) > 0 && (
                <div className="flex justify-between py-2 text-green-600">
                  <span>Discount:</span>
                  <span>-₹{invoice.pricing.discount}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-gray-300 font-bold text-lg text-gray-900">
                <span>Total:</span>
                <span>₹{invoice.pricing.total}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-6 mb-8">
            <h3 className="font-bold text-gray-900 mb-3">Payment Information:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Payment Method: <span className="font-semibold text-gray-900">{invoice.paymentInfo.method}</span></p>
                <p className="text-gray-600">Payment ID: <span className="font-mono text-sm">{invoice.paymentInfo.paymentId}</span></p>
              </div>
              <div>
                <p className="text-gray-600">Payment Status: 
                  <span className={`ml-2 font-semibold ${
                    invoice.paymentInfo.paymentStatus === 'paid' ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {invoice.paymentInfo.paymentStatus.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {invoice.specialInstructions && (
            <div className="border-t pt-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-2">Special Instructions:</h3>
              <p className="text-gray-600">{invoice.specialInstructions}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t pt-6 text-center text-gray-600 text-sm">
            <p>Thank you for choosing {invoice.companyInfo.name}!</p>
            <p className="mt-2">For any queries, please contact us at {invoice.companyInfo.email} or {invoice.companyInfo.phone}</p>
            <p className="mt-4 text-xs text-gray-500">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
