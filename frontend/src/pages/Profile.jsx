import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../api';
import '../styles/ProfileAnimations.css';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  PencilIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CogIcon,
  StarIcon,
  GiftIcon,
  HeartIcon,
  GlobeAltIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  CameraIcon,
  PhotoIcon,
  FireIcon,
  BoltIcon,
  ChartBarIcon,
  TrophyIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const Profile = () => {
  const authContext = useContext(AuthContext);
  const { user, setUser } = authContext || { user: null, setUser: () => {} };
  const navigate = useNavigate();
  const { isDarkMode, accentColor, setAccentColor } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  
  // Profile data state with safe defaults
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'prefer-not-to-say',
    bio: '',
    profileImageUrl: null
  });

  // Laundry-specific data
  const [addresses, setAddresses] = useState([]);

  const [preferences, setPreferences] = useState({
    fabricCare: 'gentle',
    detergentType: 'eco-friendly',
    starchLevel: 'light',
    specialInstructions: '',
    notifications: {
      email: true,
      sms: true,
      orderUpdates: true,
      promotions: false
    }
  });

  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  // Stats with default values
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0.00,
    memberSince: new Date().toISOString().split('T')[0],
    loyaltyPoints: 0,
    co2Saved: 0.0,
    favoriteService: 'Not Available',
    currentTier: 'New Member'
  });

  // Load profile data on mount with better error handling
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        // If no user, redirect to login
        navigate('/');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile from backend
        const response = await api.get('/profile');
        const userData = response.data;
        
        console.log('Fetched user profile:', userData);
        
        // Set profile data
        setProfileData({
          name: userData.name || user?.name || '',
          email: userData.email || user?.email || '',
          phone: userData.phone || '',
          dateOfBirth: userData.dateOfBirth || '',
          gender: userData.gender || 'prefer-not-to-say',
          bio: userData.bio || 'Loyal WashLab customer who loves eco-friendly cleaning services.',
          profileImageUrl: userData.profilePicture || null
        });
        
        // Set addresses
        setAddresses(userData.addresses || [
          {
            id: 1,
            type: 'Home',
            name: 'Home Address',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            isDefault: true
          }
        ]);
        
        // Set preferences
        setPreferences({
          fabricCare: userData.preferences?.fabricCare || 'gentle',
          detergentType: userData.preferences?.detergentType || 'eco-friendly',
          starchLevel: userData.preferences?.starchLevel || 'light',
          specialInstructions: userData.preferences?.specialInstructions || 'Please handle delicate items with extra care',
          notifications: {
            email: userData.preferences?.notifications?.email ?? true,
            sms: userData.preferences?.notifications?.sms ?? true,
            orderUpdates: userData.preferences?.notifications?.orderUpdates ?? true,
            promotions: userData.preferences?.notifications?.promotions ?? false
          }
        });
        
        // Set stats from backend response
        if (userData.stats) {
          setStats(userData.stats);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again.');
        
        // Fallback to user context data
        setProfileData({
          name: user?.name || 'Demo User',
          email: user?.email || 'demo@fabrico.com',
          phone: '+1 (555) 123-4567',
          dateOfBirth: '1990-01-01',
          gender: 'prefer-not-to-say',
          bio: 'Loyal WashLab customer who loves eco-friendly cleaning services.',
          profileImageUrl: null
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user, navigate]);

  const loyaltyRewards = [
    {
      id: 1,
      title: 'Free Dry Cleaning',
      description: 'Get one item dry cleaned for free',
      points: 500,
      available: true
    },
    {
      id: 2,
      title: '$10 Off Next Order',
      description: 'Save $10 on orders over $50',
      points: 300,
      available: true
    },
    {
      id: 3,
      title: 'Premium Service Upgrade',
      description: 'Upgrade to premium service for free',
      points: 800,
      available: false
    }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
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

  // Add validation error state
  const [errors, setErrors] = useState({});
  const [addressErrors, setAddressErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Validation functions
  const validateProfileData = (data) => {
    const errors = {};

    // Name validation
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Name is required';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    } else if (data.name.trim().length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }

    // Email validation
    if (!data.email || data.email.trim().length === 0) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (data.email.length > 100) {
      errors.email = 'Email must be less than 100 characters';
    }

    // Phone validation
    if (!data.phone || data.phone.trim().length === 0) {
      errors.phone = 'Phone number is required';
    } else if (!/^[+]?[0-9\s\-\(\)]{10,20}$/.test(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Date of birth validation
    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      
      if (dob > today) {
        errors.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (age > 120) {
        errors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    // Bio validation
    if (data.bio && data.bio.length > 500) {
      errors.bio = 'Bio must be less than 500 characters';
    }

    return errors;
  };

  const validateAddress = (address) => {
    const errors = {};

    // Address name validation
    if (!address.name || address.name.trim().length === 0) {
      errors.name = 'Address name is required';
    } else if (address.name.trim().length > 50) {
      errors.name = 'Address name must be less than 50 characters';
    }

    // Street validation
    if (!address.street || address.street.trim().length === 0) {
      errors.street = 'Street address is required';
    } else if (address.street.trim().length > 100) {
      errors.street = 'Street address must be less than 100 characters';
    }

    // City validation
    if (!address.city || address.city.trim().length === 0) {
      errors.city = 'City is required';
    } else if (address.city.trim().length > 50) {
      errors.city = 'City must be less than 50 characters';
    }

    // State validation
    if (!address.state || address.state.trim().length === 0) {
      errors.state = 'State is required';
    } else if (address.state.trim().length > 50) {
      errors.state = 'State must be less than 50 characters';
    }

    // ZIP code validation
    if (!address.zipCode || address.zipCode.trim().length === 0) {
      errors.zipCode = 'ZIP code is required';
    } else if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(address.zipCode)) {
      errors.zipCode = 'Please enter a valid ZIP code';
    }

    return errors;
  };

  const validatePassword = (passwordData) => {
    const errors = {};

    // Current password validation
    if (!passwordData.currentPassword || passwordData.currentPassword.length === 0) {
      errors.currentPassword = 'Current password is required';
    } else if (passwordData.currentPassword.length < 6) {
      errors.currentPassword = 'Current password must be at least 6 characters';
    }

    // New password validation
    if (!passwordData.newPassword || passwordData.newPassword.length === 0) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!passwordData.confirmPassword || passwordData.confirmPassword.length === 0) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  // Update address input handlers to clear errors
  const handleAddressInputChange = (field, value) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (addressErrors[field]) {
      setAddressErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Update password input handlers to clear errors
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };


  const handleSaveProfile = async () => {
    // Validate profile data
    const validationErrors = validateProfileData(profileData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setLoading(true);
    
    try {
      // Save profile data to backend instead of localStorage
      const profilePayload = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        bio: profileData.bio,
        profilePicture: profileData.profileImageUrl,
        addresses: addresses,
        preferences: preferences
      };
      
      const response = await api.put('/profile', profilePayload);
      
      // Update user context with new data
      if (user && setUser) {
        const updatedUser = { ...user, name: profileData.name, email: profileData.email };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
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
    // Validate password data
    const validationErrors = validatePassword(passwordData);
    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setPasswordErrors({});
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordModal(false);
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    // Validate address data
    const validationErrors = validateAddress(newAddress);
    if (Object.keys(validationErrors).length > 0) {
      setAddressErrors(validationErrors);
      return;
    }

    // Clear errors if validation passes
    setAddressErrors({});
    const newId = Math.max(...addresses.map(a => a.id)) + 1;
    const addressToAdd = { ...newAddress, id: newId };
    setAddresses([...addresses, addressToAdd]);
    setNewAddress({ type: 'Home', name: '', street: '', city: '', state: '', zipCode: '', isDefault: false });
    setShowAddressModal(false);
    alert('Address added successfully!');
  };

  const handleDeleteAddress = (id) => {
    if (addresses.length === 1) {
      alert('You must have at least one address.');
      return;
    }
    setAddresses(addresses.filter(addr => addr.id !== id));
    alert('Address deleted successfully!');
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    alert('Default address updated!');
  };

  const handlePreferenceChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setPreferences(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleRedeemReward = (rewardId) => {
    const reward = loyaltyRewards.find(r => r.id === rewardId);
    if (reward && stats.loyaltyPoints >= reward.points) {
      alert(`Successfully redeemed: ${reward.title}`);
    } else {
      alert('Insufficient loyalty points for this reward.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date) => {
    try {
      if (!date) return 'Not specified';
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Image upload handlers
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
      }

      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    setProfileData(prev => ({
      ...prev,
      profileImageUrl: null
    }));
  };

  const handleSaveImage = async () => {
    if (profileImage) {
      setLoading(true);
      try {
        // In a real app, you would upload to a server here
        // For now, we'll store the base64 data URL in localStorage
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target.result;
          setProfileData(prev => ({
            ...prev,
            profileImageUrl: imageUrl
          }));
          setImagePreview(null);
          setProfileImage(null);
          alert('Profile image updated successfully!');
          setLoading(false);
        };
        reader.readAsDataURL(profileImage);
      } catch (error) {
        console.error('Error saving image:', error);
        alert('Failed to save image. Please try again.');
        setLoading(false);
      }
    }
  };

  const tabs = [
    { id: 'profile', name: 'Personal Info', icon: UserCircleIcon },
    { id: 'addresses', name: 'Addresses', icon: MapPinIcon },
    { id: 'preferences', name: 'Preferences', icon: CogIcon },
    { id: 'loyalty', name: 'Loyalty & Rewards', icon: GiftIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon }
  ];

  // Use demo data if no user is found
  const currentUser = user || {
    name: 'Demo User',
    email: 'demo@fabrico.com'
  };

  // Color themes based on accent color
  const colorThemes = {
    blue: {
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      lightGradient: 'from-blue-50 to-indigo-50',
      accent: 'blue-600',
      accentLight: 'blue-50',
      accentDark: 'blue-700',
      ring: 'ring-blue-500',
      text: 'text-blue-600'
    },
    purple: {
      gradient: 'from-purple-600 via-pink-600 to-red-600',
      lightGradient: 'from-purple-50 to-pink-50',
      accent: 'purple-600',
      accentLight: 'purple-50',
      accentDark: 'purple-700',
      ring: 'ring-purple-500',
      text: 'text-purple-600'
    },
    green: {
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      lightGradient: 'from-green-50 to-emerald-50',
      accent: 'green-600',
      accentLight: 'green-50',
      accentDark: 'green-700',
      ring: 'ring-green-500',
      text: 'text-green-600'
    },
    orange: {
      gradient: 'from-orange-600 via-red-600 to-pink-600',
      lightGradient: 'from-orange-50 to-red-50',
      accent: 'orange-600',
      accentLight: 'orange-50',
      accentDark: 'orange-700',
      ring: 'ring-orange-500',
      text: 'text-orange-600'
    },
    red: {
      gradient: 'from-red-600 via-pink-600 to-rose-600',
      lightGradient: 'from-red-50 to-pink-50',
      accent: 'red-600',
      accentLight: 'red-50',
      accentDark: 'red-700',
      ring: 'ring-red-500',
      text: 'text-red-600'
    }
  };

  const currentTheme = colorThemes[accentColor] || colorThemes.blue;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
      {/* Simple Clean Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/home')}
                className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-600">Manage your account information</p>
              </div>
            </div>
            
            {/* Theme Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 mr-2">Theme:</span>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                {Object.keys(colorThemes).map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`w-8 h-8 rounded-md transition-all duration-200 ${
                      accentColor === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-105'
                    }`}
                    style={{
                      background: color === 'blue' ? '#3b82f6' :
                                  color === 'purple' ? '#a855f7' :
                                  color === 'green' ? '#10b981' :
                                  color === 'orange' ? '#f97316' :
                                  '#ef4444'
                    }}
                    title={`${color.charAt(0).toUpperCase() + color.slice(1)} theme`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Simple Profile Header Card */}
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 mb-6">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              {/* Profile Image */}
              <div className="relative group">
                <div className={`w-24 h-24 rounded-full overflow-hidden bg-${currentTheme.accent} flex items-center justify-center shadow-md ring-4 ring-${currentTheme.accentLight}`}>
                  {imagePreview || profileData.profileImageUrl ? (
                    <img 
                      src={imagePreview || profileData.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-3xl font-bold">
                      {(profileData.name || 'User').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                {/* Upload Button - Always visible on hover */}
                <div className="absolute bottom-0 right-0 opacity-100">
                  <label className={`cursor-pointer bg-${currentTheme.accent} hover:bg-${currentTheme.accentDark} text-white p-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center border-2 border-white`}>
                    <CameraIcon className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Image Preview Actions - Save/Cancel */}
                {imagePreview && (
                  <div className="absolute -top-2 -right-2 flex space-x-1">
                    <button
                      onClick={handleSaveImage}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 border-2 border-white"
                      title="Save image"
                    >
                      <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setProfileImage(null);
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border-2 border-white"
                      title="Cancel"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {/* Remove Image Button */}
                {profileData.profileImageUrl && !imagePreview && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={handleRemoveImage}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110 border-2 border-white"
                      title="Remove image"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {profileData.email}
                </p>
                <div className="flex items-center space-x-3 mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${currentTheme.accentLight} text-${currentTheme.accent}`}>
                    <StarIcon className="h-3 w-3 mr-1" />
                    {stats.currentTier}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <CalendarDaysIcon className="h-3 w-3 mr-1" />
                    Since {new Date(stats.memberSince).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Welcome Message for New Users */}
        {stats.totalOrders === 0 && (
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg p-6 mb-6 text-white shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-white">Welcome to FabricSpa! 🎉</h3>
                <p className="text-white opacity-90 mb-4">
                  Ready to experience premium laundry services? Start your journey with us today.
                </p>
                <button 
                  onClick={() => navigate('/schedule-pickup')}
                  className={`bg-white ${currentTheme.text} px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center space-x-2`}>
                  <span>Schedule Your First Pickup</span>
                  <BoltIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics cards removed as per user request */}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Simple Sidebar Navigation */}
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
                          ? `bg-${currentTheme.accentLight} text-${currentTheme.accent} font-semibold border-l-4 border-${currentTheme.accent}`
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
                      <p className="text-sm text-gray-600 mt-1">Update your profile details and preferences</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      disabled={loading}
                      className={`flex items-center space-x-2 px-5 py-2.5 bg-${currentTheme.accent} hover:bg-${currentTheme.accentDark} text-white rounded-lg transition-colors disabled:opacity-50`}
                    >
                      {isEditing ? (
                        <>
                          <XMarkIcon className="h-4 w-4" />
                          <span className="font-semibold">Cancel</span>
                        </>
                      ) : (
                        <>
                          <PencilIcon className="h-4 w-4" />
                          <span className="font-semibold">Edit Profile</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full px-5 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-medium text-gray-900 bg-white ${
                              errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-900">
                          <span className="font-medium text-gray-900">{profileData.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`w-full px-5 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-medium text-gray-900 bg-white ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your email"
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-900">
                          <span className="font-medium text-gray-900">{profileData.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className={`w-full px-5 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-medium text-gray-900 bg-white ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your phone number"
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-900">
                          <span className="font-medium text-gray-900">{profileData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                            className={`w-full px-5 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-medium text-gray-900 bg-white ${
                              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors.dateOfBirth && (
                            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-900">
                          <span className="font-medium text-gray-900">{formatDate(profileData.dateOfBirth)}</span>
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
                          className="w-full px-5 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-medium text-gray-900 bg-white"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      ) : (
                        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-900">
                          <span className="font-medium capitalize text-gray-900">{profileData.gender.replace('-', ' ')}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Member Since
                      </label>
                      <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-900">
                        <span className="font-medium text-gray-900">{formatDate(stats.memberSince)}</span>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      {isEditing ? (
                        <>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            rows={4}
                            className={`w-full px-5 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 font-medium resize-none text-gray-900 bg-white ${
                              errors.bio ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Tell us about yourself..."
                          />
                          {errors.bio && (
                            <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-900">
                          <span className="text-gray-900">{profileData.bio}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex space-x-4 mt-6">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className={`flex items-center space-x-2 px-6 py-2.5 bg-${currentTheme.accent} hover:bg-${currentTheme.accentDark} text-white rounded-lg transition-colors disabled:opacity-50`}
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <CheckIcon className="h-4 w-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          // Clear errors when canceling
                          setErrors({});
                        }}
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Addresses</h2>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Address</span>
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-yellow-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <MapPinIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{address.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                address.type === 'Home' ? 'bg-green-100 text-green-800' :
                                address.type === 'Office' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {address.type}
                              </span>
                            </div>
                          </div>
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-4">
                          <p>{address.street}</p>
                          <p>{address.city}, {address.state} {address.zipCode}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-lg hover:bg-yellow-200 transition-colors"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Laundry Preferences</h2>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Fabric Care Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fabric Care</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fabric Care Level
                        </label>
                        <select
                          value={preferences.fabricCare}
                          onChange={(e) => handlePreferenceChange('fabricCare', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="gentle">Gentle Care</option>
                          <option value="standard">Standard Care</option>
                          <option value="intensive">Intensive Care</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Detergent Type
                        </label>
                        <select
                          value={preferences.detergentType}
                          onChange={(e) => handlePreferenceChange('detergentType', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="eco-friendly">Eco-Friendly</option>
                          <option value="hypoallergenic">Hypoallergenic</option>
                          <option value="standard">Standard</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Starch Level
                        </label>
                        <select
                          value={preferences.starchLevel}
                          onChange={(e) => handlePreferenceChange('starchLevel', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="none">No Starch</option>
                          <option value="light">Light Starch</option>
                          <option value="medium">Medium Starch</option>
                          <option value="heavy">Heavy Starch</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Instructions
                      </label>
                      <textarea
                        value={preferences.specialInstructions}
                        onChange={(e) => handlePreferenceChange('specialInstructions', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any special care instructions for your items..."
                      />
                    </div>
                  </div>
                  
                  {/* Notification Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive order updates via email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.notifications.email}
                            onChange={(e) => handlePreferenceChange('notifications.email', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                          <p className="text-sm text-gray-600">Receive order updates via text message</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.notifications.sms}
                            onChange={(e) => handlePreferenceChange('notifications.sms', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Order Updates</h4>
                          <p className="text-sm text-gray-600">Get notified about order status changes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.notifications.orderUpdates}
                            onChange={(e) => handlePreferenceChange('notifications.orderUpdates', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Promotional Offers</h4>
                          <p className="text-sm text-gray-600">Receive special offers and discounts</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.notifications.promotions}
                            onChange={(e) => handlePreferenceChange('notifications.promotions', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loyalty & Rewards Tab */}
            {activeTab === 'loyalty' && (
              <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Loyalty & Rewards</h2>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Current Status */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                          <StarIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{stats.currentTier}</h3>
                          <p className="text-sm text-gray-600">Welcome to FabricSpa!</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">{stats.loyaltyPoints}</p>
                        <p className="text-sm text-gray-600">Points available</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress to Silver</span>
                        <span>0 / 100 points</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{width: '0%'}}></div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Place your first order to start earning points and unlock <span className="font-semibold">Silver tier benefits</span>!
                    </p>
                  </div>
                  
                  {/* Available Rewards */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {loyaltyRewards.map((reward) => (
                        <div key={reward.id} className={`border rounded-lg p-6 ${
                          reward.available ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                reward.available ? 'bg-green-100' : 'bg-gray-100'
                              }`}>
                                <GiftIcon className={`h-5 w-5 ${
                                  reward.available ? 'text-green-600' : 'text-gray-400'
                                }`} />
                              </div>
                              <div>
                                <h4 className={`font-semibold ${
                                  reward.available ? 'text-gray-900' : 'text-gray-500'
                                }`}>{reward.title}</h4>
                                <p className={`text-sm ${
                                  reward.available ? 'text-gray-600' : 'text-gray-400'
                                }`}>{reward.description}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-lg font-bold ${
                              reward.available ? 'text-blue-600' : 'text-gray-400'
                            }`}>
                              {reward.points} points
                            </span>
                            <button
                              onClick={() => handleRedeemReward(reward.id)}
                              disabled={!reward.available || stats.loyaltyPoints < reward.points}
                              className={`px-4 py-2 rounded-lg transition-colors ${
                                reward.available && stats.loyaltyPoints >= reward.points
                                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {reward.available && stats.loyaltyPoints >= reward.points ? 'Redeem' : 'Unavailable'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-sm border border-yellow-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <KeyIcon className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Password</h3>
                          <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>

                  <div className="border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Type
                  </label>
                  <select
                    value={newAddress.type}
                    onChange={(e) => handleAddressInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Name
                  </label>
                  <input
                    type="text"
                    value={newAddress.name}
                    onChange={(e) => handleAddressInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      addressErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Home Address"
                  />
                  {addressErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{addressErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={(e) => handleAddressInputChange('street', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      addressErrors.street ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="123 Main Street"
                  />
                  {addressErrors.street && (
                    <p className="mt-1 text-sm text-red-600">{addressErrors.street}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => handleAddressInputChange('city', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        addressErrors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="New York"
                    />
                    {addressErrors.city && (
                      <p className="mt-1 text-sm text-red-600">{addressErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => handleAddressInputChange('state', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        addressErrors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="NY"
                    />
                    {addressErrors.state && (
                      <p className="mt-1 text-sm text-red-600">{addressErrors.state}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={newAddress.zipCode}
                    onChange={(e) => handleAddressInputChange('zipCode', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      addressErrors.zipCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10001"
                  />
                  {addressErrors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{addressErrors.zipCode}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={newAddress.isDefault}
                    onChange={(e) => handleAddressInputChange('isDefault', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
                    Set as default address
                  </label>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleAddAddress}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Address
                </button>
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    // Clear errors and form when canceling
                    setAddressErrors({});
                    setNewAddress({ type: 'Home', name: '', street: '', city: '', state: '', zipCode: '', isDefault: false });
                  }}
                  className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 ${
                        passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 ${
                        passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 ${
                        passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
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
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    // Clear errors and form when canceling
                    setPasswordErrors({});
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  disabled={loading}
                  className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
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