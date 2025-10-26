import React, { useState, useEffect } from 'react';
import api from '../api';
import {
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  PencilIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      businessName: 'WashLab Laundry',
      businessEmail: 'admin@washlab.com',
      businessPhone: '+1 555-0100',
      businessAddress: '123 Business St, City, State 12345',
      timezone: 'America/New_York',
      currency: 'INR',
      language: 'en'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderUpdates: true,
      paymentAlerts: true,
      lowStockAlerts: true,
      customerMessages: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: true,
      bankTransferEnabled: false,
      cashOnDelivery: true,
      processingFee: 2.9,
      minimumAmount: 10.00
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch settings from backend on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/auth/settings');
        console.log('API Response:', response.data);
        
        // Extract only the fields we need from the response
        const apiSettings = response.data;
        
        // Merge the fetched settings with the default settings to ensure all fields are present
        setSettings(prev => {
          const newSettings = {
            general: {
              ...prev.general,
              businessName: apiSettings.businessName || prev.general.businessName,
              businessEmail: apiSettings.businessEmail || prev.general.businessEmail,
              businessPhone: apiSettings.businessPhone || prev.general.businessPhone,
              businessAddress: apiSettings.businessAddress || prev.general.businessAddress,
              timezone: apiSettings.timezone || prev.general.timezone,
              currency: apiSettings.currency || prev.general.currency,
              language: apiSettings.language || prev.general.language
            },
            notifications: {
              ...prev.notifications,
              ...apiSettings.notifications
            },
            security: {
              ...prev.security,
              ...apiSettings.security
            },
            payment: {
              ...prev.payment,
              ...apiSettings.payment
            }
          };
          console.log('Merged Settings:', newSettings);
          return newSettings;
        });
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'payment', name: 'Payment', icon: CreditCardIcon }
  ];

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    // Validate business information
    if (activeTab === 'general') {
      if (!settings.general.businessName || !settings.general.businessName.trim()) {
        errors.businessName = 'Business name is required';
      }
      
      if (!settings.general.businessEmail || !settings.general.businessEmail.trim()) {
        errors.businessEmail = 'Business email is required';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(settings.general.businessEmail)) {
          errors.businessEmail = 'Invalid email format';
        }
      }
      
      if (!settings.general.businessPhone || !settings.general.businessPhone.trim()) {
        errors.businessPhone = 'Business phone is required';
      } else {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(settings.general.businessPhone.replace(/[\s\-\(\)]/g, ''))) {
          errors.businessPhone = 'Invalid phone number format';
        }
      }
      
      if (!settings.general.businessAddress || !settings.general.businessAddress.trim()) {
        errors.businessAddress = 'Business address is required';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSettingChange = (category, key, value) => {
    console.log('Changing setting:', category, key, value);
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      };
      console.log('New Settings:', newSettings);
      return newSettings;
    });
    
    // Clear error for this field when user starts typing
    if (formErrors[key]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const GeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
        
        {editMode ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
              <input
                type="text"
                value={settings.general.businessName || ''}
                onChange={(e) => handleSettingChange('general', 'businessName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.businessName ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={saving}
              />
              {formErrors.businessName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.businessName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Email *</label>
              <input
                type="email"
                value={settings.general.businessEmail || ''}
                onChange={(e) => handleSettingChange('general', 'businessEmail', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.businessEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={saving}
              />
              {formErrors.businessEmail && (
                <p className="mt-1 text-sm text-red-600">{formErrors.businessEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone *</label>
              <input
                type="tel"
                value={settings.general.businessPhone || ''}
                onChange={(e) => handleSettingChange('general', 'businessPhone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.businessPhone ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={saving}
              />
              {formErrors.businessPhone && (
                <p className="mt-1 text-sm text-red-600">{formErrors.businessPhone}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.general.timezone || 'America/New_York'}
                onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="Asia/Kolkata">India Standard Time</option>
                <option value="Europe/London">GMT</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Business Name</p>
              <p className="text-gray-900">{settings.general.businessName || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Business Email</p>
              <p className="text-gray-900">{settings.general.businessEmail || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Business Phone</p>
              <p className="text-gray-900">{settings.general.businessPhone || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Timezone</p>
              <p className="text-gray-900">{settings.general.timezone || 'Not set'}</p>
            </div>
          </div>
        )}
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {editMode ? 'Business Address *' : 'Business Address'}
          </label>
          {editMode ? (
            <>
              <textarea
                value={settings.general.businessAddress || ''}
                onChange={(e) => handleSettingChange('general', 'businessAddress', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  formErrors.businessAddress ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={saving}
              />
              {formErrors.businessAddress && (
                <p className="mt-1 text-sm text-red-600">{formErrors.businessAddress}</p>
              )}
            </>
          ) : (
            <p className="text-gray-900">{settings.general.businessAddress || 'Not set'}</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Localization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            {editMode ? (
              <select
                value={settings.general.currency || 'INR'}
                onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              >
                <option value="INR">INR - Indian Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            ) : (
              <p className="text-gray-900">
                {settings.general.currency === 'INR' && 'INR - Indian Rupee'}
                {settings.general.currency === 'USD' && 'USD - US Dollar'}
                {settings.general.currency === 'EUR' && 'EUR - Euro'}
                {settings.general.currency === 'GBP' && 'GBP - British Pound'}
                {!settings.general.currency && 'Not set'}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            {editMode ? (
              <select
                value={settings.general.language || 'en'}
                onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            ) : (
              <p className="text-gray-900">
                {settings.general.language === 'en' && 'English'}
                {settings.general.language === 'es' && 'Spanish'}
                {settings.general.language === 'fr' && 'French'}
                {settings.general.language === 'de' && 'German'}
                {!settings.general.language && 'Not set'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications?.emailNotifications ?? true}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                className="sr-only peer"
                disabled={saving}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">SMS Notifications</p>
                <p className="text-sm text-gray-500">Receive notifications via SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications?.smsNotifications ?? false}
                onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                className="sr-only peer"
                disabled={saving}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-500">Receive browser push notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications?.pushNotifications ?? true}
                onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                className="sr-only peer"
                disabled={saving}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
        <div className="space-y-4">
          {[
            { key: 'orderUpdates', label: 'Order Updates', desc: 'New orders, status changes' },
            { key: 'paymentAlerts', label: 'Payment Alerts', desc: 'Payment confirmations, failures' },
            { key: 'lowStockAlerts', label: 'Low Stock Alerts', desc: 'Inventory running low' },
            { key: 'customerMessages', label: 'Customer Messages', desc: 'Customer inquiries and feedback' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications?.[item.key] ?? true}
                  onChange={(e) => handleSettingChange('notifications', item.key, e.target.checked)}
                  className="sr-only peer"
                  disabled={saving}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.security?.twoFactorAuth ?? false}
                onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                className="sr-only peer"
                disabled={saving}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session & Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={settings.security?.sessionTimeout ?? 30}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
            <input
              type="number"
              value={settings.security?.passwordExpiry ?? 90}
              onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={saving}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={saving}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            />
          </div>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={saving}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const PaymentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-4">
          {[
            { key: 'stripeEnabled', label: 'Stripe', desc: 'Credit/Debit cards via Stripe' },
            { key: 'paypalEnabled', label: 'PayPal', desc: 'PayPal payments' },
            { key: 'bankTransferEnabled', label: 'Bank Transfer', desc: 'Direct bank transfers' },
            { key: 'cashOnDelivery', label: 'Cash on Delivery', desc: 'Pay when order is delivered' }
          ].map((method) => (
            <div key={method.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{method.label}</p>
                <p className="text-sm text-gray-500">{method.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.payment?.[method.key] ?? true}
                  onChange={(e) => handleSettingChange('payment', method.key, e.target.checked)}
                  className="sr-only peer"
                  disabled={saving}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee (%)</label>
            <input
              type="number"
              step="0.1"
              value={settings.payment?.processingFee ?? 2.9}
              onChange={(e) => handleSettingChange('payment', 'processingFee', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={settings.payment?.minimumAmount ?? 10.00}
              onChange={(e) => handleSettingChange('payment', 'minimumAmount', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const handleSave = async () => {
    // Validate form before saving
    if (!validateForm()) {
      setError('Please fix the errors before saving');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Prepare the data to send to the backend
      const dataToSend = {
        general: settings.general,
        notifications: settings.notifications,
        security: settings.security,
        payment: settings.payment
      };
      
      const response = await api.put('/auth/settings', dataToSend);
      console.log('Save Response:', response.data);
      
      // Extract only the fields we need from the response
      const apiSettings = response.data.settings;
      
      // Merge the response settings with the current settings to ensure all fields are present
      setSettings(prev => {
        const newSettings = {
          general: {
            ...prev.general,
            businessName: apiSettings.businessName || prev.general.businessName,
            businessEmail: apiSettings.businessEmail || prev.general.businessEmail,
            businessPhone: apiSettings.businessPhone || prev.general.businessPhone,
            businessAddress: apiSettings.businessAddress || prev.general.businessAddress,
            timezone: apiSettings.timezone || prev.general.timezone,
            currency: apiSettings.currency || prev.general.currency,
            language: apiSettings.language || prev.general.language
          },
          notifications: {
            ...prev.notifications,
            ...apiSettings.notifications
          },
          security: {
            ...prev.security,
            ...apiSettings.security
          },
          payment: {
            ...prev.payment,
            ...apiSettings.payment
          }
        };
        console.log('Updated Settings:', newSettings);
        return newSettings;
      });
      setSuccess('Settings saved successfully!');
      setEditMode(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your application settings and preferences</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <XMarkIcon className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    // Exit edit mode when switching tabs
                    if (editMode) setEditMode(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {activeTab === 'general' && <GeneralSettings />}
              {activeTab === 'notifications' && <NotificationSettings />}
              {activeTab === 'security' && <SecuritySettings />}
              {activeTab === 'payment' && <PaymentSettings />}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                {editMode ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-5 w-5" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  activeTab === 'general' && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span>Edit Business Information</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;