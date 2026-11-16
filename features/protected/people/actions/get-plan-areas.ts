'use server';

import { runRpc, validIds, notFound } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { curriculumRpc } from '@/lib/api/grpc/curriculum';
import type { PlanArea } from '../types';

// The areas of the plan in force of a cycle, to mark the validated ones (CurriculumService.ListCurricula + GetCurriculum)
export const getPlanAreasAction = async (slug: string, levelId: string): Promise<AcademicResult<PlanArea[]>> => {
  if (!validIds(levelId)) return notFound;
  const list = await runRpc(slug, (token) => curriculumRpc.list({ institutionSlug: slug }, { token }), (d) => d.curricula);
  if (!list.ok) return list;
  const plan = list.data.find((c) => c.levelId === levelId && c.status === 'active');
  if (!plan) return { ok: true, data: [] };
  return runRpc(
    slug,
    (token) => curriculumRpc.get({ institutionSlug: slug, id: plan.id }, { token }),
    (d) => (d.curriculum?.subjects ?? []).filter((x) => x.kind === 'area').map((x) => ({ id: x.id, name: x.name })),
  );
};
