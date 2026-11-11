'use server';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { reportsRpc } from '@/lib/api/grpc/reports';
import type { Board, BoardQuery } from '../types';

// True when every id is empty or a valid UUID (empty means "the default")
const optional = (...ids: string[]): boolean => ids.every((id) => id === '' || validIds(id));
// Keeps only ISO dates; anything else goes as empty so the API takes its default
const day = (v: string): string => (DATE_PATTERN.test(v) ? v : '');

// The direction board: enrollment, attendance, performance, collection and the comparison between periods
export const getBoardAction = async (slug: string, q: BoardQuery): Promise<AcademicResult<Board>> =>
  optional(q.periodId, q.levelId)
    ? runRpc(slug, (token) => reportsRpc.board({ institutionSlug: slug, periodId: q.periodId, levelId: q.levelId, subject: q.subject.trim().slice(0, 160), from: day(q.from), to: day(q.to) }, { token }), (d) => d)
    : notFound;
