import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import {
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  PaperAirplaneIcon,
  ClipboardDocumentListIcon,
  ChatBubbleBottomCenterTextIcon,
  TicketIcon,
  QueueListIcon
} from '@heroicons/react/24/outline';

const DashboardFeedback = () => {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: 'general-inquiry',
    subject: '',
    description: '',
    relatedOrderId: '',
    priority: 'medium'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const categories = [
    { id: 'order-issue', name: 'Order Issue' },
    { id: 'payment-issue', name: 'Payment Issue' },
    { id: 'delivery-issue', name: 'Delivery Issue' },
    { id: 'app-bug', name: 'App Bug' },
    { id: 'customer-complaint', name: 'Customer Complaint' },
    { id: 'general-inquiry', name: 'General Inquiry' },
    { id: 'other', name: 'Other' }
  ];

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await api.get('/support-tickets/my');
      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/support-tickets', formData);
      setMessage({ type: 'success', text: 'Thank you! Your feedback has been submitted successfully.' });
      setFormData({
        category: 'general-inquiry',
        subject: '',
        description: '',
        relatedOrderId: '',
        priority: 'medium'
      });
      fetchTickets();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit feedback. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Feedback & Support</h1>
          <p className="text-gray-600 mt-1">We value your feedback. Let us know how we can improve our service.</p>
        </div>
        <button 
          onClick={fetchTickets}
          className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 font-medium transition-colors"
        >
          <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Submission Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6">
              <div className="flex items-center gap-3 text-white">
                <ChatBubbleBottomCenterTextIcon className="w-8 h-8" />
                <h2 className="text-xl font-bold">Submit Feedback</h2>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                  message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                  {message.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <ExclamationTriangleIcon className="w-5 h-5" />}
                  {message.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Feedback Category</label>
                <select
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
                <input
                  required
                  type="text"
                  placeholder="Summarize your issue"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Order ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. ORD-12345"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                  value={formData.relatedOrderId}
                  onChange={(e) => setFormData({...formData, relatedOrderId: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Detailed Message</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your feedback or complaint in detail..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <button
                disabled={submitting}
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-cyan-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* History List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <QueueListIcon className="w-6 h-6 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900">Your Support Tickets</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl"></div>
                </div>
              ))
            ) : tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${
                    ticket.status === 'open' ? 'from-blue-500' : 
                    ticket.status === 'in-progress' ? 'from-yellow-500' : 
                    'from-green-500'
                  }`}></div>
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded uppercase">{ticket.ticketId}</span>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{ticket.subject}</h3>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mb-3">
                        <TicketIcon className="w-4 h-4" />
                        {categories.find(c => c.id === ticket.category)?.name || ticket.category}
                        <span className="mx-1">•</span>
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 text-sm italic">
                        "{ticket.description}"
                      </div>
                      {ticket.resolution && (
                        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100 text-sm">
                          <p className="font-bold text-green-800 mb-1 flex items-center gap-2">
                            <CheckCircleIcon className="w-4 h-4" />
                            Official Resolution:
                          </p>
                          <p className="text-green-700">{ticket.resolution}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold border shadow-sm ${getStatusStyle(ticket.status)}`}>
                        {ticket.status.replace('-', ' ').toUpperCase()}
                      </span>
                      {ticket.relatedOrderId && (
                        <span className="text-xs text-gray-400 font-medium italic">Ref: {ticket.relatedOrderId?.orderNumber || 'Order'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white py-16 px-6 rounded-2xl border border-dashed border-gray-200 text-center flex flex-col items-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <ClipboardDocumentListIcon className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No tickets found</h3>
                <p className="text-gray-500 max-w-sm mt-1">You haven't submitted any feedback or complaints yet. Use the form to reach out to our support team.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFeedback;
