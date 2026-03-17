import React, { useContext, useState, useEffect } from 'react';
import api from '../../api';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  SparklesIcon,
  StarIcon,
  ShoppingBagIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  ChevronRightIcon,
  TruckIcon,
  ClockIcon,
  BoltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  HeartIcon,
  // EnvelopeIcon,  // Removed mail icon import
  PhoneIcon,
  MapPinIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UserCircleIcon,
  TagIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  BuildingStorefrontIcon,
  InformationCircleIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  ScissorsIcon,
  HandRaisedIcon,
  BeakerIcon,
  NewspaperIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

// Add the ServiceRecommendations import
import ServiceRecommendations from '../../components/ServiceRecommendations';
import CustomerSegment from '../../components/CustomerSegment';
import LoyaltyCard from '../../components/loyalty/LoyaltyCard';
import AdvertisementBanner from '../../components/AdvertisementBanner';

const DashboardHome = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/notifications/my');
        if (response.data.success) {
          setUnreadCount(response.data.unreadCount);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };
    fetchUnreadCount();
  }, []);

  // Mock order history for demonstration - in a real app, this would come from an API
  const mockOrderHistory = [
    {
      userOrderCount: 5,
      totalAmount: 1200,
      orderDate: '2023-05-15T10:30:00Z',
      items: [{ service: 'washAndPress' }]
    },
    {
      userOrderCount: 5,
      totalAmount: 1450,
      orderDate: '2023-05-10T11:15:00Z',
      items: [{ service: 'washAndPress' }]
    },
    {
      userOrderCount: 5,
      totalAmount: 1100,
      orderDate: '2023-05-05T09:45:00Z',
      items: [{ service: 'washAndPress' }]
    }
  ];

  // Mock customer data for segmentation
  const mockCustomerData = {
    orderFrequency: 15,
    avgOrderValue: 1250,
    daysSinceLastOrder: 5,
    serviceVariety: 3,
    satisfactionScore: 4.8,
    referralCount: 2,
    discountUsage: 4,
    complaintCount: 0,
    segment: 'premium'
  };

  // Dashboard functionality cards - all features from sidebar
  const functionalityCards = [
    {
      id: 'profile',
      title: t('dashboard.cards.profile.title'),
      description: t('dashboard.cards.profile.desc'),
      icon: UserCircleIcon,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      path: '/dashboard/profile',
      action: t('dashboard.cards.profile.action')
    },
    {
      id: 'shoe-cleaning',
      title: t('dashboard.cards.shoe_cleaning.title'),
      description: t('dashboard.cards.shoe_cleaning.desc'),
      icon: SparklesIcon,
      gradient: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-amber-200',
      path: '/dashboard/shoe-cleaning',
      action: t('dashboard.cards.shoe_cleaning.action'),
      badge: 'NEW'
    },
    {
      id: 'schedule',
      title: t('dashboard.cards.schedule.title'),
      description: t('dashboard.cards.schedule.desc'),
      icon: CalendarDaysIcon,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-200',
      path: '/dashboard/schedule',
      action: t('dashboard.cards.schedule.action')
    },
    {
      id: 'dry-cleaning',
      title: t('dashboard.cards.dry_cleaning.title'),
      description: t('dashboard.cards.dry_cleaning.desc'),
      icon: SparklesIcon,
      gradient: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-purple-100 to-indigo-200',
      path: '/dashboard/dry-cleaning',
      action: t('dashboard.cards.dry_cleaning.action'),
      badge: 'PREMIUM'
    },
    {
      id: 'stain-removal',
      title: t('dashboard.cards.stain_removal.title'),
      description: t('dashboard.cards.stain_removal.desc'),
      icon: BeakerIcon,
      gradient: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-purple-100 to-indigo-200',
      path: '/dashboard/stain-removal',
      action: t('dashboard.cards.stain_removal.action'),
      badge: 'NEW'
    },
    {
      id: 'steam-ironing',
      title: t('dashboard.cards.steam_ironing.title'),
      description: t('dashboard.cards.steam_ironing.desc'),
      icon: HandRaisedIcon,
      gradient: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-cyan-100 to-teal-200',
      path: '/dashboard/steam-ironing',
      action: t('dashboard.cards.steam_ironing.action'),
      badge: 'NEW'
    },
    {
      id: 'track',
      title: t('dashboard.cards.track.title'),
      description: t('dashboard.cards.track.desc'),
      icon: TruckIcon,
      gradient: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-200',
      path: '/dashboard/track-order',
      action: t('dashboard.cards.track.action'),
      badge: 'LIVE'
    },
    {
      id: 'orders',
      title: t('dashboard.cards.orders.title'),
      description: t('dashboard.cards.orders.desc'),
      icon: ShoppingBagIcon,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-100 to-red-200',
      path: '/dashboard/orders',
      action: t('dashboard.cards.orders.action')
    },
    {
      id: 'history',
      title: t('dashboard.cards.payment_history.title'),
      description: t('dashboard.cards.payment_history.desc'),
      icon: BanknotesIcon,
      gradient: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-gradient-to-br from-emerald-100 to-teal-200',
      path: '/dashboard/payment-history',
      action: t('dashboard.cards.payment_history.action'),
      badge: 'SECURE'
    },
    {
      id: 'rate',
      title: t('dashboard.cards.rate.title'),
      description: t('dashboard.cards.rate.desc'),
      icon: DocumentTextIcon,
      gradient: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-gradient-to-br from-indigo-100 to-purple-200',
      path: '/dashboard/rate',
      action: t('dashboard.cards.rate.action')
    },
    {
      id: 'products',
      title: t('dashboard.cards.products.title'),
      description: t('dashboard.cards.products.desc'),
      icon: TagIcon,
      gradient: 'from-pink-500 to-rose-500',
      bgColor: 'bg-gradient-to-br from-pink-100 to-rose-200',
      path: '/dashboard/products',
      action: t('dashboard.cards.products.action'),
      badge: 'NEW'
    },
    {
      id: 'store',
      title: t('dashboard.cards.store.title'),
      description: t('dashboard.cards.store.desc'),
      icon: BuildingStorefrontIcon,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-100 to-yellow-200',
      path: '/dashboard/store',
      action: t('dashboard.cards.store.action')
    },
    {
      id: 'legal',
      title: t('dashboard.cards.legal.title'),
      description: t('dashboard.cards.legal.desc'),
      icon: InformationCircleIcon,
      gradient: 'from-gray-600 to-gray-700',
      bgColor: 'bg-gradient-to-br from-slate-100 to-gray-200',
      path: '/dashboard/legal',
      action: t('dashboard.cards.legal.action')
    },
    {
      id: 'feedback',
      title: t('dashboard.cards.feedback.title'),
      description: t('dashboard.cards.feedback.desc'),
      icon: ChatBubbleLeftRightIcon,
      gradient: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      path: '/dashboard/feedback',
      action: t('dashboard.cards.feedback.action')
    },
    {
      id: 'notifications',
      title: t('dashboard.cards.notifications.title'),
      description: t('dashboard.cards.notifications.desc'),
      icon: BellIcon,
      gradient: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-sky-100 to-indigo-200',
      path: '/dashboard/notifications',
      action: t('dashboard.cards.notifications.action'),
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      id: 'lost-found',
      title: t('dashboard.cards.lost_found.title'),
      description: t('dashboard.cards.lost_found.desc'),
      icon: ExclamationTriangleIcon,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-100 to-red-200',
      path: '/dashboard/lost-items',
      action: t('dashboard.cards.lost_found.action')
    }
  ];

  // Static data
  const staticStats = [
    {
      label: t('dashboard.stats.satisfaction'),
      value: '100%',
      icon: StarIcon,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: t('dashboard.stats.quality_guaranteed')
    },
    {
      label: t('dashboard.stats.services'),
      value: '20+',
      icon: CubeIcon,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: t('dashboard.stats.comprehensive_care')
    },
    {
      label: t('dashboard.stats.team'),
      value: '50+',
      icon: UserGroupIcon,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: t('dashboard.stats.professional_staff')
    },
    {
      label: t('dashboard.stats.delivery'),
      value: '24hrs',
      icon: TruckIcon,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: t('dashboard.stats.fast_turnaround')
    }
  ];

  const features = [
    {
      icon: BoltIcon,
      title: t('dashboard.features.express.title'),
      description: t('dashboard.features.express.desc'),
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50'
    },
    {
      icon: ShieldCheckIcon,
      title: t('dashboard.features.quality.title'),
      description: t('dashboard.features.quality.desc'),
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      icon: TruckIcon,
      title: t('dashboard.features.pickup.title'),
      description: t('dashboard.features.pickup.desc'),
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    {
      icon: StarIcon,
      title: t('dashboard.features.eco.title'),
      description: t('dashboard.features.eco.desc'),
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50'
    }
  ];

  const services = [
    {
      id: 1,
      name: t('dashboard.services.pickup.name'),
      icon: ShoppingCartIcon,
      price: 'Free',
      time: '24 hours',
      popular: true,
      description: t('dashboard.services.pickup.desc')
    },
    {
      id: 2,
      name: t('dashboard.services.wash_fold.name'),
      icon: CubeIcon,
      price: '₹49',
      time: '24 hours',
      popular: true,
      description: t('dashboard.services.wash_fold.desc')
    },
    {
      id: 3,
      name: t('dashboard.services.bulk.name'),
      icon: BanknotesIcon,
      price: '20% Off',
      time: 'Always',
      popular: true,
      description: t('dashboard.services.bulk.desc')
    },
    {
      id: 4,
      name: t('dashboard.services.dry_cleaning.name'),
      icon: ScissorsIcon,
      price: '₹99',
      time: '48 hours',
      popular: true,
      description: t('dashboard.services.dry_cleaning.desc')
    }
  ];

  const faqs = [
    {
      id: 1,
      question: t('dashboard.faqs.q1'),
      answer: t('dashboard.faqs.a1')
    },
    {
      id: 2,
      question: t('dashboard.faqs.q2'),
      answer: t('dashboard.faqs.a2')
    },
    {
      id: 3,
      question: t('dashboard.faqs.q3'),
      answer: t('dashboard.faqs.a3')
    },
    {
      id: 4,
      question: t('dashboard.faqs.q4'),
      answer: t('dashboard.faqs.a4')
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Choosing Fresh Laundry: My Tips',
      excerpt: 'Discover the secrets to keeping your clothes fresh and clean with our expert laundry tips and techniques...',
      image: 'images/blog-tips.png',
      category: 'Tips',
      date: 'Oct 15, 2025',
      content: `Keeping your clothes fresh and clean doesn't have to be a chore. With the right techniques and a reliable laundry service like WashLab, you can ensure your wardrobe always looks and smells amazing.

Our expert team has compiled these essential tips to help you maintain the quality of your garments:

1. **Sort by Color and Fabric**: Always separate whites, darks, and colors. Delicate fabrics like silk and lace should be washed separately with gentle detergents.

2. **Read Care Labels**: These provide crucial information about washing temperature, drying methods, and ironing instructions.

3. **Pre-treat Stains**: Address stains immediately with appropriate stain removers before washing to prevent them from setting in.

4. **Use the Right Water Temperature**: Hot water is best for whites and heavily soiled items, while cold water preserves colors and prevents shrinkage.

5. **Don't Overload Your Machine**: Overcrowding reduces cleaning efficiency and can damage both your clothes and washer.

6. **Choose Quality Detergents**: Invest in good detergents that match your fabric types and washing needs.

For the best results, consider WashLab's professional laundry service. Our eco-friendly detergents and expert handling ensure your clothes receive the care they deserve.`
    },
    {
      id: 2,
      title: 'Ironing Pro: Best Exercise',
      excerpt: 'Learn professional ironing techniques that will make your clothes look crisp and well-maintained...',
      image: 'images/blog-ironing.png',
      category: 'Guide',
      date: 'Oct 12, 2025',
      content: `Professional ironing can transform the appearance of your clothes, making them look crisp, well-maintained, and ready to wear. Follow these expert techniques to achieve salon-quality results at home:

**Essential Ironing Preparation:**
- Check the care label for specific ironing instructions
- Set your iron to the appropriate temperature for the fabric type
- Use distilled water in your iron to prevent mineral buildup
- Have a clean pressing cloth ready for delicate fabrics

**Step-by-Step Ironing Process:**
1. **Start with Clean Clothes**: Never iron dirty garments as it sets stains permanently
2. **Iron in the Right Order**: Collars, then cuffs, followed by sleeves, and finally the body of the garment
3. **Use Steam Wisely**: Steam helps remove wrinkles but avoid over-saturating delicate fabrics
4. **Iron Along the Grain**: Follow the natural fiber direction to prevent damage
5. **Work Quickly**: Don't leave the iron in one spot too long to avoid scorching

**Fabric-Specific Tips:**
- **Cotton**: Use high heat and plenty of steam
- **Silk**: Use low heat and a pressing cloth
- **Wool**: Use medium heat with steam, iron on the wrong side
- **Polyester**: Use medium heat, avoid steam if possible

For time-saving convenience and professional results, WashLab offers expert pressing services that ensure your garments look perfect every time.`
    },
    {
      id: 3,
      title: 'Your Clothes Deserve A Clean',
      excerpt: 'Understanding the importance of proper fabric care and why professional cleaning makes a difference...',
      image: 'images/blog-cleaning.png',
      category: 'Care',
      date: 'Oct 10, 2025',
      content: `Proper fabric care is essential for maintaining the longevity, appearance, and value of your clothing. Understanding how different fabrics respond to various cleaning methods can save you money and keep your wardrobe looking its best.

**Why Professional Cleaning Matters:**

1. **Expert Knowledge**: Professional cleaners understand the unique requirements of different fabrics and can select the most appropriate cleaning methods.

2. **Specialized Equipment**: Commercial-grade machines and eco-friendly detergents provide superior cleaning results that home washing often cannot match.

3. **Stain Removal Expertise**: Professionals have access to specialized stain removal techniques and products for tough stains.

4. **Fabric Preservation**: Proper handling prevents damage that can occur from incorrect washing or drying methods.

**Common Fabric Care Mistakes to Avoid:**

- **Over-washing**: This causes premature wear and tear
- **Incorrect Detergents**: Harsh chemicals can damage delicate fibers
- **Wrong Drying Methods**: High heat can shrink or damage certain fabrics
- **Improper Storage**: Poor storage leads to wrinkles, pests, and moisture damage

**Benefits of WashLab's Professional Service:**

- Environmentally responsible cleaning processes
- Specialized care for delicate and designer garments
- Convenient pickup and delivery service
- Insurance coverage for high-value items
- Expert attention to detail and quality

Investing in professional fabric care extends the life of your clothing and ensures you always look your best. With WashLab, you're not just getting clean clothes – you're getting expert care for your wardrobe investments.`
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: t('dashboard.testimonials.t1.name'),
      rating: 5,
      comment: t('dashboard.testimonials.t1.comment'),
      location: t('dashboard.testimonials.t1.location')
    },
    {
      id: 2,
      name: t('dashboard.testimonials.t2.name'),
      rating: 5,
      comment: t('dashboard.testimonials.t2.comment'),
      location: t('dashboard.testimonials.t2.location')
    },
    {
      id: 3,
      name: t('dashboard.testimonials.t3.name'),
      rating: 5,
      comment: t('dashboard.testimonials.t3.comment'),
      location: t('dashboard.testimonials.t3.location')
    }
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case 'schedule':
        navigate('/dashboard/schedule');
        break;
      case 'laundry':
        navigate('/dashboard/laundry');
        break;
      case 'orders':
        navigate('/dashboard/orders');
        break;
      case 'track':
        navigate('/dashboard/track-order');
        break;
      case 'history':
        navigate('/dashboard/payment-history');
        break;
      case 'rate':
        navigate('/dashboard/rate');
        break;
      case 'payment-history':
        navigate('/dashboard/payment-history');
        break;
      case 'feedback':
        navigate('/dashboard/feedback');
        break;
      case 'notifications':
        navigate('/dashboard/notifications');
        break;
      default:
        break;
    }
  };

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert('Thank you for subscribing to our newsletter!');
    setNewsletterEmail('');
  };

  const handleReadMore = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Main Dashboard Functionalities Section - Starting directly without welcome section */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <AdvertisementBanner />
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            <span className="text-cyan-500">{t('dashboard.hero_title')}</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('dashboard.hero_subtitle_home')}
          </p>
        </div>

        {/* Functionality Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {functionalityCards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => navigate(card.path)}
              className={`group relative ${card.bgColor} rounded-xl p-4 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 border border-gray-300/50 cursor-pointer overflow-hidden transform perspective-1000 shadow-lg`}
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both, float 3s ease-in-out ${index * 0.2}s infinite`
              }}
            >
              {/* Animated gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
              
              {/* Sparkle effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>

              {/* Glowing border effect on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)`,
                animation: 'rotate-border 2s linear infinite'
              }}></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center mb-3">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-br ${card.gradient} shadow-lg group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 mb-3 animate-pulse-slow`}>
                    <card.icon className="h-6 w-6 text-white group-hover:animate-wiggle" />
                  </div>
                  {card.badge && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-md animate-pulse mb-2">
                      {card.badge}
                    </span>
                  )}
                </div>
                
                <h3 className="text-sm font-bold text-gray-900 mb-2 text-center group-hover:scale-105 transition-transform duration-300 animate-fade-in">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-xs leading-relaxed text-center line-clamp-2 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                  {card.description}
                </p>
                
                <div className="flex items-center justify-center text-gray-800 font-semibold text-xs group-hover:translate-x-1 transition-transform duration-300">
                  <span className="group-hover:animate-pulse">{card.action}</span>
                  <ChevronRightIcon className="h-3 w-3 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>

              {/* Ripple effect circle */}
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-white/20 rounded-full group-hover:scale-[4] transition-transform duration-700 ease-out"></div>
              
              {/* Bottom glow effect */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-slide-left-right"></div>
            </div>
          ))}
        </div>

        {/* Loyalty Section */}
        <div className="mb-16">
          <div className="max-w-md">
             <LoyaltyCard />
          </div>
        </div>

        {/* Add the ML Recommendations section after the functionality cards */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content area - we'll keep the existing content in the first two columns */}
            <div className="lg:col-span-2">
              {/* Getting Tired With Your Laundry Section */}
              {/* Background Image: Add bg_image_2.png to show person with laundry */}
              <div className="mb-20 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12">
                  {/* Image */}
                  <div className="relative">
                    <div className="bg-white/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
                      <img 
                        src="/images/laundry-hero.png" 
                        alt="Person holding laundry basket"
                        className="w-full h-full object-cover rounded-xl shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                      <span className="text-cyan-500">{t('dashboard.hero.tired_title1')}</span><br />
                      <span className="text-gray-900">{t('dashboard.hero.tired_title2')}</span>
                    </h2>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      {t('dashboard.hero.tired_desc')}
                    </p>
                    <button 
                      onClick={() => handleQuickAction('schedule')}
                      className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {t('dashboard.hero.order_pickup')} →
                    </button>
                  </div>
                </div>
              </div>

              {/* Laundry Solutions For A Busy Life */}
              <div className="mb-20 bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-500 rounded-3xl overflow-hidden relative shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 opacity-10">
                  <SparklesIcon className="h-64 w-64 text-white" />
                </div>
                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
                  <ShoppingCartIcon className="h-64 w-64 text-white" />
                </div>
                
                <div className="relative z-10 text-center py-20 px-6">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                    {t('dashboard.hero.solutions_title').split(' ').slice(0, 3).join(' ')}<br />{t('dashboard.hero.solutions_title').split(' ').slice(3).join(' ')}
                  </h2>
                  <p className="text-white/90 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
                    {t('dashboard.hero.solutions_desc')}
                  </p>
                  <button 
                    onClick={() => handleQuickAction('laundry')}
                    className="bg-white hover:bg-gray-50 text-cyan-600 font-semibold py-3 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    {t('dashboard.hero.learn_more')}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* No Fading, Only Cleaning section moved to sidebar */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 shadow-lg">
                <div className="p-3 bg-white rounded-xl w-fit mb-3 shadow-md">
                  <SparklesIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('dashboard.sidebar.premium_perfume_title')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('dashboard.sidebar.premium_perfume_desc')}
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 shadow-lg">
                <div className="p-3 bg-white rounded-xl w-fit mb-3 shadow-md">
                  <BeakerIcon className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{t('dashboard.sidebar.trusted_detergent_title')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('dashboard.sidebar.trusted_detergent_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us - Features Stats */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-orange-100 via-yellow-50 to-cyan-50 rounded-3xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { icon: ShoppingCartIcon, label: 'Laundromat', color: 'text-cyan-600' },
                { icon: ScissorsIcon, label: 'Dry Cleaning', color: 'text-purple-600' },
                { icon: BuildingStorefrontIcon, label: 'Residential', color: 'text-green-600' },
                { icon: CubeIcon, label: 'Commercial', color: 'text-blue-600' },
                { icon: TruckIcon, label: 'Dropoff', color: 'text-orange-600' },
                { icon: CalendarDaysIcon, label: 'Learn More', color: 'text-pink-600' },
              ].map((item, index) => (
                <div 
                  key={index}
                  onClick={() => handleQuickAction('rate')}
                  className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="flex justify-center mb-2">
                    <item.icon className={`h-10 w-10 ${item.color}`} />
                  </div>
                  <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News and Blog Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              {t('dashboard.blog.title')} <span className="text-cyan-500">{t('dashboard.blog.title_highlight')}</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {t('dashboard.blog.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100"
              >
                {/* Blog Image */}
                <div className="h-48 overflow-hidden">
                  <img 
                    src={`/${post.image}`}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">{post.category}</span>
                    <span className="text-gray-500 text-xs">{post.date}</span>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3 leading-tight">{post.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <button 
                    onClick={() => handleReadMore(post)}
                    className="text-cyan-600 font-semibold text-sm hover:text-cyan-700 transition-colors"
                  >
                    {t('dashboard.hero.learn_more')} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mb-12 bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-500 rounded-3xl overflow-hidden relative">
          {/* Decorative elements - removed EnvelopeIcon */}
          <div className="absolute top-0 left-0 w-96 h-96 opacity-10">
            {/* <EnvelopeIcon className="w-96 h-96 text-white" /> */} {/* Removed mail icon */}
            <NewspaperIcon className="w-96 h-96 text-white" /> {/* Replaced with NewspaperIcon */}
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12">
            {/* Newsletter Image */}
            <div className="order-2 lg:order-1">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <img 
                  src="/bg_image_4.png" 
                  alt="Happy person - Newsletter"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>

            {/* Newsletter Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                {t('dashboard.newsletter.title')}
              </h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                {t('dashboard.newsletter.desc')}
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={t('dashboard.newsletter.placeholder')}
                  required
                  className="flex-1 px-6 py-4 rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white transition-all"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-gray-50 text-cyan-600 font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                >
                  {t('dashboard.newsletter.subscribe')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Actions Footer CTA */}
        <div className="bg-gradient-to-br from-gray-50 to-cyan-50 rounded-3xl p-8 text-center border-2 border-cyan-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
            {t('dashboard.footer_cta.ready')} <SparklesIcon className="h-6 w-6 text-cyan-500" />
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleQuickAction('schedule')}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              <span>{t('dashboard.footer_cta.schedule')}</span>
            </button>
            <button
              onClick={() => handleQuickAction('orders')}
              className="bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <ClipboardDocumentListIcon className="h-5 w-5" />
              <span>{t('dashboard.footer_cta.view_orders')}</span>
            </button>
            <button
              onClick={() => handleQuickAction('rate')}
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-8 rounded-full border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <CubeIcon className="h-5 w-5" />
              <span>{t('dashboard.footer_cta.view_pricing')}</span>
            </button>
          </div>
        </div>

        {/* Blog Post Modal */}
        {isModalOpen && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPost.title}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="bg-cyan-100 text-cyan-700 text-xs font-semibold px-3 py-1 rounded-full">{selectedPost.category}</span>
                    <span className="text-gray-500 text-sm">{selectedPost.date}</span>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto p-6">
                <div className="prose max-w-none">
                  {selectedPost.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
