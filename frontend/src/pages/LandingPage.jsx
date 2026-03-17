import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthModal from '../components/AuthModal';
import LanguageToggle from '../components/LanguageToggle';
import { 
  SparklesIcon, 
  ArrowRightIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-white/90 backdrop-blur-sm py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-[#0F172A] rounded-full flex items-center justify-center">
              <SparklesIcon className="h-6 w-6 text-[#FBBF24]" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#0F172A]">WASH<span className="text-[#FBBF24]">LAB</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-slate-600">
            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-600 transition-colors">{t('landing.about')}</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-600 transition-colors">{t('landing.services')}</a>
            <a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-600 transition-colors">{t('landing.pricing')}</a>
            <a href="#stores" onClick={(e) => { e.preventDefault(); document.getElementById('stores')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-600 transition-colors">{t('landing.stores')}</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-blue-600 transition-colors">{t('landing.contact')}</a>
          </div>

          <div className="flex items-center gap-6">
            <LanguageToggle className="hidden sm:flex" />
            <button 
              onClick={() => openAuthModal('login')}
              className="bg-[#0F172A] text-white px-8 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
            >
              {t('landing.book_now')}
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-extrabold text-[#0F172A] leading-[1.1]">
              {t('landing.hero_title_1')}<br />
              {t('landing.hero_title_2')}<br />
              <span className="text-[#FBBF24] relative">
                {t('landing.hero_title_3')}
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#0F172A]" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </h1>
            
            <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
              {t('landing.hero_subtitle')}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => openAuthModal('register')}
                className="bg-[#0F172A] text-white px-10 py-5 rounded-lg font-black text-sm uppercase tracking-wider flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                {t('landing.schedule_pickup')}
                <ArrowRightIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#FBBF24] text-[#0F172A] px-10 py-5 rounded-lg font-black text-sm uppercase tracking-wider hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-100"
              >
                {t('landing.see_pricing')}
              </button>
            </div>

            {/* Quick Badges */}
            <div className="pt-10 flex flex-wrap gap-12 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {t('landing.customer_support').split(' ')[0]}<br/>{t('landing.customer_support').split(' ')[1]}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {t('landing.super_fast_delivery').split(' ').slice(0, 2).join(' ')}<br/>{t('landing.super_fast_delivery').split(' ').slice(2).join(' ')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <SparklesIcon className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  {t('landing.fresh_eco_friendly').split(' ')[0]} &<br/>{t('landing.fresh_eco_friendly').split(' ').slice(2).join(' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute inset-0 bg-blue-50 rounded-full blur-[100px] opacity-50 scale-150"></div>
            <img 
              src="/assets/laundry-delivery-illustration-v3.png" 
              alt="Laundry Delivery" 
              className="relative z-10 w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-3xl rotate-3 opacity-10"></div>
            <img 
              src="/assets/laundry-about-us-new.png" 
              alt="About WashLab" 
              className="relative z-10 rounded-3xl shadow-2xl w-full h-[400px] object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="text-[#FBBF24] font-black uppercase tracking-[0.3em] text-xs">{t('landing.since_2010')}</span>
            <h2 className="text-4xl font-black text-[#0F172A]">{t('landing.about_title')}</h2>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              {t('landing.about_p1')}
            </p>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              {t('landing.about_p2')}
            </p>
            <div className="flex gap-4 pt-4">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-bold text-blue-800">{t('landing.eco_friendly_100')}</span>
              </div>
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-full border border-yellow-100">
                <CheckCircleIcon className="h-5 w-5 text-yellow-600" />
                <span className="text-xs font-bold text-yellow-800">{t('landing.expert_handling')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[#FBBF24] font-black uppercase tracking-[0.3em] text-xs">{t('landing.our_expert_services')}</span>
            <h2 className="text-4xl font-black text-[#0F172A]">{t('landing.complete_care_title')}</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                key: "wash_fold",
                icon: "🧺"
              },
              { 
                key: "dry_cleaning",
                icon: "👕"
              },
              { 
                key: "steam_ironing",
                icon: "👔"
              },
              { 
                key: "stain_removal",
                icon: "🧼"
              },
              { 
                key: "shoe_polishing",
                icon: "👞"
              },
              { 
                key: "blanket_cleaning",
                icon: "🛌"
              }
            ].map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#0F172A]">{t(`landing.services_list.${service.key}.title`)}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-medium">{t(`landing.services_list.${service.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[#FBBF24] font-black uppercase tracking-[0.3em] text-xs">{t('landing.pricing_plans')}</span>
            <h2 className="text-4xl font-black text-[#0F172A]">{t('landing.simple_transparent_pricing')}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">{t('landing.pricing_subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                key: "wash_fold",
                price: "₹20",
                features: ["Standard Washing", "Tumble Dry", "Professional Folding", "48h Delivery"],
                recommended: false,
                icon: "🧺"
              },
              {
                key: "dry_cleaning",
                price: "₹35",
                features: ["Premium Care", "Delicate Handling", "Stain Treatment", "Protective Packaging"],
                recommended: true,
                icon: "👕"
              },
              {
                key: "steam_ironing",
                price: "₹15",
                features: ["Professional Pressing", "Wrinkle Removal", "Hanger Service", "24h Delivery"],
                recommended: false,
                icon: "👔"
              }
            ].map((plan, i) => (
              <div key={i} className={`relative p-10 rounded-3xl border-2 transition-all duration-300 ${
                plan.recommended 
                ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-2xl scale-105 z-10' 
                : 'border-slate-100 bg-slate-50 text-[#0F172A] hover:border-blue-200'
              }`}>
                {plan.recommended && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FBBF24] text-[#0F172A] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{t('landing.most_popular')}</span>
                )}
                <div className="text-4xl mb-6">{plan.icon}</div>
                <h3 className="text-xl font-black mb-2">{t(`landing.services_list.${plan.key}.title`)}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className={`text-xs font-bold uppercase tracking-widest ${plan.recommended ? 'text-slate-400' : 'text-slate-500'}`}>{t('landing.item')}</span>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircleIcon className={`h-5 w-5 ${plan.recommended ? 'text-[#FBBF24]' : 'text-blue-600'}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => openAuthModal('register')}
                  className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                    plan.recommended
                    ? 'bg-[#FBBF24] text-[#0F172A] hover:bg-yellow-400'
                    : 'bg-[#0F172A] text-white hover:bg-slate-800'
                  }`}
                >
                  {t('landing.get_started_now')}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center mt-12 text-slate-400 text-xs font-bold uppercase tracking-widest">
            {t('landing.price_variation_note')}
          </p>
        </div>
      </section>

      {/* Stores Section */}
      <section id="stores" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[#FBBF24] font-black uppercase tracking-[0.3em] text-xs">{t('landing.our_locations')}</span>
            <h2 className="text-4xl font-black text-[#0F172A]">{t('landing.find_washlab_near_you')}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: "Adimaly Main Store", 
                address: "Machiplavu P O, Chattupara, Adimaly",
                phone: "+91 91790 74256",
                hours: "8:00 AM - 8:00 PM",
                coords: "10.0125,76.9536"
              },
              { 
                name: "Munnar Branch", 
                address: "Main Road, Near Tea Museum, Munnar",
                phone: "+91 91790 74257",
                hours: "9:00 AM - 7:00 PM",
                coords: "10.0889,77.0597"
              },
              { 
                name: "Kochi Hub", 
                address: "MG Road, Opposite Marine Drive, Kochi",
                phone: "+91 91790 74258",
                hours: "8:00 AM - 9:00 PM",
                coords: "9.9816,76.2799"
              }
            ].map((store, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                  <MapPinIcon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-[#0F172A]">{store.name}</h3>
                <p className="text-slate-500 text-sm font-medium mb-2">{store.address}</p>
                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <PhoneIcon className="h-4 w-4" /> {store.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <ClockIcon className="h-4 w-4" /> {store.hours}
                  </div>
                </div>
                <button 
                  onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${store.coords}`, '_blank')}
                  className="mt-8 w-full py-3 bg-white text-[#0F172A] border border-slate-200 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#0F172A] hover:text-white transition-all"
                >
                  {t('landing.get_directions')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-4">
                <span className="text-[#FBBF24] font-black uppercase tracking-[0.3em] text-xs">{t('landing.contact')}</span>
                <h2 className="text-4xl font-black text-[#0F172A]">{t('landing.get_in_touch')}</h2>
                <p className="text-lg text-slate-500 font-medium max-w-md">
                  {t('landing.contact_subtitle')}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                    <PhoneIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('landing.call_us')}</h4>
                    <p className="text-lg font-bold text-[#0F172A]">+91 91790 74256</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('landing.email_us')}</h4>
                    <p className="text-lg font-bold text-[#0F172A]">contact@washlab.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                    <MapPinIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('landing.visit_us')}</h4>
                    <p className="text-lg font-bold text-[#0F172A]">Adimaly, Idukki, Kerala</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('landing.name_label')}</label>
                    <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0F172A] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('landing.email_label')}</label>
                    <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0F172A] transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('landing.message_label')}</label>
                  <textarea rows="4" placeholder="How can we help you?" className="w-full px-6 py-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#0F172A] transition-all resize-none"></textarea>
                </div>
                <button className="w-full py-5 bg-[#0F172A] text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                  {t('landing.send_message')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="bg-[#0F172A] text-white py-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-8 w-8 text-[#FBBF24]" />
              <span className="text-2xl font-black tracking-tighter">WASH<span className="text-[#FBBF24]">LAB</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('landing.footer_desc')}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-[#FBBF24] uppercase tracking-widest text-xs">{t('landing.quick_links')}</h4>
            <ul className="space-y-4 text-slate-300 text-sm font-medium">
              <li><a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#FBBF24] transition-colors">{t('landing.about')}</a></li>
              <li><a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#FBBF24] transition-colors">{t('landing.services')}</a></li>
              <li><a href="#pricing" onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#FBBF24] transition-colors">{t('landing.pricing')}</a></li>
              <li><a href="#stores" onClick={(e) => { e.preventDefault(); document.getElementById('stores')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#FBBF24] transition-colors">{t('landing.stores')}</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-[#FBBF24] transition-colors">{t('landing.contact')}</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-[#FBBF24] uppercase tracking-widest text-xs">{t('landing.services')}</h4>
            <ul className="space-y-4 text-slate-300 text-sm font-medium">
              <li>{t('landing.services_list.wash_fold.title')}</li>
              <li>{t('landing.services_list.dry_cleaning.title')}</li>
              <li>{t('landing.services_list.steam_ironing.title')}</li>
              <li>{t('landing.services_list.shoe_polishing.title')}</li>
            </ul>
          </div>

          <div>
             <h4 className="font-bold mb-6 text-[#FBBF24] uppercase tracking-widest text-xs">{t('landing.newsletter')}</h4>
             <div className="flex gap-2 mb-6">
                <input type="text" placeholder="Email" className="bg-slate-800 border-none rounded-lg px-4 py-3 text-sm flex-1 focus:ring-1 focus:ring-[#FBBF24] outline-none" />
                <button className="bg-[#FBBF24] text-[#0F172A] p-3 rounded-lg hover:bg-yellow-400 transition-colors"><ArrowRightIcon className="h-5 w-5" /></button>
             </div>
             <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <PhoneIcon className="h-5 w-5 text-slate-400" />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                </div>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">© 2024 WashLab. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">{t('landing.privacy_policy')}</a>
            <a href="#" className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">{t('landing.terms_of_service')}</a>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Global Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
}