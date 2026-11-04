'use client';

import { useSyncExternalStore } from 'react';

// Photos uploaded in this session (simulated storage), shared by the table and the card preview
const EMPTY: Record<string, string> = {};
let photos: Record<string, string> = EMPTY;
const listeners = new Set<() => void>();

export const setCardholderPhoto = (id: string, url: string): void => {
  const previous = photos[id];
  if (previous?.startsWith('blob:')) URL.revokeObjectURL(previous);
  photos = { ...photos, [id]: url };
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// id → photo URL for every person whose photo changed in this session
export const useCardholderPhotos = (): Record<string, string> =>
  useSyncExternalStore(
    subscribe,
    () => photos,
    () => EMPTY,
  );
