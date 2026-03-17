import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import deliveryBoyService from '../../services/deliveryBoyService';
import {
  UserCircleIcon,
  PhoneIcon,
  MapPinIcon,
  TruckIcon,
  KeyIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const SimplifiedProfileSettings = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: '',
    licensePlate: '',
    address: '',
    isAvailable: false
  });
  const [availability, setAvailability] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await deliveryBoyService.getProfile();
      setProfile({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        vehicleType: profileData.vehicleType || '',
        licensePlate: profileData.licensePlate || '',
        address: profileData.address || '',
        isAvailable: profileData.isAvailable || false
      });
      setAvailability(profileData.isAvailable || false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      await deliveryBoyService.updateProfile(profile);
      setSuccessMessage('Profile updated successfully!');
      
      // Update availability status as well
      await deliveryBoyService.updateAvailability(availability);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const newAvailability = !availability;
      setAvailability(newAvailability);
      await deliveryBoyService.updateAvailability(newAvailability);
      
      setSuccessMessage(newAvailability 
        ? 'You are now available for deliveries' 
        : 'You are now unavailable for deliveries'
      );
    } catch (error) {
      console.error('Error updating availability:', error);
      setErrorMessage('Failed to update availability status');
      setAvailability(!availability); // Revert the toggle
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">{t('profile_settings', 'Profile Settings')}</h1>
        <p className="text-sm text-gray-500">{t('manage_your_profile', 'Manage your personal information')}</p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5" />
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <KeyIcon className="w-5 h-5" />
          {errorMessage}
        </div>
      )}

      {/* Availability Toggle */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{t('availability_status', 'Availability Status')}</h3>
            <p className="text-sm text-gray-500">
              {t('availability_description', 'Control whether you receive delivery assignments')}
            </p>
          </div>
          <button
            onClick={toggleAvailability}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              availability ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                availability ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${availability ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium">
            {availability ? t('available', 'Available') : t('unavailable', 'Unavailable')}
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Personal Information */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-900 flex items-center gap-2">
              <UserCircleIcon className="w-5 h-5" />
              {t('personal_information', 'Personal Information')}
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('full_name', 'Full Name')}
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('enter_your_name', 'Enter your name')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('email_address', 'Email Address')}
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('enter_your_email', 'Enter your email')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('phone_number', 'Phone Number')}
              </label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('enter_your_phone', 'Enter your phone number')}
              />
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-900 flex items-center gap-2">
              <TruckIcon className="w-5 h-5" />
              {t('vehicle_information', 'Vehicle Information')}
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('vehicle_type', 'Vehicle Type')}
              </label>
              <select
                value={profile.vehicleType}
                onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('select_vehicle_type', 'Select vehicle type')}</option>
                <option value="bike">{t('bike', 'Bike')}</option>
                <option value="scooter">{t('scooter', 'Scooter')}</option>
                <option value="car">{t('car', 'Car')}</option>
                <option value="motorcycle">{t('motorcycle', 'Motorcycle')}</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('license_plate', 'License Plate')}
              </label>
              <input
                type="text"
                value={profile.licensePlate}
                onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('enter_license_plate', 'Enter license plate')}
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-medium text-gray-900 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              {t('address', 'Address')}
            </h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('address_line', 'Address')}
              </label>
              <textarea
                value={profile.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder={t('enter_your_address', 'Enter your address')}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="p-4 bg-gray-50">
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  {t('saving', 'Saving...')}
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  {t('save_changes', 'Save Changes')}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SimplifiedProfileSettings;
