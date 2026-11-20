'use client';

import Link from 'next/link';
import type { JSX } from 'react';
import { HeartHandshake, Video } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { liveHref } from '@/features/protected/meetings/data/meetings-data';
import { LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { cn } from '@/lib/utils';
import { formatWhen, sessionModeLabels, sessionStatusClass, sessionStatusLabels } from '../data/tutoring-data';
import { useMyTutoring } from '../hooks/use-my-tutoring';
import { useThread } from '../hooks/use-thread';
import { Conversation } from './conversation';

// A student's tutoring: their tutor, the sessions they are called to (with the link to join) and the agreements,
// and the conversation with the tutor
export const MyTutoringView = ({ slug }: { slug: string }): JSX.Element => {
  const { data, error, reload } = useMyTutoring(slug);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  if (!data.hasTutor) return <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">Aún no tienes un tutor asignado. Consulta con la coordinación del CEBA.</p>;
  const ahead = data.sessions.filter((s) => s.status === 'scheduled');
  const held = data.sessions.filter((s) => s.status === 'held' && s.agreements);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
      <ThreadPanel slug={slug} title={data.tutor?.staffName ?? 'Tu tutor'} />
      <aside className="space-y-6">
        <section className="flex items-center gap-3 rounded-2xl border border-border bg-background p-4">
          <span className="flex size-10 items-center justify-center rounded-full bg-brand-soft text-brand">
            <MorphIcon icon={HeartHandshake} size={18} />
          </span>
          <span>
            <span className="block text-xs text-muted-foreground">Tu tutor virtual</span>
            <span className="block font-medium text-foreground">{data.tutor?.staffName}</span>
          </span>
        </section>
        <section aria-labelledby="my-ahead" className="space-y-2">
          <h2 id="my-ahead" className="text-sm font-semibold text-foreground">
            Próximas tutorías
          </h2>
          {ahead.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tienes tutorías agendadas.</p>
          ) : (
            <ul className="space-y-2">
              {ahead.map((s) => (
                <li key={s.id} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
                  <span className="block font-medium text-foreground">{s.reason}</span>
                  <span className="block text-xs text-muted-foreground">
                    {formatWhen(s.scheduledAt)} · {s.durationMin} min · {sessionModeLabels[s.mode]}
                  </span>
                  {s.mode === 'virtual' && (s.provider === 'platform' || s.link) && (
                    <Link href={liveHref('tutoring', s.id)} className="btn-brand mt-2 h-8 px-3 text-xs">
                      <MorphIcon icon={Video} size={14} />
                      Unirme {s.provider === 'platform' ? '(en la plataforma)' : '(Google Meet)'}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section aria-labelledby="my-agreements" className="space-y-2">
          <h2 id="my-agreements" className="text-sm font-semibold text-foreground">
            Acuerdos
          </h2>
          {held.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay acuerdos registrados.</p>
          ) : (
            <ul className="space-y-2">
              {held.map((s) => (
                <li key={s.id} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{formatWhen(s.scheduledAt)}</span>
                    <span className={cn('pill', sessionStatusClass[s.status])}>{sessionStatusLabels[s.status]}</span>
                  </span>
                  <span className="mt-1 block text-foreground">{s.agreements}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
};

const ThreadPanel = ({ slug, title }: { slug: string; title: string }): JSX.Element => {
  const state = useThread(slug, { studentId: '' });
  return <Conversation state={state} title={title} subtitle="Escríbele si tienes dudas o no puedes conectarte" />;
};
