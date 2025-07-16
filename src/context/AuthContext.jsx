// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import  {useLocalStorage}  from '../hooks/useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';
import { toast } from 'react-toastify';
import { useTheme } from './ThemeContext'; // For toast theme

export const AuthContext = createContext();

/**
 * Provides authentication context to its children.
 * Manages user login, registration, and logout using localStorage.
 */
export const AuthProvider = ({ children }) => {
  const { currentEffectiveTheme } = useTheme();
  // 'user' will store the currently logged-in user's data (e.g., { username: 'test' })
  const [user, setUser] = useLocalStorage(LOCAL_STORAGE_KEYS.AUTH_USER, null);
  // 'registeredUsers' will store an array of all registered users
  const [registeredUsers, setRegisteredUsers] = useLocalStorage(LOCAL_STORAGE_KEYS.REGISTERED_USERS, []);

  /**
   * Simulates user registration.
   * @param {string} username
   * @param {string} password
   * @returns {boolean} True if registration is successful, false otherwise.
   */
  const register = (username, password) => {
    if (!username || !password) {
      toast.error('Username and password are required.', { theme: currentEffectiveTheme });
      return false;
    }
    if (registeredUsers.some(u => u.username === username)) {
      toast.error('Username already exists.', { theme: currentEffectiveTheme });
      return false;
    }
    const newUser = { username, password }; // In a real app, hash password!
    setRegisteredUsers(prevUsers => [...prevUsers, newUser]);
    toast.success('Registration successful! Please log in.', { theme: currentEffectiveTheme });
    return true;
  };

  /**
   * Simulates user login.
   * @param {string} username
   * @param {string} password
   * @returns {boolean} True if login is successful, false otherwise.
   */
  const login = (username, password) => {
    const foundUser = registeredUsers.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser({ username: foundUser.username }); // Store minimal user data in current session
      toast.success(`Welcome, ${foundUser.username}!`, { theme: currentEffectiveTheme });
      return true;
    } else {
      toast.error('Invalid username or password.', { theme: currentEffectiveTheme });
      return false;
    }
  };

  /**
   * Logs out the current user.
   */
  const logout = () => {
    setUser(null); // Clear current user from localStorage
    toast.info('You have been logged out.', { theme: currentEffectiveTheme });
  };

  const value = {
    user,
    isAuthenticated: !!user, // Convenience flag
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to consume the AuthContext.
 * @returns {{user: Object|null, isAuthenticated: boolean, register: Function, login: Function, logout: Function}}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
