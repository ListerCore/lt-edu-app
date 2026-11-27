'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { setModuleAction } from '../actions/set-module';
import type { UseSetModuleResult } from '../types';

// Switches a module, then reloads the list and the menu (the live event refreshes the other open tabs)
export const useSetModule = (onSaved: () => void): UseSetModuleResult => {
  const slug = useInstitutionSlug();
  const { reloadManagement } = useWorkspace();
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const setModule = (key: string, enabled: boolean): void => {
    setSavingKey(key);
    void runAcademicAction(setModuleAction(slug, key, enabled))
      .then((result): void => {
        if (!result.ok) return;
        onSaved();
        reloadManagement();
      })
      .finally((): void => setSavingKey(null));
  };
  return { setModule, savingKey };
};
