'use server';

import { runRpc, toInt } from '@/features/protected/academic/lib/run-rpc';
import { participationRpc } from '@/lib/api/grpc/participation';
import type { AcademicResult, PermanenceRule, RuleValues } from '../types';

// Saves the institution's rule of permanence (ParticipationService.SavePermanenceRule)
export const savePermanenceRuleAction = async (slug: string, v: RuleValues): Promise<AcademicResult<PermanenceRule>> =>
  runRpc(
    slug,
    (token) =>
      participationRpc.saveRule(
        { institutionSlug: slug, rule: { windowDays: toInt(v.windowDays) ?? 0, minActiveDays: toInt(v.minActiveDays) ?? 0, inactiveDays: toInt(v.inactiveDays) ?? 0, lowPercent: toInt(v.lowPercent) ?? 0, updatedByName: '', updatedAt: '' } },
        { token },
      ),
    (d) => d.rule,
    'Regla de permanencia guardada.',
  );
