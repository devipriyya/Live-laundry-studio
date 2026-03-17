import React, { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  TrashIcon,
  EyeIcon,
  PaperAirplaneIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import api from '../api';

const ComplaintFeedbackManagement = () => {
  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' or 'feedback'
  const [loading, setLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/support-tickets', {
        params: { status: statusFilter }
      });
      setComplaints(response.data.tickets || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviews', {
        params: { isAdminView: 'true' }
      });
      setFeedback(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'complaints') {
      fetchComplaints();
    } else {
      fetchFeedback();
    }
  }, [activeTab, statusFilter]);

  const handleResolveComplaint = async (id, resolution) => {
    try {
      setLoading(true);
      await api.put(`/support-tickets/${id}`, {
        status: 'resolved',
        resolution
      });
      fetchComplaints();
      setShowModal(false);
    } catch (error) {
      console.error('Error resolving complaint:', error);
      alert('Failed to resolve complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyToComplaint = async (id) => {
    try {
      setLoading(true);
      await api.put(`/support-tickets/${id}`, {
        message: replyMessage,
        status: 'in-progress'
      });
      setReplyMessage('');
      fetchComplaints();
      const updatedTicket = await api.get(`/support-tickets/${id}`);
      setSelectedItem(updatedTicket.data.ticket);
    } catch (error) {
      console.error('Error replying to complaint:', error);
      alert('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        setLoading(true);
        await api.delete(`/support-tickets/${id}`);
        fetchComplaints();
      } catch (error) {
        console.error('Error deleting complaint:', error);
        alert('Failed to delete complaint');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReviewStatus = async (id, status) => {
    try {
      setLoading(true);
      await api.put(`/reviews/${id}`, { status });
      fetchFeedback();
    } catch (error) {
      console.error('Error updating review status:', error);
      alert('Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Open</span>;
      case 'in-progress': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">In Progress</span>;
      case 'resolved': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Resolved</span>;
      case 'closed': return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">Closed</span>;
      case 'approved': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Approved</span>;
      case 'pending': return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Pending</span>;
      case 'rejected': return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">Rejected</span>;
      default: return null;
    }
  };

  const renderRating = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? 
            <StarIconSolid key={star} className="h-4 w-4 text-yellow-500" /> : 
            <StarIcon key={star} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Complaints & Feedback</h1>
          <p className="text-gray-600 mt-2">Manage customer concerns and reviews</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'complaints' 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
          Complaints
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'feedback' 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
          }`}
        >
          <StarIcon className="h-5 w-5 mr-2" />
          Feedback
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-w-[150px]"
          >
            <option value="all">All Status</option>
            {activeTab === 'complaints' ? (
              <>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </>
            ) : (
              <>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </>
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Loading {activeTab}...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {activeTab === 'complaints' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">User</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Subject</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {complaints.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <UserCircleIcon className="h-8 w-8 text-gray-400 mr-2" />
                        <div>
                          <div className="font-bold text-sm text-gray-900">{ticket.userName || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{ticket.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ticket.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{ticket.category}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(ticket);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteComplaint(ticket._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">User</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Rating</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Comment</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {feedback.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-sm text-gray-900">{review.customerInfo.name}</div>
                        <div className="text-xs text-gray-500">{review.customerInfo.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderRating(review.rating)}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-md truncate">{review.comment}</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(review.status)}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {review.status !== 'approved' && (
                          <button
                            onClick={() => handleReviewStatus(review._id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button
                            onClick={() => handleReviewStatus(review._id, 'rejected')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Reject"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {((activeTab === 'complaints' && complaints.length === 0) || 
            (activeTab === 'feedback' && feedback.length === 0)) && !loading && (
            <div className="p-20 text-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} Found</h3>
              <p className="text-gray-500">There are no records matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Complaint Details Modal */}
      {showModal && selectedItem && activeTab === 'complaints' && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-gray-900 opacity-75 backdrop-blur-sm"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedItem.subject}</h3>
                    <p className="text-sm text-gray-500">Ticket ID: {selectedItem.ticketId}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedItem.status)}
                    <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl">
                      <XCircleIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedItem.description}</p>
                  </div>

                  {selectedItem.messages && selectedItem.messages.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-700">Conversation</h4>
                      {selectedItem.messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'support' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.sender === 'support' 
                              ? 'bg-blue-600 text-white rounded-tr-none' 
                              : 'bg-gray-100 text-gray-900 rounded-tl-none'
                          }`}>
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-[10px] mt-1 opacity-70 ${msg.sender === 'support' ? 'text-right' : 'text-left'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  {selectedItem.status !== 'resolved' && (
                    <div className="space-y-4">
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder="Type your response here..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none h-24 resize-none"
                      />
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleReplyToComplaint(selectedItem._id)}
                          disabled={!replyMessage || loading}
                          className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        >
                          <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                          Send Reply
                        </button>
                        <button
                          onClick={() => handleResolveComplaint(selectedItem._id, replyMessage)}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                        >
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedItem.status === 'resolved' && (
                    <div className="bg-green-50 rounded-xl p-4 flex items-center text-green-700 font-medium">
                      <CheckCircleIcon className="h-6 w-6 mr-2" />
                      This complaint has been resolved.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintFeedbackManagement;
