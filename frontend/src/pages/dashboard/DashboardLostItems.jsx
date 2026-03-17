import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ArrowPathIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import api from '../../api';

const DashboardLostItems = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    orderId: '',
    itemName: '',
    description: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lost-items/my-reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/lost-items', formData);
      setMessage({ type: 'success', text: 'Report submitted successfully!' });
      setFormData({ orderId: '', itemName: '', description: '' });
      setShowForm(false);
      fetchReports();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit report' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Reported': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Item Found': return 'bg-green-100 text-green-800 border-green-200';
      case 'Returned': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Reported': return <ClockIcon className="h-5 w-5" />;
      case 'Under Review': return <MagnifyingGlassIcon className="h-5 w-5" />;
      case 'Item Found': return <CheckCircleIcon className="h-5 w-5" />;
      case 'Returned': return <ArchiveBoxIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ExclamationTriangleIcon className="h-10 w-10 text-orange-500" />
            Lost & Found
          </h1>
          <p className="text-gray-600 mt-2">Report missing items from your orders and track their status.</p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 ${
            showForm 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
          }`}
        >
          {showForm ? (
            <>
              <XMarkIcon className="h-5 w-5" />
              Cancel
            </>
          ) : (
            <>
              <PlusIcon className="h-5 w-5" />
              Report New Item
            </>
          )}
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl border ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'
        } animate-fadeIn`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12 animate-slideDown overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 opacity-20 rounded-bl-full -mr-8 -mt-8"></div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Missing Item Details</h2>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Order ID / Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ORD-123456"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  value={formData.orderId}
                  onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue Cotton Shirt"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  value={formData.itemName}
                  onChange={(e) => setFormData({...formData, itemName: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                required
                rows="4"
                placeholder="Describe the item, its color, size, or any unique identification marks..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Submitting...
                </span>
              ) : 'Submit Report'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">Your Reports</h3>
          <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-500 border border-gray-200">
            {reports.length} Reports
          </span>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <ArrowPathIcon className="h-10 w-10 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading your reports...</p>
          </div>
        ) : reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Report Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date Reported</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">{report.itemName}</div>
                        <div className="text-sm text-gray-500">Order: {report.orderId}</div>
                        <div className="text-xs text-gray-400 mt-1 italic line-clamp-1">{report.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(report.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ArchiveBoxIcon className="h-10 w-10 text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Reports Yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Everything looks good! You haven't reported any lost items yet. 
              If you discover something is missing, use the button above.
            </p>
          </div>
        )}
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
          <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Thorough Search</h4>
          <p className="text-sm text-gray-600 leading-relaxed">Everything we wash is tracked, but if something slips through, we cross-reference our CCTV and logs.</p>
        </div>
        
        <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100">
          <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-green-600">
            <ClockIcon className="h-6 w-6" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Fast Resolution</h4>
          <p className="text-sm text-gray-600 leading-relaxed">Most lost item reports are resolved within 48-72 hours as we audit our facility.</p>
        </div>

        <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
          <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-orange-600">
            <ExclamationTriangleIcon className="h-6 w-6" />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">Insurance Coverage</h4>
          <p className="text-sm text-gray-600 leading-relaxed">In the rare case an item isn't found, you may be eligible for a refund or replacement based on our policy.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLostItems;
