// src/components/ui/Button.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Button component with Tailwind CSS and Framer Motion.
 * @param {Object} props - Component props.
 * @param {string} [props.variant='primary'] - Button style variant ('primary', 'secondary', 'outline', 'ghost').
 * @param {string} [props.size='md'] - Button size ('sm', 'md', 'lg').
 * @param {string} [props.className=''] - Additional Tailwind CSS classes.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {Function} props.onClick - Click handler for the button.
 * @param {string} [props.type='button'] - The type of the button.
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  children,
  onClick,
  type = 'button',
  ...props
}) => {
  // Base styles
  let baseStyles = 'font-body font-semibold py-2 px-4 rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Variant styles
  switch (variant) {
    case 'primary':
      baseStyles += ' bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500';
      break;
    case 'secondary':
      baseStyles += ' bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500';
      break;
    case 'outline':
      baseStyles += ' border border-primary-500 text-primary-500 hover:bg-primary-500/10 focus:ring-primary-500';
      break;
    case 'ghost':
      baseStyles += ' text-neutral-900 hover:bg-neutral-100 dark:text-neutral-0 dark:hover:bg-neutral-800/20 focus:ring-neutral-900/50';
      break;
    case 'danger': // New variant for destructive actions
      baseStyles += ' bg-error-500 text-white hover:bg-error-600 focus:ring-error-500';
      break;
    default:
      baseStyles += ' bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500';
  }

  // Size styles
  switch (size) {
    case 'sm':
      baseStyles += ' text-sm py-1 px-3';
      break;
    case 'lg':
      baseStyles += ' text-lg py-3 px-6';
      break;
    case 'md':
    default:
      baseStyles += ' text-base py-2 px-4';
      break;
  }

  // Disabled styles
  if (disabled) {
    baseStyles += ' opacity-50 cursor-not-allowed';
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${className}`}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }} // Scale down on tap/click
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
