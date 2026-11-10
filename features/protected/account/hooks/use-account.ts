'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAccountAction, getTwoFactorStatusAction } from '../actions/account-actions';
import type { Account, TwoFactorStatus, UseAccountResult } from '../types';

interface AccountState {
  account: Account | null;
  twoFactor: TwoFactorStatus | null;
  error: string | null;
  isLoading: boolean;
}

// Loads the signed-in account and its two-step verification; reload() after any change
export const useAccount = (): UseAccountResult => {
  const [state, setState] = useState<AccountState>({ account: null, twoFactor: null, error: null, isLoading: true });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    void Promise.all([getAccountAction(), getTwoFactorStatusAction()]).then(([account, twoFactor]) => {
      if (!active) return;
      if (!account.ok || !twoFactor.ok) {
        setState((current) => ({ ...current, isLoading: false, error: (!account.ok ? account.message : twoFactor.message) ?? 'No pudimos cargar tu cuenta.' }));
        return;
      }
      setState({ account: account.data ?? null, twoFactor: twoFactor.data ?? null, error: null, isLoading: false });
    });
    return () => {
      active = false;
    };
  }, [version]);

  const reload = useCallback((): void => setVersion((current) => current + 1), []);

  return { ...state, reload };
};
