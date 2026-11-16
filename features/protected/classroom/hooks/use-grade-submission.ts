'use client';

import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { gradeSubmissionAction } from '../actions/grade-submission';
import type { FormState, GradeValues, UseGradeParams } from '../types';

// Grade one attempt: the level of each competency (the suggested one preselected), points of open questions and the
// feedback, which a C requires because it becomes the descriptive conclusion
export const useGradeSubmission = ({ submission, onSaved }: UseGradeParams, competencyIds: string[]): FormState<GradeValues> => {
  const slug = useInstitutionSlug();
  const initialLevels = Object.keys(submission.levels).length > 0 ? submission.levels : Object.fromEntries(competencyIds.map((c) => [c, submission.suggestedLevel]));
  return useAcademicForm({
    initial: { levels: initialLevels, openPoints: Object.fromEntries(Object.entries(submission.openPoints).map(([k, v]) => [k, String(v)])), feedback: submission.feedback },
    validate: (v: GradeValues): Record<string, string> => ({
      ...(Object.values(v.levels).includes('C') && !v.feedback.trim() ? { feedback: 'Con C, escribe qué le falta lograr y cómo se le apoyará.' } : {}),
      ...(!Object.values(v.levels).some(Boolean) && !v.feedback.trim() ? { levels: 'Pon al menos un nivel o una retroalimentación.' } : {}),
    }),
    save: (v: GradeValues) =>
      gradeSubmissionAction(
        slug,
        submission.id,
        Object.fromEntries(Object.entries(v.levels).filter(([, l]) => l)),
        Object.fromEntries(Object.entries(v.openPoints).flatMap(([k, p]) => (p.trim() === '' ? [] : [[k, Number(p)]]))),
        v.feedback.trim().slice(0, 1000),
      ),
    onSaved: () => onSaved(),
  });
};
