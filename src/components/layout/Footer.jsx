// src/components/layout/Footer.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Global Footer component.
 */
const Footer = () => {
  return (
    <motion.footer
      className="w-full bg-neutral-0 dark:bg-neutral-900 p-4 mt-8 border-t border-neutral-400/20 dark:border-neutral-700/50 text-center text-sm text-neutral-600 dark:text-neutral-400 font-body"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.5 }}
    >
      <p>&copy; {new Date().getFullYear()} Speech2Text. All rights reserved. Built with ❤️ for the contest.</p>
    </motion.footer>
  );
};

export default Footer;
