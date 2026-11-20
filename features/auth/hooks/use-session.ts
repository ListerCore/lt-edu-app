'use client';

import { useSyncExternalStore } from 'react';
import { SIGNED_IN_COOKIE } from '@/lib/auth/cookies';

const listeners = new Set<() => void>();

// The hint cookie has no change event: re-read when the tab regains focus (sign-in or sign-out in another tab)
const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  window.addEventListener('focus', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('focus', listener);
  };
};

const read = (): boolean => document.cookie.split('; ').includes(`${SIGNED_IN_COOKIE}=1`);

const notify = (): void => listeners.forEach((listener) => listener());

// UI hint of the sign-in state (navbar, menus), from the readable cookie the server sets next to the httpOnly
// session. The real check is the session cookie, verified by proxy.ts and lt-edu-api
export const startSession = (): void => notify();

export const endSession = (): void => {
  document.cookie = `${SIGNED_IN_COOKIE}=; Max-Age=0; Path=/`;
  notify();
};

// true/false once known; null while rendering on the server, so nothing auth-dependent flashes
export const useSession = (): boolean | null => useSyncExternalStore(subscribe, read, () => null);
