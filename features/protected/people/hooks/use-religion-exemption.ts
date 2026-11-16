'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { setReligionExemptionAction } from '../actions/set-religion-exemption';

// Grants (with the request date and resolution) or withdraws the exemption from Educación Religiosa
export const useReligionExemption = (slug: string, onDone: () => void): { save: (enrollmentId: string, exempt: boolean, requestedOn: string, reference: string) => Promise<boolean>; isSaving: boolean } => {
  const [isSaving, setIsSaving] = useState(false);
  const save = async (enrollmentId: string, exempt: boolean, requestedOn: string, reference: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      const r = await runAcademicAction(setReligionExemptionAction(slug, enrollmentId, exempt, requestedOn, reference));
      if (r.ok) onDone();
      return r.ok;
    } finally {
      setIsSaving(false);
    }
  };
  return { save, isSaving };
};
