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
  GlobeAltIcon
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
      icon: "🧽",
      title: "Dry Cleaning",
      description: "We offer convenient dry-cleaning services for your favorite garments including wedding dresses and other special-occasion pieces."
    },
    {
      icon: "👔", 
      title: "Wash & Iron",
      description: "We wash your clothes and deliver them fresh from our commercial steam press folded and ready to hang in your closet."
    },
    {
      icon: "🔥",
      title: "Steam Iron",
      description: "Laundry Drop makes it easy. Let our pro's steam iron clothes, bedding, and household linens."
    },
    {
      icon: "🛏️",
      title: "Bed Sheet Cleaning",
      description: "For your bedsheets: we can multiple schedule delivery options, including same day delivery for complete fast fit."
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
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1631609088067-3082ac1fe84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ];

  const videos = [
    {
      title: "How to Keep White Clothes White is the Laundry",
      thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "2:45"
    },
    {
      title: "Trichloroethane",
      thumbnail: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "1:30"
    },
    {
      title: "What to do Laundry",
      thumbnail: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "3:15"
    },
    {
      title: "How to Care for your Clothes",
      thumbnail: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      duration: "4:20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                <div className="relative">
                  <SparklesIcon className="h-10 w-10 text-blue-600 animate-pulse" />
                  <div className="absolute inset-0 h-10 w-10 bg-blue-600/20 rounded-full blur-xl animate-ping"></div>
                </div>
                FabricSpa
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#home" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                HOME
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#services" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                SERVICES
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#about" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                ABOUT US
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#whyus" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                WHY US
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#gallery" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                GALLERY
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#contact" className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold group">
                CONTACT
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
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
                className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80"></div>
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
        {/* Hero Content */}
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
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-110 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Start Your Journey
                <ArrowRightIcon className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button className="group inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 hover:shadow-xl">
              <PlayIcon className="h-6 w-6 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>

          {/* Stats Cards */}
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

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-32 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-cyan-400/10 to-indigo-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Our Services
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Premium Care for Every Need</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive range of professional laundry services designed to keep your clothes looking their absolute best.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ABOUT US</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/laundry-background.jpeg" 
                alt="Professional laundry service"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
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
              <p className="text-gray-600 text-lg leading-relaxed">
                Experience the difference that professional care makes – because your clothes truly deserve it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="whyus" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Why Choose WashLab
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Experience the Difference</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover what makes WashLab the preferred choice for premium garment care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUsFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 text-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                  {feature.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">GALLERY</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={image} 
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Section */}
      <section id="videos" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">VIDEOS</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video, index) => (
              <div key={index} className="relative group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-blue-600 p-4 rounded-full">
                      <PlayIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <h3 className="text-white font-semibold mt-4">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <img 
                src="/laundry-background.jpeg" 
                alt="Customer testimonial"
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
            </div>
            
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="text-2xl font-bold text-blue-600 mr-4">"</div>
                  <h3 className="font-semibold text-gray-900">Angeles Paul</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "Service was very quick delivery and Pricing was perfect. I would definitely 
                  recommend to anyone needing laundry done."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="text-2xl font-bold text-blue-600 mr-4">"</div>
                  <h3 className="font-semibold text-gray-900">Billy David</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "I tried out your service! I appreciate how efficient your guys were and how well-priced the service was, 
                  good work. Would recommend to my friends and will definitely be using your services again."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">CONTACT US</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="w-full h-96 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-600">Map Location</span>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Office Address</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPinIcon className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <p className="font-semibold text-gray-900">New York City, Manhattan, New York</p>
                      <p className="text-gray-600">Street: Broadway Greenwich Street Complex, Above</p>
                      <p className="text-gray-600">Whole Foods Market, New York 10007</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <PhoneIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">General Inquiries</p>
                      <p className="text-blue-600">(212) 227-3500</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <PhoneIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Call Us</p>
                      <p className="text-blue-600">(212) 227-3500</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Our Timings</p>
                      <p className="text-gray-600">Mon - Sun: 9:00 AM - 10:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <form className="space-y-4">
                  <div>
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <textarea 
                      placeholder="Your Message" 
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">ABOUT WASHLAB</h3>
              <p className="text-gray-400 text-sm">
                Premium laundry services with cutting-edge technology and expert care for your garments.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">QUICK</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">CONNECT</h3>
              <p className="text-gray-400 text-sm">Follow Us for updates</p>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">NEWSLETTER</h3>
              <p className="text-gray-400 text-sm mb-4">Stay updated with our latest offers</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="flex-1 p-2 rounded-l-lg focus:outline-none"
                />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  →
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">&copy; 2024 WashLab. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={closeAuthModal} 
        initialMode={authMode}
      />
    </div>
  );
}