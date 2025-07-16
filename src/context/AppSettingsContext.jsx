// src/context/AppSettingsContext.jsx
import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_APP_SETTINGS, LOCAL_STORAGE_KEYS } from '../utils/constants';

export const AppSettingsContext = createContext();

/**
 * Provides application settings context to its children.
 * Manages settings like offline mode, high contrast, etc., and persists them in localStorage.
 */
export const AppSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useLocalStorage(LOCAL_STORAGE_KEYS.APP_SETTINGS, DEFAULT_APP_SETTINGS);

  // Effect to apply high-contrast class to the document body
  useEffect(() => {
    if (settings.highContrastMode) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [settings.highContrastMode]);

  /**
   * Updates a specific application setting.
   * @param {string} name - The name of the setting to update.
   * @param {boolean|string} value - The new value for the setting.
   */
  const updateSetting = (name, value) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const value = {
    settings,
    updateSetting,
  };

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
};

/**
 * Custom hook to consume the AppSettingsContext.
 * @returns {{settings: Object, updateSetting: Function}}
 */
export const useAppContextSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppContextSettings must be used within an AppSettingsProvider');
  }
  return context;
};
