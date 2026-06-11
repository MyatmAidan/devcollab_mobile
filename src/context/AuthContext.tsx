import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authApi';
import { disconnectEcho } from '../services/echoService';
import { getToken, removeToken, setToken } from '../services/tokenService';
import type { LoginInput, RegisterInput, User } from '../types/user';
import { getErrorMessage } from '../api/axios';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const me = await authApi.getMe();
    setUser(me);
  }, []);

  const bootstrap = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setUser(null);
        return;
      }
      await refreshUser();
    } catch {
      await removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (input: LoginInput) => {
    setError(null);
    try {
      const result = await authApi.login(input);
      await setToken(result.token);
      setUser(result.user);
    } catch (err) {
      const message = getErrorMessage(err, 'Login failed.');
      setError(message);
      throw err;
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setError(null);
    try {
      const result = await authApi.register(input);
      await setToken(result.token);
      setUser(result.user);
    } catch (err) {
      const message = getErrorMessage(err, 'Registration failed.');
      setError(message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout API errors and clear local session anyway.
    } finally {
      disconnectEcho();
      await removeToken();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      error,
      clearError: () => setError(null),
    }),
    [user, isLoading, login, register, logout, refreshUser, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
