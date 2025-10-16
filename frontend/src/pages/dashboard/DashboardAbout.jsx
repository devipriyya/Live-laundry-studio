import React from 'react';
import { SparklesIcon, HeartIcon, UsersIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const DashboardAbout = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">About FabricSpa</h1>
        <p className="text-gray-600 mt-2">Your trusted partner in premium laundry care</p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <SparklesIcon className="h-8 w-8" />
          <h2 className="text-3xl font-bold">FabricSpa</h2>
        </div>
        <p className="text-xl text-blue-100 mb-6">
          Revolutionizing laundry care with technology, sustainability, and exceptional service since 2020.
        </p>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold">50K+</div>
            <div className="text-blue-200">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">25+</div>
            <div className="text-blue-200">Cities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">1M+</div>
            <div className="text-blue-200">Garments Cleaned</div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <HeartIcon className="h-6 w-6 text-red-500" />
            <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            To provide exceptional laundry and dry cleaning services that save our customers time while 
            delivering superior care for their garments. We combine cutting-edge technology with 
            eco-friendly practices to ensure the best results.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <GlobeAltIcon className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            To become India's most trusted and sustainable laundry service provider, setting new 
            standards in fabric care while contributing to environmental conservation and 
            community well-being.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Our Core Values</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <SparklesIcon className="h-8 w-8 text-blue-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Quality Excellence</h4>
            <p className="text-sm text-gray-600">Uncompromising standards in every service we provide</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Sustainability</h4>
            <p className="text-sm text-gray-600">Eco-friendly processes that protect our planet</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <UsersIcon className="h-8 w-8 text-purple-600 mx-auto" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Customer First</h4>
            <p className="text-sm text-gray-600">Your satisfaction is our top priority</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Innovation</h4>
            <p className="text-sm text-gray-600">Continuously improving through technology</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Leadership Team</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👨‍💼</span>
            </div>
            <h4 className="font-semibold text-gray-900">Rajesh Kumar</h4>
            <p className="text-sm text-gray-600 mb-2">Founder & CEO</p>
            <p className="text-xs text-gray-500">15+ years in textile industry</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👩‍💼</span>
            </div>
            <h4 className="font-semibold text-gray-900">Priya Sharma</h4>
            <p className="text-sm text-gray-600 mb-2">COO</p>
            <p className="text-xs text-gray-500">Operations & Quality Expert</p>
          </div>
          
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👨‍💻</span>
            </div>
            <h4 className="font-semibold text-gray-900">Amit Patel</h4>
            <p className="text-sm text-gray-600 mb-2">CTO</p>
            <p className="text-xs text-gray-500">Technology & Innovation Lead</p>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Headquarters</h4>
            <p className="text-gray-600">
              FabricSpa Technologies Pvt Ltd<br />
              123 Tech Park, Bangalore<br />
              Karnataka 560001, India
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
            <p className="text-gray-600">
              Phone: +91 80 1234 5678<br />
              Email: hello@fabricspa.com<br />
              Support: support@fabricspa.com
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Business Hours</h4>
            <p className="text-gray-600">
              Monday - Saturday: 8:00 AM - 8:00 PM<br />
              Sunday: 10:00 AM - 6:00 PM<br />
              24/7 Online Support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAbout;
