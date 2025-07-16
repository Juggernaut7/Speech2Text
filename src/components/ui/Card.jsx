// src/components/ui/Card.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Card component with Tailwind CSS and Framer Motion.
 * Applies default styling from the design system.
 * @param {Object} props - Component props.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes.
 * @param {React.ReactNode} props.children - The content of the card.
 */
const Card = ({ className = '', children, ...props }) => {
  const baseStyles = 'bg-neutral-0 dark:bg-neutral-900 rounded-lg shadow-soft p-6 border border-neutral-400/20 dark:border-neutral-700/50';

  return (
    <motion.div
      className={`${baseStyles} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
