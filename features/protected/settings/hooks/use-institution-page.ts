'use client';

import { useMemo } from 'react';
import { useGetStructure } from '@/features/protected/academic/hooks/use-get-structure';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import type { Authorization, InstitutionPageState } from '../types';
import { useGetInstitutionFile } from './use-get-institution-file';

// Institución page: the file plus, in a CEBA, its cycles (an authorization of a form of attention names one).
// Authorizations in force come first; expired ones stay below as history
export const useInstitutionPage = (): InstitutionPageState => {
  const file = useGetInstitutionFile();
  const { institutionType } = useWorkspace();
  const isEba = file.data ? file.data.institutionKind === 'eba' : institutionType === 'EBA';
  const structure = useGetStructure(isEba);
  const { inForce, expired } = useMemo(() => {
    const all = file.data?.authorizations ?? [];
    return { inForce: all.filter((a: Authorization) => a.inForce), expired: all.filter((a: Authorization) => !a.inForce) };
  }, [file.data]);
  return { ...file, levels: structure.data?.levels ?? [], isEba, inForce, expired };
};
