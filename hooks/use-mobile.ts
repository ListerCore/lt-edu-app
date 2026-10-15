'use client';

import { useSyncExternalStore } from 'react';

const MOBILE_QUERY = '(max-width: 767px)';

const subscribe = (callback: () => void): (() => void) => {
  const mediaQuery = window.matchMedia(MOBILE_QUERY);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
};

const getSnapshot = (): boolean => window.matchMedia(MOBILE_QUERY).matches;

const getServerSnapshot = (): boolean => false;

export const useIsMobile = (): boolean => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
