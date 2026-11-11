'use client';

import { useState, type JSX } from 'react';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { isAttendanceEvent, isAssessmentEvent, isWellbeingEvent, type LiveEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getAlertsAction } from '../actions/wellbeing-actions';
import { alertKindLabels } from '../data/wellbeing-data';
import { StudentFileView } from './student-file';

// Alerts change with wellbeing, attendance and conduct grades
const refreshOn = (type: LiveEvent['type']): boolean => isWellbeingEvent(type) || isAttendanceEvent(type) || isAssessmentEvent(type);

// Which tab of the file answers each kind of alert
const tabFor: Record<string, 'tutoring' | 'discipline' | 'psychology' | 'special'> = {
  attendance: 'tutoring',
  conduct: 'discipline',
  discipline: 'discipline',
  reconsideration: 'discipline',
  commitment: 'tutoring',
  psychology: 'psychology',
  plan: 'special',
};

// Alertas: what needs attention in the students the person follows, most urgent first
export const AlertsPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const { data, error, reload } = useAcademicData(`wb-alerts:${slug}`, () => getAlertsAction(slug), refreshOn);
  const [kind, setKind] = useState('');
  const [open, setOpen] = useState<{ id: string; kind: string } | null>(null);
  const shown = (data?.alerts ?? []).filter((a) => !kind || a.kind === kind);
  return (
    <AcademicPage
      titleId="alerts-title"
      title="Alertas"
      description="Inasistencias cerca del límite, conducta desaprobatoria, faltas graves sin cerrar, reconsideraciones por resolver, compromisos vencidos, derivaciones a psicología sin atender y estudiantes sin plan de orientación."
      context={null}
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : open ? (
        <StudentFileView slug={slug} studentId={open.id} initialTab={tabFor[open.kind]} onBack={(): void => setOpen(null)} />
      ) : (
        <div className="space-y-5">
          <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
            <Chip on={!kind} onClick={(): void => setKind('')} label="Todas" n={data.alerts.length} />
            {Object.entries(alertKindLabels)
              .filter(([k]) => (data.counts[k] ?? 0) > 0)
              .map(([k, label]) => (
                <Chip key={k} on={kind === k} onClick={(): void => setKind(k)} label={label} n={data.counts[k] ?? 0} />
              ))}
          </div>
          {shown.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">Sin alertas. Todo en orden.</p>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
              {shown.map((a, i) => (
                <li key={`${a.kind}-${a.studentId}-${i}`}>
                  <button
                    type="button"
                    disabled={!a.studentId}
                    onClick={(): void => setOpen({ id: a.studentId, kind: a.kind })}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left enabled:hover:bg-surface"
                  >
                    <span aria-hidden className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', a.level === 'high' ? 'bg-destructive' : 'bg-warning')} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">{a.title}</span>
                      <span className="line-clamp-2 block text-sm text-muted-foreground">{a.detail}</span>
                      {a.studentName && (
                        <span className="block text-xs text-muted-foreground">
                          {a.studentName} · {a.placement}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-right text-xs text-muted-foreground">
                      <span className="block">{alertKindLabels[a.kind]}</span>
                      {a.since && <span className="block">{formatDay(a.since, false)}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </AcademicPage>
  );
};

// A filter chip with its count
const Chip = ({ on, onClick, label, n }: { on: boolean; onClick: () => void; label: string; n: number }): JSX.Element => (
  <button type="button" aria-pressed={on} onClick={onClick} className={cn('flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium', on ? 'border-brand bg-brand-soft text-brand' : 'border-border text-foreground hover:border-brand/50')}>
    {label}
    <span className="text-xs tabular-nums opacity-70">{n}</span>
  </button>
);
