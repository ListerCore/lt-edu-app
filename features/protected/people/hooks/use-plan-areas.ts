'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { getPlanAreasAction } from '../actions/get-plan-areas';
import type { PlanArea } from '../types';

// The areas of the cycle's plan in force, to mark the validated ones; none until a cycle is chosen
export const usePlanAreas = (slug: string, levelId: string): RemoteState<PlanArea[]> =>
  useAcademicData(`plan-areas:${slug}:${levelId}`, async () => (levelId ? getPlanAreasAction(slug, levelId) : { ok: true as const, data: [] }));
