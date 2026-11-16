'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, Item, ItemPayload } from '../types';

// Creates (empty id) or edits a piece of material (ClassroomService.SaveItem)
export const saveItemAction = async (slug: string, p: ItemPayload, message?: string): Promise<AcademicResult<Item>> =>
  (p.id && !validIds(p.id)) || (!p.id && !validIds(p.unitId)) || (p.libraryItemId && !validIds(p.libraryItemId))
    ? notFound
    : runRpc(
        slug,
        (token) =>
          classroomRpc.saveItem(
            {
              institutionSlug: slug,
              item: {
                id: p.id,
                unitId: p.unitId,
                kind: p.kind,
                title: p.title,
                body: p.body,
                url: p.url,
                complementary: p.complementary,
                startsAt: p.startsAt,
                durationMinutes: p.durationMinutes,
                recordingUrl: p.recordingUrl,
                libraryItemId: p.libraryItemId,
                published: p.published,
                files: 0,
                viewed: false,
                views: 0,
              },
            },
            { token },
          ),
        (d) => d.item,
        message ?? (p.id ? 'Material actualizado.' : 'Material agregado.'),
      );
