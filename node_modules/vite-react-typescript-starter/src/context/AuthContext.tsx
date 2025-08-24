import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiPost, setAuthToken } from '../api/client';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('flowenventory_user');
    const savedToken = localStorage.getItem('flowenventory_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setAuthToken(savedToken);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiPost<{ token: string; user: User }>('/api/auth/login', { email, password });
      setAuthToken(res.token);
      localStorage.setItem('flowenventory_token', res.token);
      localStorage.setItem('flowenventory_user', JSON.stringify(res.user));
      setUser({ ...res.user, createdAt: new Date(res.user.createdAt) });
      return true;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('flowenventory_user');
    localStorage.removeItem('flowenventory_token');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};