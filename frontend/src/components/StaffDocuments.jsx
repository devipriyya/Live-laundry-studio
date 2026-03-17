import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  UserGroupIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DownloadIcon,
  UploadIcon,
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
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const StaffDocuments = () => {
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [documentRecords, setDocumentRecords] = useState([
    {
      id: 1,
      staffId: 'STF-001',
      staffName: 'Sarah Johnson',
      documentType: 'ID Proof',
      fileName: 'sarah_johnson_id.pdf',
      fileSize: '2.5 MB',
      uploadDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'valid',
      category: 'identity',
      description: 'Driver\'s License',
      uploadedBy: 'Admin'
    },
    {
      id: 2,
      staffId: 'STF-001',
      staffName: 'Sarah Johnson',
      documentType: 'Certificate',
      fileName: 'sarah_certification.pdf',
      fileSize: '1.8 MB',
      uploadDate: '2024-01-10',
      expiryDate: '2026-01-10',
      status: 'valid',
      category: 'qualification',
      description: 'Advanced Customer Service Certification',
      uploadedBy: 'HR'
    },
    {
      id: 3,
      staffId: 'STF-002',
      staffName: 'Mike Wilson',
      documentType: 'Medical Certificate',
      fileName: 'mike_medical.pdf',
      fileSize: '1.2 MB',
      uploadDate: '2024-01-12',
      expiryDate: '2024-07-12',
      status: 'expiring',
      category: 'health',
      description: 'Annual Health Check-up',
      uploadedBy: 'Medical Officer'
    },
    {
      id: 4,
      staffId: 'STF-003',
      staffName: 'Emma Davis',
      documentType: 'Contract',
      fileName: 'emma_contract.pdf',
      fileSize: '3.1 MB',
      uploadDate: '2024-01-05',
      expiryDate: null,
      status: 'valid',
      category: 'employment',
      description: 'Employment Contract',
      uploadedBy: 'Legal'
    }
  ]);

  const staffMembers = [
    { id: 'all', name: 'All Staff' },
    { id: 'STF-001', name: 'Sarah Johnson', role: 'Manager' },
    { id: 'STF-002', name: 'Mike Wilson', role: 'Technician' },
    { id: 'STF-003', name: 'Emma Davis', role: 'Supervisor' }
  ];

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'identity', name: 'Identity' },
    { id: 'qualification', name: 'Qualification' },
    { id: 'health', name: 'Health' },
    { id: 'employment', name: 'Employment' },
    { id: 'insurance', name: 'Insurance' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'expiring': return 'bg-amber-100 text-amber-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentSummary = () => {
    const valid = documentRecords.filter(d => d.status === 'valid').length;
    const expiring = documentRecords.filter(d => d.status === 'expiring').length;
    const expired = documentRecords.filter(d => d.status === 'expired').length;
    const total = documentRecords.length;
    const upcomingExpirations = documentRecords.filter(d => 
      d.expiryDate && 
      new Date(d.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ).length;
    
    return {
      valid,
      expiring,
      expired,
      total,
      upcomingExpirations
    };
  };

  const DocumentModal = ({ document, onClose, onSave }) => {
    const [formData, setFormData] = useState(
      document || {
        staffId: '',
        documentType: '',
        fileName: '',
        fileSize: '',
        uploadDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        status: 'valid',
        category: 'identity',
        description: '',
        uploadedBy: 'Admin'
      }
    );

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {document ? 'Edit Document Record' : 'Add New Document Record'}
              </h3>
              <button onClick={onClose} className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff Member</label>
                <select
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Staff</option>
                  {staffMembers.filter(s => s.id !== 'all').map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <input
                  type="text"
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Name</label>
                <input
                  type="text"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
                <input
                  type="text"
                  name="fileSize"
                  value={formData.fileSize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2.5 MB"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Date</label>
                <input
                  type="date"
                  name="uploadDate"
                  value={formData.uploadDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="identity">Identity</option>
                  <option value="qualification">Qualification</option>
                  <option value="health">Health</option>
                  <option value="employment">Employment</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="valid">Valid</option>
                  <option value="expiring">Expiring Soon</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Uploaded By</label>
                <input
                  type="text"
                  name="uploadedBy"
                  value={formData.uploadedBy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {document ? 'Update' : 'Create'} Document
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSaveDocument = (documentData) => {
    if (documentData.id) {
      // Update existing record
      setDocumentRecords(documentRecords.map(record => 
        record.id === documentData.id ? documentData : record
      ));
    } else {
      // Create new record
      const newRecord = {
        ...documentData,
        id: Math.max(...documentRecords.map(r => r.id), 0) + 1
      };
      setDocumentRecords([...documentRecords, newRecord]);
    }
  };

  const handleDeleteDocument = (documentId) => {
    if (confirm('Are you sure you want to delete this document record?')) {
      setDocumentRecords(documentRecords.filter(record => record.id !== documentId));
    }
  };

  const handleDownload = (fileName) => {
    alert(`Downloading: ${fileName}`);
    // In a real app, this would trigger actual file download
  };

  const summary = getDocumentSummary();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Documents Management</h1>
            <p className="text-gray-600">Manage and track staff documents and files</p>
          </div>
          <button
            onClick={() => {
              setEditingDocument(null);
              setShowDocumentModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Add Document
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <DocumentTextIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Valid</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.valid}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.expiring}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <ExclamationCircleIcon className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expired</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.expired}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.upcomingExpirations}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-purple-600" />
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
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document Records Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Document Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documentRecords
                .filter(record => 
                  (selectedStaff === 'all' || record.staffId === selectedStaff) &&
                  (selectedCategory === 'all' || record.category === selectedCategory)
                )
                .map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <span className="text-blue-700 font-semibold text-sm">
                            {record.staffName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{record.staffName}</div>
                          <div className="text-sm text-gray-500">{record.staffRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{record.fileName}</div>
                      <div className="text-sm text-gray-500">{record.description}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.documentType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(record.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.expiryDate ? new Date(record.expiryDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.fileSize}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(record.fileName)}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Download"
                        >
                          <DocumentArrowDownIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingDocument(record);
                            setShowDocumentModal(true);
                          }}
                          className="text-amber-600 hover:text-amber-900 p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(record.id)}
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

      {/* Document Modal */}
      {showDocumentModal && (
        <DocumentModal
          document={editingDocument}
          onClose={() => {
            setShowDocumentModal(false);
            setEditingDocument(null);
          }}
          onSave={handleSaveDocument}
        />
      )}
    </div>
  );
};

export default StaffDocuments;
