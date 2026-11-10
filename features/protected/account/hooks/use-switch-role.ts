'use client';

import { useCallback, useState } from 'react';
import { sileo } from 'sileo';
import { setActiveRoleAction } from '../actions/account-actions';
import type { UseSwitchRoleResult } from '../types';

// Switches the role the session works as; onSwitched reloads the account
export const useSwitchRole = (onSwitched: () => void): UseSwitchRoleResult => {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const switchTo = useCallback(
    (userRoleId: string): void => {
      setPendingId(userRoleId);
      void setActiveRoleAction(userRoleId).then((result) => {
        setPendingId(null);
        if (!result.ok) {
          sileo.error({ title: 'No se cambió el rol', description: result.message });
          return;
        }
        sileo.success({ title: 'Rol actualizado', description: 'Ahora trabajas con este rol.' });
        onSwitched();
      });
    },
    [onSwitched],
  );

  return { pendingId, switchTo };
};
