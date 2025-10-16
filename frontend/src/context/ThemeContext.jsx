import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('blue');

  const themes = {
    light: {
      background: 'bg-gray-50',
      surface: 'bg-white',
      text: {
        primary: 'text-gray-900',
        secondary: 'text-gray-600',
        muted: 'text-gray-500'
      },
      border: 'border-gray-200',
      hover: 'hover:bg-gray-50'
    },
    dark: {
      background: 'bg-gray-900',
      surface: 'bg-gray-800',
      text: {
        primary: 'text-white',
        secondary: 'text-gray-300',
        muted: 'text-gray-400'
      },
      border: 'border-gray-700',
      hover: 'hover:bg-gray-700'
    }
  };

  const accentColors = {
    blue: {
      primary: 'bg-blue-600 text-white',
      secondary: 'bg-blue-100 text-blue-800',
      hover: 'hover:bg-blue-700',
      focus: 'focus:ring-blue-500',
      border: 'border-blue-500'
    },
    purple: {
      primary: 'bg-purple-600 text-white',
      secondary: 'bg-purple-100 text-purple-800',
      hover: 'hover:bg-purple-700',
      focus: 'focus:ring-purple-500',
      border: 'border-purple-500'
    },
    green: {
      primary: 'bg-green-600 text-white',
      secondary: 'bg-green-100 text-green-800',
      hover: 'hover:bg-green-700',
      focus: 'focus:ring-green-500',
      border: 'border-green-500'
    },
    red: {
      primary: 'bg-red-600 text-white',
      secondary: 'bg-red-100 text-red-800',
      hover: 'hover:bg-red-700',
      focus: 'focus:ring-red-500',
      border: 'border-red-500'
    },
    orange: {
      primary: 'bg-orange-600 text-white',
      secondary: 'bg-orange-100 text-orange-800',
      hover: 'hover:bg-orange-700',
      focus: 'focus:ring-orange-500',
      border: 'border-orange-500'
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedAccent = localStorage.getItem('accentColor');
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    
    if (savedAccent) {
      setAccentColor(savedAccent);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const currentTheme = isDarkMode ? themes.dark : themes.light;
  const currentAccent = accentColors[accentColor];

  const getThemeClasses = (element) => {
    const baseClasses = {
      card: `${currentTheme.surface} ${currentTheme.border} border rounded-lg shadow-sm`,
      button: {
        primary: `${currentAccent.primary} ${currentAccent.hover} ${currentAccent.focus} focus:ring-2 focus:ring-offset-2 px-4 py-2 rounded-lg font-medium transition-colors`,
        secondary: `${currentTheme.surface} ${currentTheme.text.primary} ${currentTheme.border} border ${currentTheme.hover} px-4 py-2 rounded-lg font-medium transition-colors`,
        ghost: `${currentTheme.text.primary} ${currentTheme.hover} px-4 py-2 rounded-lg font-medium transition-colors`
      },
      input: `${currentTheme.surface} ${currentTheme.text.primary} ${currentTheme.border} border rounded-lg px-3 py-2 ${currentAccent.focus} focus:ring-2 focus:ring-offset-2 focus:border-transparent`,
      sidebar: `${currentTheme.surface} ${currentTheme.border} border-r`,
      header: `${currentTheme.surface} ${currentTheme.border} border-b`,
      text: {
        primary: currentTheme.text.primary,
        secondary: currentTheme.text.secondary,
        muted: currentTheme.text.muted
      }
    };

    return baseClasses[element] || '';
  };

  const value = {
    isDarkMode,
    accentColor,
    toggleTheme,
    setAccentColor,
    currentTheme,
    currentAccent,
    getThemeClasses,
    themes,
    accentColors
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`min-h-screen ${currentTheme.background} ${currentTheme.text.primary} transition-colors duration-200`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
