'use client';

import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { demoInstitutionSlugs } from '../data/academic-data';

// Institution the academic pages work on: the Joseph demo of the workspace type (the API answers with the person's
// own institution when they hold a role there)
export const useInstitutionSlug = (): string => demoInstitutionSlugs[useWorkspace().institutionType];
