'use client';

import { useEffect } from 'react';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { getLiveConfigAction } from '../actions/get-live-config';
import type { LiveProvider } from '../types';

// Whether "En la plataforma" can be offered: null until the API answers, false when it is not set up (or fails)
export const usePlatformAvailable = (slug: string): boolean | null => {
  const { data, error } = useAcademicData(
    `live-config:${slug}`,
    () => getLiveConfigAction(slug),
    () => false,
  );
  return error ? false : data;
};

// A new session starts on the platform; when the platform turns out not to be set up, it moves to Google Meet
export const useProviderFallback = (available: boolean | null, provider: LiveProvider, isNew: boolean, setProvider: (p: LiveProvider) => void): void => {
  useEffect(() => {
    if (available === false && isNew && provider === 'platform') setProvider('meet');
  }, [available, isNew, provider, setProvider]);
};
