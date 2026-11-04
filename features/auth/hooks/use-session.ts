'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'joseph-session';
const listeners = new Set<() => void>();

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
};

const read = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'active';
  } catch {
    return false;
  }
};

const write = (active: boolean): void => {
  try {
    if (active) localStorage.setItem(STORAGE_KEY, 'active');
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Blocked storage: the simulated session lasts only for this page view
  }
  listeners.forEach((listener) => listener());
};

// Simulated sign-in state (localStorage) until joseph-api issues real sessions
export const startSession = (): void => write(true);
export const endSession = (): void => write(false);

// true/false once known; null while rendering on the server, so nothing auth-dependent flashes
export const useSession = (): boolean | null => useSyncExternalStore(subscribe, read, () => null);
