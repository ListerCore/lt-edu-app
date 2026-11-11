'use client';

import { useCallback, useEffect, useState } from 'react';
import { isAcademicEvent, useLiveRefresh, type LiveEvent } from '@/hooks/use-live';
import type { AcademicResult, RemoteState } from '../types';

interface LoadState<T> {
  key: string;
  data: T | null;
  error: string | null;
}

// Loads academic data for a key (institution, period…) through a server action and reloads it whenever someone
// changes the structure, periods or sections of the institution (live event) or the caller asks
export const useAcademicData = <T>(key: string, load: () => Promise<AcademicResult<T>>, refreshOn: (type: LiveEvent['type']) => boolean = isAcademicEvent): RemoteState<T> => {
  const [state, setState] = useState<LoadState<T>>({ key: '', data: null, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    void load().then((result) => {
      if (!active) return;
      setState(result.ok ? { key, data: result.data, error: null } : { key, data: null, error: result.message });
    });
    return () => {
      active = false;
    };
    // load changes with key; version forces a refetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);

  const reload = useCallback((): void => setVersion((current) => current + 1), []);
  useLiveRefresh((event) => refreshOn(event.type), reload);

  // Data of another key (the workspace switched institution) is not shown while the new one loads
  const current = state.key === key;
  return { data: current ? state.data : null, error: current ? state.error : null, isLoading: !current, reload };
};
