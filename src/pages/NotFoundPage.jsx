// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';

/**
 * A simple 404 Not Found page.
 */
const NotFoundPage = () => {
  const { currentEffectiveTheme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 text-center
                     ${currentEffectiveTheme === 'dark' ? 'bg-neutral-900 text-neutral-0' : 'bg-neutral-100 text-neutral-900'}`}>
      <motion.h1
        className="font-heading text-6xl md:text-8xl font-bold text-primary-500 dark:text-secondary-500 mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        404
      </motion.h1>
      <motion.p
        className="font-body text-xl md:text-2xl text-neutral-800 dark:text-neutral-100 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Oops! The page you're looking for doesn't exist.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link to="/">
          <Button variant="primary" size="lg">
            Go to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
