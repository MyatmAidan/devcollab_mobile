import { useContext } from 'react';
import { CompanyAuthContext } from '../context/CompanyAuthContext';

export function useCompanyAuth() {
  const ctx = useContext(CompanyAuthContext);
  if (!ctx) throw new Error('useCompanyAuth must be used within CompanyAuthProvider');
  return ctx;
}
