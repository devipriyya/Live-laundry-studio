import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  UserIcon, 
  TruckIcon, 
  MapPinIcon,
  PhotoIcon,
  ArrowsUpDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const IncidentManagement = () => {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    type: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Incident type labels
  const incidentTypeLabels = {
    'customer-not-available': 'Customer Not Available',
    'address-incorrect': 'Address Incorrect',
    'clothes-not-ready': 'Clothes Not Ready',
    'unable-to-deliver': 'Unable to Deliver',
    'vehicle-issue': 'Vehicle Issue',
    'weather-issue': 'Weather Issue',
    'other': 'Other Issue'
  };

  // Priority labels and colors
  const priorityLabels = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High',
    'urgent': 'Urgent'
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Status labels and colors
  const statusLabels = {
    'reported': 'Reported',
    'under-review': 'Under Review',
    'resolved': 'Resolved',
    'dismissed': 'Dismissed'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'under-review': return 'bg-blue-100 text-blue-800';
      case 'dismissed': return 'bg-gray-100 text-gray-800';
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Fetch incidents
  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/incidents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncidents(response.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...incidents];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(incident => 
        incident.orderId?.orderNumber?.toLowerCase().includes(term) ||
        incident.deliveryBoyId?.name?.toLowerCase().includes(term) ||
        incident.description?.toLowerCase().includes(term) ||
        incident.type?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(incident => incident.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter(incident => incident.priority === filters.priority);
    }

    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter(incident => incident.type === filters.type);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle nested properties
      if (sortBy === 'orderNumber') {
        aValue = a.orderId?.orderNumber;
        bValue = b.orderId?.orderNumber;
      } else if (sortBy === 'deliveryBoyName') {
        aValue = a.deliveryBoyId?.name;
        bValue = b.deliveryBoyId?.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredIncidents(result);
  }, [incidents, searchTerm, filters, sortBy, sortOrder]);

  // Update incident status
  const updateIncidentStatus = async (incidentId, status, resolutionNotes = '') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_URL}/incidents/${incidentId}`, {
        status,
        resolutionNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setIncidents(prev => prev.map(incident => 
        incident._id === incidentId ? response.data : incident
      ));

      alert('Incident status updated successfully!');
    } catch (error) {
      console.error('Error updating incident:', error);
      alert('Failed to update incident status');
    }
  };

  // Initialize data
  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Incident Management</h1>
        <p className="text-gray-600 mt-1">Manage and track delivery incidents reported by delivery personnel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{incidents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {incidents.filter(i => i.status === 'reported' || i.status === 'under-review').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {incidents.filter(i => i.priority === 'high' || i.priority === 'urgent').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {incidents.filter(i => i.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="reported">Reported</option>
                <option value="under-review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="customer-not-available">Customer Not Available</option>
                <option value="address-incorrect">Address Incorrect</option>
                <option value="clothes-not-ready">Clothes Not Ready</option>
                <option value="unable-to-deliver">Unable to Deliver</option>
                <option value="vehicle-issue">Vehicle Issue</option>
                <option value="weather-issue">Weather Issue</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order & Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery Boy
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reported
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No incidents found
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {incident.orderId?.orderNumber || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {incidentTypeLabels[incident.type] || incident.type}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {incident.deliveryBoyId?.name || 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {incident.deliveryBoyId?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {incident.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(incident.priority)}`}>
                        {priorityLabels[incident.priority] || incident.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(incident.status)}`}>
                        {statusLabels[incident.status] || incident.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(incident.reportedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedIncident(incident);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      {incident.status !== 'resolved' && incident.status !== 'dismissed' && (
                        <>
                          <button
                            onClick={() => updateIncidentStatus(incident._id, 'resolved', 'Manually resolved by admin')}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => updateIncidentStatus(incident._id, 'dismissed', 'Dismissed by admin')}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {showDetailModal && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Incident Details</h2>
                  <p className="text-gray-600">Order #{selectedIncident.orderId?.orderNumber}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Incident Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Incident Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium">{incidentTypeLabels[selectedIncident.type] || selectedIncident.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Priority</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(selectedIncident.priority)}`}>
                        {priorityLabels[selectedIncident.priority] || selectedIncident.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedIncident.status)}`}>
                        {statusLabels[selectedIncident.status] || selectedIncident.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reported At</p>
                      <p className="font-medium">{new Date(selectedIncident.reportedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Boy Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Reported By</h3>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">
                        {selectedIncident.deliveryBoyId?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedIncident.deliveryBoyId?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">{selectedIncident.description}</p>
                  </div>
                </div>

                {/* Location */}
                {selectedIncident.location && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {selectedIncident.location.address || 
                           `${selectedIncident.location.latitude}, ${selectedIncident.location.longitude}`}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photo Evidence */}
                {selectedIncident.photoUrl && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-3">Photo Evidence</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <img 
                        src={selectedIncident.photoUrl} 
                        alt="Incident evidence" 
                        className="max-w-full h-auto rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Resolution */}
                {selectedIncident.status === 'resolved' || selectedIncident.status === 'dismissed' ? (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-3">Resolution</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{selectedIncident.resolutionNotes || 'No resolution notes provided.'}</p>
                      {selectedIncident.resolvedAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          Resolved by {selectedIncident.resolvedBy?.name || 'Admin'} on {new Date(selectedIncident.resolvedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const notes = prompt('Enter resolution notes:');
                          if (notes !== null) {
                            updateIncidentStatus(selectedIncident._id, 'resolved', notes);
                            setShowDetailModal(false);
                          }
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Mark as Resolved
                      </button>
                      <button
                        onClick={() => {
                          const notes = prompt('Enter dismissal notes:');
                          if (notes !== null) {
                            updateIncidentStatus(selectedIncident._id, 'dismissed', notes);
                            setShowDetailModal(false);
                          }
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Dismiss Incident
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncidentManagement;