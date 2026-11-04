'use client';

import { useEffect, useState } from 'react';
import { getCardholdersAction } from '../actions/card-actions';
import type { CardholdersResponse, GetCardholdersParams, UseGetCardholdersResult } from '../types';
import { useCardholderPhotos } from './use-cardholder-photos';

// Loads one page of the roster; the previous page stays on screen while the next one arrives
export const useGetCardholders = (params: GetCardholdersParams): UseGetCardholdersResult => {
  const { institutionType, group, search, page, pageSize } = params;
  const photos = useCardholderPhotos();
  const key = JSON.stringify(params);
  const [state, setState] = useState<{ key: string | null; response: CardholdersResponse | null }>({ key: null, response: null });

  useEffect(() => {
    let active = true;
    void getCardholdersAction({ institutionType, group, search, page, pageSize }).then((result) => {
      if (active && result.ok && result.data) setState({ key, response: result.data });
    });
    return () => {
      active = false;
    };
  }, [key, institutionType, group, search, page, pageSize]);

  const cardholders = (state.response?.data ?? []).map((person) => (photos[person.id] ? { ...person, photoUrl: photos[person.id] } : person));

  return { cardholders, meta: state.response?.meta ?? null, isLoading: state.response === null, isFetching: state.key !== key };
};
