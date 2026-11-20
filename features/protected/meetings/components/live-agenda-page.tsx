'use client';

import Link from 'next/link';
import { useMemo, type JSX } from 'react';
import { Brain, HeartHandshake, MonitorPlay, Video } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useNow } from '@/features/protected/apafa/hooks/use-now';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { cn } from '@/lib/utils';
import { isLiveSource, limaDate, liveDay, liveHref, livePhase, liveSourceLabels, liveTime, providerLabels } from '../data/meetings-data';
import { useLiveAgenda } from '../hooks/use-live-agenda';
import type { LiveProvider, LiveSession } from '../types';

const sourceIcons = { class: MonitorPlay, tutoring: HeartHandshake, psychology: Brain };

// Clases en vivo: every live session of the person (their live classes, virtual tutoring and psychology
// appointments), today first, with the button to join when it opens
export const LiveAgendaPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const { role } = useWorkspace();
  const family = role === 'student' || role === 'guardian';
  const { data, error, reload } = useLiveAgenda(slug);
  const now = useNow();
  const today = now ? limaDate(now) : '';
  const groups = useMemo(() => {
    const list = (data?.sessions ?? []).filter((s) => livePhase(s.startsAt, s.durationMin, now) !== 'ended' || s.isHost);
    return {
      today: list.filter((s) => limaDate(s.startsAt) <= today && livePhase(s.startsAt, s.durationMin, now) !== 'ended'),
      ahead: list.filter((s) => limaDate(s.startsAt) > today),
    };
  }, [data, today, now]);
  return (
    <AcademicPage wide titleId="live-title" title="Clases en vivo" description={family ? 'Tus clases en vivo, tutorías y citas. El botón para entrar se activa 15 minutos antes.' : 'Las clases en vivo de tus aulas, tus tutorías virtuales y citas. Se programan desde el aula virtual, la tutoría o psicología, en la plataforma o en Google Meet.'} context={null}>
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-8">
          <AgendaGroup id="live-today" title="Hoy" now={now} sessions={groups.today} empty="No tienes sesiones en vivo hoy." />
          <AgendaGroup id="live-ahead" title="Próximas" now={now} sessions={groups.ahead} empty="No hay sesiones en las próximas dos semanas." showDay />
        </div>
      )}
    </AcademicPage>
  );
};

const AgendaGroup = ({ id, title, now, sessions, empty, showDay }: { id: string; title: string; now: number; sessions: LiveSession[]; empty: string; showDay?: boolean }): JSX.Element => (
  <section aria-labelledby={id} className="space-y-3">
    <h2 id={id} className="text-sm font-semibold text-foreground">
      {title}
    </h2>
    {sessions.length === 0 ? (
      <p className="rounded-2xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">{empty}</p>
    ) : (
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {sessions.map((s) => (
          <li key={`${s.source}-${s.id}`}>
            <SessionCard session={s} now={now} showDay={showDay} />
          </li>
        ))}
      </ul>
    )}
  </section>
);

const SessionCard = ({ session: s, now, showDay }: { session: LiveSession; now: number; showDay?: boolean }): JSX.Element => {
  const phase = now ? livePhase(s.startsAt, s.durationMin, now) : 'upcoming';
  const canJoin = s.isHost || phase === 'open';
  const source = isLiveSource(s.source) ? s.source : 'class';
  const end = new Date(new Date(s.startsAt).getTime() + s.durationMin * 60_000).toISOString();
  return (
    <article className={cn('flex h-full flex-col gap-3 rounded-2xl border bg-background p-4', phase === 'open' ? 'border-brand' : 'border-border')}>
      <div className="flex items-start justify-between gap-2">
        <span className="pill bg-brand-soft text-brand">
          <MorphIcon icon={sourceIcons[source]} size={12} />
          {liveSourceLabels[source]}
        </span>
        {phase === 'open' && <span className="pill bg-success/15 text-success">Abierta</span>}
      </div>
      <div className="min-w-0">
        <h3 className="font-medium text-pretty text-foreground">{s.title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{s.context}</p>
      </div>
      <dl className="grid gap-1 text-sm">
        <div className="flex gap-2">
          <dt className="sr-only">Cuándo</dt>
          <dd className="text-foreground first-letter:uppercase">
            {showDay ? `${liveDay(s.startsAt)}, ` : ''}
            {liveTime(s.startsAt)} – {liveTime(end)}
          </dd>
        </div>
        <div className="flex flex-wrap gap-x-2 text-muted-foreground">
          <dt className="sr-only">Dónde</dt>
          <dd>{providerLabels[s.provider as LiveProvider] ?? s.provider}</dd>
          {s.hostName && <dd>· {s.isHost ? 'Tú eres anfitrión' : s.hostName}</dd>}
        </div>
      </dl>
      <div className="mt-auto">
        {canJoin ? (
          <Link href={liveHref(source, s.id)} className="btn-brand h-9 w-full justify-center px-4 text-sm">
            <MorphIcon icon={Video} size={16} />
            {s.isHost && phase !== 'open' ? 'Abrir sala' : 'Unirme'}
          </Link>
        ) : (
          <p className="rounded-lg bg-secondary px-3 py-2 text-center text-xs text-muted-foreground">{phase === 'ended' ? 'La sesión ya terminó.' : 'El botón se activa 15 minutos antes.'}</p>
        )}
      </div>
    </article>
  );
};
