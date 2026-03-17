import React, { useState, useEffect } from 'react';
import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ArrowsPointingOutIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  QueueListIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  HeartIcon,
  GiftIcon,
  CalendarDaysIcon,
  ClockIcon as ClockOutlineIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PaperAirplaneIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  PhoneIcon as PhoneOutlineIcon
} from '@heroicons/react/24/outline';

const StaffCommunication = () => {
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedMessageType, setSelectedMessageType] = useState('all');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [messageRecords, setMessageRecords] = useState([
    {
      id: 1,
      senderId: 'admin',
      senderName: 'Admin',
      recipientId: 'STF-001',
      recipientName: 'Sarah Johnson',
      subject: 'Monthly Performance Review',
      message: 'Your monthly performance review is scheduled for next week. Please prepare your reports.',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'read',
      priority: 'high',
      messageType: 'notification',
      attachments: []
    },
    {
      id: 2,
      senderId: 'hr',
      senderName: 'HR Department',
      recipientId: 'STF-002',
      recipientName: 'Mike Wilson',
      subject: 'New Safety Protocols',
      message: 'Please review the new safety protocols attached to this message.',
      timestamp: '2024-01-14T14:20:00Z',
      status: 'unread',
      priority: 'medium',
      messageType: 'announcement',
      attachments: ['safety_protocols.pdf']
    },
    {
      id: 3,
      senderId: 'STF-001',
      senderName: 'Sarah Johnson',
      recipientId: 'admin',
      recipientName: 'Admin',
      subject: 'Schedule Change Request',
      message: 'I need to request a schedule change for next Friday due to personal reasons.',
      timestamp: '2024-01-13T16:45:00Z',
      status: 'read',
      priority: 'low',
      messageType: 'request',
      attachments: []
    },
    {
      id: 4,
      senderId: 'manager',
      senderName: 'Manager',
      recipientId: 'STF-003',
      recipientName: 'Emma Davis',
      subject: 'Training Schedule',
      message: 'Your leadership training is scheduled for next month. Details attached.',
      timestamp: '2024-01-12T09:15:00Z',
      status: 'read',
      priority: 'high',
      messageType: 'training',
      attachments: ['training_schedule.pdf']
    }
  ]);

  const staffMembers = [
    { id: 'all', name: 'All Staff' },
    { id: 'admin', name: 'Admin', role: 'Administrator' },
    { id: 'hr', name: 'HR', role: 'Human Resources' },
    { id: 'manager', name: 'Manager', role: 'Manager' },
    { id: 'STF-001', name: 'Sarah Johnson', role: 'Manager' },
    { id: 'STF-002', name: 'Mike Wilson', role: 'Technician' },
    { id: 'STF-003', name: 'Emma Davis', role: 'Supervisor' }
  ];

  const messageTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'notification', name: 'Notifications' },
    { id: 'announcement', name: 'Announcements' },
    { id: 'request', name: 'Requests' },
    { id: 'training', name: 'Training' },
    { id: 'chat', name: 'Chat Messages' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'unread': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'notification': return 'bg-blue-100 text-blue-800';
      case 'announcement': return 'bg-purple-100 text-purple-800';
      case 'request': return 'bg-amber-100 text-amber-800';
      case 'training': return 'bg-green-100 text-green-800';
      case 'chat': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommunicationSummary = () => {
    const unread = messageRecords.filter(m => m.status === 'unread').length;
    const highPriority = messageRecords.filter(m => m.priority === 'high').length;
    const announcements = messageRecords.filter(m => m.messageType === 'announcement').length;
    const total = messageRecords.length;
    const requests = messageRecords.filter(m => m.messageType === 'request').length;
    
    return {
      unread,
      highPriority,
      announcements,
      total,
      requests
    };
  };

  const MessageModal = ({ message, onClose, onSave }) => {
    const [formData, setFormData] = useState(
      message || {
        senderId: 'admin',
        recipientId: '',
        subject: '',
        message: '',
        priority: 'medium',
        messageType: 'notification',
        attachments: []
      }
    );

    const [attachmentInput, setAttachmentInput] = useState('');

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addAttachment = () => {
      if (attachmentInput.trim() && !formData.attachments.includes(attachmentInput.trim())) {
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, attachmentInput.trim()]
        }));
        setAttachmentInput('');
      }
    };

    const removeAttachment = (attachment) => {
      setFormData(prev => ({
        ...prev,
        attachments: prev.attachments.filter(a => a !== attachment)
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const newMessage = {
        ...formData,
        id: message ? message.id : Math.max(...messageRecords.map(m => m.id), 0) + 1,
        timestamp: new Date().toISOString(),
        status: 'unread'
      };
      onSave(newMessage);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {message ? 'Edit Message' : 'Send New Message'}
              </h3>
              <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sender</label>
                <select
                  name="senderId"
                  value={formData.senderId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {staffMembers.filter(s => s.id !== 'all').map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                <select
                  name="recipientId"
                  value={formData.recipientId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Recipient</option>
                  {staffMembers.filter(s => s.id !== 'all' && s.id !== formData.senderId).map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message Type</label>
                <select
                  name="messageType"
                  value={formData.messageType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="notification">Notification</option>
                  <option value="announcement">Announcement</option>
                  <option value="request">Request</option>
                  <option value="training">Training</option>
                  <option value="chat">Chat</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={attachmentInput}
                  onChange={(e) => setAttachmentInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add attachment filename"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttachment())}
                />
                <button
                  type="button"
                  onClick={addAttachment}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.attachments.map((attachment, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {attachment}
                    <button
                      type="button"
                      onClick={() => removeAttachment(attachment)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSaveMessage = (messageData) => {
    if (messageData.id) {
      // Update existing message
      setMessageRecords(messageRecords.map(record => 
        record.id === messageData.id ? messageData : record
      ));
    } else {
      // Create new message
      setMessageRecords([...messageRecords, messageData]);
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (confirm('Are you sure you want to delete this message?')) {
      setMessageRecords(messageRecords.filter(record => record.id !== messageId));
    }
  };

  const handleMarkAsRead = (messageId) => {
    setMessageRecords(messageRecords.map(record => 
      record.id === messageId ? { ...record, status: 'read' } : record
    ));
  };

  const summary = getCommunicationSummary();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Communication Center</h1>
            <p className="text-gray-600">Manage and track staff communications</p>
          </div>
          <button
            onClick={() => {
              setEditingMessage(null);
              setShowMessageModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
            Send Message
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.unread}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <EnvelopeIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.highPriority}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <ExclamationCircleIcon className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Announcements</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.announcements}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MegaphoneIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Requests</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.requests}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <LightBulbIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {staffMembers.map(staff => (
                <option key={staff.id} value={staff.id}>{staff.name}</option>
              ))}
            </select>
            
            <select
              value={selectedMessageType}
              onChange={(e) => setSelectedMessageType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {messageTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Message Records Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Communication Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messageRecords
                .filter(record => 
                  (selectedStaff === 'all' || record.senderId === selectedStaff || record.recipientId === selectedStaff) &&
                  (selectedMessageType === 'all' || record.messageType === selectedMessageType)
                )
                .map((record) => (
                  <tr key={record.id} className={`hover:bg-gray-50 transition-colors ${record.status === 'unread' ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-700 font-semibold text-sm">
                            {record.senderName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{record.senderName}</div>
                          <div className="text-sm text-gray-500">{record.senderId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <span className="text-green-700 font-semibold text-sm">
                            {record.recipientName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{record.recipientName}</div>
                          <div className="text-sm text-gray-500">{record.recipientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{record.subject}</div>
                      <div className="text-sm text-gray-600 truncate max-w-xs">{record.message}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getPriorityColor(record.priority)}`}>
                        {record.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getMessageTypeColor(record.messageType)}`}>
                        {record.messageType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {record.status === 'unread' && (
                          <button
                            onClick={() => handleMarkAsRead(record.id)}
                            className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Mark as Read"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingMessage(record);
                            setShowMessageModal(true);
                          }}
                          className="text-amber-600 hover:text-amber-900 p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(record.id)}
                          className="text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <MessageModal
          message={editingMessage}
          onClose={() => {
            setShowMessageModal(false);
            setEditingMessage(null);
          }}
          onSave={handleSaveMessage}
        />
      )}
    </div>
  );
};

export default StaffCommunication;