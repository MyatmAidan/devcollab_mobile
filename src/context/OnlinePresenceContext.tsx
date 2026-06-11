import React, { createContext, useContext } from 'react';
import { useOnlinePresence } from '../hooks/useOnlinePresence';
import { useAuth } from '../hooks/useAuth';

interface OnlinePresenceContextValue {
  isUserOnline: (userId: string) => boolean;
}

const OnlinePresenceContext = createContext<OnlinePresenceContextValue>({
  isUserOnline: () => false,
});

/** Wrap inside AuthProvider so useAuth() works. */
export const OnlinePresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isUserOnline } = useOnlinePresence(isAuthenticated);

  return (
    <OnlinePresenceContext.Provider value={{ isUserOnline }}>
      {children}
    </OnlinePresenceContext.Provider>
  );
};

export function useIsOnline(userId: string | undefined): boolean {
  const { isUserOnline } = useContext(OnlinePresenceContext);
  if (!userId) return false;
  return isUserOnline(userId);
}
