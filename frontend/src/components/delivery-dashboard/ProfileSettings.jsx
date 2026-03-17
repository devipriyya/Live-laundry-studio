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
  FingerPrintIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
  ArrowLeftIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid, CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const ProfileSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006/api';
  const fileInputRef = useRef(null);

  // State
  const [activeSection, setActiveSection] = useState('profile');
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

  const sections = [
    { id: 'profile', label: 'Personal Info', icon: UserCircleIcon, color: 'from-violet-500 to-purple-600' },
    { id: 'vehicle', label: 'Vehicle', icon: TruckIcon, color: 'from-blue-500 to-cyan-600' },
    { id: 'schedule', label: 'Schedule', icon: ClockIcon, color: 'from-amber-500 to-orange-600' },
    { id: 'payments', label: 'Payments', icon: CreditCardIcon, color: 'from-emerald-500 to-teal-600' },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon, color: 'from-rose-500 to-pink-600' },
    { id: 'notifications', label: 'Notifications', icon: BellIcon, color: 'from-indigo-500 to-blue-600' }
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 shadow-2xl">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-600 text-center font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34c0-2 2-4 2-4s2 2 2 4-2 4-2 4-2-2-2-4zm-10 0c0-2 2-4 2-4s2 2 2 4-2 4-2 4-2-2-2-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 pb-32">
          {/* Back Button */}
          <button
            onClick={() => navigate('/delivery-dashboard')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-36 h-36 rounded-3xl overflow-hidden bg-white/20 backdrop-blur-sm border-4 border-white/40 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                      <span className="text-6xl font-bold text-white">
                        {profile?.name?.charAt(0)?.toUpperCase() || 'D'}
                      </span>
                    </div>
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl">
                      <ArrowPathIcon className="w-12 h-12 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute -bottom-3 -right-3 p-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
                >
                  <CameraIcon className="w-6 h-6" />
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
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl font-bold text-white mb-2">{profile?.name}</h1>
                <p className="text-white/80 flex items-center justify-center lg:justify-start gap-2 text-lg">
                  <EnvelopeIcon className="w-5 h-5" />
                  {profile?.email}
                </p>
                
                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6">
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-2xl">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarSolid
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(profile?.deliveryBoyInfo?.rating || 5)
                              ? 'text-yellow-400'
                              : 'text-white/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-white font-bold text-lg">
                      {profile?.deliveryBoyInfo?.rating?.toFixed(1) || '5.0'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-sm rounded-2xl">
                    <BoltIcon className="w-6 h-6 text-yellow-400" />
                    <span className="text-white font-bold text-lg">
                      {profile?.deliveryStats?.totalDeliveries || 0}
                    </span>
                    <span className="text-white/70">deliveries</span>
                  </div>

                  <button
                    onClick={toggleAvailability}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
                      formData.isAvailable
                        ? 'bg-emerald-500/30 text-emerald-100 border-2 border-emerald-400/50'
                        : 'bg-red-500/30 text-red-100 border-2 border-red-400/50'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${
                      formData.isAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                    }`}></span>
                    {formData.isAvailable ? 'Online' : 'Offline'}
                  </button>
                </div>
              </div>

              {photoPreview && (
                <button
                  onClick={handleRemovePhoto}
                  disabled={uploadingPhoto}
                  className="text-white/70 hover:text-red-300 text-sm flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
                >
                  <XMarkIcon className="w-5 h-5" />
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 pb-12 relative z-20">
        {/* Alerts */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 shadow-lg">
                <div className="p-2 bg-red-100 rounded-xl">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-red-700 flex-1 font-medium">{error}</p>
                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 shadow-lg">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <CheckCircleSolid className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-emerald-700 flex-1 font-medium">{success}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-xl p-4 sticky top-6">
              <nav className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                      activeSection === section.id
                        ? `bg-gradient-to-r ${section.color} text-white shadow-lg transform scale-[1.02]`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <section.icon className="w-6 h-6" />
                    <span className="font-semibold">{section.label}</span>
                    {activeSection === section.id && (
                      <CheckCircleSolid className="w-5 h-5 ml-auto" />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Personal Info Section */}
              {activeSection === 'profile' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl">
                          <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        Personal Information
                      </h2>
                      <p className="text-gray-500 mt-1">Manage your personal details and contact info</p>
                    </div>
                    <button
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      disabled={saving}
                      className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg ${
                        editMode
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-xl'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : editMode ? <CheckCircleIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                      {saving ? 'Saving...' : editMode ? 'Save Changes' : 'Edit'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} disabled={!editMode} icon={<UserCircleIcon className="w-5 h-5" />} />
                    <FormInput label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} disabled={!editMode} icon={<PhoneIcon className="w-5 h-5" />} />
                    <FormInput label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} disabled={!editMode} icon={<CalendarIcon className="w-5 h-5" />} />
                    <FormSelect label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} disabled={!editMode} options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                    ]} />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        rows={3}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="p-6 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-3xl">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <HeartIcon className="w-6 h-6 text-rose-500" />
                      Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput label="Contact Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} disabled={!editMode} placeholder="Emergency contact name" />
                      <FormInput label="Contact Number" name="emergencyContact" type="tel" value={formData.emergencyContact} onChange={handleInputChange} disabled={!editMode} placeholder="Emergency phone number" />
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex justify-end">
                      <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Vehicle Section */}
              {activeSection === 'vehicle' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl">
                          <TruckIcon className="w-6 h-6 text-white" />
                        </div>
                        Vehicle Information
                      </h2>
                      <p className="text-gray-500 mt-1">Manage your vehicle details and documents</p>
                    </div>
                    <button
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      disabled={saving}
                      className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg ${
                        editMode ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : editMode ? <CheckCircleIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                      {saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                    </button>
                  </div>

                  {/* Vehicle Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Vehicle Type</label>
                    <div className="grid grid-cols-5 gap-4">
                      {vehicleOptions.map(vehicle => (
                        <button
                          key={vehicle.type}
                          onClick={() => editMode && setFormData(prev => ({ ...prev, vehicleType: vehicle.type }))}
                          disabled={!editMode}
                          className={`p-5 rounded-3xl border-3 transition-all duration-300 ${
                            formData.vehicleType === vehicle.type
                              ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-500 shadow-lg shadow-blue-500/20 scale-105'
                              : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                          } ${!editMode ? 'opacity-70 cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="text-4xl mb-2">{vehicle.icon}</div>
                          <div className={`text-sm font-semibold ${formData.vehicleType === vehicle.type ? 'text-blue-600' : 'text-gray-600'}`}>
                            {vehicle.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., KA-01-AB-1234" icon={<IdentificationIcon className="w-5 h-5" />} />
                    <FormInput label="Vehicle Model" name="vehicleModel" value={formData.vehicleModel} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., Honda Activa" />
                    <FormInput label="Vehicle Color" name="vehicleColor" value={formData.vehicleColor} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., Black" />
                    <FormInput label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleInputChange} disabled={!editMode} placeholder="Driving license number" icon={<DocumentTextIcon className="w-5 h-5" />} />
                    <FormInput label="License Expiry" name="licenseExpiry" type="date" value={formData.licenseExpiry} onChange={handleInputChange} disabled={!editMode} icon={<CalendarIcon className="w-5 h-5" />} />
                  </div>

                  {editMode && (
                    <div className="flex justify-end">
                      <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
                    </div>
                  )}
                </div>
              )}

              {/* Schedule Section */}
              {activeSection === 'schedule' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl">
                          <ClockIcon className="w-6 h-6 text-white" />
                        </div>
                        Work Schedule
                      </h2>
                      <p className="text-gray-500 mt-1">Set your working hours and availability</p>
                    </div>
                    <button
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      disabled={saving}
                      className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg ${
                        editMode ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : editMode ? <CheckCircleIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                      {saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                    </button>
                  </div>

                  {/* Working Hours */}
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                      <SunIcon className="w-6 h-6 text-amber-500" />
                      Working Hours
                    </h3>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-medium">From</span>
                        <input
                          type="time"
                          name="workingHoursStart"
                          value={formData.workingHoursStart}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className="px-5 py-3 bg-white border-2 border-amber-200 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 disabled:opacity-60"
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
                          className="px-5 py-3 bg-white border-2 border-amber-200 rounded-2xl text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 disabled:opacity-60"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Available Days */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-4">Available Days</label>
                    <div className="flex flex-wrap gap-3">
                      {weekDays.map(day => (
                        <button
                          key={day.id}
                          onClick={() => editMode && handleDayToggle(day.id)}
                          disabled={!editMode}
                          title={day.fullLabel}
                          className={`w-16 h-16 rounded-2xl font-bold text-lg transition-all duration-300 ${
                            formData.availableDays.includes(day.id)
                              ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-105'
                              : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
                          } ${!editMode ? 'cursor-default' : 'hover:scale-110'}`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex justify-end">
                      <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
                    </div>
                  )}
                </div>
              )}

              {/* Payments Section */}
              {activeSection === 'payments' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                          <CreditCardIcon className="w-6 h-6 text-white" />
                        </div>
                        Payment Details
                      </h2>
                      <p className="text-gray-500 mt-1">Manage your bank account for salary payments</p>
                    </div>
                    <button
                      onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                      disabled={saving}
                      className={`px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg ${
                        editMode ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : editMode ? <CheckCircleIcon className="w-5 h-5" /> : <PencilIcon className="w-5 h-5" />}
                      {saving ? 'Saving...' : editMode ? 'Save' : 'Edit'}
                    </button>
                  </div>

                  {/* Security Notice */}
                  <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 rounded-2xl">
                      <ShieldCheckIcon className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-bold text-lg mb-1">Your data is secure</h4>
                      <p className="text-gray-600">
                        Bank details are encrypted and used only for salary payments. We never share your financial information with anyone.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Bank Name" name="bankName" value={formData.bankName} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., State Bank of India" icon={<BuildingLibraryIcon className="w-5 h-5" />} />
                    <FormInput label="Account Number" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleInputChange} disabled={!editMode} placeholder="Enter account number" icon={<CreditCardIcon className="w-5 h-5" />} />
                    <FormInput label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., SBIN0001234" />
                    <FormInput label="UPI ID" name="upiId" value={formData.upiId} onChange={handleInputChange} disabled={!editMode} placeholder="e.g., yourname@upi" icon={<GlobeAltIcon className="w-5 h-5" />} />
                  </div>

                  {editMode && (
                    <div className="flex justify-end">
                      <button onClick={() => { setEditMode(false); fetchProfile(); }} className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
                    </div>
                  )}
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl">
                        <KeyIcon className="w-6 h-6 text-white" />
                      </div>
                      Security Settings
                    </h2>
                    <p className="text-gray-500 mt-1">Manage your password and account security</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="max-w-lg space-y-6">
                    <PasswordInput label="Current Password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} show={showPasswords.current} onToggle={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))} />
                    
                    <div>
                      <PasswordInput label="New Password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} show={showPasswords.new} onToggle={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))} />
                      {passwordData.newPassword && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Password strength</span>
                            <span className={passwordStrength < 40 ? 'text-red-500 font-semibold' : passwordStrength < 70 ? 'text-amber-500 font-semibold' : 'text-emerald-500 font-semibold'}>
                              {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}
                            </span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
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
                      <PasswordInput label="Confirm New Password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} show={showPasswords.confirm} onToggle={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))} />
                      {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium">
                          <XMarkIcon className="w-4 h-4" /> Passwords do not match
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="w-full px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <ArrowPathIcon className="w-5 h-5 animate-spin" />
                          Updating Password...
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
                  <div className="mt-10 pt-8 border-t-2 border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Account Information</h3>
                    <div className="space-y-1 bg-gray-50 rounded-2xl p-6">
                      <InfoRow label="Email" value={profile?.email} />
                      <InfoRow label="Account Type" value={profile?.role} capitalize />
                      <InfoRow label="Member Since" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'} />
                      <div className="flex justify-between items-center py-4">
                        <span className="text-gray-500 font-medium">Documents Verified</span>
                        <span className={`font-semibold flex items-center gap-2 ${profile?.deliveryBoyInfo?.documentsVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {profile?.deliveryBoyInfo?.documentsVerified ? (
                            <><CheckBadgeIcon className="w-6 h-6" /> Verified</>
                          ) : (
                            <><ExclamationTriangleIcon className="w-6 h-6" /> Pending</>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl">
                        <BellIcon className="w-6 h-6 text-white" />
                      </div>
                      Notification Preferences
                    </h2>
                    <p className="text-gray-500 mt-1">Control how you receive notifications</p>
                  </div>

                  <div className="space-y-4">
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
    </div>
  );
};

// Form Input Component
const FormInput = ({ label, icon, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
      />
    </div>
  </div>
);

// Form Select Component
const FormSelect = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <select
      {...props}
      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed appearance-none cursor-pointer"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        backgroundPosition: 'right 1rem center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5em 1.5em'
      }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Password Input Component
const PasswordInput = ({ label, show, onToggle, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        {...props}
        className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

// Info Row Component
const InfoRow = ({ label, value, capitalize }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-0">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className={`text-gray-900 font-semibold ${capitalize ? 'capitalize' : ''}`}>{value}</span>
  </div>
);

// Toggle Setting Component
const ToggleSetting = ({ title, description, enabled, onChange }) => (
  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
    <div>
      <h4 className="text-gray-900 font-semibold">{title}</h4>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
        enabled ? 'bg-gradient-to-r from-indigo-500 to-blue-600' : 'bg-gray-300'
      }`}
    >
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300 ${
        enabled ? 'left-7' : 'left-1'
      }`}></div>
    </button>
  </div>
);

export default ProfileSettings;
