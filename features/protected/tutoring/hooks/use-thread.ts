'use client';

import { useTransition } from 'react';
import { sileo } from 'sileo';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { isTutoringEvent } from '@/hooks/use-live';
import { getThreadAction } from '../actions/get-thread';
import { openThreadAction } from '../actions/open-thread';
import { sendMessageAction } from '../actions/send-message';
import type { ThreadView } from '../types';

export interface ThreadState {
  view: ThreadView | null;
  error: string | null;
  isSending: boolean;
  send: (body: string) => Promise<boolean>;
}

// A conversation opened by thread id, or by student (staff; '' for a student account's tutor). It reloads (and
// marks itself read) when tutoring changes live, so a message from the other side shows up on its own
export const useThread = (slug: string, target: { studentId?: string; threadId?: string }): ThreadState => {
  const { studentId = '', threadId = '' } = target;
  const { data, error, reload } = useAcademicData(
    `thread:${slug}:${threadId || `student:${studentId}`}`,
    () => (threadId ? getThreadAction(slug, threadId) : openThreadAction(slug, studentId)),
    isTutoringEvent,
  );
  const [isSending, start] = useTransition();
  const send = (body: string): Promise<boolean> =>
    new Promise((resolve) =>
      start(async () => {
        const id = data?.thread?.id;
        if (!id) return resolve(false);
        const r = await sendMessageAction(slug, id, body);
        if (!r.ok) {
          sileo.error({ title: 'No se pudo enviar', description: r.message });
          return resolve(false);
        }
        reload();
        resolve(true);
      }),
    );
  return { view: data, error, isSending, send };
};
