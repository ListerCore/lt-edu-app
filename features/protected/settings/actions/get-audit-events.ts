'use server';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { institutionRpc } from '@/lib/api/grpc/institution';
import { AUDIT_PAGE_SIZE } from '../data/settings-data';
import type { AcademicResult, AuditPageResult, AuditQuery } from '../types';

// One page of the audit log, newest first, with the cursor of the next (InstitutionService.ListAuditEvents)
export const getAuditEventsAction = async (slug: string, q: AuditQuery): Promise<AcademicResult<AuditPageResult>> =>
  (q.from && !DATE_PATTERN.test(q.from)) || (q.to && !DATE_PATTERN.test(q.to)) || (q.beforeId && !validIds(q.beforeId)) || !/^[a-z-]{0,40}$/.test(q.module)
    ? notFound
    : runRpc(
        slug,
        (token) =>
          institutionRpc.auditEvents(
            { institutionSlug: slug, module: q.module, userId: '', from: q.from, to: q.to, beforeAt: q.beforeAt, beforeId: q.beforeId, limit: AUDIT_PAGE_SIZE },
            { token },
          ),
        (d) => ({ events: d.events, hasMore: d.hasMore, nextBeforeAt: d.nextBeforeAt, nextBeforeId: d.nextBeforeId }),
      );
