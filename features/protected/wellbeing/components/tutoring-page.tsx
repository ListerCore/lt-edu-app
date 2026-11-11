'use client';

import { useMemo, useState, type JSX } from 'react';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { SearchBox } from '@/features/protected/people/components/people-ui';
import { isWellbeingEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getTutoringAction } from '../actions/wellbeing-actions';
import { interviewKindLabels, partyLabels } from '../data/wellbeing-data';
import type { WellStudent } from '../types';
import { StudentFileView } from './student-file';

const fold = (v: string): string => v.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

// Tutoría: the tutor's students with what is open for each, the commitments due and the latest interviews. Families
// see their children's agreements and commitments
export const TutoringPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const { data, error, reload } = useAcademicData(`wb-tutoring:${slug}`, () => getTutoringAction(slug), isWellbeingEvent);
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const rows = useMemo(() => (data?.students ?? []).filter((s) => !query || fold(`${s.name} ${s.code} ${s.placement}`).includes(fold(query))), [data, query]);
  const family = data?.family ?? false;
  return (
    <AcademicPage
      titleId="tut-title"
      title="Tutoría"
      description={family ? 'Los acuerdos de las reuniones con el tutor y los compromisos de cada hijo.' : 'Entrevistas con estudiantes y familias, compromisos y su seguimiento. Lo conversado queda reservado para el personal; la familia ve los acuerdos.'}
      context={null}
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : open ? (
        <StudentFileView slug={slug} studentId={open} onBack={data.students.length > 1 || !family ? (): void => setOpen(null) : undefined} />
      ) : family && data.students.length === 1 && data.students[0] ? (
        <StudentFileView slug={slug} studentId={data.students[0].id} />
      ) : data.students.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">No tienes una sección a cargo como tutor en el periodo.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section aria-label="Estudiantes" className="space-y-3">
            {data.students.length > 8 && <SearchBox value={query} onChange={setQuery} placeholder="Buscar estudiante o sección" />}
            <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
              {rows.slice(0, 300).map((s) => (
                <li key={s.id}>
                  <StudentRow s={s} onOpen={(): void => setOpen(s.id)} />
                </li>
              ))}
            </ul>
            {rows.length > 300 && <p className="text-xs text-muted-foreground">Se muestran 300 de {rows.length}: usa la búsqueda.</p>}
          </section>
          {!family && (
            <aside className="space-y-6">
              <section aria-labelledby="tut-due" className="space-y-2">
                <h2 id="tut-due" className="text-sm font-semibold text-foreground">
                  Compromisos por revisar
                </h2>
                {data.due.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nada pendiente.</p>
                ) : (
                  <ul className="space-y-2">
                    {data.due.slice(0, 12).map((c) => {
                      const late = c.dueOn < data.today;
                      return (
                        <li key={c.id}>
                          <button type="button" onClick={(): void => setOpen(c.studentId)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-left text-sm hover:border-brand/50">
                            <span className="block font-medium text-foreground">{c.studentName}</span>
                            <span className="line-clamp-2 block text-muted-foreground">{c.description}</span>
                            <span className={cn('block text-xs', late ? 'text-destructive' : 'text-muted-foreground')}>
                              {partyLabels[c.party]} · {late ? 'venció' : 'vence'} el {formatDay(c.dueOn, false)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
              <section aria-labelledby="tut-latest" className="space-y-2">
                <h2 id="tut-latest" className="text-sm font-semibold text-foreground">
                  Últimas entrevistas
                </h2>
                {data.interviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Sin entrevistas en los últimos dos meses.</p>
                ) : (
                  <ul className="divide-y divide-border rounded-xl border border-border bg-background">
                    {data.interviews.slice(0, 10).map((x) => (
                      <li key={x.id}>
                        <button type="button" onClick={(): void => setOpen(x.studentId)} className="w-full px-3 py-2 text-left text-sm hover:bg-surface">
                          <span className="block text-foreground">{x.topic}</span>
                          <span className="block text-xs text-muted-foreground">
                            {x.studentName} · {interviewKindLabels[x.kind]?.toLowerCase()} · {formatDay(x.heldOn, false)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </aside>
          )}
        </div>
      )}
    </AcademicPage>
  );
};

// A student with chips for what is open (commitments, faults, psychology, POI)
const StudentRow = ({ s, onOpen }: { s: WellStudent; onOpen: () => void }): JSX.Element => (
  <button type="button" onClick={onOpen} className="flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-left hover:bg-surface">
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-medium text-foreground">{s.name}</span>
      <span className="block text-xs text-muted-foreground">
        {s.code} · {s.placement}
        {s.lastInterview && ` · última entrevista ${formatDay(s.lastInterview, false)}`}
      </span>
    </span>
    <span className="flex flex-wrap gap-1">
      {s.pendingCommitments > 0 && <span className="pill bg-secondary text-foreground">{s.pendingCommitments === 1 ? '1 compromiso' : `${s.pendingCommitments} compromisos`}</span>}
      {s.openIncidents > 0 && <span className="pill bg-warning/15 text-warning">{s.openIncidents === 1 ? '1 falta abierta' : `${s.openIncidents} faltas abiertas`}</span>}
      {s.activeCase && <span className="pill bg-brand/12 text-brand">Psicología</span>}
      {s.specialNeeds && <span className="pill bg-secondary text-muted-foreground">{s.hasPlan ? 'POI' : 'NEE'}</span>}
    </span>
  </button>
);
