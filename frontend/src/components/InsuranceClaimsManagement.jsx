import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  BanknotesIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const InsuranceClaimsManagement = () => {
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({
    total: 0, submitted: 0, underReview: 0, approved: 0, rejected: 0, compensated: 0,
    totalClaimedAmount: 0, totalApprovedAmount: 0
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: '', approvedAmount: 0, adminNotes: '', rejectionReason: '', compensationMethod: 'refund'
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      const response = await api.get('/insurance/claims', { params });
      setClaims(response.data.claims || []);
      setStats(response.data.stats || stats);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const filteredClaims = claims.filter(claim => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      claim.claimNumber?.toLowerCase().includes(term) ||
      claim.customerInfo?.name?.toLowerCase().includes(term) ||
      claim.customerInfo?.email?.toLowerCase().includes(term) ||
      claim.orderId?.orderNumber?.toLowerCase().includes(term)
    );
  });

  const openReview = (claim) => {
    setSelectedClaim(claim);
    setReviewData({
      status: '',
      approvedAmount: Math.min(claim.totalClaimAmount, claim.coverageAmount),
      adminNotes: '',
      rejectionReason: '',
      compensationMethod: 'refund'
    });
    setShowReviewModal(true);
  };

  const handleReview = async () => {
    if (!reviewData.status) return;
    setActionLoading(true);
    try {
      await api.patch(`/insurance/claims/${selectedClaim._id}/review`, reviewData);
      setShowReviewModal(false);
      setSelectedClaim(null);
      fetchClaims();
    } catch (error) {
      console.error('Error reviewing claim:', error);
      alert(error.response?.data?.message || 'Error reviewing claim');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompensate = async (claimId) => {
    if (!confirm('Process compensation for this claim?')) return;
    setActionLoading(true);
    try {
      await api.patch(`/insurance/claims/${claimId}/compensate`);
      fetchClaims();
    } catch (error) {
      console.error('Error processing compensation:', error);
      alert(error.response?.data?.message || 'Error processing compensation');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'submitted': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'under-review': 'bg-blue-100 text-blue-800 border-blue-200',
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'partially-approved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'compensated': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </span>
    );
  };

  const getDamageTypeBadge = (type) => {
    const colors = {
      'torn': 'bg-red-50 text-red-700', 'discolored': 'bg-orange-50 text-orange-700',
      'shrunk': 'bg-yellow-50 text-yellow-700', 'stained': 'bg-amber-50 text-amber-700',
      'lost': 'bg-gray-100 text-gray-700', 'burned': 'bg-red-100 text-red-800',
      'other': 'bg-slate-50 text-slate-700'
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[type] || 'bg-gray-50'}`}>{type}</span>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheckIcon className="h-7 w-7 text-green-600" />
            Insurance Claims Management
          </h1>
          <p className="text-gray-600 mt-1">Review and manage cloth damage insurance claims</p>
        </div>
        <button onClick={fetchClaims} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><DocumentTextIcon className="h-5 w-5 text-yellow-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-xl font-bold text-gray-900">{stats.submitted + stats.underReview}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><CheckCircleIcon className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg"><BanknotesIcon className="h-5 w-5 text-purple-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Compensated</p>
              <p className="text-xl font-bold text-gray-900">{stats.compensated}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><CurrencyDollarIcon className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-sm text-gray-500">Total Approved</p>
              <p className="text-xl font-bold text-gray-900">${stats.totalApprovedAmount?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by claim #, customer, or order #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="under-review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="partially-approved">Partially Approved</option>
          <option value="rejected">Rejected</option>
          <option value="compensated">Compensated</option>
        </select>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-500">Loading claims...</span>
          </div>
        ) : filteredClaims.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <ShieldCheckIcon className="h-12 w-12 mb-3 text-gray-300" />
            <p className="text-lg font-medium">No insurance claims found</p>
            <p className="text-sm">Claims will appear here when customers submit them</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claim</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClaims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">{claim.claimNumber}</p>
                      <p className="text-xs text-gray-500">{new Date(claim.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{claim.customerInfo?.name}</p>
                      <p className="text-xs text-gray-500">{claim.customerInfo?.email}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-blue-600 font-medium">{claim.orderId?.orderNumber || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${claim.policyType === 'premium' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {claim.policyType === 'premium' ? 'Premium' : 'Basic'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">${claim.totalClaimAmount?.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{claim.damagedItems?.length} item(s)</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-gray-700">${claim.coverageAmount?.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(claim.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openReview(claim)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Review Claim"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {['submitted', 'under-review'].includes(claim.status) && (
                          <>
                            <button
                              onClick={() => { setSelectedClaim(claim); setReviewData({ ...reviewData, status: 'approved', approvedAmount: Math.min(claim.totalClaimAmount, claim.coverageAmount) }); setShowReviewModal(true); }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => { setSelectedClaim(claim); setReviewData({ ...reviewData, status: 'rejected' }); setShowReviewModal(true); }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {['approved', 'partially-approved'].includes(claim.status) && (
                          <button
                            onClick={() => handleCompensate(claim._id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Process Compensation"
                          >
                            <BanknotesIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Review Claim: {selectedClaim.claimNumber}</h2>
                <p className="text-sm text-gray-500">Order: {selectedClaim.orderId?.orderNumber || 'N/A'}</p>
              </div>
              <button onClick={() => { setShowReviewModal(false); setSelectedClaim(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer & Policy Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1"><UserCircleIcon className="h-4 w-4" /> Customer</h4>
                  <p className="font-medium text-gray-900">{selectedClaim.customerInfo?.name}</p>
                  <p className="text-sm text-gray-600">{selectedClaim.customerInfo?.email}</p>
                  <p className="text-sm text-gray-600">{selectedClaim.customerInfo?.phone}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1"><ShieldCheckIcon className="h-4 w-4" /> Insurance</h4>
                  <p className="font-medium text-gray-900 capitalize">{selectedClaim.policyType} Protection</p>
                  <p className="text-sm text-gray-600">Coverage: ${selectedClaim.coverageAmount?.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Claimed: ${selectedClaim.totalClaimAmount?.toFixed(2)}</p>
                </div>
              </div>

              {/* Damaged Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Damaged Items ({selectedClaim.damagedItems?.length})</h4>
                <div className="space-y-3">
                  {selectedClaim.damagedItems?.map((item, idx) => (
                    <div key={idx} className="bg-red-50 border border-red-100 rounded-xl p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.itemName}</p>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          <div className="mt-2">{getDamageTypeBadge(item.damageType)}</div>
                        </div>
                        <p className="font-semibold text-red-700">${item.estimatedValue?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Review Form */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Admin Decision</h4>

                {/* Status Selection */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { value: 'approved', label: 'Approve', color: 'green', icon: CheckCircleIcon },
                    { value: 'partially-approved', label: 'Partial Approve', color: 'emerald', icon: CheckCircleIcon },
                    { value: 'rejected', label: 'Reject', color: 'red', icon: XCircleIcon }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setReviewData(prev => ({ ...prev, status: opt.value }))}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${reviewData.status === opt.value
                        ? `border-${opt.color}-500 bg-${opt.color}-50 text-${opt.color}-700`
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <opt.icon className="h-5 w-5 mx-auto mb-1" />
                      <p className="text-sm font-medium">{opt.label}</p>
                    </button>
                  ))}
                </div>

                {/* Approved Amount */}
                {reviewData.status && reviewData.status !== 'rejected' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approved Amount ($)</label>
                    <input
                      type="number"
                      min="0"
                      max={selectedClaim.coverageAmount}
                      value={reviewData.approvedAmount}
                      onChange={(e) => setReviewData(prev => ({ ...prev, approvedAmount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Max coverage: ${selectedClaim.coverageAmount?.toFixed(2)} | Claimed: ${selectedClaim.totalClaimAmount?.toFixed(2)}</p>
                  </div>
                )}

                {/* Compensation Method */}
                {reviewData.status && reviewData.status !== 'rejected' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compensation Method</label>
                    <select
                      value={reviewData.compensationMethod}
                      onChange={(e) => setReviewData(prev => ({ ...prev, compensationMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="refund">Refund to Payment Method</option>
                      <option value="credit">Store Credit</option>
                      <option value="replacement">Item Replacement</option>
                    </select>
                  </div>
                )}

                {/* Rejection Reason */}
                {reviewData.status === 'rejected' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                    <textarea
                      value={reviewData.rejectionReason}
                      onChange={(e) => setReviewData(prev => ({ ...prev, rejectionReason: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      rows="3"
                      placeholder="Explain why the claim is being rejected..."
                    />
                  </div>
                )}

                {/* Admin Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                  <textarea
                    value={reviewData.adminNotes}
                    onChange={(e) => setReviewData(prev => ({ ...prev, adminNotes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    rows="2"
                    placeholder="Internal notes about this claim..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReview}
                    disabled={!reviewData.status || actionLoading}
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    {actionLoading ? 'Processing...' : 'Submit Review'}
                  </button>
                  <button
                    onClick={() => { setShowReviewModal(false); setSelectedClaim(null); }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Claim History */}
              {selectedClaim.history?.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Claim History</h4>
                  <div className="space-y-2">
                    {selectedClaim.history.map((entry, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="text-gray-900">{entry.action}</p>
                          {entry.note && <p className="text-gray-500">{entry.note}</p>}
                          <p className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsuranceClaimsManagement;
