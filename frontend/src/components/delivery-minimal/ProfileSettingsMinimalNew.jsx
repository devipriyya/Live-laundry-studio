import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  PencilIcon,
  CameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  TruckIcon,
  ClockIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  KeyIcon,
  HeartIcon,
  BellIcon,
  SunIcon,
  ArrowLeftIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const ProfileSettingsMinimal = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const fileInputRef = useRef(null);

  // State
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Profile data
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    bio: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    vehicleColor: '',
    vehicleModel: '',
    licenseNumber: '',
    licenseExpiry: '',
    emergencyContact: '',
    emergencyContactName: '',
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
    upiId: '',
    workingHoursStart: '09:00',
    workingHoursEnd: '18:00',
    availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    isAvailable: true
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Settings state
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: false,
    sound: true,
    vibration: true
  });

  // Tabs configuration
  const tabs = [
    { id: 'profile', name: 'Personal Info', icon: UserCircleIcon },
    { id: 'vehicle', name: 'Vehicle Details', icon: TruckIcon },
    { id: 'schedule', name: 'Work Schedule', icon: ClockIcon },
    { id: 'payments', name: 'Payment Info', icon: CreditCardIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon }
  ];

  const weekDays = [
    { id: 'monday', label: 'Mon', fullLabel: 'Monday' },
    { id: 'tuesday', label: 'Tue', fullLabel: 'Tuesday' },
    { id: 'wednesday', label: 'Wed', fullLabel: 'Wednesday' },
    { id: 'thursday', label: 'Thu', fullLabel: 'Thursday' },
    { id: 'friday', label: 'Fri', fullLabel: 'Friday' },
    { id: 'saturday', label: 'Sat', fullLabel: 'Saturday' },
    { id: 'sunday', label: 'Sun', fullLabel: 'Sunday' }
  ];

  const vehicleOptions = [
    { type: 'bicycle', icon: '🚲', label: 'Bicycle' },
    { type: 'bike', icon: '🏍️', label: 'Bike' },
    { type: 'scooter', icon: '🛵', label: 'Scooter' },
    { type: 'car', icon: '🚗', label: 'Car' },
    { type: 'van', icon: '🚐', label: 'Van' }
  ];

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery-boy/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const profileData = response.data.profile;
        setProfile(profileData);
        
        setFormData({
          name: profileData.name || '',
          phone: profileData.phone || '',
          dateOfBirth: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '',
          gender: profileData.gender || 'prefer-not-to-say',
          bio: profileData.bio || '',
          vehicleType: profileData.deliveryBoyInfo?.vehicleType || 'bike',
          vehicleNumber: profileData.deliveryBoyInfo?.vehicleNumber || '',
          vehicleColor: profileData.deliveryBoyInfo?.vehicleColor || '',
          vehicleModel: profileData.deliveryBoyInfo?.vehicleModel || '',
          licenseNumber: profileData.deliveryBoyInfo?.licenseNumber || '',
          licenseExpiry: profileData.deliveryBoyInfo?.licenseExpiry ? profileData.deliveryBoyInfo.licenseExpiry.split('T')[0] : '',
          emergencyContact: profileData.deliveryBoyInfo?.emergencyContact || '',
          emergencyContactName: profileData.deliveryBoyInfo?.emergencyContactName || '',
          bankAccountNumber: profileData.deliveryBoyInfo?.bankAccountNumber || '',
          bankName: profileData.deliveryBoyInfo?.bankName || '',
          ifscCode: profileData.deliveryBoyInfo?.ifscCode || '',
          upiId: profileData.deliveryBoyInfo?.upiId || '',
          workingHoursStart: profileData.deliveryBoyInfo?.workingHours?.start || '09:00',
          workingHoursEnd: profileData.deliveryBoyInfo?.workingHours?.end || '18:00',
          availableDays: profileData.deliveryBoyInfo?.availableDays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          isAvailable: profileData.deliveryBoyInfo?.isAvailable ?? true
        });
        
        setPhotoPreview(profileData.profilePicture);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender,
        bio: formData.bio,
        vehicleType: formData.vehicleType,
        vehicleNumber: formData.vehicleNumber,
        vehicleColor: formData.vehicleColor,
        vehicleModel: formData.vehicleModel,
        licenseNumber: formData.licenseNumber,
        licenseExpiry: formData.licenseExpiry || null,
        emergencyContact: formData.emergencyContact,
        emergencyContactName: formData.emergencyContactName,
        bankAccountNumber: formData.bankAccountNumber,
        bankName: formData.bankName,
        ifscCode: formData.ifscCode,
        upiId: formData.upiId,
        workingHours: {
          start: formData.workingHoursStart,
          end: formData.workingHoursEnd
        },
        availableDays: formData.availableDays,
        isAvailable: formData.isAvailable
      };

      const response = await axios.put(`${API_URL}/delivery-boy/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProfile(response.data.profile);
        setSuccess('Profile updated successfully!');
        setEditMode(false);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(100, strength));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New password and confirm password do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/delivery-boy/profile/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordStrength(0);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      uploadPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (base64Image) => {
    try {
      setUploadingPhoto(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/delivery-boy/profile/photo`, 
        { profilePicture: base64Image },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        setSuccess('Profile photo updated!');
        setProfile(prev => ({ ...prev, profilePicture: response.data.profilePicture }));
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err.response?.data?.message || 'Failed to upload photo');
      setPhotoPreview(profile?.profilePicture);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/delivery-boy/profile/availability`, 
        { isAvailable: !formData.isAvailable },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      if (response.data.success) {
        setFormData(prev => ({ ...prev, isAvailable: response.data.isAvailable }));
        setProfile(prev => ({
          ...prev,
          deliveryBoyInfo: { ...prev.deliveryBoyInfo, isAvailable: response.data.isAvailable }
        }));
      }
    } catch (err) {
      console.error('Error toggling availability:', err);
      setError(err.response?.data?.message || 'Failed to update availability');
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-yellow-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 pb-20 lg:pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/delivery-minimal')}
                className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
                <p className="text-xs text-gray-500">Manage your account</p>
              </div>
            </div>
            
            <button
              onClick={toggleAvailability}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                formData.isAvailable
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${formData.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              <span>{formData.isAvailable ? 'Online' : 'Offline'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Alerts */}
        {(error || success) && (
          <div className="mb-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                <p className="text-red-700 text-sm flex-1">{error}</p>
                <button onClick={() => setError(null)} className="text-red-500">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <CheckCircleSolid className="w-5 h-5 text-green-600" />
                <p className="text-green-700 text-sm flex-1">{success}</p>
              </div>
            )}
          </div>
        )}

        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 mb-6">
          <div className="p-4">
            <div className="flex items-center space-x-4">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-yellow-500 flex items-center justify-center ring-4 ring-yellow-100">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xl font-bold">
                      {profile?.name?.charAt(0)?.toUpperCase() || 'D'}
                    </span>
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                      <ArrowPathIcon className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label className="absolute -bottom-1 -right-1 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-full shadow-lg transition-all border-2 border-white">
                  <CameraIcon className="h-3 w-3" />
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                </label>
              </div>
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate">{profile?.name}</h2>
                <p className="text-sm text-gray-500 truncate">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    <StarIcon className="h-3 w-3 mr-1" />
                    {profile?.deliveryBoyInfo?.rating?.toFixed(1) || '5.0'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {profile?.deliveryStats?.totalDeliveries || 0} deliveries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Scrollable */}
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 mb-6 overflow-x-auto">
          <div className="flex min-w-max p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Personal Information</h3>
                <button
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg disabled:opacity-50"
                >
                  {saving ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : editMode ? <CheckCircleIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                  {saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} disabled={!editMode} />
                <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={!editMode} />
                <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} disabled={!editMode} />
                <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} disabled={!editMode} options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                  { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                ]} />

                {/* Emergency Contact */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
                    <HeartIcon className="w-4 h-4 text-red-500" />
                    Emergency Contact
                  </h4>
                  <div className="space-y-3">
                    <InputField label="Contact Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} disabled={!editMode} />
                    <InputField label="Contact Number" name="emergencyContact" type="tel" value={formData.emergencyContact} onChange={handleInputChange} disabled={!editMode} />
                  </div>
                </div>

                {editMode && (
                  <button onClick={() => { setEditMode(false); fetchProfile(); }} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                )}
              </div>
            </div>
          )}

          {/* Vehicle Tab */}
          {activeTab === 'vehicle' && (
            <div>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Vehicle Details</h3>
                <button
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg disabled:opacity-50"
                >
                  {saving ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : editMode ? <CheckCircleIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                  {saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {vehicleOptions.map(vehicle => (
                      <button
                        key={vehicle.type}
                        onClick={() => editMode && setFormData(prev => ({ ...prev, vehicleType: vehicle.type }))}
                        disabled={!editMode}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          formData.vehicleType === vehicle.type
                            ? 'bg-yellow-50 border-yellow-500'
                            : 'bg-gray-50 border-gray-200'
                        } ${!editMode ? 'opacity-70' : ''}`}
                      >
                        <div className="text-2xl">{vehicle.icon}</div>
                        <div className="text-xs mt-1">{vehicle.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <InputField label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., KA-01-AB-1234" />
                <InputField label="Vehicle Model" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} disabled={!editMode} />
                <InputField label="Vehicle Color" name="vehicleColor" value={formData.vehicleColor} onChange={handleInputChange} disabled={!editMode} />
                <InputField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} disabled={!editMode} />
                <InputField label="License Expiry" name="licenseExpiry" type="date" value={formData.licenseExpiry} onChange={handleInputChange} disabled={!editMode} />

                {editMode && (
                  <button onClick={() => { setEditMode(false); fetchProfile(); }} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                )}
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Work Schedule</h3>
                <button
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg disabled:opacity-50"
                >
                  {saving ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : editMode ? <CheckCircleIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                  {saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Working Hours */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
                    <SunIcon className="w-4 h-4 text-amber-500" />
                    Working Hours
                  </h4>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      name="workingHoursStart"
                      value={formData.workingHoursStart}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="px-3 py-2 bg-white border border-amber-200 rounded-lg disabled:opacity-60"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      name="workingHoursEnd"
                      value={formData.workingHoursEnd}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="px-3 py-2 bg-white border border-amber-200 rounded-lg disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Available Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map(day => (
                      <button
                        key={day.id}
                        onClick={() => editMode && handleDayToggle(day.id)}
                        disabled={!editMode}
                        className={`w-12 h-12 rounded-lg font-bold text-sm transition-all ${
                          formData.availableDays.includes(day.id)
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-500'
                        } ${!editMode ? 'opacity-70' : ''}`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>

                {editMode && (
                  <button onClick={() => { setEditMode(false); fetchProfile(); }} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                )}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Payment Details</h3>
                <button
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg disabled:opacity-50"
                >
                  {saving ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : editMode ? <CheckCircleIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                  {saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-gray-600">Your bank details are encrypted and secure.</p>
                </div>

                <InputField label="Bank Name" name="bankName" value={formData.bankName} onChange={handleInputChange} disabled={!editMode} />
                <InputField label="Account Number" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleInputChange} disabled={!editMode} />
                <InputField label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} disabled={!editMode} />
                <InputField label="UPI ID" name="upiId" value={formData.upiId} onChange={handleInputChange} disabled={!editMode} />

                {editMode && (
                  <button onClick={() => { setEditMode(false); fetchProfile(); }} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                )}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Security Settings</h3>
              </div>
              
              <div className="p-4">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <PasswordField label="Current Password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} show={showPasswords.current} onToggle={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))} />
                  
                  <div>
                    <PasswordField label="New Password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} show={showPasswords.new} onToggle={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))} />
                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${passwordStrength < 40 ? 'bg-red-500' : passwordStrength < 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <PasswordField label="Confirm Password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} show={showPasswords.confirm} onToggle={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))} />

                  <button
                    type="submit"
                    disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                    className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </form>

                {/* Account Info */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Account Info</h4>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-900">{profile?.email}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Account Type</span><span className="text-gray-900">Delivery Partner</span></div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Documents</span>
                      <span className={profile?.deliveryBoyInfo?.documentsVerified ? 'text-green-600' : 'text-amber-600'}>
                        {profile?.deliveryBoyInfo?.documentsVerified ? '✓ Verified' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              
              <div className="p-4 space-y-3">
                <ToggleSetting title="Order Updates" description="New orders and status changes" enabled={notificationSettings.orderUpdates} onChange={() => setNotificationSettings(prev => ({ ...prev, orderUpdates: !prev.orderUpdates }))} />
                <ToggleSetting title="Promotions" description="Bonuses and incentives" enabled={notificationSettings.promotions} onChange={() => setNotificationSettings(prev => ({ ...prev, promotions: !prev.promotions }))} />
                <ToggleSetting title="Sound" description="Play notification sounds" enabled={notificationSettings.sound} onChange={() => setNotificationSettings(prev => ({ ...prev, sound: !prev.sound }))} />
                <ToggleSetting title="Vibration" description="Vibrate on notifications" enabled={notificationSettings.vibration} onChange={() => setNotificationSettings(prev => ({ ...prev, vibration: !prev.vibration }))} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple Input Field
const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input {...props} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
  </div>
);

// Simple Select Field
const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <select {...props} className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

// Password Field
const PasswordField = ({ label, show, onToggle, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <input type={show ? 'text' : 'password'} {...props} className="w-full px-3 py-2.5 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500" />
      <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        {show ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

// Toggle Setting
const ToggleSetting = ({ title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div>
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-all ${enabled ? 'bg-yellow-500' : 'bg-gray-300'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? 'left-5' : 'left-0.5'}`}></div>
    </button>
  </div>
);

export default ProfileSettingsMinimal;
