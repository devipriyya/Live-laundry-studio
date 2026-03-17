import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  PhotoIcon,
  PowerIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import laundryStaffService from '../../services/laundryStaffService';

const StaffProfile = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await laundryStaffService.getProfile();
      setProfileData(data.profile || null);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      await laundryStaffService.updateProfile(profileData);
      setMessage({ type: 'success', text: t('profile_updated', 'Profile updated successfully!') });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: t('profile_update_failed', 'Failed to update profile') });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">{t('loading_profile', 'Loading profile...')}</p>
      </div>
    );
  }

  // Use real profile data with safe fallbacks to AuthContext user
  const displayUser = profileData || {
    name: user?.name || 'Staff Member',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'Laundry Staff',
    employeeId: user?._id?.substring(0, 8) || '---',
    joinDate: user?.createdAt || new Date().toISOString()
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('my_profile', 'My Profile')}</h1>
          <p className="text-gray-500 text-sm">{t('profile_subtitle', 'Manage your personal information and account settings')}</p>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
        >
          <PowerIcon className="w-5 h-5" />
          {t('logout', 'Logout')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-xl border-4 border-white">
                {displayUser.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-blue-600 hover:bg-gray-50 transition-all">
                <PhotoIcon className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{displayUser.name}</h2>
            <p className="text-blue-600 font-semibold text-sm mb-6">{displayUser.role}</p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-6">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{t('employee_id', 'ID')}</p>
                <p className="text-sm font-bold text-gray-800">{displayUser.employeeId}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{t('joined', 'Joined')}</p>
                <p className="text-sm font-bold text-gray-800">{new Date(displayUser.joinDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6 text-blue-200" />
              {t('account_status', 'Account Status')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">{t('identity_verified', 'Identity Verified')}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">{t('background_check', 'Background Check Cleared')}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">{t('certified_technician', 'Certified Laundry Tech')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-8 flex items-center gap-2">
              <UserCircleIcon className="w-6 h-6 text-blue-500" />
              {t('personal_information', 'Personal Information')}
            </h3>

            {message.text && (
              <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {message.type === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <ExclamationTriangleIcon className="w-5 h-5" />}
                <span className="text-sm font-bold">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">{t('full_name', 'Full Name')}</label>
                  <div className="relative">
                    <UserCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={displayUser.name}
                      onChange={(e) => setProfileData({...displayUser, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">{t('email_address', 'Email Address')}</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email" 
                      value={displayUser.email}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">{t('phone_number', 'Phone Number')}</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="tel" 
                      value={displayUser.phone}
                      onChange={(e) => setProfileData({...displayUser, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                >
                  {saving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <CheckCircleIcon className="w-5 h-5" />}
                  {t('save_changes', 'Save Changes')}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-8 flex items-center gap-2">
              <LockClosedIcon className="w-6 h-6 text-indigo-500" />
              {t('security', 'Security')}
            </h3>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <LockClosedIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-bold text-indigo-900">{t('change_password', 'Change Password')}</p>
                  <p className="text-xs text-indigo-700">{t('password_hint', 'It\'s a good idea to use a strong password')}</p>
                </div>
              </div>
              <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold border border-indigo-200 hover:bg-indigo-50 transition-all">
                {t('update', 'Update')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
