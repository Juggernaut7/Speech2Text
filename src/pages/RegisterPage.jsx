// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

/**
 * Registration page for the application.
 * Allows new users to register using a simulated authentication system.
 */
const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const { currentEffectiveTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (register(username, password)) {
      // Redirect to login page on successful registration
      navigate('/login');
    } else {
      // Error message handled by toast in AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 font-body p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <h2 className="font-heading text-2xl font-bold text-center text-primary-500 dark:text-secondary-500 mb-6">
            Create Your Account
          </h2>
          <p className="text-center text-neutral-600 dark:text-neutral-400 mb-8">
            Join Speech2Text and start transcribing!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-100 mb-1" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-3 border border-neutral-400/30 rounded-md bg-neutral-0 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-0
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Choose a username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-800 dark:text-neutral-100 mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-neutral-400/30 rounded-md bg-neutral-0 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-0
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a strong password"
              />
            </div>
            <Button type="submit" variant="primary" className="w-full py-3">
              Register
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary-500 hover:underline">
              Login here
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
