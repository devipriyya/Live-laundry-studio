// Mock API service to simulate real backend responses
// This demonstrates how the dashboard would work with real API data

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate API response with random data variations
const generateRandomStats = () => {
  const baseStats = {
    totalOrders: Math.floor(Math.random() * 50) + 20,
    activeOrders: Math.floor(Math.random() * 8) + 1,
    completedOrders: Math.floor(Math.random() * 45) + 15,
    totalSpent: Math.floor(Math.random() * 5000) + 3000,
    rewardPoints: Math.floor(Math.random() * 800) + 500,
    membershipTier: 'Premium',
    nextRewardAt: 1500,
    co2Saved: Math.floor(Math.random() * 20) + 5
  };
  
  // Ensure completed + active doesn't exceed total
  baseStats.completedOrders = Math.min(baseStats.completedOrders, baseStats.totalOrders - baseStats.activeOrders);
  
  return baseStats;
};

const generateRandomOrders = () => {
  const services = ['Dry Cleaning & Steam Press', 'Wash & Steam Press', 'Steam Press Only'];
  const serviceTypes = ['Regular', 'Express', 'Premium'];
  const statuses = ['In Progress', 'Ready for Pickup', 'Completed', 'Picked Up'];
  const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad'];
  
  const orders = [];
  const orderCount = Math.floor(Math.random() * 5) + 3;
  
  for (let i = 0; i < orderCount; i++) {
    const service = services[Math.floor(Math.random() * services.length)];
    const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
        case 'completed': return 'bg-gray-500';
        case 'in progress': return 'bg-blue-500';
        case 'ready for pickup': return 'bg-green-500';
        case 'picked up': return 'bg-purple-500';
        default: return 'bg-gray-500';
      }
    };
    
    const basePrice = service.includes('Dry Cleaning') ? 300 : service.includes('Wash') ? 200 : 100;
    const multiplier = serviceType === 'Premium' ? 1.5 : serviceType === 'Express' ? 1.3 : 1;
    const amount = Math.floor(basePrice * multiplier);
    
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 7));
    
    orders.push({
      id: `ORD-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      service,
      serviceType,
      status,
      pickupDate: date.toISOString().split('T')[0],
      timeSlot: ['9-12', '12-3', '3-6'][Math.floor(Math.random() * 3)],
      location,
      statusColor: getStatusColor(status),
      amount: `₹${amount}`,
      items: ['Shirt', 'Trousers', 'Dress', 'Jacket', 'Saree', 'Kurta'].slice(0, Math.floor(Math.random() * 3) + 1),
      createdAt: date.toISOString()
    });
  }
  
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const generateRandomActivities = () => {
  const activityTypes = [
    {
      type: 'order_ready',
      title: 'Order #{orderId} is ready for pickup',
      description: 'Your wash & steam press order is ready for collection',
      icon: 'CheckCircleIcon',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      type: 'pickup_scheduled',
      title: 'Pickup scheduled for tomorrow',
      description: 'Your laundry will be collected between 9-12 AM',
      icon: 'TruckIcon',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      type: 'reward_earned',
      title: 'You earned {points} reward points!',
      description: 'Points added for completing order #{orderId}',
      icon: 'GiftIcon',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100'
    },
    {
      type: 'membership_upgrade',
      title: 'Congratulations! You are now a Premium Member',
      description: 'Enjoy exclusive benefits and faster service',
      icon: 'StarIcon',
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100'
    }
  ];
  
  const activities = [];
  const activityCount = Math.floor(Math.random() * 4) + 2;
  
  for (let i = 0; i < activityCount; i++) {
    const template = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const orderId = `ORD-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const points = Math.floor(Math.random() * 100) + 20;
    
    const date = new Date();
    date.setHours(date.getHours() - Math.floor(Math.random() * 72));
    
    activities.push({
      id: `ACT-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      type: template.type,
      title: template.title.replace('{orderId}', orderId).replace('{points}', points),
      description: template.description.replace('{orderId}', orderId),
      timestamp: date.toISOString(),
      icon: template.icon,
      iconColor: template.iconColor,
      iconBg: template.iconBg
    });
  }
  
  return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const generateRewardInfo = () => {
  const currentPoints = Math.floor(Math.random() * 800) + 500;
  const pointsToNext = Math.floor(Math.random() * 300) + 200;
  
  return {
    currentPoints,
    tierInfo: {
      current: 'Premium',
      next: 'Platinum',
      pointsToNext,
      benefits: [
        'Free pickup and delivery',
        'Priority processing',
        '10% discount on all services',
        'Dedicated customer support'
      ]
    },
    availableRewards: [
      {
        id: 'REW-001',
        name: 'Free Dry Cleaning',
        description: 'One free dry cleaning service',
        pointsCost: 500,
        available: currentPoints >= 500
      },
      {
        id: 'REW-002',
        name: '₹100 Off Next Order',
        description: 'Get ₹100 discount on your next order',
        pointsCost: 300,
        available: currentPoints >= 300
      },
      {
        id: 'REW-003',
        name: 'Express Service Upgrade',
        description: 'Free upgrade to express service',
        pointsCost: 200,
        available: currentPoints >= 200
      }
    ]
  };
};

// Mock API service that simulates real backend calls
export const mockApiService = {
  async getDashboardStats(userId) {
    console.log(`🔄 Fetching dashboard stats for user: ${userId}`);
    await delay(800); // Simulate network delay
    
    const stats = generateRandomStats();
    console.log('📊 Dashboard stats loaded:', stats);
    return stats;
  },

  async getRecentOrders(userId, limit = 5) {
    console.log(`🔄 Fetching recent orders for user: ${userId}, limit: ${limit}`);
    await delay(600);
    
    const orders = generateRandomOrders().slice(0, limit);
    console.log('📦 Recent orders loaded:', orders);
    return orders;
  },

  async getActiveOrders(userId) {
    console.log(`🔄 Fetching active orders for user: ${userId}`);
    await delay(700);
    
    const allOrders = generateRandomOrders();
    const activeOrders = allOrders.filter(order => 
      ['In Progress', 'Ready for Pickup'].includes(order.status)
    );
    
    console.log('🚀 Active orders loaded:', activeOrders);
    return activeOrders;
  },

  async getRecentActivities(userId, limit = 5) {
    console.log(`🔄 Fetching recent activities for user: ${userId}, limit: ${limit}`);
    await delay(500);
    
    const activities = generateRandomActivities().slice(0, limit);
    console.log('🔔 Recent activities loaded:', activities);
    return activities;
  },

  async getServices() {
    console.log('🔄 Fetching services...');
    await delay(400);
    
    const services = [
      {
        id: 'SRV-001',
        name: 'Dry Cleaning',
        description: 'Professional dry cleaning for delicate fabrics',
        icon: '👔',
        startingPrice: Math.floor(Math.random() * 50) + 150,
        currency: '₹',
        popular: true
      },
      {
        id: 'SRV-002',
        name: 'Wash & Press',
        description: 'Complete wash and press service',
        icon: '💧',
        startingPrice: Math.floor(Math.random() * 30) + 80,
        currency: '₹',
        popular: true
      },
      {
        id: 'SRV-003',
        name: 'Steam Press',
        description: 'Quick steam pressing service',
        icon: '🔥',
        startingPrice: Math.floor(Math.random() * 20) + 50,
        currency: '₹',
        popular: false
      },
      {
        id: 'SRV-004',
        name: 'Shoe Cleaning',
        description: 'Professional shoe cleaning and polishing',
        icon: '👞',
        startingPrice: Math.floor(Math.random() * 50) + 200,
        currency: '₹',
        popular: Math.random() > 0.5
      }
    ];
    
    console.log('🧺 Services loaded:', services);
    return services;
  },

  async getUserProfile(userId) {
    console.log(`🔄 Fetching user profile for: ${userId}`);
    await delay(300);
    
    const profile = {
      id: userId,
      name: 'Demo User',
      email: 'demo@fabrico.com',
      phone: '+91 9876543210',
      memberSince: '2023-06-15',
      membershipTier: 'Premium',
      loyalCustomer: true,
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true
        },
        defaultLocation: 'Bangalore',
        preferredTimeSlot: '9-12'
      },
      addresses: [
        {
          id: 'ADDR-001',
          type: 'Home',
          address: '123 Main Street, Koramangala, Bangalore - 560034',
          isDefault: true
        },
        {
          id: 'ADDR-002',
          type: 'Office',
          address: '456 Business Park, Whitefield, Bangalore - 560066',
          isDefault: false
        }
      ]
    };
    
    console.log('👤 User profile loaded:', profile);
    return profile;
  },

  async getRewardInfo(userId) {
    console.log(`🔄 Fetching reward info for user: ${userId}`);
    await delay(450);
    
    const rewardInfo = generateRewardInfo();
    console.log('🎁 Reward info loaded:', rewardInfo);
    return rewardInfo;
  }
};

export default mockApiService;
