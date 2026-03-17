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
  IdentificationIcon,
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
  GlobeAltIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  BellIcon,
  SunIcon,
  ArrowLeftIcon,
  StarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

const ProfileSettingsNew = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
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
    address: '',
    city: '',
    state: '',
    pincode: '',
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

  // Tabs configuration - matching User Dashboard style
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
          address: profileData.address?.street || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          pincode: profileData.address?.pincode || '',
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
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
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
        setSuccess('Profile photo updated successfully!');
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-yellow-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Simple Clean Header - Matching User Dashboard */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/delivery-dashboard')}
                className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-600">Manage your account information</p>
              </div>
            </div>
            
            {/* Availability Toggle */}
            <button
              onClick={toggleAvailability}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                formData.isAvailable
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${
                formData.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></span>
              <span>{formData.isAvailable ? 'Online' : 'Offline'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                <p className="text-red-700 flex-1">{error}</p>
                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircleSolid className="w-5 h-5 text-green-600" />
                <p className="text-green-700 flex-1">{success}</p>
              </div>
            )}
          </div>
        )}

        {/* Simple Profile Header Card - Matching User Dashboard */}
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-yellow-500 flex items-center justify-center shadow-md ring-4 ring-yellow-100">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-bold">
                      {profile?.name?.charAt(0)?.toUpperCase() || 'D'}
                    </span>
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                      <ArrowPathIcon className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <label className="absolute bottom-0 right-0 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow-lg transition-all hover:scale-110 border-2 border-white">
                  <CameraIcon className="h-4 w-4" />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {profile?.email}
                </p>
                <div className="flex items-center space-x-3 mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    <TruckIcon className="h-3 w-3 mr-1" />
                    Delivery Partner
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <StarIcon className="h-3 w-3 mr-1" />
                    {profile?.deliveryBoyInfo?.rating?.toFixed(1) || '5.0'} Rating
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {profile?.deliveryStats?.totalDeliveries || 0} Deliveries
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Simple Sidebar Navigation - Matching User Dashboard */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Settings</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-yellow-50 text-yellow-700 font-semibold border-l-4 border-yellow-500'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                      <p className="text-sm text-gray-600 mt-1">Update your profile details</p>
                    </div>
                    <button
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      disabled={saving}
                      className="flex items-center space-x-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      ) : editMode ? (
                        <CheckCircleIcon className="h-4 w-4" />
                      ) : (
                        <PencilIcon className="h-4 w-4" />
                      )}
                      <span className="font-semibold">{saving ? 'Saving...' : editMode ? 'Save Changes' : 'Edit Profile'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Full Name" name="name" value={formData.name} onChange={handleInputChange} disabled={!editMode} />
                    <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={!editMode} />
                    <InputField label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} disabled={!editMode} />
                    <SelectField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} disabled={!editMode} options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                    ]} />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        rows={3}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                      <HeartIcon className="w-5 h-5 text-red-500" />
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Contact Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} disabled={!editMode} placeholder="Emergency contact name" />
                      <InputField label="Contact Number" name="emergencyContact" type="tel" value={formData.emergencyContact} onChange={handleInputChange} disabled={!editMode} placeholder="Emergency phone number" />
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex justify-end mt-6">
                      <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vehicle Tab */}
            {activeTab === 'vehicle' && (
              <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Vehicle Information</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage your vehicle details</p>
                    </div>
                    <button
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      disabled={saving}
                      className="flex items-center space-x-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : editMode ? <CheckCircleIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                      <span className="font-semibold">{saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Vehicle Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Type</label>
                    <div className="grid grid-cols-5 gap-3">
                      {vehicleOptions.map(vehicle => (
                        <button
                          key={vehicle.type}
                          onClick={() => editMode && setFormData(prev => ({ ...prev, vehicleType: vehicle.type }))}
                          disabled={!editMode}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            formData.vehicleType === vehicle.type
                              ? 'bg-yellow-50 border-yellow-500 shadow-md'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          } ${!editMode ? 'opacity-70 cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="text-3xl mb-2 text-center">{vehicle.icon}</div>
                          <div className={`text-sm font-medium text-center ${formData.vehicleType === vehicle.type ? 'text-yellow-700' : 'text-gray-600'}`}>
                            {vehicle.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., KA-01-AB-1234" />
                    <InputField label="Vehicle Model" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., Honda Activa" />
                    <InputField label="Vehicle Color" name="vehicleColor" value={formData.vehicleColor} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., Black" />
                    <InputField label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} disabled={!editMode} placeholder="Driving license number" />
                    <InputField label="License Expiry" name="licenseExpiry" type="date" value={formData.licenseExpiry} onChange={handleInputChange} disabled={!editMode} />
                  </div>

                  {editMode && (
                    <div className="flex justify-end mt-6">
                      <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Work Schedule</h2>
                      <p className="text-sm text-gray-600 mt-1">Set your working hours and availability</p>
                    </div>
                    <button
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      disabled={saving}
                      className="flex items-center space-x-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : editMode ? <CheckCircleIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                      <span className="font-semibold">{saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Working Hours */}
                  <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                      <SunIcon className="w-5 h-5 text-amber-500" />
                      Working Hours
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium">From</span>
                        <input
                          type="time"
                          name="workingHoursStart"
                          value={formData.workingHoursStart}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="px-4 py-2 bg-white border-2 border-amber-200 rounded-lg font-medium focus:ring-2 focus:ring-amber-200 focus:border-amber-500 disabled:opacity-60"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium">To</span>
                        <input
                          type="time"
                          name="workingHoursEnd"
                          value={formData.workingHoursEnd}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="px-4 py-2 bg-white border-2 border-amber-200 rounded-lg font-medium focus:ring-2 focus:ring-amber-200 focus:border-amber-500 disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Available Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Available Days</label>
                    <div className="flex flex-wrap gap-3">
                      {weekDays.map(day => (
                        <button
                          key={day.id}
                          onClick={() => editMode && handleDayToggle(day.id)}
                          disabled={!editMode}
                          title={day.fullLabel}
                          className={`w-14 h-14 rounded-lg font-bold text-sm transition-all ${
                            formData.availableDays.includes(day.id)
                              ? 'bg-yellow-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                          } ${!editMode ? 'cursor-default' : 'hover:scale-105'}`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex justify-end mt-6">
                      <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                      <p className="text-sm text-gray-600 mt-1">Manage your bank account for salary payments</p>
                    </div>
                    <button
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      disabled={saving}
                      className="flex items-center space-x-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {saving ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : editMode ? <CheckCircleIcon className="h-4 w-4" /> : <PencilIcon className="h-4 w-4" />}
                      <span className="font-semibold">{saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Security Notice */}
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                    <ShieldCheckIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Your data is secure</h4>
                      <p className="text-sm text-gray-600">Bank details are encrypted and used only for salary payments.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Bank Name" name="bankName" value={formData.bankName} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., State Bank of India" />
                    <InputField label="Account Number" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleInputChange} disabled={!editMode} placeholder="Enter account number" />
                    <InputField label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., SBIN0001234" />
                    <InputField label="UPI ID" name="upiId" value={formData.upiId} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., yourname@upi" />
                  </div>

                  {editMode && (
                    <div className="flex justify-end mt-6">
                      <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-6 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-600 mt-1">Manage your password and account security</p>
                </div>
                
                <div className="p-6">
                  <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
                    <PasswordField 
                      label="Current Password" 
                      name="currentPassword" 
                      value={passwordData.currentPassword} 
                      onChange={handlePasswordChange} 
                      show={showPasswords.current} 
                      onToggle={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))} 
                    />
                    
                    <div>
                      <PasswordField 
                        label="New Password" 
                        name="newPassword" 
                        value={passwordData.newPassword} 
                        onChange={handlePasswordChange} 
                        show={showPasswords.new} 
                        onToggle={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))} 
                      />
                      {passwordData.newPassword && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Password strength</span>
                            <span className={passwordStrength < 40 ? 'text-red-500 font-medium' : passwordStrength < 70 ? 'text-amber-500 font-medium' : 'text-green-500 font-medium'}>
                              {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${
                                passwordStrength < 40 ? 'bg-red-500' : passwordStrength < 70 ? 'bg-amber-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <PasswordField 
                        label="Confirm New Password" 
                        name="confirmPassword" 
                        value={passwordData.confirmPassword} 
                        onChange={handlePasswordChange} 
                        show={showPasswords.confirm} 
                        onToggle={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))} 
                      />
                      {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <XMarkIcon className="w-4 h-4" /> Passwords do not match
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="w-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <ArrowPathIcon className="w-5 h-5 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <KeyIcon className="w-5 h-5" />
                          Update Password
                        </>
                      )}
                    </button>
                  </form>

                  {/* Account Info */}
                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <InfoRow label="Email" value={profile?.email} />
                      <InfoRow label="Account Type" value="Delivery Partner" />
                      <InfoRow label="Member Since" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
                      <div className="flex justify-between items-center py-3">
                        <span className="text-gray-500">Documents Verified</span>
                        <span className={`font-medium flex items-center gap-2 ${profile?.deliveryBoyInfo?.documentsVerified ? 'text-green-600' : 'text-amber-600'}`}>
                          {profile?.deliveryBoyInfo?.documentsVerified ? (
                            <><CheckCircleSolid className="w-5 h-5" /> Verified</>
                          ) : (
                            <><ExclamationTriangleIcon className="w-5 h-5" /> Pending</>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-600 mt-1">Control how you receive notifications</p>
                </div>
                
                <div className="p-6 space-y-4">
                  <ToggleSetting
                    title="Order Updates"
                    description="Get notified about new orders and status changes"
                    enabled={notificationSettings.orderUpdates}
                    onChange={() => setNotificationSettings(prev => ({ ...prev, orderUpdates: !prev.orderUpdates }))}
                  />
                  <ToggleSetting
                    title="Promotions & Offers"
                    description="Receive information about bonuses and incentives"
                    enabled={notificationSettings.promotions}
                    onChange={() => setNotificationSettings(prev => ({ ...prev, promotions: !prev.promotions }))}
                  />
                  <ToggleSetting
                    title="Sound"
                    description="Play sound for new notifications"
                    enabled={notificationSettings.sound}
                    onChange={() => setNotificationSettings(prev => ({ ...prev, sound: !prev.sound }))}
                  />
                  <ToggleSetting
                    title="Vibration"
                    description="Vibrate for new notifications"
                    enabled={notificationSettings.vibration}
                    onChange={() => setNotificationSettings(prev => ({ ...prev, vibration: !prev.vibration }))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Input Field Component
const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
    />
  </div>
);

// Simple Select Field Component
const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      {...props}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Password Field Component
const PasswordField = ({ label, show, onToggle, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        {...props}
        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-200 focus:border-yellow-500 transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

// Info Row Component
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
    <span className="text-gray-500">{label}</span>
    <span className="text-gray-900 font-medium">{value}</span>
  </div>
);

// Toggle Setting Component
const ToggleSetting = ({ title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div>
      <h4 className="text-gray-900 font-medium">{title}</h4>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-all ${
        enabled ? 'bg-yellow-500' : 'bg-gray-300'
      }`}
    >
      <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${
        enabled ? 'left-5' : 'left-0.5'
      }`}></div>
    </button>
  </div>
);

export default ProfileSettingsNew;
