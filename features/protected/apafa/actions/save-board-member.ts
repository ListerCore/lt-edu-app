'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { apafaRpc } from '@/lib/api/grpc/apafa';
import type { AcademicResult, BoardMember, BoardMemberPayload } from '../types';

// Adds (empty id) or edits one office of the APAFA board (ApafaService.SaveBoardMember)
export const saveBoardMemberAction = async (slug: string, p: BoardMemberPayload): Promise<AcademicResult<BoardMember>> =>
  p.id && !validIds(p.id)
    ? notFound
    : runRpc(
        slug,
        (token) => apafaRpc.saveBoardMember({ institutionSlug: slug, member: { id: p.id, fullName: p.fullName, position: p.position, phone: p.phone, startsOn: p.startsOn, endsOn: p.endsOn } }, { token }),
        (d) => d.member,
        p.id ? 'Cargo actualizado.' : 'Cargo agregado al consejo directivo.',
      );
