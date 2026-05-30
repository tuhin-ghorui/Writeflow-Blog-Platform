import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize and check token on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('writeflow_token');
      if (token) {
        try {
          // Fetch fresh user data from server
          const userData = await api.get('/auth/me');
          setUser(userData);
          localStorage.setItem('writeflow_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to verify token:', error.message);
          // Token is invalid/expired
          localStorage.removeItem('writeflow_token');
          localStorage.removeItem('writeflow_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    // Listen to external auth-change events (like from api.js 401s)
    const handleAuthChange = () => {
      const token = localStorage.getItem('writeflow_token');
      if (!token) {
        setUser(null);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      localStorage.setItem('writeflow_token', data.token);
      
      const userPayload = {
        _id: data._id,
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        role: data.role,
        createdAt: data.createdAt,
      };
      
      localStorage.setItem('writeflow_user', JSON.stringify(userPayload));
      setUser(userPayload);
      return userPayload;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullName, username, email, password, avatar) => {
    setLoading(true);
    try {
      const data = await api.post('/auth/register', {
        fullName,
        username,
        email,
        password,
        avatar,
      });
      localStorage.setItem('writeflow_token', data.token);

      const userPayload = {
        _id: data._id,
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        role: data.role,
        createdAt: data.createdAt,
      };

      localStorage.setItem('writeflow_user', JSON.stringify(userPayload));
      setUser(userPayload);
      return userPayload;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('writeflow_token');
    localStorage.removeItem('writeflow_user');
    setUser(null);
  };

  const updateProfileState = (updatedUser) => {
    localStorage.setItem('writeflow_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
