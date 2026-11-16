'use server';

import { notFound, runRpc } from '@/features/protected/academic/lib/run-rpc';
import type { AcademicResult } from '@/features/protected/academic/types';
import { peopleRpc } from '@/lib/api/grpc/people';
import type { PlacementProposal } from '../types';

// Cycle and grade the cuadro de equivalencias proposes for grades passed in EBR primaria or secundaria (PeopleService.ProposePlacement)
export const proposePlacementAction = async (slug: string, origin: string, passed: number): Promise<AcademicResult<PlacementProposal>> =>
  /^ebr_(primaria|secundaria)$/.test(origin) && Number.isInteger(passed) && passed >= 0 && passed <= 6
    ? runRpc(slug, (token) => peopleRpc.proposePlacement({ institutionSlug: slug, origin, passed }, { token }), (d) => d)
    : notFound;
