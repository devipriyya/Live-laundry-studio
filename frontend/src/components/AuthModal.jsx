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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6 animate-fadeIn">
      <div className="relative w-full max-w-md mx-auto animate-slideUp">
        {/* Modal Background - Clean White Design */}
        <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Content with smooth transitions */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
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
