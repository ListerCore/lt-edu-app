'use client';

import { useCallback, useEffect, useState } from 'react';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { getAccountProfileAction } from '../actions/account-actions';
import type { AccountContact, AccountProfile, UseGetAccountProfileResult } from '../types';

// Loads the profile of the signed-in person (again when the demo institution type or role changes)
export const useGetAccountProfile = (): UseGetAccountProfileResult => {
  const { institutionType, role } = useWorkspace();
  const key = `${institutionType}:${role}`;
  const [state, setState] = useState<{ key: string | null; profile: AccountProfile | null }>({ key: null, profile: null });

  useEffect(() => {
    let active = true;
    void getAccountProfileAction(institutionType, role).then((result) => {
      if (active && result.ok && result.data) setState({ key, profile: result.data });
    });
    return () => {
      active = false;
    };
  }, [key, institutionType, role]);

  const applyContact = useCallback((contact: AccountContact): void => setState((current) => (current.profile ? { ...current, profile: { ...current.profile, contact } } : current)), []);

  return { profile: state.key === key ? state.profile : null, isLoading: state.key !== key, applyContact };
};
