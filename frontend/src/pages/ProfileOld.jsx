import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  KeyIcon,
  PencilIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarDaysIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bio: ''
  });

  // Load profile data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('fabricspa_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfileData({
          name: parsed.name || user?.name || 'Demo User',
          email: parsed.email || user?.email || 'demo@fabrico.com',
          phone: parsed.phone || '+1 (555) 123-4567',
          dateOfBirth: parsed.dateOfBirth || '1990-01-01',
          gender: parsed.gender || 'prefer-not-to-say'
        });
      } catch (error) {
        setProfileData({
          name: user?.name || 'Demo User',
          email: user?.email || 'demo@fabrico.com',
          phone: '+1 (555) 123-4567',
          dateOfBirth: '1990-01-01',
          gender: 'prefer-not-to-say'
        });
      }
    } else {
      setProfileData({
        name: user?.name || 'Demo User',
        email: user?.email || 'demo@fabrico.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-01-01',
        gender: 'prefer-not-to-say'
      });
    }
  }, [user]);

  const recentOrders = [
    {
      id: 'ORD001',
      service: 'Dry Cleaning',
      items: 5,
      amount: '45.99',
      status: 'Completed',
      date: '2024-01-15'
    },
    {
      id: 'ORD002', 
      service: 'Wash & Fold',
      items: 8,
      amount: '32.50',
      status: 'In Progress',
      date: '2024-01-10'
    },
    {
      id: 'ORD003',
      service: 'Steam Press',
      items: 3,
      amount: '28.75',
      status: 'Ready for Pickup',
      date: '2024-01-08'
    }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const stats = {
    totalOrders: 47,
    totalSpent: 2850.75,
    memberSince: new Date('2023-01-15')
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      localStorage.setItem('fabricspa_profile', JSON.stringify(profileData));
      const updatedUser = { ...user, name: profileData.name, email: profileData.email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const tabs = [
    { id: 'profile', name: 'Personal Info', icon: UserCircleIcon },
    { id: 'orders', name: 'Order History', icon: ShoppingBagIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-500">Manage your account information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              {/* Simple Avatar */}
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  {(profileData.name || 'User').charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">{profileData.name}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {profileData.email}
                </p>
                <div className="flex items-center space-x-4 mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Member since {new Date(stats.memberSince).getFullYear()}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {stats.totalOrders} orders
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Simple Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold text-lg">$</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-2xl font-semibold text-gray-900">{formatDate(stats.memberSince)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Simple Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">3 active orders</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '80%'}}></div>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">80% to next reward tier</p>
                </div>
              </div>
              <nav className="space-y-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group w-full flex items-center space-x-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl transform scale-105'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 hover:shadow-lg hover:scale-102'
                      }`}
                    >
                      <Icon className={`h-6 w-6 transition-transform duration-300 ${activeTab === tab.id ? 'text-white' : 'group-hover:scale-110'}`} />
                      <span className="font-semibold flex-1">{tab.name}</span>
                      {tab.id === 'orders' && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                          activeTab === tab.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-blue-100 text-blue-800 group-hover:bg-blue-200'
                        }`}>
                          3
                        </span>
                      )}
                      {activeTab !== tab.id && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Enhanced Quick Actions */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="group relative bg-gradient-to-br from-blue-500 to-indigo-600 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-500">
                          <ShoppingBagIcon className="h-8 w-8 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg">New Order</span>
                        <span className="text-blue-100 text-sm mt-2">Start a new laundry order</span>
                      </div>
                    </button>
                    <button className="group relative bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-500">
                          <TruckIcon className="h-8 w-8 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg">Track Order</span>
                        <span className="text-green-100 text-sm mt-2">Monitor your deliveries</span>
                      </div>
                    </button>
                    <button className="group relative bg-gradient-to-br from-purple-500 to-pink-600 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-500">
                          <GiftIcon className="h-8 w-8 text-white" />
                        </div>
                        <span className="font-bold text-white text-lg">Redeem Points</span>
                        <span className="text-purple-100 text-sm mt-2">Use your loyalty rewards</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Enhanced Recent Orders */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Recent Orders</h3>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <span className="font-semibold mr-2">View All</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 3).map((order, index) => (
                      <div key={order.id} className="group relative bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-102 border border-gray-100 hover:border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">#{order.id.slice(-2)}</span>
                                </div>
                                <h4 className="font-bold text-gray-900 text-lg">#{order.id}</h4>
                              </div>
                              <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg ${order.statusColor} group-hover:scale-105 transition-transform duration-300`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center">
                                <ShoppingBagIcon className="h-4 w-4 mr-1" />
                                {order.service}
                              </span>
                              <span className="flex items-center">
                                <TagIcon className="h-4 w-4 mr-1" />
                                {order.items} items
                              </span>
                              <span className="flex items-center">
                                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                                {order.date}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${order.amount}</p>
                            <div className="flex space-x-2 mt-2">
                              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors">
                                View
                              </button>
                              <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors">
                                Reorder
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Achievements */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 hover:scale-105 ${
                        achievement.unlocked 
                          ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg hover:shadow-xl' 
                          : 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 hover:border-gray-300'
                      }`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 ${
                            achievement.unlocked 
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg' 
                              : 'bg-gray-200'
                          }`}>
                            <span className={achievement.unlocked ? 'filter drop-shadow-sm' : 'grayscale'}>{achievement.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-bold text-lg mb-1 ${achievement.unlocked ? 'text-green-800' : 'text-gray-500'}`}>
                              {achievement.name}
                            </h4>
                            <p className={`text-sm mb-3 ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'}`}>
                              {achievement.description}
                            </p>
                            {!achievement.unlocked && (
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                                  style={{width: `${achievement.progress}%`}}
                                ></div>
                              </div>
                            )}
                          </div>
                          {achievement.unlocked && (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckIcon className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                      <InformationCircleIcon className="h-8 w-8 text-blue-600" />
                      <span>Personal Information</span>
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      <PencilIcon className="h-4 w-4" />
                      <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Enhanced Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center space-x-2">
                          <UserCircleIcon className="h-5 w-5 text-gray-500" />
                          <span>{profileData.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter your email"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center space-x-2">
                          <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                          <span>{profileData.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center space-x-2">
                          <PhoneIcon className="h-5 w-5 text-gray-500" />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center space-x-2">
                          <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                          <span>{formatDate(profileData.dateOfBirth)}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                      </label>
                      {isEditing ? (
                        <select
                          value={profileData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center space-x-2">
                          <UserCircleIcon className="h-5 w-5 text-gray-500" />
                          <span className="capitalize">{profileData.gender.replace('-', ' ')}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 flex items-center space-x-2">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
                        <span>{formatDate(stats.memberSince)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                        <p>{profileData.bio}</p>
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <div className="flex space-x-4 mt-8">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <CheckIcon className="h-4 w-4" />
                        )}
                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200 disabled:opacity-50"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <ShoppingBagIcon className="h-8 w-8 text-blue-600" />
                    <span>Order History</span>
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-semibold text-gray-900">#{order.id}</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${order.statusColor}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">${order.amount}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Service:</span> {order.service}
                          </div>
                          <div>
                            <span className="font-medium">Items:</span> {order.items}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {order.date}
                          </div>
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            View Details
                          </button>
                          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            Reorder
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loyalty Tab */}
            {activeTab === 'loyalty' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <GiftIcon className="h-8 w-8 text-purple-600" />
                    <span>Loyalty & Rewards</span>
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Current Status */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.rewardTier} Member</h3>
                        <p className="text-gray-600">You have {stats.loyaltyPoints} points</p>
                      </div>
                      <div className="text-4xl">🏆</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{width: '80%'}}></div>
                    </div>
                    <p className="text-sm text-gray-600">250 points to next tier (Platinum)</p>
                  </div>

                  {/* Available Rewards */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Available Rewards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">Free Dry Cleaning</h4>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">500 pts</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Get one item dry cleaned for free</p>
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          Redeem
                        </button>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">$10 Off</h4>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">300 pts</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">$10 discount on your next order</p>
                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                          Redeem
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
                    <span>Security Settings</span>
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                          <KeyIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                          <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <ShieldCheckIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                      <MapPinIcon className="h-8 w-8 text-blue-600" />
                      <span>Delivery Addresses</span>
                    </h2>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Address</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {showAddressForm && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                          <select
                            value={newAddress.type}
                            onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Type</option>
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                          <input
                            type="text"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter street address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter state"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter ZIP code"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={handleAddAddress}
                          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200"
                        >
                          Add Address
                        </button>
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {address.type}
                              </span>
                              {address.isDefault && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-900 font-medium">{address.address}</p>
                            <p className="text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefault(address.id)}
                                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-red-500 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <Cog6ToothIcon className="h-8 w-8 text-blue-600" />
                    <span>Preferences</span>
                  </h2>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Notifications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <BellIcon className="h-5 w-5 text-blue-600" />
                      <span>Notifications</span>
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(preferences.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{key} Notifications</p>
                            <p className="text-sm text-gray-600">Receive notifications via {key}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          value={preferences.language}
                          onChange={(e) => handlePreferenceChange('', 'language', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={preferences.currency}
                          onChange={(e) => handlePreferenceChange('', 'currency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.current ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.new ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.confirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                    <button
                      onClick={() => setShowPasswordModal(false)}
                      disabled={loading}
                      className="px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all duration-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                      <MapPinIcon className="h-8 w-8 text-indigo-600" />
                      <span>Delivery Addresses</span>
                    </h2>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Address</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  {showAddressForm && (
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                          <select
                            value={newAddress.type}
                            onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select Type</option>
                            <option value="Home">Home</option>
                            <option value="Office">Office</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                          <input
                            type="text"
                            value={newAddress.address}
                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter street address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter city"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter state"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter ZIP code"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={handleAddAddress}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                        >
                          Add Address
                        </button>
                        <button
                          onClick={() => setShowAddressForm(false)}
                          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800">
                                {address.type}
                              </span>
                              {address.isDefault && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-900 font-medium">{address.address}</p>
                            <p className="text-gray-600">{address.city}, {address.state} {address.zipCode}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleSetDefault(address.id)}
                                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Set Default
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-red-500 hover:text-red-600 transition-colors"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <CogIcon className="h-8 w-8 text-indigo-600" />
                    <span>Preferences</span>
                  </h2>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Notifications */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <BellIcon className="h-5 w-5 text-indigo-600" />
                      <span>Notifications</span>
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(preferences.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{key} Notifications</p>
                            <p className="text-sm text-gray-600">Receive notifications via {key}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          value={preferences.language}
                          onChange={(e) => handlePreferenceChange('', 'language', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                        <select
                          value={preferences.currency}
                          onChange={(e) => handlePreferenceChange('', 'currency', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="INR">INR (₹)</option>
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <ChartBarIcon className="h-8 w-8 text-indigo-600" />
                    <span>Statistics</span>
                  </h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <ChartBarIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold">₹</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Spent</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <GiftIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                          <p className="text-2xl font-bold text-gray-900">{stats.loyaltyPoints}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-6 border border-orange-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Member Since</p>
                          <p className="text-lg font-bold text-gray-900">{formatDate(stats.memberSince)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.current ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  disabled={loading}
                  className="px-4 py-3 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;