'use client';

import { useEffect, useRef, useState, type JSX, type KeyboardEvent } from 'react';
import { SendHorizontal } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { formatMessageTime } from '../data/tutoring-data';
import type { ThreadState } from '../hooks/use-thread';

interface Props {
  state: ThreadState;
  // Who the viewer talks to, for the header and the empty state
  title: string;
  subtitle?: string;
  className?: string;
}

// A conversation: the messages (the viewer's own on the right) and the box to write; Enter sends, Shift+Enter breaks
// the line. Dirección reads without writing
export const Conversation = ({ state, title, subtitle, className }: Props): JSX.Element => {
  const [draft, setDraft] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const { view, error, isSending, send } = state;
  const count = view?.messages.length ?? 0;
  useEffect(() => end.current?.scrollIntoView({ block: 'end' }), [count]);
  const submit = async (): Promise<void> => {
    const body = draft.trim();
    if (!body || isSending) return;
    if (await send(body)) setDraft('');
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void submit();
    }
  };
  return (
    <section aria-label={`Conversación con ${title}`} className={cn('flex min-h-[28rem] flex-col rounded-2xl border border-border bg-background', className)}>
      <header className="border-b border-border px-4 py-3">
        <p className="font-medium text-foreground">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </header>
      <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4" aria-live="polite">
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : !view ? (
          <p className="text-sm text-muted-foreground">Cargando…</p>
        ) : view.messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Aún no hay mensajes. Escribe el primero.</p>
        ) : (
          view.messages.map((m) => {
            const mine = m.side === view.side;
            return (
              <div key={m.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                <div className={cn('max-w-[80%] rounded-2xl px-3.5 py-2 text-sm', mine ? 'rounded-br-md bg-brand text-brand-foreground' : 'rounded-bl-md bg-secondary text-foreground')}>
                  {!mine && <p className="text-xs font-medium opacity-75">{m.authorName}</p>}
                  <p className="break-words whitespace-pre-wrap">{m.body}</p>
                  <p className={cn('mt-0.5 text-right text-[11px]', mine ? 'opacity-80' : 'text-muted-foreground')}>{formatMessageTime(m.createdAt)}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={end} />
      </div>
      {view?.side ? (
        <form
          className="flex items-end gap-2 border-t border-border p-3"
          onSubmit={(e): void => {
            e.preventDefault();
            void submit();
          }}
        >
          <label htmlFor="message-body" className="sr-only">
            Mensaje
          </label>
          <Textarea id="message-body" rows={2} maxLength={2000} value={draft} placeholder="Escribe un mensaje…" onChange={(e): void => setDraft(e.target.value)} onKeyDown={onKey} className="min-h-0 flex-1 resize-none" />
          <button type="submit" className="btn-brand h-10 px-3" disabled={isSending || !draft.trim()} aria-label="Enviar">
            <MorphIcon icon={SendHorizontal} size={16} />
          </button>
        </form>
      ) : (
        view && <p className="border-t border-border px-4 py-3 text-xs text-muted-foreground">Lees la conversación; escriben el estudiante y su tutor.</p>
      )}
    </section>
  );
};
