'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { tutoringRpc } from '@/lib/api/grpc/tutoring';
import type { TutoringSession } from '../types';

// Marks a session missed or cancelled, or back to scheduled (TutoringService.SetTutoringSessionStatus)
export const setSessionStatusAction = async (slug: string, id: string, status: 'missed' | 'cancelled' | 'scheduled'): Promise<AcademicResult<TutoringSession>> =>
  validIds(id) ? runRpc(slug, (token) => tutoringRpc.sessionStatus({ institutionSlug: slug, id, status }, { token }), (d) => d.session) : notFound;
