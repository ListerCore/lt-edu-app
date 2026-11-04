'use client';

import { useEffect, useState } from 'react';
import type { InstitutionType, Role } from '@/features/protected/dashboard/types';
import { getOwnCardholderAction } from '../actions/card-actions';
import type { Cardholder, UseGetOwnCardholderResult } from '../types';
import { useCardholderPhotos } from './use-cardholder-photos';

// The signed-in person's own card (or their child's), for roles that do not manage cards
export const useGetOwnCardholder = (institutionType: InstitutionType, role: Role, enabled: boolean): UseGetOwnCardholderResult => {
  const photos = useCardholderPhotos();
  const key = `${institutionType}:${role}`;
  const [state, setState] = useState<{ key: string | null; cardholder: Cardholder | null }>({ key: null, cardholder: null });

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    void getOwnCardholderAction(institutionType, role).then((result) => {
      if (active) setState({ key, cardholder: result.ok && result.data ? result.data : null });
    });
    return () => {
      active = false;
    };
  }, [enabled, key, institutionType, role]);

  const cardholder = state.key === key ? state.cardholder : null;
  return { cardholder: cardholder && photos[cardholder.id] ? { ...cardholder, photoUrl: photos[cardholder.id] } : cardholder, isLoading: enabled && state.key !== key };
};
