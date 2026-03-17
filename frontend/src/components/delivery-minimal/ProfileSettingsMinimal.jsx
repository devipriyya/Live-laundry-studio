import React, { useState, useEffect, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import {
  UserCircleIcon,
  CameraIcon,
  PhoneIcon,
  EnvelopeIcon,
  TruckIcon,
  MapPinIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon,
  ArrowLeftIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

const ProfileSettingsMinimal = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateProfile } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    address: ''
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [settings, setSettings] = useState({
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'en',
    notifications: true
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/delivery-boy/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data.profile;
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          vehicleType: data.deliveryBoyInfo?.vehicleType || 'bike',
          vehicleNumber: data.deliveryBoyInfo?.vehicleNumber || '',
          address: data.address?.street || ''
        });
        setPhotoPreview(data.profilePicture);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      showMessage('error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/delivery-boy/profile`, {
        name: profile.name,
        phone: profile.phone,
        vehicleType: profile.vehicleType,
        vehicleNumber: profile.vehicleNumber
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showMessage('success', 'Profile updated successfully');
        if (updateProfile) {
          updateProfile(response.data.profile);
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showMessage('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      setPhotoPreview(reader.result);
      try {
        const token = localStorage.getItem('token');
        await axios.put(`${API_URL}/delivery-boy/profile/photo`, 
          { profilePicture: reader.result },
          { headers: { Authorization: `Bearer ${token}` }}
        );
        showMessage('success', 'Photo updated');
      } catch (error) {
        showMessage('error', 'Failed to upload photo');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/delivery-boy/profile/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showMessage('success', 'Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  };

  const handleLanguageChange = (language) => {
    setSettings(prev => ({ ...prev, language }));
    localStorage.setItem('language', language);
    i18n.changeLanguage(language);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: t('profile', 'Profile'), icon: UserCircleIcon },
    { id: 'security', label: t('security', 'Security'), icon: ShieldCheckIcon },
    { id: 'preferences', label: t('preferences', 'Preferences'), icon: GlobeAltIcon }
  ];

  return (
    <div className="p-5 lg:p-8 pb-24 lg:pb-8 max-w-2xl mx-auto font-sans">
      {/* Message Toast */}
      {message.text && (
        <div className={`
          fixed top-16 lg:top-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-96 z-50
          flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl
          ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white
        `}>
          {message.type === 'success' ? (
            <CheckCircleIcon className="w-6 h-6 flex-shrink-0" />
          ) : (
            <XMarkIcon className="w-6 h-6 flex-shrink-0" />
          )}
          <span className="text-base font-semibold">{message.text}</span>
        </div>
      )}

      {/* Back to Dashboard Button */}
      <button
        onClick={() => navigate('/delivery-minimal')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 group transition-colors"
      >
        <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-base font-semibold">Back to Dashboard</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">{t('profile_settings', 'Profile Settings')}</h1>
        <p className="text-base text-gray-600 mt-2 font-medium">{t('manage_account', 'Manage your account settings')}</p>
      </div>

      {/* Profile Photo Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 lg:p-8 mb-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden bg-gray-100 ring-4 ring-blue-50">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                  <span className="text-3xl lg:text-4xl font-bold text-blue-600">
                    {profile.name?.charAt(0)?.toUpperCase() || 'D'}
                  </span>
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
            >
              <CameraIcon className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 truncate">{profile.name}</h2>
            <p className="text-base text-gray-600 mt-1 truncate">{profile.email}</p>
            <p className="text-sm text-blue-600 mt-2 font-medium">Delivery Partner</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1.5 bg-gray-100 rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-semibold transition-all
              ${activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-md' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'}
            `}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 lg:p-8 space-y-6">
          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">{t('name', 'Name')}</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3.5 text-base font-medium text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">{t('email', 'Email')}</label>
            <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl">
              <EnvelopeIcon className="w-5 h-5 text-gray-500" />
              <span className="text-base font-medium text-gray-800">{profile.email}</span>
              <span className="ml-auto text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">Verified</span>
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">{t('phone', 'Phone')}</label>
            <div className="relative">
              <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
                className="w-full pl-12 pr-4 py-3.5 text-base font-medium text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">{t('vehicle_type', 'Vehicle Type')}</label>
              <select
                value={profile.vehicleType}
                onChange={(e) => setProfile(prev => ({ ...prev, vehicleType: e.target.value }))}
                className="w-full px-4 py-3.5 text-base font-medium text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
              >
                <option value="bicycle">🚲 Bicycle</option>
                <option value="bike">🏍️ Bike</option>
                <option value="scooter">🛵 Scooter</option>
                <option value="car">🚗 Car</option>
                <option value="van">🚐 Van</option>
              </select>
            </div>
            <div>
              <label className="block text-base font-bold text-gray-800 mb-2">{t('vehicle_number', 'Vehicle Number')}</label>
              <input
                type="text"
                value={profile.vehicleNumber}
                onChange={(e) => setProfile(prev => ({ ...prev, vehicleNumber: e.target.value.toUpperCase() }))}
                placeholder="KA 01 AB 1234"
                className="w-full px-4 py-3.5 text-base font-medium text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all uppercase placeholder:text-gray-400 placeholder:font-normal placeholder:normal-case"
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="w-full py-4 bg-blue-600 text-white text-lg rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-3">
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                {t('saving', 'Saving...')}
              </span>
            ) : (
              t('save_changes', 'Save Changes')
            )}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <ShieldCheckIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t('change_password', 'Change Password')}</h3>
              <p className="text-sm font-medium text-gray-500">Update your password to keep your account secure</p>
            </div>
          </div>
          
          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">{t('current_password', 'Current Password')}</label>
            <div className="relative">
              <input
                type={showPassword.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
                className="w-full px-4 py-3.5 pr-12 text-base font-medium text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword.current ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">{t('new_password', 'New Password')}</label>
            <div className="relative">
              <input
                type={showPassword.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password (min 6 characters)"
                className="w-full px-4 py-3.5 pr-12 text-base font-medium text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword.new ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {passwordData.newPassword && passwordData.newPassword.length < 6 && (
              <p className="text-sm font-semibold text-amber-600 mt-2">⚠️ Password must be at least 6 characters</p>
            )}
          </div>

          <div>
            <label className="block text-base font-bold text-gray-800 mb-2">{t('confirm_password', 'Confirm New Password')}</label>
            <div className="relative">
              <input
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your new password"
                className="w-full px-4 py-3.5 pr-12 text-base font-medium text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400 placeholder:font-normal"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                {showPassword.confirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
              <p className="text-sm font-semibold text-red-600 mt-2">❌ Passwords do not match</p>
            )}
            {passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword.length >= 6 && (
              <p className="text-sm font-semibold text-green-600 mt-2 flex items-center gap-1"><CheckCircleIcon className="w-4 h-4" /> Passwords match</p>
            )}
          </div>

          <button
            onClick={handleChangePassword}
            disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword || passwordData.newPassword.length < 6}
            className="w-full py-4 bg-blue-600 text-white text-lg rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-3">
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                {t('updating', 'Updating...')}
              </span>
            ) : (
              t('update_password', 'Update Password')
            )}
          </button>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 lg:p-8 space-y-8">
          {/* Theme */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('theme', 'Appearance')}</h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleThemeChange('light')}
                className={`
                  flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl border-2 transition-all
                  ${settings.theme === 'light' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'}
                `}
              >
                <SunIcon className="w-6 h-6" />
                <span className="text-base font-bold">{t('light', 'Light')}</span>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`
                  flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-xl border-2 transition-all
                  ${settings.theme === 'dark' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'}
                `}
              >
                <MoonIcon className="w-6 h-6" />
                <span className="text-base font-bold">{t('dark', 'Dark')}</span>
              </button>
            </div>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('language', 'Language')}</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { code: 'en', label: 'English', flag: '🇬🇧' },
                { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
                { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`
                    flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 text-base font-bold transition-all
                    ${settings.language === lang.code 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'}
                  `}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">{t('notifications', 'Push Notifications')}</h3>
              <p className="text-sm font-medium text-gray-600 mt-1">{t('receive_notifications', 'Get notified about new orders and updates')}</p>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
              className={`
                relative w-14 h-8 rounded-full transition-all shadow-inner
                ${settings.notifications ? 'bg-blue-600' : 'bg-gray-300'}
              `}
            >
              <span className={`
                absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all
                ${settings.notifications ? 'left-7' : 'left-1'}
              `} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettingsMinimal;