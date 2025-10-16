import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  SwatchIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const ThemeToggle = ({ showColorPicker = true, compact = false }) => {
  const { 
    isDarkMode, 
    accentColor, 
    toggleTheme, 
    setAccentColor, 
    accentColors,
    getThemeClasses 
  } = useTheme();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);

  const themeOptions = [
    { id: 'light', label: 'Light', icon: SunIcon },
    { id: 'dark', label: 'Dark', icon: MoonIcon },
    { id: 'system', label: 'System', icon: ComputerDesktopIcon }
  ];

  const colorOptions = [
    { id: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { id: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { id: 'green', label: 'Green', color: 'bg-green-500' },
    { id: 'red', label: 'Red', color: 'bg-red-500' },
    { id: 'orange', label: 'Orange', color: 'bg-orange-500' }
  ];

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${getThemeClasses('button').ghost}`}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
        
        {showColorPicker && (
          <div className="relative">
            <button
              onClick={() => setShowColorDropdown(!showColorDropdown)}
              className={`p-2 rounded-lg transition-colors ${getThemeClasses('button').ghost}`}
              title="Change accent color"
            >
              <SwatchIcon className="h-5 w-5" />
            </button>
            
            {showColorDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowColorDropdown(false)}
                />
                <div className={`absolute right-0 top-12 z-20 w-48 ${getThemeClasses('card')} p-2`}>
                  <div className="space-y-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => {
                          setAccentColor(color.id);
                          setShowColorDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          accentColor === color.id 
                            ? getThemeClasses('button').secondary.split(' ').slice(0, 3).join(' ')
                            : getThemeClasses('button').ghost
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full ${color.color}`} />
                        <span className="flex-1 text-left">{color.label}</span>
                        {accentColor === color.id && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Theme Selector */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${getThemeClasses('button').secondary}`}
        >
          {isDarkMode ? (
            <MoonIcon className="h-4 w-4" />
          ) : (
            <SunIcon className="h-4 w-4" />
          )}
          <span className="text-sm">{isDarkMode ? 'Dark' : 'Light'}</span>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
        
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />
            <div className={`absolute right-0 top-12 z-20 w-48 ${getThemeClasses('card')} p-2`}>
              <div className="space-y-1">
                {themeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      if (option.id === 'light') {
                        if (isDarkMode) toggleTheme();
                      } else if (option.id === 'dark') {
                        if (!isDarkMode) toggleTheme();
                      } else {
                        // System theme - could implement system preference detection
                        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                        if (prefersDark !== isDarkMode) toggleTheme();
                      }
                      setShowDropdown(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      (option.id === 'light' && !isDarkMode) || (option.id === 'dark' && isDarkMode)
                        ? getThemeClasses('button').secondary.split(' ').slice(0, 3).join(' ')
                        : getThemeClasses('button').ghost
                    }`}
                  >
                    <option.icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{option.label}</span>
                    {((option.id === 'light' && !isDarkMode) || (option.id === 'dark' && isDarkMode)) && (
                      <CheckIcon className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Color Picker */}
      {showColorPicker && (
        <div className="relative">
          <button
            onClick={() => setShowColorDropdown(!showColorDropdown)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${getThemeClasses('button').secondary}`}
          >
            <div className={`w-4 h-4 rounded-full ${colorOptions.find(c => c.id === accentColor)?.color}`} />
            <span className="text-sm">Color</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          
          {showColorDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowColorDropdown(false)}
              />
              <div className={`absolute right-0 top-12 z-20 w-48 ${getThemeClasses('card')} p-2`}>
                <div className="space-y-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setAccentColor(color.id);
                        setShowColorDropdown(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        accentColor === color.id 
                          ? getThemeClasses('button').secondary.split(' ').slice(0, 3).join(' ')
                          : getThemeClasses('button').ghost
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${color.color}`} />
                      <span className="flex-1 text-left">{color.label}</span>
                      {accentColor === color.id && (
                        <CheckIcon className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
