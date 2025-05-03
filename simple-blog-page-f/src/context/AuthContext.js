import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state and listen for localStorage changes
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    
    // Initial load
    initAuth();
    
    // Listen for storage events (for multi-tab synchronization)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'token') {
        console.log('Auth storage changed, updating state');
        initAuth();
      }
    };
    
    // Listen for custom auth change events
    const handleAuthChange = () => {
      console.log('Auth change event received, updating state');
      initAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setUser(authService.getCurrentUser());
        return { success: true };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Register function
  const register = async (username, email, password) => {
    try {
      const response = await authService.register(username, email, password);
      return { success: true, message: response.message || 'Registration successful' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 