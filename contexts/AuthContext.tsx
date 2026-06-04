'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authApi, AdminProfile } from '@/lib/api';

interface AuthState {
  user: AdminProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: { email?: string; password?: string; currentPassword?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    console.log('[AuthContext] checkAuth - token exists:', !!token);

    if (!token) {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const user = await authApi.getProfile();
      console.log('[AuthContext] checkAuth - profile ok:', user.email);
      setState({ user, isAuthenticated: true, isLoading: false });
    } catch (err) {
      console.log('[AuthContext] checkAuth - profile failed, clearing token:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      void checkAuth();
    }, 0);
    return () => clearTimeout(id);
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await authApi.login(email, password);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      setState({ user: response.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      const message =
        error != null && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'Login failed. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const updateProfile = async (data: { email?: string; password?: string; currentPassword?: string }) => {
    try {
      const updatedUser = await authApi.updateProfile(data);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    } catch (error) {
      const message =
        error != null && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : 'Failed to update profile. Please try again.';
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Return a safe stub during SSR or before provider mounts
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: async (_email: string, _password: string) => { throw new Error('AuthProvider not mounted'); },
      logout: () => {},
      checkAuth: async () => {},
      updateProfile: async (_data: { email?: string; password?: string; currentPassword?: string }) => { throw new Error('AuthProvider not mounted'); },
    } as AuthContextType;
  }
  return context;
}
