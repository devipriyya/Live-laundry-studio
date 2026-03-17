import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [currentMode, setCurrentMode] = useState(initialMode);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentMode(initialMode);
  }, [initialMode]);

  if (!isOpen) return null;

  const switchToLogin = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMode('login');
      setIsAnimating(false);
    }, 150);
  };

  const switchToRegister = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMode('register');
      setIsAnimating(false);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 py-6 animate-fadeIn">
      <div className="relative w-full max-w-md mx-auto animate-slideUp">
        {/* Modal Background - Premium Glassmorphism Design */}
        <div className="relative bg-white/10 backdrop-blur-3xl rounded-[2.5rem] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-all rounded-full hover:bg-white/10 z-20"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Content with smooth transitions */}
          <div className={`relative z-10 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            {currentMode === 'login' ? (
              <LoginForm onSwitchToRegister={switchToRegister} onClose={onClose} />
            ) : (
              <RegisterForm onSwitchToLogin={switchToLogin} onClose={onClose} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
