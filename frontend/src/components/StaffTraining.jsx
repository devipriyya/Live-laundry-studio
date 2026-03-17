import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  ChartBarIcon,
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
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const StaffTraining = () => {
  const [selectedStaff, setSelectedStaff] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [editingTraining, setEditingTraining] = useState(null);
  const [trainingRecords, setTrainingRecords] = useState([
    {
      id: 1,
      staffId: 'STF-001',
      staffName: 'Sarah Johnson',
      courseId: 'TRN-001',
      courseName: 'Advanced Customer Service',
      instructor: 'John Smith',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      duration: 40,
      status: 'completed',
      score: 95,
      certificateIssued: true,
      certificateDate: '2024-01-21',
      materials: ['Handbook', 'Video Tutorials'],
      prerequisites: ['Basic Customer Service']
    },
    {
      id: 2,
      staffId: 'STF-002',
      staffName: 'Mike Wilson',
      courseId: 'TRN-002',
      courseName: 'Equipment Safety Training',
      instructor: 'Jane Doe',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      duration: 24,
      status: 'in-progress',
      score: 85,
      certificateIssued: false,
      certificateDate: null,
      materials: ['Safety Manual', 'Videos'],
      prerequisites: ['Basic Safety Training']
    },
    {
      id: 3,
      staffId: 'STF-003',
      staffName: 'Emma Davis',
      courseId: 'TRN-003',
      courseName: 'Leadership Development',
      instructor: 'Robert Brown',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      duration: 60,
      status: 'scheduled',
      score: null,
      certificateIssued: false,
      certificateDate: null,
      materials: ['Workbook', 'Case Studies'],
      prerequisites: ['Management Experience']
    }
  ]);

  const courses = [
    { id: 'TRN-001', name: 'Advanced Customer Service', category: 'Customer Service', duration: 40 },
    { id: 'TRN-002', name: 'Equipment Safety Training', category: 'Safety', duration: 24 },
    { id: 'TRN-003', name: 'Leadership Development', category: 'Management', duration: 60 },
    { id: 'TRN-004', name: 'Quality Assurance', category: 'Quality', duration: 32 },
    { id: 'TRN-005', name: 'Digital Marketing', category: 'Marketing', duration: 48 }
  ];

  const staffMembers = [
    { id: 'all', name: 'All Staff' },
    { id: 'STF-001', name: 'Sarah Johnson', role: 'Manager' },
    { id: 'STF-002', name: 'Mike Wilson', role: 'Technician' },
    { id: 'STF-003', name: 'Emma Davis', role: 'Supervisor' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-amber-100 text-amber-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrainingSummary = () => {
    const completed = trainingRecords.filter(r => r.status === 'completed').length;
    const inProgress = trainingRecords.filter(r => r.status === 'in-progress').length;
    const scheduled = trainingRecords.filter(r => r.status === 'scheduled').length;
    const failed = trainingRecords.filter(r => r.status === 'failed').length;
    const total = trainingRecords.length;
    const avgScore = trainingRecords.reduce((sum, r) => sum + (r.score || 0), 0) / (completed || 1);
    
    return {
      completed,
      inProgress,
      scheduled,
      failed,
      total,
      avgScore: avgScore.toFixed(1)
    };
  };

  const TrainingModal = ({ training, onClose, onSave }) => {
    const [formData, setFormData] = useState(
      training || {
        staffId: '',
        courseId: '',
        instructor: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        duration: 0,
        status: 'scheduled',
        score: null,
        certificateIssued: false,
        certificateDate: '',
        materials: [],
        prerequisites: []
      }
    );

    const [materialInput, setMaterialInput] = useState('');
    const [prerequisiteInput, setPrerequisiteInput] = useState('');

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    };

    const addMaterial = () => {
      if (materialInput.trim() && !formData.materials.includes(materialInput.trim())) {
        setFormData(prev => ({
          ...prev,
          materials: [...prev.materials, materialInput.trim()]
        }));
        setMaterialInput('');
      }
    };

    const removeMaterial = (material) => {
      setFormData(prev => ({
        ...prev,
        materials: prev.materials.filter(m => m !== material)
      }));
    };

    const addPrerequisite = () => {
      if (prerequisiteInput.trim() && !formData.prerequisites.includes(prerequisiteInput.trim())) {
        setFormData(prev => ({
          ...prev,
          prerequisites: [...prev.prerequisites, prerequisiteInput.trim()]
        }));
        setPrerequisiteInput('');
      }
    };

    const removePrerequisite = (prereq) => {
      setFormData(prev => ({
        ...prev,
        prerequisites: prev.prerequisites.filter(p => p !== prereq)
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {training ? 'Edit Training Record' : 'Add New Training Record'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                <input
                  type="text"
                  name="instructor"
                  value={formData.instructor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score</label>
                <input
                  type="number"
                  name="score"
                  value={formData.score || ''}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="certificateIssued"
                  checked={formData.certificateIssued}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">Certificate Issued</label>
              </div>
              
              {formData.certificateIssued && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Date</label>
                  <input
                    type="date"
                    name="certificateDate"
                    value={formData.certificateDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Materials</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={materialInput}
                  onChange={(e) => setMaterialInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add material"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                />
                <button
                  type="button"
                  onClick={addMaterial}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.materials.map((material, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {material}
                    <button
                      type="button"
                      onClick={() => removeMaterial(material)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={prerequisiteInput}
                  onChange={(e) => setPrerequisiteInput(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add prerequisite"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                />
                <button
                  type="button"
                  onClick={addPrerequisite}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.prerequisites.map((prereq, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs"
                  >
                    {prereq}
                    <button
                      type="button"
                      onClick={() => removePrerequisite(prereq)}
                      className="text-amber-600 hover:text-amber-800"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {training ? 'Update' : 'Create'} Training
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const handleSaveTraining = (trainingData) => {
    if (trainingData.id) {
      // Update existing record
      setTrainingRecords(trainingRecords.map(record => 
        record.id === trainingData.id ? trainingData : record
      ));
    } else {
      // Create new record
      const newRecord = {
        ...trainingData,
        id: Math.max(...trainingRecords.map(r => r.id), 0) + 1
      };
      setTrainingRecords([...trainingRecords, newRecord]);
    }
  };

  const handleDeleteTraining = (trainingId) => {
    if (confirm('Are you sure you want to delete this training record?')) {
      setTrainingRecords(trainingRecords.filter(record => record.id !== trainingId));
    }
  };

  const summary = getTrainingSummary();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Training Management</h1>
            <p className="text-gray-600">Track and manage staff development programs</p>
          </div>
          <button
            onClick={() => {
              setEditingTraining(null);
              setShowTrainingModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <PlusIcon className="w-5 h-5" />
            Add Training
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trainings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.completed}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.inProgress}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <ArrowPathIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.scheduled}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <CalendarDaysIcon className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{summary.avgScore}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="scheduled">Scheduled</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Training Records Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Training Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trainingRecords
                .filter(record => 
                  (selectedStaff === 'all' || record.staffId === selectedStaff) &&
                  (selectedStatus === 'all' || record.status === selectedStatus)
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
                      <div className="font-medium text-gray-900">{record.courseName}</div>
                      <div className="text-sm text-gray-500">{record.courseId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(record.startDate).toLocaleDateString()} - {new Date(record.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.duration} hours
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.instructor}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {record.score ? `${record.score}%` : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingTraining(record);
                            setShowTrainingModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTraining(record.id)}
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

      {/* Training Modal */}
      {showTrainingModal && (
        <TrainingModal
          training={editingTraining}
          onClose={() => {
            setShowTrainingModal(false);
            setEditingTraining(null);
          }}
          onSave={handleSaveTraining}
        />
      )}
    </div>
  );
};

export default StaffTraining;
