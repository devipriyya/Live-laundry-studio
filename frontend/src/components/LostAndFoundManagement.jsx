import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  MagnifyingGlassIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  UserIcon,
  PencilSquareIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';
import api from '../api';

const LostAndFoundManagement = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Update state
  const [statusUpdate, setStatusUpdate] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api.get('/lost-items');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching lost items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.patch(`/lost-items/${selectedReport._id}`, {
        status: statusUpdate,
        adminNotes: adminNotes
      });
      setIsModalOpen(false);
      fetchReports();
    } catch (error) {
      console.error('Error updating report:', error);
      alert('Failed to update report status');
    } finally {
      setUpdating(false);
    }
  };

  const openEditModal = (report) => {
    setSelectedReport(report);
    setStatusUpdate(report.status);
    setAdminNotes(report.adminNotes || '');
    setIsModalOpen(true);
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Reported': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Under Review': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Item Found': return 'bg-green-50 text-green-700 border-green-200';
      case 'Returned': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const stats = [
    { label: 'Total Reports', value: reports.length, icon: ArchiveBoxIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Issues', value: reports.filter(r => r.status === 'Reported').length, icon: ExclamationTriangleIcon, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Under Review', value: reports.filter(r => r.status === 'Under Review').length, icon: MagnifyingGlassIcon, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { label: 'Resolved', value: reports.filter(r => r.status === 'Returned').length, icon: CheckCircleIcon, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ArchiveBoxIcon className="h-10 w-10 text-indigo-600" />
            Lost & Found Management
          </h1>
          <p className="text-gray-500 mt-1 uppercase tracking-widest text-xs font-bold">Review and track missing item reports</p>
        </div>
        
        <button 
          onClick={fetchReports}
          className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-gray-600 shadow-sm"
        >
          <ArrowPathIcon className={`h-6 w-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group transition-all hover:shadow-md">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User & Order</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Report Date</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-gray-400">
                  <ArrowPathIcon className="h-12 w-12 animate-spin mx-auto mb-4" />
                  Loading reports...
                </td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50/80 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {report.user?.name ? report.user.name[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 line-clamp-1">{report.user?.name || 'Unknown User'}</div>
                        <div className="text-xs text-gray-500 font-mono tracking-tighter">ORD: {report.orderId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="font-bold text-gray-800">{report.itemName}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 italic">{report.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusBg(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 font-medium">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditModal(report)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:shadow-sm"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center">
                  <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ArchiveBoxIcon className="h-10 w-10 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">All Clear!</h3>
                  <p className="text-gray-500">No lost items have been reported recently.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl relative overflow-hidden animate-zoomIn">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Manage Report</h3>
                  <p className="text-gray-500 text-sm font-medium">Update status and add investigation notes</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600"
                >
                  <ExclamationTriangleIcon className="h-6 w-6 rotate-45" />
                </button>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-700">{selectedReport.user?.name} ({selectedReport.user?.phone})</span>
                </div>
                <div className="flex items-center gap-3">
                  <ArchiveBoxIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 font-medium">Item: {selectedReport.itemName}</span>
                </div>
              </div>

              <form onSubmit={handleUpdateStatus} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Resolution Progress</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Reported', 'Under Review', 'Item Found', 'Returned'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatusUpdate(s)}
                        className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                          statusUpdate === s 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' 
                            : 'bg-white text-gray-600 border-gray-100 hover:border-indigo-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <ChatBubbleBottomCenterTextIcon className="h-4 w-4" />
                    Internal Investigation Notes
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-50 bg-gray-50 focus:bg-white focus:border-indigo-500 transition-all outline-none text-sm font-medium resize-none shadow-inner"
                    placeholder="Document CCTV review, staff interviews, etc..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 px-6 rounded-2xl text-gray-600 font-bold hover:bg-gray-50 transition-all border border-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Update Status'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostAndFoundManagement;
