// src/components/ui/ToggleSwitch.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable ToggleSwitch component.
 * @param {Object} props - Component props.
 * @param {string} props.label - The label for the toggle switch.
 * @param {boolean} props.checked - The current checked state.
 * @param {Function} props.onChange - Callback function when the state changes.
 */
const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <motion.div
      className="flex items-center justify-between"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <label className="text-sm font-body font-medium text-neutral-900 dark:text-neutral-0">
        {label}
      </label>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-neutral-400/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 dark:peer-focus:ring-secondary-500 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-neutral-400 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-700 peer-checked:bg-primary-500 dark:peer-checked:bg-secondary-500"></div>
      </label>
    </motion.div>
  );
};

export default ToggleSwitch;
