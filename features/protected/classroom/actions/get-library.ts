'use server';

import { runRpc } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, LibraryData } from '../types';

// The institution's library (ClassroomService.ListLibrary)
export const getLibraryAction = async (slug: string): Promise<AcademicResult<LibraryData>> =>
  runRpc(slug, (token) => classroomRpc.library({ institutionSlug: slug }, { token }), (d) => ({ items: d.items, canEdit: d.canEdit }));
