'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { closingRpc } from '@/lib/api/grpc/closing';
import type { PromotionRules } from '../types';

// Sets the rule of a cycle (ClosingService.SavePromotionRule)
export const savePromotionRuleAction = async (slug: string, rule: { levelId: string; automatic: boolean; areas: number; note: string }): Promise<AcademicResult<PromotionRules>> =>
  validIds(rule.levelId)
    ? runRpc(slug, (token) => closingRpc.savePromotionRule({ institutionSlug: slug, ...rule, areas: Math.round(rule.areas), note: rule.note.slice(0, 300) }, { token }), (d) => d, 'Regla de promoción guardada.')
    : notFound;
