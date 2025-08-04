import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../lib/api';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: number;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminToken: string | null;
  isAdminLoggedIn: boolean;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  getAuthHeaders: () => { Authorization: string };
  refreshToken: () => void;
  debugSession: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Function to check if token format is valid
  const isTokenFormatValid = (token: string): boolean => {
    try {
      // Check if token has the correct JWT format (3 parts separated by dots)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }
      
      // Try to decode the payload to check if it's valid JSON
      const payload = JSON.parse(atob(parts[1]));
      return payload && payload._id && payload.role;
    } catch (error) {
      return false;
    }
  };

  // Function to validate token with backend (for persistent sessions)
  const validateToken = async (token: string): Promise<boolean> => {
    // First check if token format is valid
    if (!isTokenFormatValid(token)) {
      return false;
    }

    try {
      const response = await authAPI.verifyToken(token);
      
      // Update user data if it has changed
      if (response.user && response.user._id) {
        setAdminUser(response.user);
      }
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      // Return true if it's a network error (backend not available)
      // This prevents logout when backend is down
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return true;
      }
      return false;
    }
  };

  // Function to check and restore session (persistent)
  const checkAndRestoreSession = async () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        
        // Check if token format is valid before restoring
        if (isTokenFormatValid(token)) {
          // Restore the session immediately to prevent logout on refresh
          setAdminToken(token);
          setAdminUser(parsedUser);
          setIsAdminLoggedIn(true);
          
          // Then validate token with backend in the background (non-blocking)
          setTimeout(async () => {
            try {
              const isValid = await validateToken(token);
              if (!isValid) {
                // Don't logout for persistent sessions, just log the issue
              }
            } catch (validationError) {
              // Don't logout on validation error, keep the session
            }
          }, 1000); // Delay validation by 1 second
        } else {
          logout();
        }
      } catch (error) {
        // Only logout if we can't parse the user data
        logout();
      }
    }
  };

  useEffect(() => {
    // Check for existing admin session on app load
    checkAndRestoreSession();

    // Set up periodic token validation (every 30 minutes for persistent sessions)
    const tokenCheckInterval = setInterval(() => {
      if (adminToken) {
        validateToken(adminToken).then(isValid => {
          if (!isValid) {
            // Don't logout for persistent sessions, just log the issue
          }
        }).catch(error => {
          // Don't logout on network errors, just log them
        });
      }
    }, 30 * 60 * 1000); // Check every 30 minutes

    return () => {
      clearInterval(tokenCheckInterval);
    };
  }, [adminToken]);

  const login = (token: string, user: AdminUser) => {
    // Store in localStorage for persistence
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    
    // Update state
    setAdminToken(token);
    setAdminUser(user);
    setIsAdminLoggedIn(true);
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint if we have a token
      if (adminToken) {
        await authAPI.logout(`Bearer ${adminToken}`);
      }
    } catch (error) {
      // Handle logout error silently
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setAdminToken(null);
      setAdminUser(null);
      setIsAdminLoggedIn(false);
    }
  };

  const getAuthHeaders = () => {
    if (!adminToken) {
      throw new Error('No authentication token found. Please log in again.');
    }
    
    return {
      Authorization: `Bearer ${adminToken}`
    };
  };

  const refreshToken = () => {
    checkAndRestoreSession();
  };

  const debugSession = () => {
    console.log('=== Session Debug Info ===');
    console.log('adminToken:', adminToken ? 'Present' : 'Not present');
    console.log('adminUser:', adminUser);
    console.log('isAdminLoggedIn:', isAdminLoggedIn);
    console.log('localStorage adminToken:', localStorage.getItem('adminToken') ? 'Present' : 'Not present');
    console.log('localStorage adminUser:', localStorage.getItem('adminUser'));
    if (adminToken) {
      console.log('Token format valid:', isTokenFormatValid(adminToken));
    }
  };

  const value: AdminAuthContextType = {
    adminUser,
    adminToken,
    isAdminLoggedIn,
    login,
    logout,
    getAuthHeaders,
    refreshToken,
    debugSession
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}; 