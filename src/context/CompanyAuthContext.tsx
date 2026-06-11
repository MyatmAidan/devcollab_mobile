import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  companyLogin,
  companyLogout,
  companyRegister,
  getCompanyMe,
} from '../api/companyApi';
import {
  getCompanyToken,
  removeCompanyToken,
  setCompanyToken,
} from '../services/companyTokenService';
import type {
  CompanyLoginInput,
  CompanyProfile,
  CompanyRegisterInput,
} from '../types/company';

interface CompanyAuthContextValue {
  company: CompanyProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: CompanyLoginInput) => Promise<void>;
  register: (input: CompanyRegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshCompany: () => Promise<void>;
}

export const CompanyAuthContext = createContext<CompanyAuthContextValue | undefined>(undefined);

export const CompanyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCompany = useCallback(async () => {
    const me = await getCompanyMe();
    setCompany(me);
  }, []);

  const bootstrap = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getCompanyToken();
      if (!token) {
        setCompany(null);
        return;
      }
      await refreshCompany();
    } catch {
      await removeCompanyToken();
      setCompany(null);
    } finally {
      setIsLoading(false);
    }
  }, [refreshCompany]);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const login = useCallback(async (input: CompanyLoginInput) => {
    const result = await companyLogin(input);
    await setCompanyToken(result.token);
    setCompany(result.company);
  }, []);

  const register = useCallback(async (input: CompanyRegisterInput) => {
    const result = await companyRegister(input);
    await setCompanyToken(result.token);
    setCompany(result.company);
  }, []);

  const logout = useCallback(async () => {
    try {
      await companyLogout();
    } catch {
      // ignore
    } finally {
      await removeCompanyToken();
      setCompany(null);
    }
  }, []);

  const value = useMemo<CompanyAuthContextValue>(
    () => ({
      company,
      isAuthenticated: !!company,
      isLoading,
      login,
      register,
      logout,
      refreshCompany,
    }),
    [company, isLoading, login, register, logout, refreshCompany],
  );

  return <CompanyAuthContext.Provider value={value}>{children}</CompanyAuthContext.Provider>;
};
