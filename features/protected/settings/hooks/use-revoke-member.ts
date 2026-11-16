'use client';

import { useState } from 'react';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { revokeMemberAction } from '../actions/revoke-member';
import type { UseRevokeMemberResult } from '../types';

// Takes a role away (or cancels an invitation), then reloads the list
export const useRevokeMember = (onRevoked: () => void): UseRevokeMemberResult => {
  const slug = useInstitutionSlug();
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const revoke = (id: string): void => {
    setRevokingId(id);
    void runAcademicAction(revokeMemberAction(slug, id))
      .then((result): void => {
        if (result.ok) onRevoked();
      })
      .finally((): void => setRevokingId(null));
  };
  return { revoke, revokingId };
};
