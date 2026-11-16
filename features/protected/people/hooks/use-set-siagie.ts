'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { setSiagieStatusAction } from '../actions/set-siagie-status';

// Marks enrollments as pending, exported or observed (with the observation); resolves true when saved
export const useSetSiagie = (slug: string, onDone: () => void): { set: (ids: string[], status: string, note: string) => Promise<boolean>; isSetting: boolean } => {
  const [isSetting, setIsSetting] = useState(false);
  const set = async (ids: string[], status: string, note: string): Promise<boolean> => {
    setIsSetting(true);
    try {
      const r = await runAcademicAction(setSiagieStatusAction(slug, ids, status, note));
      if (r.ok) onDone();
      return r.ok;
    } finally {
      setIsSetting(false);
    }
  };
  return { set, isSetting };
};
