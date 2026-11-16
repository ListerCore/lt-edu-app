'use client';

import { useEffect, type JSX } from 'react';
import { cn } from '@/lib/utils';
import { formatMessageTime } from '../data/tutoring-data';
import { useThread } from '../hooks/use-thread';
import type { Thread } from '../types';
import { Conversation } from './conversation';

interface Props {
  slug: string;
  threads: Thread[];
  // The open conversation: a thread, or a student to start one with
  open: { threadId?: string; studentId?: string; name: string; placement: string } | null;
  onOpen: (t: Thread) => void;
  // Reading a conversation clears its unread count in the list
  onRead: () => void;
}

// The tutor's conversations, newest first, and the one open
export const MessagesTab = ({ slug, threads, open, onOpen, onRead }: Props): JSX.Element => (
  <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
    <nav aria-label="Conversaciones" className="space-y-2">
      {threads.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">Aún no hay conversaciones. Usa «Escribir» junto a un estudiante.</p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
          {threads.map((t) => {
            const active = open?.threadId === t.id || (open?.studentId === t.studentId && !open?.threadId);
            return (
              <li key={t.id}>
                <button type="button" onClick={(): void => onOpen(t)} aria-current={active ? 'true' : undefined} className={cn('flex w-full items-start gap-2 px-3 py-2.5 text-left hover:bg-surface', active && 'bg-surface')}>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">{t.studentName}</span>
                    <span className={cn('block truncate text-xs', t.unread > 0 ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                      {t.lastSide === 'staff' && 'Tú: '}
                      {t.lastBody || 'Sin mensajes'}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-[11px] text-muted-foreground">{formatMessageTime(t.lastMessageAt)}</span>
                    {t.unread > 0 && <span className="rounded-full bg-brand px-1.5 text-[11px] font-semibold text-brand-foreground">{t.unread}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
    {open ? <OpenConversation key={open.threadId ?? open.studentId} slug={slug} open={open} unread={threads.find((t) => t.id === open.threadId || t.studentId === open.studentId)?.unread ?? 0} onRead={onRead} /> : <p className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">Elige una conversación.</p>}
  </div>
);

const OpenConversation = ({ slug, open, unread, onRead }: { slug: string; open: NonNullable<Props['open']>; unread: number; onRead: () => void }): JSX.Element => {
  const state = useThread(slug, { threadId: open.threadId, studentId: open.studentId });
  const loaded = state.view?.messages.length ?? -1;
  // Once read (and when a new one arrives while open), the list catches up
  useEffect(() => {
    if (loaded >= 0 && unread > 0) onRead();
  }, [loaded, unread, onRead]);
  return <Conversation state={state} title={open.name} subtitle={open.placement} />;
};
