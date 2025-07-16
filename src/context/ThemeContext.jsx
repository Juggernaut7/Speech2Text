// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

// Create a context for the theme
export const ThemeContext = createContext();

/**
 * Provides theme (light/dark) context to its children.
 * Manages the 'dark' class on the documentElement and persists theme preference in localStorage.
 */
export const ThemeProvider = ({ children }) => {
  // Use useLocalStorage to persist theme preference
  const [theme, setTheme] = useLocalStorage(LOCAL_STORAGE_KEYS.THEME, 'system'); // 'light', 'dark', or 'system'

  // Effect to apply the theme class to the document element
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(isDark ? 'dark' : 'light');
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'light';
      // If system, toggle to light/dark based on current system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
    });
  };

  // Function to set theme explicitly
  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme);
  };

  // Determine current effective theme for display purposes
  const currentEffectiveTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  const value = {
    theme,
    currentEffectiveTheme,
    toggleTheme,
    setSpecificTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to consume the ThemeContext.
 * @returns {{theme: string, currentEffectiveTheme: string, toggleTheme: Function, setSpecificTheme: Function}}
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
