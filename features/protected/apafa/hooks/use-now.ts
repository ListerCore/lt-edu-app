'use client';

import { useSyncExternalStore } from 'react';

const MINUTE = 60_000;

// Ticks once a minute so "upcoming" and "waiting for its acta" stay right while the page is open
const subscribe = (notify: () => void): (() => void) => {
  const timer = setInterval(notify, MINUTE);
  return (): void => clearInterval(timer);
};

// Rounded to the minute, so the snapshot stays the same between renders of the same minute
const snapshot = (): number => Math.floor(Date.now() / MINUTE) * MINUTE;

// Current time in ms in the browser; 0 while prerendering (nothing time-dependent is baked into the shell)
export const useNow = (): number => useSyncExternalStore(subscribe, snapshot, () => 0);
