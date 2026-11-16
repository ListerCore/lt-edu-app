'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { participationRpc } from '@/lib/api/grpc/participation';
import type { AcademicResult, SectionPermanence } from '../types';

// The permanence of each student of a distance section, week by week (ParticipationService.GetSectionPermanence)
export const getSectionPermanenceAction = async (slug: string, sectionId: string): Promise<AcademicResult<SectionPermanence>> =>
  validIds(sectionId) ? runRpc(slug, (token) => participationRpc.section({ institutionSlug: slug, sectionId }, { token }), (d) => d) : notFound;
