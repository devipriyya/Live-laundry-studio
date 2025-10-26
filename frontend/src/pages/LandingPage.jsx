import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import { AuthContext } from '../context/AuthContext';
import { 
  SparklesIcon,
  ShieldCheckIcon,
  TruckIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  ClockIcon,
  ArrowRightIcon,
  PlayIcon,
  StarIcon,
  CheckCircleIcon,
  HeartIcon,
  GlobeAltIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Modern laundry-themed hero images
const heroImages = [
  "/laundry-background.jpeg"
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };


  const services = [
    {
      icon: "🧺",
      title: "Schedule Wash Services",
      description: "Convenient pickup and delivery laundry service with multiple scheduling options to fit your busy lifestyle.",
      features: [
        "Eco-friendly wash with biodegradable detergents",
        "Fast 24-48 hour turnaround",
        "Fabric safety with specialized care for each material",
        "Affordable pricing with no hidden fees",
        "Contactless pickup and delivery",
        "Real-time order tracking"
      ]
    },
    {
      icon: "👕", 
      title: "Dry Cleaning Services",
      description: "Professional dry cleaning for delicate fabrics, special garments, and items requiring specialized care.",
      features: [
        "Expert handling of delicate fabrics",
        "Specialized care for wedding dresses and formal wear",
        "Stain removal by certified professionals",
        "Quality assurance on every garment",
        "Free pickup and delivery",
        "Insurance coverage for high-value items"
      ]
    },
    {
      icon: "👞",
      title: "Shoe Polishing Services",
      description: "Restore your shoes to like-new condition with our professional cleaning and polishing services.",
      features: [
        "Premium leather conditioning",
        "Scuff and scratch repair",
        "Professional shine and polish",
        "Sole cleaning and deodorizing",
        "Waterproofing treatment",
        "Quick 24-hour service"
      ]
    },
    {
      icon: "🧴",
      title: "Stain Removal Services",
      description: "Expert stain removal for tough spots and spills with specialized techniques for different stain types.",
      features: [
        "Specialized treatment for different stain types",
        "Gentle yet effective removal process",
        "Fabric-safe cleaning solutions",
        "Same-day service for urgent needs",
        "Guaranteed results or free re-treatment",
        "Environmentally responsible products"
      ]
    },
    {
      icon: "🚿",
      title: "Steam Ironing Services",
      description: "Professional steam ironing to remove wrinkles and restore your garments to their perfect shape.",
      features: [
        "Commercial-grade steam equipment",
        "Specialized pressing for different fabrics",
        "Precision shaping and creasing",
        "Sanitization through high-temperature steam",
        "Quick turnaround without compromising quality",
        "Hanger-fresh delivery"
      ]
    }
  ];

  const whyUsFeatures = [
    {
      number: "1",
      title: "We pickup and drop off from your office",
      description: "Some additional text here"
    },
    {
      number: "2", 
      title: "We use products that never harm your clothing and give it back to you.",
      description: "Some additional text here"
    },
    {
      number: "3",
      title: "Your orders are delivered at your doorstep back to you.",
      description: "Some additional text here"
    },
    {
      number: "4",
      title: "We deliver and charge very competively priced service",
      description: "Some additional text here"
    }
  ];

  const galleryImages = [
    "/laundry-background.jpeg",
    "/assets/laundry-hero.jpg",
    "/assets/bg_image_1.png",
    "/assets/bg_image_2.png",
    "/assets/bg_image_3.png",
    "/assets/bg_image_4.png"
  ];

  const videos = [
    {
      title: "Professional Dry Cleaning Process",
      thumbnail: "/assets/bg_image_1.png",
      duration: "3:20",
      videoUrl: "https://www.youtube.com/embed/o8GzY-HfWKA?si=OFKO2FouaBXpLM-t"
    },
    {
      title: "Shoe Polishing Services",
      thumbnail: "/assets/bg_image_2.png",
      duration: "1:45",
      videoUrl: "https://www.youtube.com/embed/p49p6ptb0Wg?si=VoVrixNZxHltlKjR"
    },
    {
      title: "Steam Ironing Services",
      thumbnail: "/assets/bg_image_3.png",
      duration: "2:30",
      videoUrl: "https://www.youtube.com/embed/MIgRvvgvPPQ?si=feature_shared"
    },
    {
      title: "Stain Removal Services",
      thumbnail: "/assets/bg_image_4.png",
      duration: "3:15",
      videoUrl: "https://www.youtube.com/embed/z8ca-X0gHZ4?si=YG1mHRn83bWYIoZx"
    }
  ];

  // Function to open video modal
  const openVideoModal = (video) => {
    setCurrentVideo(video);
    setVideoModalOpen(true);
  };

  // Function to close video modal
  const closeVideoModal = () => {
    setVideoModalOpen(false);
    setCurrentVideo(null);
  };

  // Function to open service modal
  const openServiceModal = (service) => {
    setCurrentService(service);
    setServiceModalOpen(true);
  };

  // Function to close service modal
  const closeServiceModal = () => {
    setServiceModalOpen(false);
    setCurrentService(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Modern Navigation */}
      <nav className="relative z-50 bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="relative">
                  <SparklesIcon className="h-10 w-10 text-blue-600 animate-pulse" />
                </div>
                WashLab
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                HOME
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#services" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                SERVICES
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#about" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                ABOUT
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#whyus" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                WHY US
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#gallery" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                GALLERY
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#videos" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                VIDEOS
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#testimonials" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                TESTIMONIALS
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contact" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                CONTACT
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => openAuthModal('login')}
                className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50"
              >
                Log In
              </button>
              <button 
                onClick={() => openAuthModal('register')}
                className="relative bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={`Laundry service ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-purple-900/60 to-indigo-900/70"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Laundry Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce delay-300">🧺</div>
          <div className="absolute top-40 right-20 text-5xl opacity-30 animate-pulse delay-700">👕</div>
          <div className="absolute bottom-40 left-20 text-4xl opacity-25 animate-bounce delay-1000">🧽</div>
          <div className="absolute bottom-20 right-10 text-5xl opacity-20 animate-pulse delay-500">🫧</div>
          <div className="absolute top-60 left-1/3 text-3xl opacity-30 animate-bounce delay-1500">✨</div>
        </div>
        
        {/* Modern Hero Content */}
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-semibold border border-white/30 shadow-xl">
              <SparklesIcon className="h-6 w-6" />
              Premium Laundry Experience
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight">
            <span className="block mb-4">Fresh.</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Clean.
            </span>
            <span className="block text-4xl md:text-5xl lg:text-6xl font-bold mt-4 text-blue-200">
              Delivered.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
            Transform your laundry experience with our premium care services. 
            <span className="block mt-2 text-cyan-200">Professional • Convenient • Eco-Friendly</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
              onClick={() => openAuthModal('register')}
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Your Journey
                <ArrowRightIcon className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button className="group inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:shadow-xl">
              <PlayIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>

          {/* Modern Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">50K+</div>
              <div className="text-blue-200 text-sm font-medium">Happy Customers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-blue-200 text-sm font-medium">Service Available</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">99%</div>
              <div className="text-blue-200 text-sm font-medium">Satisfaction Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="text-3xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">2Hr</div>
              <div className="text-blue-200 text-sm font-medium">Express Service</div>
            </div>
          </div>
        </div>

        {/* Modern Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Modern Services Section */}
      <section id="services" className="relative py-32 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-cyan-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Premium Laundry Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience care, quality, and freshness in every wash
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center transform hover:-translate-y-2 border border-gray-100 cursor-pointer overflow-hidden"
                onClick={() => openServiceModal(service)}
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <button 
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    openServiceModal(service);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern About Us Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ABOUT WASHLAB</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our commitment to premium garment care and exceptional customer service
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl -z-10"></div>
              <img 
                src="/laundry-background.jpeg" 
                alt="Professional laundry service"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            
            <div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                WashLab brings together cutting-edge technology and traditional craftsmanship to deliver 
                unparalleled garment care. Our expert team is dedicated to preserving the quality and 
                extending the life of your favorite clothing items.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                From delicate fabrics to everyday essentials, we provide comprehensive services including 
                dry cleaning, alterations, and specialized treatments. Our state-of-the-art facility 
                ensures every piece receives the attention it deserves.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Experience the difference that professional care makes – because your clothes truly deserve it.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                  <span className="text-blue-700 font-medium">Eco-Friendly</span>
                </div>
                <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-teal-500" />
                  <span className="text-teal-700 font-medium">24/7 Service</span>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-indigo-500" />
                  <span className="text-indigo-700 font-medium">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="whyus" className="py-20 bg-gradient-to-br from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
              Why Choose WashLab
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Experience the Difference</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes WashLab the preferred choice for premium garment care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUsFeatures.map((feature, index) => (
              <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-teal-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  {feature.number}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">OUR GALLERY</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take a look at our state-of-the-art facilities and professional laundry processes
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 group">
                <img 
                  src={image} 
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="font-bold text-lg">WashLab Facility {index + 1}</h3>
                    <p className="text-sm opacity-80">Professional laundry service</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Videos Section */}
      <section id="videos" className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">LAUNDRY SERVICE VIDEOS</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Discover our professional laundry processes and techniques through our informative videos
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video, index) => (
              <div 
                key={index} 
                className="relative group cursor-pointer bg-gray-800 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2"
                onClick={() => openVideoModal(video)}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-4 rounded-full transform group-hover:scale-110 transition-transform duration-300">
                      <PlayIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-2 py-1 rounded text-sm font-medium">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-xl mb-2 group-hover:text-blue-400 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-400">
                    Learn about our professional laundry techniques and processes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">WHAT OUR CUSTOMERS SAY</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl -z-10"></div>
              <img 
                src="/laundry-background.jpeg" 
                alt="Customer testimonial"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="text-2xl font-bold text-blue-500 mr-4">"</div>
                  <h3 className="font-bold text-gray-900 text-lg">Angeles Paul</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  "Service was very quick delivery and Pricing was perfect. I would definitely 
                  recommend to anyone needing laundry done."
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="text-2xl font-bold text-blue-500 mr-4">"</div>
                  <h3 className="font-bold text-gray-900 text-lg">Billy David</h3>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">
                  "I tried out your service! I appreciate how efficient your guys were and how well-priced the service was, 
                  good work. Would recommend to my friends and will definitely be using your services again."
                </p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">GET IN TOUCH WITH US</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions or need assistance? Our team is here to help with bookings, support, and feedback. 
              Reach out to us through any of the channels below or use our contact form.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4 group">
                    <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-3 rounded-lg text-white">
                      <MapPinIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">
                        Washlab laundry services<br />
                        Machiplavu P O, Chattupara<br />
                        Adimaly, Idukki 685561
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 group">
                    <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-3 rounded-lg text-white">
                      <PhoneIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                      <p className="text-blue-600 font-medium">+91 917907425691</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 group">
                    <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-3 rounded-lg text-white">
                      <EnvelopeIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                      <p className="text-blue-600 font-medium">washlab041@gmail.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-500">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    Our Location
                  </h3>
                </div>
                <div className="h-80 w-full">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3934.571896409943!2d77.12345678521442!3d9.876543292234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b079c9d8e8f1a2b%3A0x1234567890abcdef!2sWashlab%20laundry%20services!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Washlab Location"
                  ></iframe>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    id="name"
                    placeholder="Your Name" 
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    placeholder="your.email@example.com" 
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject"
                    placeholder="How can we help?" 
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea 
                    id="message"
                    placeholder="Your message here..." 
                    rows={5}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-blue-400" />
                WashLab
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Premium laundry services with cutting-edge technology and expert care for your garments.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <GlobeAltIcon className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <GlobeAltIcon className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <GlobeAltIcon className="h-6 w-6" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">SERVICES</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Schedule Wash</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Dry Cleaning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Shoe Polishing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Stain Removal</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Steam Ironing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">COMPANY</h3>
              <ul className="space-y-3">
                <li><a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#whyus" className="text-gray-400 hover:text-blue-400 transition-colors">Why Choose Us</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-blue-400 transition-colors">Testimonials</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">NEWSLETTER</h3>
              <p className="text-gray-400 text-sm mb-4">Stay updated with our latest offers</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 p-3 rounded-l-lg focus:outline-none bg-gray-800 text-white"
                />
                <button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 py-3 rounded-r-lg hover:from-blue-600 hover:to-teal-600 transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500 text-sm">&copy; 2024 WashLab. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Service Modal */}
      {serviceModalOpen && currentService && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl">
            <button 
              onClick={closeServiceModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
            
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">{currentService.icon}</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{currentService.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-8 text-lg">{currentService.description}</p>
              
              <h4 className="text-xl font-bold text-gray-900 mb-4">Service Features</h4>
              <ul className="space-y-3 mb-8">
                {currentService.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={closeServiceModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    closeServiceModal();
                    // Here you could redirect to the specific service page or open a booking modal
                    // For now, we'll just scroll to the contact section
                    setTimeout(() => {
                      document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Book This Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModalOpen && currentVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <XMarkIcon className="h-10 w-10" />
            </button>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <div className="relative pb-[56.25%] h-0"> {/* 16:9 Aspect Ratio */}
                <iframe
                  src={currentVideo.videoUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentVideo.title}
                ></iframe>
              </div>
              <div className="bg-gray-800 p-4">
                <h3 className="text-white font-bold text-xl">{currentVideo.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={closeAuthModal} 
        initialMode={authMode}
      />
    </div>
  );
}