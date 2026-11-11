import type { CardCompetency, CardSubject, CardTerm, Competency, Evaluation, FamilyCard, GetGradebookResponse, LevelMark, ReportCard, ScoreMark, Sheet, SheetProgress, StudentRef, TutorProgress } from '@/lib/api/grpc/gen/joseph/assessment/v1/assessment';

export type { CardCompetency, CardSubject, CardTerm, Competency, Evaluation, FamilyCard, GetGradebookResponse as Gradebook, LevelMark, ReportCard, ScoreMark, Sheet, SheetProgress, StudentRef, TutorProgress };

// What a sheet edits before saving: levels and conclusions by "student:competency"
export interface LevelDraft {
  level: string;
  conclusion: string;
}

export interface EvaluationValues {
  name: string;
  weight: string;
  heldOn: string;
}

// A sheet opened from the gradebook: an area or unit, or the tutor's sheet of a section
export type OpenSheet = { kind: 'area'; assignmentId: string; title: string } | { kind: 'tutor'; sectionId: string; title: string };
