'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { savePermanenceRuleAction } from '../actions/save-permanence-rule';
import type { PermanenceRule, RuleValues } from '../types';

// The rule's form: active days can't exceed the window
export const useSaveRule = (rule: PermanenceRule, onSaved: () => void): ReturnType<typeof useAcademicForm<RuleValues, PermanenceRule>> => {
  const slug = useInstitutionSlug();
  return useAcademicForm<RuleValues, PermanenceRule>({
    initial: { windowDays: String(rule.windowDays), minActiveDays: String(rule.minActiveDays), inactiveDays: String(rule.inactiveDays), lowPercent: String(rule.lowPercent) },
    validate: (v): Record<string, string> => (Number(v.minActiveDays) > Number(v.windowDays) ? { minActiveDays: 'No puede pasar de los días de la semana de medición.' } : {}),
    save: (v) => savePermanenceRuleAction(slug, v),
    onSaved,
  });
};
