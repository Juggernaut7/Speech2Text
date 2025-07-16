// src/components/ui/LanguageSelector.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAppContextSettings } from '../../context/AppSettingsContext';
import { LANGUAGES } from '../../utils/constants';
import { FaGlobe } from 'react-icons/fa'; // Globe icon for language
import { IconContext } from 'react-icons';

/**
 * Dropdown component for selecting the transcription language.
 * @param {Object} props - Component props.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes.
 */
const LanguageSelector = ({ className = '' }) => {
  const { settings, updateSetting } = useAppContextSettings();

  const handleLanguageChange = (e) => {
    updateSetting('language', e.target.value);
  };

  return (
    <motion.div
      className={`relative w-full ${className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
    >
      <label htmlFor="language-select" className="sr-only">Select Language</label>
      <div className="relative">
        <select
          id="language-select"
          value={settings.language}
          onChange={handleLanguageChange}
          className="block w-full p-3 pl-10 pr-8 border border-neutral-400/30 rounded-md
                     bg-neutral-0 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-0
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     appearance-none transition-colors cursor-pointer text-sm font-body"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <IconContext.Provider value={{ className: "text-neutral-500 dark:text-neutral-400" }}>
            <FaGlobe size={18} />
          </IconContext.Provider>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-5 w-5 text-neutral-500 dark:text-neutral-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

export default LanguageSelector;
