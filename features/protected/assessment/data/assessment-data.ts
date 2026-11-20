import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import type { Evaluation, ScoreMark } from '../types';

export const GRADES_PATH = `${DASHBOARD_PATH}/evaluation/grades`;
export const REPORT_CARDS_PATH = `${DASHBOARD_PATH}/evaluation/report-cards`;

export const levels = ['AD', 'A', 'B', 'C'] as const;
export const levelLabels: Record<string, string> = { AD: 'Logro destacado', A: 'Logro esperado', B: 'En proceso', C: 'En inicio' };
export const levelClass: Record<string, string> = {
  AD: 'bg-success text-white',
  A: 'bg-success/14 text-success',
  B: 'bg-warning/16 text-warning',
  C: 'bg-destructive/14 text-destructive',
  '': 'bg-secondary text-muted-foreground',
};

export const cellKey = (studentId: string, competencyId: string): string => `${studentId}:${competencyId}`;

// Weighted average of the scores a student has (same rule as lt-edu-api: evaluations not taken do not count)
export const weightedAverage = (evaluations: Evaluation[], score: (evaluationId: string) => number | null): number | null => {
  let sum = 0;
  let weights = 0;
  for (const e of evaluations) {
    const v = score(e.id);
    if (v !== null) {
      sum += v * e.weight;
      weights += e.weight;
    }
  }
  return weights === 0 ? null : Math.round((sum / weights) * 10) / 10;
};

export const scoreMap = (scores: ScoreMark[]): Map<string, number> => new Map(scores.map((s) => [`${s.studentId}:${s.evaluationId}`, s.score ?? 0]));

export const formatAverage = (value: number | null | undefined): string => (value === null || value === undefined ? '—' : value.toLocaleString('es-PE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
// Registers round averages to a whole grade, 0.5 up
export const roundGrade = (value: number): number => Math.floor(value + 0.5);

export const percent = (filled: number, expected: number): number => (expected === 0 ? 0 : Math.round((filled * 100) / expected));
