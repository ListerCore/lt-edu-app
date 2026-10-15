'use client';

import { useSyncExternalStore } from 'react';

const SESSION_COOKIE_NAME = 'sige_session';
const SESSION_STORAGE_KEY = 'sige_session_active';

export const isSessionActive = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const inStorage = localStorage.getItem(SESSION_STORAGE_KEY);
    if (inStorage !== null) {
      return inStorage === 'true';
    }
    return document.cookie.split('; ').some((item) => item.startsWith(`${SESSION_COOKIE_NAME}=true`));
  } catch {
    return false;
  }
};

export const setAuthSession = (active: boolean): void => {
  if (typeof window === 'undefined') return;
  try {
    if (active) {
      localStorage.setItem(SESSION_STORAGE_KEY, 'true');
      document.cookie = `${SESSION_COOKIE_NAME}=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    }
  } catch {
    // Ignore browser storage restrictions
  }
  window.dispatchEvent(new Event('sige_session_change'));
};

const subscribe = (callback: () => void): (() => void) => {
  window.addEventListener('sige_session_change', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('sige_session_change', callback);
    window.removeEventListener('storage', callback);
  };
};

const getSnapshot = (): boolean => isSessionActive();
const getServerSnapshot = (): boolean => false;

export const useAuthSession = (): {
  isAuthenticated: boolean;
  isLoaded: boolean;
  setSession: (active: boolean) => void;
} => {
  const isAuthenticated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return { isAuthenticated, isLoaded: true, setSession: setAuthSession };
};
