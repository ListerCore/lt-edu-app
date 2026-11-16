'use server';

import { notFound, runRpc, validIds } from '@/features/protected/academic/lib/run-rpc';
import { classroomRpc } from '@/lib/api/grpc/classroom';
import type { AcademicResult, LibraryItem, LibraryPayload } from '../types';

// Creates (empty id) or edits a library entry (ClassroomService.SaveLibraryItem)
export const saveLibraryItemAction = async (slug: string, p: LibraryPayload): Promise<AcademicResult<LibraryItem>> =>
  p.id && !validIds(p.id)
    ? notFound
    : runRpc(
        slug,
        (token) =>
          classroomRpc.saveLibraryItem(
            { institutionSlug: slug, item: { id: p.id, kind: p.kind, title: p.title, description: p.description, body: p.body, url: p.url, topic: p.topic, createdName: '', updatedAt: '', files: 0, uses: 0 } },
            { token },
          ),
        (d) => d.item,
        p.id ? 'Recurso actualizado.' : 'Recurso agregado a la biblioteca.',
      );
