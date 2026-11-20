'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'lt-edu-notifications-read';
const EMPTY: string[] = [];

let cached: string[] | null = null;
const listeners = new Set<() => void>();

const read = (): string[] => {
  if (cached) return cached;
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    cached = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
};

// Adds ids to the read set shared by the bell and the notifications page
export const addReadIds = (ids: string[]): void => {
  cached = [...new Set([...read(), ...ids])];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cached));
  } catch {
    // Blocked storage: read marks last until the page reloads
  }
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Read notification ids (simulated read receipts in localStorage)
export const useNotificationReads = (): string[] => useSyncExternalStore(subscribe, read, () => EMPTY);
