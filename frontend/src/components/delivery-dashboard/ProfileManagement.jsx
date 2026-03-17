import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  UserCircleIcon,
  PencilIcon,
  CameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  MapPinIcon,
  TruckIcon,
  IdentificationIcon,
  BanknotesIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  CreditCardIcon,
  KeyIcon,
  SparklesIcon,
  BoltIcon,
  HeartIcon,
  GlobeAltIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

const ProfileManagement = ({ onClose }) => {
  const { t } = useTranslation();
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
    vehicleType: 'bike',
    vehicleNumber: '',
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

  const handleRemovePhoto = async () => {
    try {
      setUploadingPhoto(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/delivery-boy/profile/photo`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPhotoPreview(null);
        setProfile(prev => ({ ...prev, profilePicture: null }));
        setSuccess('Profile photo removed successfully!');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.error('Error removing photo:', err);
      setError(err.response?.data?.message || 'Failed to remove photo');
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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserCircleIcon, color: 'from-violet-500 to-purple-500' },
    { id: 'vehicle', label: 'Vehicle', icon: TruckIcon, color: 'from-blue-500 to-cyan-500' },
    { id: 'bank', label: 'Payments', icon: CreditCardIcon, color: 'from-emerald-500 to-teal-500' },
    { id: 'security', label: 'Security', icon: FingerPrintIcon, color: 'from-orange-500 to-red-500' }
  ];

  const weekDays = [
    { id: 'monday', label: 'M', fullLabel: 'Monday' },
    { id: 'tuesday', label: 'T', fullLabel: 'Tuesday' },
    { id: 'wednesday', label: 'W', fullLabel: 'Wednesday' },
    { id: 'thursday', label: 'T', fullLabel: 'Thursday' },
    { id: 'friday', label: 'F', fullLabel: 'Friday' },
    { id: 'saturday', label: 'S', fullLabel: 'Saturday' },
    { id: 'sunday', label: 'S', fullLabel: 'Sunday' }
  ];

  const vehicleIcons = {
    bicycle: '🚲',
    bike: '🏍️',
    scooter: '🛵',
    car: '🚗',
    van: '🚐'
  };

  // Loading State
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-white/80 text-center font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="w-full max-w-5xl max-h-[92vh] bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col"
        style={{ animation: 'fadeInScale 0.3s ease-out' }}
      >
        {/* Hero Header with Profile */}
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34c0-2 2-4 2-4s2 2 2 4-2 4-2 4-2-2-2-4zm-10 0c0-2 2-4 2-4s2 2 2 4-2 4-2 4-2-2-2-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-200 group"
          >
            <XMarkIcon className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Profile Content */}
          <div className="relative z-10 px-8 py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white/30 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400">
                      <span className="text-5xl font-bold text-white">
                        {profile?.name?.charAt(0)?.toUpperCase() || 'D'}
                      </span>
                    </div>
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <ArrowPathIcon className="w-10 h-10 text-white animate-spin" />
                    </div>
                  )}
                </div>
                {/* Camera Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute -bottom-2 -right-2 p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                >
                  <CameraIcon className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-1">{profile?.name}</h1>
                <p className="text-white/70 flex items-center justify-center md:justify-start gap-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  {profile?.email}
                </p>
                
                {/* Stats Row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarSolid
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(profile?.deliveryBoyInfo?.rating || 5)
                              ? 'text-yellow-400'
                              : 'text-white/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-semibold">
                      {profile?.deliveryBoyInfo?.rating?.toFixed(1) || '5.0'}
                    </span>
                  </div>

                  {/* Deliveries */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                    <BoltIcon className="w-5 h-5 text-cyan-400" />
                    <span className="text-white font-semibold">
                      {profile?.deliveryStats?.totalDeliveries || 0}
                    </span>
                    <span className="text-white/60 text-sm">deliveries</span>
                  </div>

                  {/* Availability Toggle */}
                  <button
                    onClick={toggleAvailability}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      formData.isAvailable
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      formData.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                    }`}></span>
                    {formData.isAvailable ? 'Online' : 'Offline'}
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              {photoPreview && (
                <button
                  onClick={handleRemovePhoto}
                  disabled={uploadingPhoto}
                  className="text-white/60 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {(error || success) && (
          <div className="px-6 pt-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
                <div className="p-2 bg-red-500/20 rounded-xl">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-red-300 flex-1">{error}</p>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
                <div className="p-2 bg-emerald-500/20 rounded-xl">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <p className="text-emerald-300 flex-1">{success}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 pt-6">
          <div className="flex gap-2 p-1.5 bg-white/5 backdrop-blur-sm rounded-2xl">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-purple-400" />
                    Personal Information
                  </h3>
                  <p className="text-white/50 text-sm mt-1">Manage your personal details</p>
                </div>
                <button
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  disabled={saving}
                  className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
                    editMode
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {saving ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : editMode ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <PencilIcon className="w-5 h-5" />
                  )}
                  {saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  icon={<UserCircleIcon className="w-5 h-5" />}
                />
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  icon={<PhoneIcon className="w-5 h-5" />}
                />
                <InputField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  icon={<CalendarIcon className="w-5 h-5" />}
                />
                <SelectField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                  ]}
                />
                <div className="md:col-span-2">
                  <label className="block text-white/70 text-sm font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  />
                </div>
              </div>

              {/* Emergency Contact Card */}
              <div className="p-5 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-2xl">
                <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <HeartIcon className="w-5 h-5 text-rose-400" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Contact Name"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    placeholder="Name of emergency contact"
                  />
                  <InputField
                    label="Contact Number"
                    name="emergencyContact"
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    placeholder="Emergency phone number"
                  />
                </div>
              </div>

              {editMode && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setEditMode(false);
                      fetchProfile();
                    }}
                    className="px-5 py-2.5 text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Vehicle Tab */}
          {activeTab === 'vehicle' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <TruckIcon className="w-6 h-6 text-blue-400" />
                    Vehicle & Work
                  </h3>
                  <p className="text-white/50 text-sm mt-1">Vehicle details and work schedule</p>
                </div>
                <button
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  disabled={saving}
                  className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
                    editMode
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : editMode ? <CheckCircleIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                  {saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* Vehicle Type Selection */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-3">Vehicle Type</label>
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(vehicleIcons).map(([type, icon]) => (
                    <button
                      key={type}
                      onClick={() => editMode && setFormData(prev => ({ ...prev, vehicleType: type }))}
                      disabled={!editMode}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                        formData.vehicleType === type
                          ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500 shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10 hover:border-white/30'
                      } ${!editMode ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                    >
                      <div className="text-3xl mb-2">{icon}</div>
                      <div className={`text-xs font-medium capitalize ${formData.vehicleType === type ? 'text-blue-400' : 'text-white/60'}`}>
                        {type}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Vehicle Number"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="e.g., KA-01-AB-1234"
                  icon={<IdentificationIcon className="w-5 h-5" />}
                />
                <InputField
                  label="License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="Your driving license number"
                  icon={<IdentificationIcon className="w-5 h-5" />}
                />
                <InputField
                  label="License Expiry"
                  name="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  icon={<CalendarIcon className="w-5 h-5" />}
                />
              </div>

              {/* Working Hours */}
              <div className="p-5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl">
                <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <ClockIcon className="w-5 h-5 text-blue-400" />
                  Working Hours
                </h4>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">From</span>
                    <input
                      type="time"
                      name="workingHoursStart"
                      value={formData.workingHoursStart}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-sm">To</span>
                    <input
                      type="time"
                      name="workingHoursEnd"
                      value={formData.workingHoursEnd}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Available Days */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-3">Available Days</label>
                <div className="flex gap-2 flex-wrap">
                  {weekDays.map(day => (
                    <button
                      key={day.id}
                      onClick={() => editMode && handleDayToggle(day.id)}
                      disabled={!editMode}
                      title={day.fullLabel}
                      className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${
                        formData.availableDays.includes(day.id)
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-white/5 text-white/40 border border-white/10'
                      } ${!editMode ? 'cursor-default' : 'hover:scale-110'}`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              {editMode && (
                <div className="flex justify-end">
                  <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-5 py-2.5 text-white/60 hover:text-white">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bank Tab */}
          {activeTab === 'bank' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <CreditCardIcon className="w-6 h-6 text-emerald-400" />
                    Payment Details
                  </h3>
                  <p className="text-white/50 text-sm mt-1">Bank account for salary payments</p>
                </div>
                <button
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                  disabled={saving}
                  className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
                    editMode
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : editMode ? <CheckCircleIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                  {saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                </button>
              </div>

              {/* Security Notice */}
              <div className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <ShieldCheckIcon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Your data is secure</h4>
                  <p className="text-white/60 text-sm">
                    Bank details are encrypted and used only for salary payments. We never share your financial information.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Bank Name"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="e.g., State Bank of India"
                  icon={<BanknotesIcon className="w-5 h-5" />}
                />
                <InputField
                  label="Account Number"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="Enter account number"
                  icon={<CreditCardIcon className="w-5 h-5" />}
                />
                <InputField
                  label="IFSC Code"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="e.g., SBIN0001234"
                />
                <InputField
                  label="UPI ID"
                  name="upiId"
                  value={formData.upiId}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  placeholder="e.g., yourname@upi"
                  icon={<GlobeAltIcon className="w-5 h-5" />}
                />
              </div>

              {editMode && (
                <div className="flex justify-end">
                  <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-5 py-2.5 text-white/60 hover:text-white">
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <KeyIcon className="w-6 h-6 text-orange-400" />
                  Change Password
                </h3>
                <p className="text-white/50 text-sm mt-1">Update your account password</p>
              </div>

              <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
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
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-white/60">Password strength</span>
                        <span className={
                          passwordStrength < 40 ? 'text-red-400' : 
                          passwordStrength < 70 ? 'text-amber-400' : 'text-emerald-400'
                        }>
                          {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 rounded-full ${
                            passwordStrength < 40 ? 'bg-gradient-to-r from-red-500 to-red-400' : 
                            passwordStrength < 70 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 
                            'bg-gradient-to-r from-emerald-500 to-teal-400'
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
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <XMarkIcon className="w-4 h-4" /> Passwords do not match
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  className="w-full px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg shadow-orange-500/25 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <FingerPrintIcon className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </button>
              </form>

              {/* Account Info */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4">Account Information</h4>
                <div className="space-y-1">
                  <InfoRow label="Email" value={profile?.email} />
                  <InfoRow label="Account Type" value={profile?.role} capitalize />
                  <InfoRow label="Member Since" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
                  <div className="flex justify-between items-center py-3 border-b border-white/5">
                    <span className="text-white/60">Documents Verified</span>
                    <span className={`font-medium flex items-center gap-2 ${
                      profile?.deliveryBoyInfo?.documentsVerified ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {profile?.deliveryBoyInfo?.documentsVerified ? (
                        <>
                          <CheckBadgeIcon className="w-5 h-5" />
                          Verified
                        </>
                      ) : (
                        <>
                          <ExclamationTriangleIcon className="w-5 h-5" />
                          Pending
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        @keyframes fadeInScale {
          from { 
            opacity: 0; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
      `}</style>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-white/70 text-sm font-medium mb-2">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
      />
    </div>
  </div>
);

// Reusable Select Component
const SelectField = ({ label, options, ...props }) => (
  <div>
    <label className="block text-white/70 text-sm font-medium mb-2">{label}</label>
    <select
      {...props}
      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff60' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 0.75rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em'
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-slate-800">{opt.label}</option>
      ))}
    </select>
  </div>
);

// Reusable Password Field Component
const PasswordField = ({ label, show, onToggle, ...props }) => (
  <div>
    <label className="block text-white/70 text-sm font-medium mb-2">{label}</label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        {...props}
        className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
      >
        {show ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

// Info Row Component
const InfoRow = ({ label, value, capitalize }) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5">
    <span className="text-white/60">{label}</span>
    <span className={`text-white font-medium ${capitalize ? 'capitalize' : ''}`}>{value}</span>
  </div>
);

export default ProfileManagement;
