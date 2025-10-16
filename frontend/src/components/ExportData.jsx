import React, { useState } from 'react';
import {
  DocumentArrowDownIcon,
  TableCellsIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  CheckIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const ExportData = ({ data, dataType = 'orders', onExport, className = '' }) => {
  const [showModal, setShowModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportOptions, setExportOptions] = useState({
    includeHeaders: true,
    dateRange: 'all',
    fields: []
  });
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      id: 'csv',
      label: 'CSV',
      description: 'Comma-separated values for spreadsheets',
      icon: TableCellsIcon,
      extension: '.csv'
    },
    {
      id: 'excel',
      label: 'Excel',
      description: 'Microsoft Excel format',
      icon: TableCellsIcon,
      extension: '.xlsx'
    },
    {
      id: 'pdf',
      label: 'PDF',
      description: 'Portable document format',
      icon: DocumentTextIcon,
      extension: '.pdf'
    },
    {
      id: 'json',
      label: 'JSON',
      description: 'JavaScript Object Notation',
      icon: DocumentTextIcon,
      extension: '.json'
    }
  ];

  const fieldOptions = {
    orders: [
      { id: 'id', label: 'Order ID', default: true },
      { id: 'customer', label: 'Customer Name', default: true },
      { id: 'email', label: 'Customer Email', default: true },
      { id: 'phone', label: 'Phone Number', default: false },
      { id: 'service', label: 'Service Type', default: true },
      { id: 'status', label: 'Status', default: true },
      { id: 'amount', label: 'Amount', default: true },
      { id: 'date', label: 'Order Date', default: true },
      { id: 'pickup_date', label: 'Pickup Date', default: false },
      { id: 'delivery_date', label: 'Delivery Date', default: false },
      { id: 'notes', label: 'Notes', default: false }
    ],
    customers: [
      { id: 'id', label: 'Customer ID', default: true },
      { id: 'name', label: 'Full Name', default: true },
      { id: 'email', label: 'Email Address', default: true },
      { id: 'phone', label: 'Phone Number', default: true },
      { id: 'address', label: 'Address', default: false },
      { id: 'registration_date', label: 'Registration Date', default: true },
      { id: 'total_orders', label: 'Total Orders', default: true },
      { id: 'total_spent', label: 'Total Spent', default: true },
      { id: 'status', label: 'Status', default: true },
      { id: 'last_order', label: 'Last Order Date', default: false }
    ],
    staff: [
      { id: 'id', label: 'Employee ID', default: true },
      { id: 'name', label: 'Full Name', default: true },
      { id: 'email', label: 'Email Address', default: true },
      { id: 'phone', label: 'Phone Number', default: false },
      { id: 'role', label: 'Role', default: true },
      { id: 'department', label: 'Department', default: true },
      { id: 'hire_date', label: 'Hire Date', default: true },
      { id: 'salary', label: 'Salary', default: false },
      { id: 'status', label: 'Employment Status', default: true }
    ]
  };

  const currentFields = fieldOptions[dataType] || fieldOptions.orders;

  React.useEffect(() => {
    const defaultFields = currentFields.filter(field => field.default).map(field => field.id);
    setExportOptions(prev => ({ ...prev, fields: defaultFields }));
  }, [dataType]);

  const handleFieldToggle = (fieldId) => {
    setExportOptions(prev => ({
      ...prev,
      fields: prev.fields.includes(fieldId)
        ? prev.fields.filter(id => id !== fieldId)
        : [...prev.fields, fieldId]
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        format: exportFormat,
        options: exportOptions,
        data: data,
        timestamp: new Date().toISOString()
      };

      // Call the onExport callback if provided
      if (onExport) {
        await onExport(exportData);
      } else {
        // Default export behavior - download file
        downloadFile(exportData);
      }

      setShowModal(false);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (exportData) => {
    const format = exportFormats.find(f => f.id === exportFormat);
    const filename = `${dataType}_export_${new Date().toISOString().split('T')[0]}${format.extension}`;
    
    let content = '';
    let mimeType = 'text/plain';

    switch (exportFormat) {
      case 'csv':
        content = generateCSV(exportData);
        mimeType = 'text/csv';
        break;
      case 'json':
        content = JSON.stringify(exportData.data, null, 2);
        mimeType = 'application/json';
        break;
      case 'excel':
        // In a real implementation, you'd use a library like xlsx
        content = generateCSV(exportData);
        mimeType = 'application/vnd.ms-excel';
        break;
      case 'pdf':
        // In a real implementation, you'd use a library like jsPDF
        content = generateTextReport(exportData);
        mimeType = 'application/pdf';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCSV = (exportData) => {
    const headers = exportData.options.fields.map(fieldId => 
      currentFields.find(f => f.id === fieldId)?.label || fieldId
    );
    
    const rows = exportData.data.map(item => 
      exportData.options.fields.map(fieldId => item[fieldId] || '')
    );

    const csvContent = [
      exportData.options.includeHeaders ? headers.join(',') : '',
      ...rows.map(row => row.join(','))
    ].filter(Boolean).join('\n');

    return csvContent;
  };

  const generateTextReport = (exportData) => {
    return `${dataType.toUpperCase()} EXPORT REPORT\n\nGenerated: ${new Date().toLocaleString()}\nTotal Records: ${exportData.data.length}\n\n${JSON.stringify(exportData.data, null, 2)}`;
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${className}`}
      >
        <DocumentArrowDownIcon className="h-4 w-4" />
        <span>Export</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Export {dataType.charAt(0).toUpperCase() + dataType.slice(1)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Export Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Export Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {exportFormats.map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setExportFormat(format.id)}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        exportFormat === format.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <format.icon className="h-6 w-6 text-gray-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{format.label}</p>
                          <p className="text-sm text-gray-500">{format.description}</p>
                        </div>
                        {exportFormat === format.id && (
                          <CheckIcon className="h-5 w-5 text-blue-600 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Export Options
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeHeaders}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        includeHeaders: e.target.checked
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include column headers</span>
                  </label>

                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Date Range</label>
                    <select
                      value={exportOptions.dateRange}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        dateRange: e.target.value
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All time</option>
                      <option value="today">Today</option>
                      <option value="week">This week</option>
                      <option value="month">This month</option>
                      <option value="quarter">This quarter</option>
                      <option value="year">This year</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Field Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Fields to Export
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {currentFields.map((field) => (
                    <label key={field.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportOptions.fields.includes(field.id)}
                        onChange={() => handleFieldToggle(field.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{field.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Export Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Export Summary</p>
                    <ul className="space-y-1">
                      <li>• {data?.length || 0} records will be exported</li>
                      <li>• {exportOptions.fields.length} fields selected</li>
                      <li>• Format: {exportFormats.find(f => f.id === exportFormat)?.label}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isExporting}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || exportOptions.fields.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-4 w-4" />
                    <span>Export Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportData;
