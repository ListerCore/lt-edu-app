'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { closingRpc } from '@/lib/api/grpc/closing';
import type { PromotionRules } from '../types';

// Brings a cycle back to the rule by default (ClosingService.ResetPromotionRule)
export const resetPromotionRuleAction = async (slug: string, levelId: string): Promise<AcademicResult<PromotionRules>> =>
  validIds(levelId) ? runRpc(slug, (token) => closingRpc.resetPromotionRule({ institutionSlug: slug, levelId }, { token }), (d) => d, 'Vuelve a la regla por defecto.') : notFound;
