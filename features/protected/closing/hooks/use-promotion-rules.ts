'use client';

import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import type { RemoteState } from '@/features/protected/academic/types';
import { isAssessmentEvent } from '@/hooks/use-live';
import { getPromotionRulesAction } from '../actions/get-promotion-rules';
import type { PromotionRules } from '../types';

// The promotion rules of the EBA cycles; outside EBA the call fails and the closing hides what is EBA's own
export const usePromotionRules = (slug: string): RemoteState<PromotionRules> => useAcademicData(`promotion-rules:${slug}`, () => getPromotionRulesAction(slug), isAssessmentEvent);
