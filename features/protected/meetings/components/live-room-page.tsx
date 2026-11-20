'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';
import { ArrowLeft, ExternalLink, LogOut, Users } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { DASHBOARD_PATH } from '@/features/protected/dashboard/data/dashboard-navigation';
import { liveDay, liveSourceLabels, liveTime } from '../data/meetings-data';
import { useAttendance } from '../hooks/use-attendance';
import { useJoinSession } from '../hooks/use-join-session';
import type { JoinInfo, LiveSource } from '../types';

const LIVE_PATH = `${DASHBOARD_PATH}/live`;

const LiveCall = dynamic(() => import('./live-call'), { ssr: false, loading: () => <PageSkeleton /> });

// One live session: the call inside the platform, or the card that opens Google Meet. Entering is logged, so the
// host sees who came
export const LiveRoomPage = ({ source, id }: { source: LiveSource; id: string }): JSX.Element => {
  const slug = useInstitutionSlug();
  const router = useRouter();
  const { data, error, reload } = useJoinSession(slug, source, id);
  const session = data?.session;
  const back = (
    <Link href={LIVE_PATH} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
      <MorphIcon icon={ArrowLeft} size={14} />
      Clases en vivo
    </Link>
  );
  return (
    <AcademicPage wide titleId="live-room-title" title={session?.title ?? liveSourceLabels[source]} description={session ? `${session.context} · ${liveDay(session.startsAt)}, ${liveTime(session.startsAt)} · ${session.durationMin} min` : 'Entrando a la sesión…'} context={null} back={back}>
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data || !session ? (
        <PageSkeleton />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-3">
            {data.meetUrl ? <MeetCard info={data} /> : <LiveCall serverUrl={data.serverUrl} token={data.token} onLeave={(): void => router.push(LIVE_PATH)} />}
            <Link href={LIVE_PATH} className="btn-alt h-9 px-4 text-sm">
              <MorphIcon icon={LogOut} size={16} />
              Salir
            </Link>
          </div>
          {session.isHost && <AttendeesPanel slug={slug} source={source} id={id} />}
        </div>
      )}
    </AcademicPage>
  );
};

const MeetCard = ({ info }: { info: JoinInfo }): JSX.Element => (
  <section className="rounded-2xl border border-border bg-background p-6 text-center">
    <p className="text-sm text-muted-foreground">Esta sesión es por Google Meet. Tu ingreso ya quedó registrado.</p>
    <a href={info.meetUrl} target="_blank" rel="noopener noreferrer" className="btn-brand mt-4 h-10 px-5">
      <MorphIcon icon={ExternalLink} size={16} />
      Abrir Google Meet
    </a>
    <p className="mt-3 text-xs break-all text-muted-foreground">{info.meetUrl}</p>
  </section>
);

const AttendeesPanel = ({ slug, source, id }: { slug: string; source: LiveSource; id: string }): JSX.Element => {
  const { data, error, reload } = useAttendance(slug, source, id, true);
  return (
    <aside aria-labelledby="live-attendees" className="space-y-3 rounded-2xl border border-border bg-background p-4">
      <h2 id="live-attendees" className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <MorphIcon icon={Users} size={16} />
        Asistentes {data ? `(${data.length})` : ''}
      </h2>
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : data.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no entra nadie.</p>
      ) : (
        <ul className="max-h-[60svh] space-y-2 overflow-y-auto">
          {data.map((a) => (
            <li key={a.userId} className="text-sm">
              <span className="block text-foreground">{a.displayName}</span>
              <span className="block text-xs text-muted-foreground">
                Entró a las {liveTime(a.firstAt)}
                {a.joins > 1 ? ` · ${a.joins} veces` : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};
