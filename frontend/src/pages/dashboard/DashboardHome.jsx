import React, { useContext, useState } from 'react';
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
  ArchiveBoxIcon,
  BanknotesIcon,
  ScissorsIcon,
  HandRaisedIcon,
  BeakerIcon,
  NewspaperIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Dashboard functionality cards - all features from sidebar
  const functionalityCards = [
    {
      id: 'profile',
      title: 'My Profile',
      description: 'View and manage your personal information, addresses, and preferences',
      icon: UserCircleIcon,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-200',
      path: '/dashboard/profile',
      action: 'View Profile'
    },
    {
      id: 'shoe-cleaning',
      title: 'Shoe Polishing',
      description: 'Professional shoe cleaning and polishing services',
      icon: SparklesIcon,
      gradient: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-gradient-to-br from-yellow-100 to-amber-200',
      path: '/dashboard/shoe-cleaning',
      action: 'Book Service',
      badge: 'NEW'
    },
    {
      id: 'schedule',
      title: 'Schedule Wash',
      description: 'Book a pickup time that works best for your schedule',
      icon: CalendarDaysIcon,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-200',
      path: '/dashboard/schedule',
      action: 'Schedule Now'
    },
    {
      id: 'stain-removal',
      title: 'Stain Removal',
      description: 'Professional stain removal service for your clothes',
      icon: BeakerIcon,
      gradient: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-gradient-to-br from-purple-100 to-indigo-200',
      path: '/dashboard/stain-removal',
      action: 'Remove Stains',
      badge: 'NEW'
    },
    {
      id: 'orders',
      title: 'My Orders',
      description: 'Track your current orders and view order history',
      icon: ShoppingBagIcon,
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-100 to-red-200',
      path: '/dashboard/orders',
      action: 'View Orders'
    },
    {
      id: 'quality',
      title: 'Quality Approval',
      description: 'Review and approve the quality of your cleaned items',
      icon: CheckCircleIcon,
      gradient: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-teal-100 to-cyan-200',
      path: '/dashboard/quality',
      action: 'Check Quality'
    },
    {
      id: 'rate',
      title: 'Get Rate Card',
      description: 'View pricing for all our services and special offers',
      icon: DocumentTextIcon,
      gradient: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-gradient-to-br from-indigo-100 to-purple-200',
      path: '/dashboard/rate',
      action: 'View Pricing'
    },
    {
      id: 'products',
      title: 'Jivika Labs Products',
      description: 'Premium laundry care products and accessories',
      icon: TagIcon,
      gradient: 'from-pink-500 to-rose-500',
      bgColor: 'bg-gradient-to-br from-pink-100 to-rose-200',
      path: '/dashboard/products',
      action: 'Shop Now',
      badge: 'NEW'
    },
    {
      id: 'store',
      title: 'Store Locator',
      description: 'Find our nearest service centers and drop-off points',
      icon: BuildingStorefrontIcon,
      gradient: 'from-amber-500 to-orange-500',
      bgColor: 'bg-gradient-to-br from-amber-100 to-yellow-200',
      path: '/dashboard/store',
      action: 'Find Stores'
    },
    {
      id: 'legal',
      title: 'Legal Information',
      description: 'Terms of service, privacy policy, and legal documents',
      icon: InformationCircleIcon,
      gradient: 'from-gray-600 to-gray-700',
      bgColor: 'bg-gradient-to-br from-slate-100 to-gray-200',
      path: '/dashboard/legal',
      action: 'Read More'
    },
    {
      id: 'about',
      title: 'Notifications',
      description: 'Learn more about our company and our commitment to quality',
      icon: QuestionMarkCircleIcon,
      gradient: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-sky-100 to-indigo-200',
      path: '/dashboard/about',
      action: 'Learn More'
    }
  ];

  // Static data
  const staticStats = [
    {
      label: 'Your Satisfaction',
      value: '100%',
      icon: StarIcon,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      description: 'Quality Guaranteed'
    },
    {
      label: 'Services Available',
      value: '20+',
      icon: CubeIcon,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      description: 'Comprehensive Care'
    },
    {
      label: 'Expert Team',
      value: '50+',
      icon: UserGroupIcon,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      description: 'Professional Staff'
    },
    {
      label: 'Quick Delivery',
      value: '24hrs',
      icon: TruckIcon,
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      description: 'Fast Turnaround'
    }
  ];

  const features = [
    {
      icon: BoltIcon,
      title: 'Express Service',
      description: 'Get your laundry done in as fast as 3 hours',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-orange-50'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assurance',
      description: 'Premium detergents and careful handling guaranteed',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50'
    },
    {
      icon: TruckIcon,
      title: 'Free Pickup & Delivery',
      description: 'Convenient doorstep service at no extra cost',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50'
    },
    {
      icon: StarIcon,
      title: 'Eco-Friendly',
      description: 'Environment conscious cleaning solutions',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50'
    }
  ];

  const services = [
    {
      id: 1,
      name: 'Laundry Pickup',
      icon: ShoppingCartIcon,
      price: 'Free',
      time: '24 hours',
      popular: true,
      description: 'Convenient pickup service from your doorstep at scheduled times'
    },
    {
      id: 2,
      name: 'Wash And Fold',
      icon: ArchiveBoxIcon,
      price: '₹49',
      time: '24 hours',
      popular: true,
      description: 'Professional washing, drying and folding service for everyday clothes'
    },
    {
      id: 3,
      name: 'Bulk Discount',
      icon: BanknotesIcon,
      price: '20% Off',
      time: 'Always',
      popular: true,
      description: 'Save more with bulk orders and enjoy special pricing benefits'
    },
    {
      id: 4,
      name: 'Dry Cleaning',
      icon: ScissorsIcon,
      price: '₹99',
      time: '48 hours',
      popular: true,
      description: 'Expert dry cleaning for delicate fabrics and formal wear'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I schedule a laundry pickup?',
      answer: 'Simply click on "Schedule Pickup" button, select your preferred date and time, and our team will arrive at your doorstep to collect your laundry. You can also track your order in real-time.'
    },
    {
      id: 2,
      question: 'What are your service timings?',
      answer: 'We operate 7 days a week from 8 AM to 8 PM. You can schedule pickups and deliveries within this time frame. Express services are available for urgent requirements.'
    },
    {
      id: 3,
      question: 'Do you offer same-day service?',
      answer: 'Yes! Our express service offers same-day delivery for orders placed before 10 AM. Additional charges may apply for express service.'
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including credit/debit cards, UPI, net banking, and cash on delivery. You can also maintain a wallet for faster checkout.'
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'Choosing Fresh Laundry: My Tips',
      excerpt: 'Discover the secrets to keeping your clothes fresh and clean with our expert laundry tips and techniques...',
      image: 'bg_image_2.png',
      category: 'Tips',
      date: 'Oct 15, 2025'
    },
    {
      id: 2,
      title: 'Ironing Pro: Best Exercise',
      excerpt: 'Learn professional ironing techniques that will make your clothes look crisp and well-maintained...',
      image: 'bg_image_3.png',
      category: 'Guide',
      date: 'Oct 12, 2025'
    },
    {
      id: 3,
      title: 'Your Clothes Deserve A Clean',
      excerpt: 'Understanding the importance of proper fabric care and why professional cleaning makes a difference...',
      image: 'bg_image_4.png',
      category: 'Care',
      date: 'Oct 10, 2025'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Excellent service! My clothes came back fresh and perfectly ironed.',
      location: 'Mumbai'
    },
    {
      id: 2,
      name: 'Rahul Verma',
      rating: 5,
      comment: 'Best laundry service in the city. Quick and reliable!',
      location: 'Delhi'
    },
    {
      id: 3,
      name: 'Anjali Patel',
      rating: 5,
      comment: 'Professional team and eco-friendly products. Highly recommended!',
      location: 'Bangalore'
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
      case 'rate':
        navigate('/dashboard/rate');
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

  return (
    <div className="min-h-screen bg-white">
      {/* Main Dashboard Functionalities Section - Starting directly without welcome section */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            <span className="text-cyan-500">Stay fresh, stay organized with your laundry services</span>
          </h2>
          
        </div>

        {/* Functionality Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {functionalityCards.map((card, index) => (
            <div
              key={card.id}
              onClick={() => navigate(card.path)}
              className={`group relative ${card.bgColor} rounded-xl p-4 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-105 border border-gray-300/50 cursor-pointer overflow-hidden transform perspective-1000`}
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

        {/* Add keyframe animations */}
        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-5px);
            }
          }

          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          @keyframes rotate-border {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes wiggle {
            0%, 100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(-10deg);
            }
            75% {
              transform: rotate(10deg);
            }
          }

          @keyframes slide-left-right {
            0%, 100% {
              transform: translateX(-100%);
            }
            50% {
              transform: translateX(100%);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes pulse-slow {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }

          .animate-wiggle {
            animation: wiggle 0.5s ease-in-out;
          }

          .animate-slide-left-right {
            animation: slide-left-right 2s ease-in-out infinite;
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-in;
          }

          .animate-pulse-slow {
            animation: pulse-slow 2s ease-in-out infinite;
          }
        `}</style>
        {/* Getting Tired With Your Laundry Section */}
        {/* Background Image: Add bg_image_2.png to show person with laundry */}
        <div className="mb-20 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12">
            {/* Image */}
            <div className="relative">
              <div className="bg-white/50 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
                <img 
                  src="/bg_image_2.png" 
                  alt="Person holding laundry basket"
                  className="w-full h-full object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                <span className="text-cyan-500">Getting Tired With</span><br />
                <span className="text-gray-900">Your Laundry?</span>
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                It must take a lot of time to prepare before you go to town. After grocery shopping your hands are full, so you can't carry your laundry. Then you'll end up taking two trips to get your laundry done. We've got a hack! We'll pick-up & drop-off. We're here for you.
              </p>
              <button 
                onClick={() => handleQuickAction('schedule')}
                className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Order Pickup →
              </button>
            </div>
          </div>
        </div>

        {/* Laundry Solutions For A Busy Life */}
        <div className="mb-20 bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-500 rounded-3xl overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 opacity-10">
            <SparklesIcon className="h-64 w-64 text-white" />
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
            <ShoppingCartIcon className="h-64 w-64 text-white" />
          </div>
          
          <div className="relative z-10 text-center py-20 px-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Laundry Solutions For<br />A Busy Life
            </h2>
            <p className="text-white/90 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
              When you need a laundry service that fits in with your busy life, you need Fabrico. We collect dirty laundry, clean it and deliver it back to you – all from your mobile or laptop.
            </p>
            <button 
              onClick={() => handleQuickAction('laundry')}
              className="bg-white hover:bg-gray-50 text-cyan-600 font-semibold py-3 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* No Fading, Only Cleaning */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              <span className="text-cyan-500">No Fading,</span> Only Cleaning
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Bring new life to your old & treasured belongings by choosing the soft on color, tough on stains Fabrico service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-10 hover:shadow-xl transition-all duration-300">
              <div className="p-4 bg-white rounded-2xl w-fit mb-4 shadow-md">
                <SparklesIcon className="h-12 w-12 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Perfume</h3>
              <p className="text-gray-600 leading-relaxed">
                Leave all the worry of your clothes smelling weird to us. With Fabrico, fresh is the only way your clothes get back to you.
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-10 hover:shadow-xl transition-all duration-300">
              <div className="p-4 bg-white rounded-2xl w-fit mb-4 shadow-md">
                <BeakerIcon className="h-12 w-12 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Trusted Detergent</h3>
              <p className="text-gray-600 leading-relaxed">
                Choose the right detergent that gives your clothes the perfect amount of care. Quality washing chemicals that don't harm your fabric.
              </p>
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
              News And <span className="text-cyan-500">Blog</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay updated with our latest tips, guides, and news
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-gray-100 cursor-pointer"
                onClick={() => handleQuickAction('orders')}
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
                  <button className="text-cyan-600 font-semibold text-sm hover:text-cyan-700 transition-colors">
                    Read More →
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
                Join Our Newsletter
              </h2>
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                Get the scoop on discounts, pay on delivery, free delivery and the chance to win a gift for referring friends.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 px-6 py-4 rounded-full border-2 border-white/30 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:border-white transition-all"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-gray-50 text-cyan-600 font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Quick Actions Footer CTA */}
        <div className="bg-gradient-to-br from-gray-50 to-cyan-50 rounded-3xl p-8 text-center border-2 border-cyan-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
            Ready to get started? <SparklesIcon className="h-6 w-6 text-cyan-500" />
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleQuickAction('schedule')}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              <span>Schedule Pickup</span>
            </button>
            <button
              onClick={() => handleQuickAction('orders')}
              className="bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <ClipboardDocumentListIcon className="h-5 w-5" />
              <span>View Orders</span>
            </button>
            <button
              onClick={() => handleQuickAction('rate')}
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-8 rounded-full border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <CubeIcon className="h-5 w-5" />
              <span>View Pricing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;