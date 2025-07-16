// src/components/ui/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5'; // Close icon
import { IconContext } from 'react-icons';
import Button from './Button';

/**
 * Reusable Modal component for displaying overlays.
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls the visibility of the modal.
 * @param {Function} props.onClose - Callback function when the modal is requested to close.
 * @param {string} props.title - The title of the modal.
 * @param {React.ReactNode} props.children - The content of the modal body.
 * @param {React.ReactNode} [props.actions] - Optional action buttons for the modal footer.
 */
const Modal = ({ open, onClose, title, children, actions }) => {
  if (typeof window === 'undefined' || !open) return null; // Don't render on server or if not open

  return ReactDOM.createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-neutral-900/70 dark:bg-neutral-900/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-neutral-0 dark:bg-neutral-800 rounded-lg shadow-large max-w-md w-full p-6
                       border border-neutral-400/20 dark:border-neutral-700"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-400/10 dark:border-neutral-700/50">
              <h3 className="font-heading text-lg font-semibold text-neutral-900 dark:text-neutral-0">
                {title}
              </h3>
              <Button variant="ghost" size="sm" onClick={onClose} className="p-1 rounded-full">
                <IconContext.Provider value={{ className: "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-0" }}>
                  <IoClose size={24} />
                </IconContext.Provider>
              </Button>
            </div>

            {/* Body */}
            <div className="font-body text-neutral-800 dark:text-neutral-100 mb-6">
              {children}
            </div>

            {/* Actions (Footer) */}
            {actions && (
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-400/10 dark:border-neutral-700/50">
                {actions}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body // Portal to the body to ensure it's on top
  );
};

export default Modal;
