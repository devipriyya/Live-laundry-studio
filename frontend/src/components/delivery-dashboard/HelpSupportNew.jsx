import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  TicketIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  TruckIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  UserIcon,
  ShieldExclamationIcon,
  WrenchScrewdriverIcon,
  InformationCircleIcon,
  BookOpenIcon,
  ChevronRightIcon,
  StarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid, StarIcon as StarSolid } from '@heroicons/react/24/solid';

const HelpSupportNew = () => {
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
  
  // State
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('help'); // help, tickets, new-ticket
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Tickets state
  const [tickets, setTickets] = useState([]);
  const [ticketStats, setTicketStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 });
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketFilter, setTicketFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  
  // Selected ticket for viewing
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetailLoading, setTicketDetailLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // New ticket form
  const [newTicketForm, setNewTicketForm] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium'
  });
  const [submittingTicket, setSubmittingTicket] = useState(false);
  
  // Close ticket modal
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closeRating, setCloseRating] = useState(5);
  const [closeFeedback, setCloseFeedback] = useState('');
  
  // FAQs
  const [faqs, setFaqs] = useState([]);
  
  // Alerts
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Get auth headers
  const getToken = () => localStorage.getItem('token');
  const authHeaders = { headers: { Authorization: `Bearer ${getToken()}` }};

  // Ticket categories
  const categories = [
    { id: 'order-issue', label: 'Order Issue', icon: TruckIcon, color: 'blue' },
    { id: 'payment-issue', label: 'Payment Issue', icon: CurrencyRupeeIcon, color: 'green' },
    { id: 'delivery-issue', label: 'Delivery Issue', icon: TruckIcon, color: 'orange' },
    { id: 'earnings-issue', label: 'Earnings Issue', icon: CurrencyRupeeIcon, color: 'emerald' },
    { id: 'schedule-issue', label: 'Schedule Issue', icon: CalendarIcon, color: 'purple' },
    { id: 'customer-complaint', label: 'Customer Complaint', icon: UserIcon, color: 'red' },
    { id: 'vehicle-issue', label: 'Vehicle Issue', icon: WrenchScrewdriverIcon, color: 'gray' },
    { id: 'safety-concern', label: 'Safety Concern', icon: ShieldExclamationIcon, color: 'red' },
    { id: 'app-bug', label: 'App Bug', icon: WrenchScrewdriverIcon, color: 'amber' },
    { id: 'account-issue', label: 'Account Issue', icon: UserIcon, color: 'indigo' },
    { id: 'general-inquiry', label: 'General Inquiry', icon: QuestionMarkCircleIcon, color: 'cyan' },
    { id: 'other', label: 'Other', icon: DocumentTextIcon, color: 'gray' }
  ];

  // FAQ categories
  const faqCategories = [
    { id: 'all', label: 'All' },
    { id: 'orders', label: 'Orders' },
    { id: 'earnings', label: 'Earnings' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'account', label: 'Account' },
    { id: 'issues', label: 'Issues' }
  ];

  // Load initial data
  useEffect(() => {
    fetchFaqs();
    fetchTicketStats();
  }, []);

  // Load tickets when tab changes
  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets();
    }
  }, [activeTab, ticketFilter, pagination.page]);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${API_URL}/delivery-boy/support/faqs`, authHeaders);
      if (response.data.success) {
        setFaqs(response.data.faqs);
      }
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      // Use default FAQs if API fails
      setFaqs(getDefaultFaqs());
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/delivery-boy/support/tickets/stats`, authHeaders);
      if (response.data.success) {
        setTicketStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching ticket stats:', err);
    }
  };

  const fetchTickets = async () => {
    try {
      setTicketsLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      if (ticketFilter !== 'all') {
        params.status = ticketFilter;
      }
      
      const response = await axios.get(`${API_URL}/delivery-boy/support/tickets`, { ...authHeaders, params });
      if (response.data.success) {
        setTickets(response.data.tickets);
        setPagination(prev => ({ ...prev, ...response.data.pagination }));
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Failed to load tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      setTicketDetailLoading(true);
      const response = await axios.get(`${API_URL}/delivery-boy/support/tickets/${ticketId}`, authHeaders);
      if (response.data.success) {
        setSelectedTicket(response.data.ticket);
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError('Failed to load ticket details');
    } finally {
      setTicketDetailLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    if (!newTicketForm.category || !newTicketForm.subject || !newTicketForm.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmittingTicket(true);
      const response = await axios.post(`${API_URL}/delivery-boy/support/tickets`, newTicketForm, authHeaders);
      
      if (response.data.success) {
        setSuccess('Ticket created successfully! Our team will respond soon.');
        setNewTicketForm({ category: '', subject: '', description: '', priority: 'medium' });
        setActiveTab('tickets');
        fetchTickets();
        fetchTicketStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmittingTicket(false);
      setTimeout(() => { setSuccess(null); setError(null); }, 5000);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    
    try {
      setSendingMessage(true);
      const response = await axios.post(
        `${API_URL}/delivery-boy/support/tickets/${selectedTicket._id}/messages`,
        { message: newMessage },
        authHeaders
      );
      
      if (response.data.success) {
        setSelectedTicket(response.data.ticket);
        setNewMessage('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
      setTimeout(() => setError(null), 5000);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      const response = await axios.post(
        `${API_URL}/delivery-boy/support/tickets/${selectedTicket._id}/close`,
        { rating: closeRating, feedback: closeFeedback },
        authHeaders
      );
      
      if (response.data.success) {
        setSuccess('Ticket closed successfully');
        setShowCloseModal(false);
        setSelectedTicket(null);
        fetchTickets();
        fetchTicketStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close ticket');
    }
    setTimeout(() => { setSuccess(null); setError(null); }, 5000);
  };

  const handleReopenTicket = async () => {
    if (!selectedTicket) return;
    
    try {
      const response = await axios.post(
        `${API_URL}/delivery-boy/support/tickets/${selectedTicket._id}/reopen`,
        {},
        authHeaders
      );
      
      if (response.data.success) {
        setSuccess('Ticket reopened successfully');
        setSelectedTicket(response.data.ticket);
        fetchTickets();
        fetchTicketStats();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reopen ticket');
    }
    setTimeout(() => { setSuccess(null); setError(null); }, 5000);
  };

  const getDefaultFaqs = () => [
    { id: 1, category: 'orders', question: 'How do I update order status?', answer: 'Navigate to My Orders, select the order, and click the status button.' },
    { id: 2, category: 'earnings', question: 'When do I receive my earnings?', answer: 'Earnings are transferred within 2-3 business days.' },
    { id: 3, category: 'schedule', question: 'How do I set my availability?', answer: 'Go to Shift Management and set your working hours.' }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'waiting-response': return 'bg-purple-100 text-purple-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-yellow-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading help center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 pb-8">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        
        {/* Alerts */}
        {(error || success) && (
          <div className="fixed top-4 right-4 z-50 max-w-sm">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 shadow-lg">
                <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm flex-1">{error}</p>
                <button onClick={() => setError(null)}><XMarkIcon className="w-5 h-5 text-red-500" /></button>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 shadow-lg">
                <CheckCircleSolid className="w-5 h-5 text-green-600" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <QuestionMarkCircleIcon className="w-8 h-8" />
                Help & Support
              </h1>
              <p className="mt-1 text-yellow-100">Get help, find answers, or contact our support team</p>
            </div>
            <div className="flex gap-2">
              <a href="tel:+918001234567" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                <PhoneIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Call Support</span>
              </a>
              <button 
                onClick={() => setActiveTab('new-ticket')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-yellow-600 hover:bg-yellow-50 rounded-lg font-medium transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                New Ticket
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TicketIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ticketStats.total}</p>
                <p className="text-xs text-gray-500">Total Tickets</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ticketStats.open + ticketStats.inProgress}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{ticketStats.resolved}</p>
                <p className="text-xs text-gray-500">Resolved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-xs text-gray-500">Support</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'help', label: 'Help Center', icon: BookOpenIcon },
              { id: 'tickets', label: 'My Tickets', icon: TicketIcon, badge: ticketStats.open + ticketStats.inProgress },
              { id: 'new-ticket', label: 'New Ticket', icon: PlusIcon }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedTicket(null); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-yellow-600 border-b-2 border-yellow-500 bg-yellow-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-yellow-500 text-white rounded-full">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* Help Center Tab */}
          {activeTab === 'help' && (
            <div className="p-6 space-y-6">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                />
              </div>

              {/* FAQ Categories */}
              <div className="flex flex-wrap gap-2">
                {faqCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* FAQs */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <QuestionMarkCircleIcon className="w-5 h-5 text-yellow-600" />
                  Frequently Asked Questions
                </h3>
                
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <InformationCircleIcon className="w-12 h-12 mx-auto text-gray-300" />
                    <p className="mt-2">No FAQs found matching your search</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredFaqs.map((faq) => (
                      <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                          {expandedFaq === faq.id ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFaq === faq.id && (
                          <div className="px-4 pb-4 text-gray-600 bg-gray-50 border-t border-gray-200">
                            <p className="pt-3">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <a href="tel:+918001234567" className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200">
                    <PhoneIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone Support</h4>
                    <p className="text-sm text-gray-500">+91 800-123-4567</p>
                    <p className="text-xs text-green-600">Available 24/7</p>
                  </div>
                </a>
                
                <a href="mailto:support@fabrico.com" className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                    <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email Support</h4>
                    <p className="text-sm text-gray-500">support@fabrico.com</p>
                    <p className="text-xs text-blue-600">Response within 24h</p>
                  </div>
                </a>
                
                <button 
                  onClick={() => setActiveTab('new-ticket')}
                  className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors group text-left"
                >
                  <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200">
                    <TicketIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Submit Ticket</h4>
                    <p className="text-sm text-gray-500">Create support request</p>
                    <p className="text-xs text-yellow-600">Track your issue</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && !selectedTicket && (
            <div className="p-6 space-y-4">
              {/* Filter */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'open', label: 'Open' },
                    { id: 'in-progress', label: 'In Progress' },
                    { id: 'resolved', label: 'Resolved' }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => { setTicketFilter(filter.id); setPagination(prev => ({ ...prev, page: 1 })); }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                        ticketFilter === filter.id
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <button onClick={fetchTickets} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ArrowPathIcon className={`w-5 h-5 text-gray-500 ${ticketsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Tickets List */}
              {ticketsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <ArrowPathIcon className="w-8 h-8 animate-spin text-yellow-500" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <TicketIcon className="w-16 h-16 mx-auto text-gray-300" />
                  <h3 className="mt-4 font-medium text-gray-900">No tickets found</h3>
                  <p className="text-sm text-gray-500 mt-1">Create a new ticket if you need help</p>
                  <button
                    onClick={() => setActiveTab('new-ticket')}
                    className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    Create Ticket
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map(ticket => (
                    <div
                      key={ticket._id}
                      onClick={() => fetchTicketDetails(ticket._id)}
                      className="p-4 border border-gray-200 rounded-xl hover:border-yellow-300 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono text-gray-500">{ticket.ticketId}</span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(ticket.status)}`}>
                              {ticket.status.replace('-', ' ')}
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 truncate">{ticket.subject}</h4>
                          <p className="text-sm text-gray-500 truncate mt-1">{ticket.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500">{formatDate(ticket.createdAt)}</p>
                          <ChevronRightIcon className="w-5 h-5 text-gray-400 mt-2 ml-auto" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.pages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-1 bg-gray-100 rounded-lg disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Ticket Detail View */}
          {activeTab === 'tickets' && selectedTicket && (
            <div className="p-6">
              {ticketDetailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <ArrowPathIcon className="w-8 h-8 animate-spin text-yellow-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Back button & header */}
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => setSelectedTicket(null)}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                      <ChevronDownIcon className="w-5 h-5 rotate-90" />
                      Back to tickets
                    </button>
                    <div className="flex gap-2">
                      {(selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') ? (
                        <button
                          onClick={handleReopenTicket}
                          className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm hover:bg-yellow-200"
                        >
                          Reopen Ticket
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowCloseModal(true)}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                        >
                          Close Ticket
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Ticket info */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <p className="text-xs font-mono text-gray-500">{selectedTicket.ticketId}</p>
                        <h3 className="font-semibold text-gray-900 text-lg">{selectedTicket.subject}</h3>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedTicket.status)}`}>
                          {selectedTicket.status.replace('-', ' ')}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                          {selectedTicket.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{selectedTicket.description}</p>
                    <p className="text-xs text-gray-500 mt-2">Created: {formatDate(selectedTicket.createdAt)}</p>
                  </div>

                  {/* Messages */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">Conversation</h4>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                      {selectedTicket.messages?.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-xl ${
                            msg.sender === 'user' 
                              ? 'bg-yellow-500 text-white' 
                              : msg.sender === 'system'
                              ? 'bg-gray-100 text-gray-600 text-sm italic'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            {msg.sender === 'support' && (
                              <p className="text-xs font-medium text-gray-500 mb-1">{msg.senderName || 'Support Team'}</p>
                            )}
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-yellow-100' : 'text-gray-500'}`}>
                              {formatDate(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Reply input */}
                    {selectedTicket.status !== 'closed' && (
                      <div className="p-3 border-t border-gray-200 flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendingMessage}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
                        >
                          {sendingMessage ? (
                            <ArrowPathIcon className="w-5 h-5 animate-spin" />
                          ) : (
                            <PaperAirplaneIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* New Ticket Tab */}
          {activeTab === 'new-ticket' && (
            <form onSubmit={handleCreateTicket} className="p-6 space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setNewTicketForm(prev => ({ ...prev, category: cat.id }))}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          newTicketForm.category === cat.id
                            ? 'border-yellow-500 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1 ${newTicketForm.category === cat.id ? 'text-yellow-600' : 'text-gray-500'}`} />
                        <p className="text-xs font-medium text-gray-700">{cat.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input
                  type="text"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief summary of your issue"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={newTicketForm.description}
                  onChange={(e) => setNewTicketForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Provide detailed information about your issue..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 resize-none"
                  required
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <div className="flex gap-3">
                  {['low', 'medium', 'high', 'urgent'].map(priority => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setNewTicketForm(prev => ({ ...prev, priority }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        newTicketForm.priority === priority
                          ? getPriorityColor(priority)
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('help')}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingTicket || !newTicketForm.category || !newTicketForm.subject || !newTicketForm.description}
                  className="flex-1 px-4 py-3 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submittingTicket ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      Create Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Close Ticket Modal */}
        {showCloseModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Close Ticket</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rate your experience</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setCloseRating(star)}
                          className="p-1"
                        >
                          {star <= closeRating ? (
                            <StarSolid className="w-8 h-8 text-yellow-500" />
                          ) : (
                            <StarIcon className="w-8 h-8 text-gray-300" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Feedback (optional)</label>
                    <textarea
                      value={closeFeedback}
                      onChange={(e) => setCloseFeedback(e.target.value)}
                      placeholder="Share your feedback..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 resize-none"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowCloseModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCloseTicket}
                    className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600"
                  >
                    Close Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpSupportNew;
