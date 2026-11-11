'use server';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { notFound, runRpc, toInt, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { assessmentRpc } from '@/lib/api/grpc/assessment';
import type { EvaluationValues, FamilyCard, Gradebook, LevelMark, ReportCard, Sheet } from '../types';

// Ids may be empty (no term, a new evaluation); anything else must be a uuid
const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));
const cleanMarks = (marks: LevelMark[]): LevelMark[] =>
  marks.filter((m) => validIds(m.studentId, m.competencyId)).map((m) => ({ studentId: m.studentId, competencyId: m.competencyId, level: m.level, conclusion: m.conclusion.slice(0, 1000) }));

export const getGradebookAction = async (slug: string, periodId: string, termId: string): Promise<AcademicResult<Gradebook>> =>
  optional(periodId, termId) ? runRpc(slug, (token) => assessmentRpc.gradebook({ institutionSlug: slug, periodId, termId }, { token }), (d) => d) : notFound;

export const getSheetAction = async (slug: string, assignmentId: string, termId: string): Promise<AcademicResult<Sheet>> =>
  validIds(assignmentId) && optional(termId) ? runRpc(slug, (token) => assessmentRpc.sheet({ institutionSlug: slug, assignmentId, termId }, { token }), (d) => d.sheet) : notFound;

export const saveLevelsAction = async (slug: string, assignmentId: string, termId: string, marks: LevelMark[]): Promise<AcademicResult<Sheet>> =>
  validIds(assignmentId) && optional(termId)
    ? runRpc(slug, (token) => assessmentRpc.saveLevels({ institutionSlug: slug, assignmentId, termId, marks: cleanMarks(marks) }, { token }), (d) => d.sheet, 'Registro guardado.')
    : notFound;

export const saveEvaluationAction = async (slug: string, assignmentId: string, termId: string, id: string, v: EvaluationValues): Promise<AcademicResult<Sheet>> =>
  validIds(assignmentId) && optional(termId, id)
    ? runRpc(
        slug,
        (token) => assessmentRpc.saveEvaluation({ institutionSlug: slug, assignmentId, termId, id, name: v.name.slice(0, 120), weight: toInt(v.weight) ?? 0, heldOn: DATE_PATTERN.test(v.heldOn) ? v.heldOn : '' }, { token }),
        (d) => d.sheet,
        id ? 'Evaluación actualizada.' : 'Evaluación agregada.',
      )
    : notFound;

export const deleteEvaluationAction = async (slug: string, assignmentId: string, termId: string, id: string): Promise<AcademicResult<Sheet>> =>
  validIds(assignmentId, id) && optional(termId) ? runRpc(slug, (token) => assessmentRpc.deleteEvaluation({ institutionSlug: slug, assignmentId, termId, id }, { token }), (d) => d.sheet, 'Evaluación eliminada.') : notFound;

// scores: student id → 0–20, or null to clear
export const saveScoresAction = async (slug: string, assignmentId: string, termId: string, evaluationId: string, scores: Record<string, number | null>): Promise<AcademicResult<Sheet>> =>
  validIds(assignmentId, evaluationId) && optional(termId)
    ? runRpc(
        slug,
        (token) =>
          assessmentRpc.saveScores(
            { institutionSlug: slug, assignmentId, termId, evaluationId, scores: Object.entries(scores).filter(([id]) => validIds(id)).map(([studentId, score]) => ({ studentId, score: score ?? undefined })) },
            { token },
          ),
        (d) => d.sheet,
      )
    : notFound;

export const getTutorSheetAction = async (slug: string, sectionId: string, termId: string): Promise<AcademicResult<Sheet>> =>
  validIds(sectionId) && optional(termId) ? runRpc(slug, (token) => assessmentRpc.tutorSheet({ institutionSlug: slug, sectionId, termId }, { token }), (d) => d.sheet) : notFound;

export interface TutorSave {
  marks: LevelMark[];
  conduct: Array<{ studentId: string; score: number | null; note: string }>;
  comments: Array<{ studentId: string; comment: string }>;
}

export const saveTutorSheetAction = async (slug: string, sectionId: string, termId: string, v: TutorSave): Promise<AcademicResult<Sheet>> =>
  validIds(sectionId) && optional(termId)
    ? runRpc(
        slug,
        (token) =>
          assessmentRpc.saveTutorSheet(
            {
              institutionSlug: slug,
              sectionId,
              termId,
              marks: cleanMarks(v.marks),
              conduct: v.conduct.filter((c) => validIds(c.studentId)).map((c) => ({ studentId: c.studentId, score: c.score ?? undefined, note: c.note.slice(0, 500) })),
              comments: v.comments.filter((c) => validIds(c.studentId)).map((c) => ({ studentId: c.studentId, comment: c.comment.slice(0, 1000) })),
            },
            { token },
          ),
        (d) => d.sheet,
        'Hoja de tutoría guardada.',
      )
    : notFound;

export const submitSheetAction = async (slug: string, sectionId: string, assignmentId: string, termId: string, sent: boolean): Promise<AcademicResult<null>> =>
  validIds(sectionId) && optional(assignmentId, termId)
    ? runRpc(slug, (token) => assessmentRpc.submit({ institutionSlug: slug, sectionId, assignmentId, termId, sent }, { token }), () => null, sent ? 'Enviado a coordinación.' : 'Envío retirado: puedes seguir corrigiendo.')
    : notFound;

export const getReportCardAction = async (slug: string, studentId: string, periodId: string, termId: string): Promise<AcademicResult<ReportCard>> =>
  validIds(studentId) && optional(periodId, termId) ? runRpc(slug, (token) => assessmentRpc.reportCard({ institutionSlug: slug, studentId, periodId, termId }, { token }), (d) => d.card) : notFound;

export const getSectionCardsAction = async (slug: string, sectionId: string, termId: string): Promise<AcademicResult<ReportCard[]>> =>
  validIds(sectionId) && optional(termId) ? runRpc(slug, (token) => assessmentRpc.sectionCards({ institutionSlug: slug, sectionId, termId }, { token }), (d) => d.cards) : notFound;

export const getMyCardsAction = async (slug: string): Promise<AcademicResult<FamilyCard[]>> => runRpc(slug, (token) => assessmentRpc.myCards({ institutionSlug: slug }, { token }), (d) => d.cards);
