'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { demoInstitutionSlugs } from '@/features/protected/academic/data/academic-data';
import { useLiveRefresh, type LiveEvent } from '@/hooks/use-live';
import { getInstitutionManagementAction } from '../actions/get-institution-management';
import { demoManagement } from '../data/permissions';
import type { InstitutionType, Management, UseInstitutionManagementResult } from '../types';

// One answer per institution slug, shared by every component of the tab (the sidebar, guards, pages…)
const known = new Map<string, Management>();
const pending = new Set<string>();
const listeners = new Set<() => void>();

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Fetches the management of a slug once at a time; a failed call keeps the last answer (or the fallback)
const load = (slug: string): void => {
  if (pending.has(slug)) return;
  pending.add(slug);
  void getInstitutionManagementAction(slug)
    .then((result) => {
      if (!result.ok || known.get(slug) === result.data) return;
      known.set(slug, result.data);
      listeners.forEach((listener) => listener());
    })
    .finally(() => pending.delete(slug));
};

// Only a change of the academic profile (where the management lives) asks again
const isSettingsChange = (event: LiveEvent): boolean => event.type === 'academic.changed' && event.data.area === 'settings';

// Management type of the workspace institution: the API's answer, or the demo default of the type before it arrives
export const useInstitutionManagement = (institutionType: InstitutionType): UseInstitutionManagementResult => {
  const slug = demoInstitutionSlugs[institutionType];
  const answer = useSyncExternalStore(
    subscribe,
    () => known.get(slug) ?? null,
    () => null,
  );

  useEffect(() => {
    if (!known.has(slug)) load(slug);
  }, [slug]);

  const reload = useCallback((): void => load(slug), [slug]);
  useLiveRefresh(isSettingsChange, reload);

  const management = answer ?? demoManagement[institutionType];
  return { management, isPublic: management === 'public', isLoaded: answer !== null, reload };
};
