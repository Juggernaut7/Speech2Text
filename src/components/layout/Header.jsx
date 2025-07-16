// src/components/layout/Header.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { RiSunFill, RiMoonFill } from 'react-icons/ri'; // Sun/Moon icons
import { IoLogOutOutline } from 'react-icons/io5'; // Logout icon
import { IconContext } from 'react-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ToggleSwitch from '../ui/ToggleSwitch';
import Button from '../ui/Button';

/**
 * Global Header component with app title, theme toggle, and logout functionality.
 */
const Header = () => {
  const { theme, toggleTheme, currentEffectiveTheme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const isDarkMode = currentEffectiveTheme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <motion.header
      className="w-full bg-neutral-0 dark:bg-neutral-900 p-4 shadow-soft border-b border-neutral-400/20 dark:border-neutral-700/50 flex justify-between items-center z-10 sticky top-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <h1 className="font-heading text-xl md:text-2xl font-bold text-primary-500 dark:text-secondary-500">
        Speech2Text<span className="text-secondary-500 dark:text-primary-500">.</span>
      </h1>

      <div className="flex items-center space-x-4">
        {/* User Info (if logged in) */}
        {isAuthenticated && user && (
          <span className="text-neutral-800 dark:text-neutral-100 font-body text-sm hidden sm:block">
            Hello, <span className="font-semibold">{user.username}</span>!
          </span>
        )}

        {/* Theme Toggle */}
        <div className="flex items-center space-x-2">
          <IconContext.Provider value={{ className: "text-neutral-800 dark:text-neutral-100" }}>
            {isDarkMode ? <RiMoonFill size={20} /> : <RiSunFill size={20} />}
          </IconContext.Provider>
          <ToggleSwitch
            label="" // Label is handled by icon
            checked={isDarkMode}
            onChange={toggleTheme}
          />
        </div>

        {/* Logout Button */}
        {isAuthenticated && (
          <Button variant="ghost" size="sm" onClick={handleLogout} className="p-2 rounded-full">
            <IconContext.Provider value={{ className: "text-error-500" }}>
              <IoLogOutOutline size={24} />
            </IconContext.Provider>
            <span className="sr-only sm:not-sr-only sm:ml-1">Logout</span> {/* Show text on larger screens */}
          </Button>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
