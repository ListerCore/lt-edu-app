'use client';

import Link from 'next/link';
import { useTransition, type JSX } from 'react';
import { CalendarPlus, CheckCheck, Pencil, Video, X } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { liveHref } from '@/features/protected/meetings/data/meetings-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useNow } from '@/features/protected/apafa/hooks/use-now';
import { cn } from '@/lib/utils';
import { setSessionStatusAction } from '../actions/set-session-status';
import { formatWhen, sessionKindLabels, sessionModeLabels, sessionStatusClass, sessionStatusLabels } from '../data/tutoring-data';
import type { SessionDraft, TutoringSession } from '../types';

interface Props {
  slug: string;
  sessions: TutoringSession[];
  onNew: (draft: SessionDraft) => void;
  onEdit: (s: TutoringSession) => void;
  onHold: (s: TutoringSession) => void;
  onChange: () => void;
}

// The tutor's sessions: what is ahead (join, record, cancel) and the last two weeks with their agreements
export const SessionsTab = ({ slug, sessions, onNew, onEdit, onHold, onChange }: Props): JSX.Element => {
  const [isPending, start] = useTransition();
  const now = useNow();
  const ahead = sessions.filter((s) => s.status === 'scheduled').sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const past = sessions.filter((s) => s.status !== 'scheduled').sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt));
  const status = (s: TutoringSession, next: 'missed' | 'cancelled'): void =>
    start(async () => {
      const r = await runAcademicAction(setSessionStatusAction(slug, s.id, next), next === 'cancelled' ? 'Tutoría cancelada.' : 'Registrada como no asistió.');
      if (r.ok) onChange();
    });
  const card = (s: TutoringSession): JSX.Element => {
    const started = now > 0 && Date.parse(s.scheduledAt) <= now + 30 * 60_000;
    return (
      <li key={s.id} className="flex flex-wrap items-start gap-3 px-4 py-3">
        <span className="min-w-0 flex-1 basis-64">
          <span className="block text-sm font-medium text-foreground">{s.reason}</span>
          <span className="block text-xs text-muted-foreground">
            {formatWhen(s.scheduledAt)} · {s.durationMin} min · {sessionKindLabels[s.kind]} · {sessionModeLabels[s.mode]}
          </span>
          <span className="block text-xs text-muted-foreground">{s.attendees.map((a) => (a.attended === false ? `${a.studentName} (no vino)` : a.studentName)).join(' · ')}</span>
          {s.agreements && <span className="mt-1 block text-xs text-foreground">Acuerdos: {s.agreements}</span>}
        </span>
        <span className={cn('pill', sessionStatusClass[s.status])}>{sessionStatusLabels[s.status]}</span>
        {s.status === 'scheduled' && (
          <span className="flex flex-wrap gap-1">
            {s.mode === 'virtual' && (s.provider === 'platform' || s.link) && (
              <Link href={liveHref('tutoring', s.id)} className="btn-alt h-8 px-3 text-xs">
                <MorphIcon icon={Video} size={14} />
                {s.provider === 'platform' ? 'Abrir la sala' : 'Unirse'}
              </Link>
            )}
            <button type="button" className="btn-brand h-8 px-3 text-xs" disabled={!started} title={started ? undefined : 'Se registra cuando ya se realizó'} onClick={(): void => onHold(s)}>
              <MorphIcon icon={CheckCheck} size={14} />
              Registrar
            </button>
            <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => onEdit(s)} aria-label="Cambiar la tutoría">
              <MorphIcon icon={Pencil} size={14} />
            </button>
            <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={isPending} onClick={(): void => status(s, 'cancelled')} aria-label="Cancelar la tutoría">
              <MorphIcon icon={X} size={14} />
            </button>
          </span>
        )}
      </li>
    );
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button type="button" className="btn-brand" onClick={(): void => onNew({ studentIds: [], kind: 'group', reason: '', alertKind: '' })}>
          <MorphIcon icon={CalendarPlus} size={16} />
          Agendar tutoría
        </button>
      </div>
      <section aria-labelledby="ts-ahead" className="space-y-2">
        <h2 id="ts-ahead" className="text-sm font-semibold text-foreground">
          Agendadas
        </h2>
        {ahead.length === 0 ? <p className="text-sm text-muted-foreground">No hay tutorías agendadas.</p> : <ul className="divide-y divide-border rounded-2xl border border-border bg-background">{ahead.map(card)}</ul>}
      </section>
      <section aria-labelledby="ts-past" className="space-y-2">
        <h2 id="ts-past" className="text-sm font-semibold text-foreground">
          Últimas dos semanas
        </h2>
        {past.length === 0 ? <p className="text-sm text-muted-foreground">Sin tutorías registradas.</p> : <ul className="divide-y divide-border rounded-2xl border border-border bg-background">{past.map(card)}</ul>}
      </section>
    </div>
  );
};
