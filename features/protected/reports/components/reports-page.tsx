'use client';

import { useState, type JSX } from 'react';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { soles } from '@/features/protected/finance/data/finance-data';
import { Filter } from '@/features/protected/wellbeing/components/wellbeing-ui';
import { isAttendanceEvent, isFinanceEvent, type LiveEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { getBoardAction } from '../actions/reports-actions';
import { achievementLabel, attendanceRate, num, pct } from '../data/reports-data';
import type { Board, BoardQuery, PeriodKpi } from '../types';
import { AttendanceSection, type Range } from './attendance-section';
import { CompareSection, EnrollmentSection } from './compare-section';
import { FinanceSection } from './finance-section';
import { PerformanceSection } from './performance-section';
import { Kpi } from './report-ui';

type Tab = 'attendance' | 'performance' | 'finance' | 'enrollment' | 'compare';

// New attendance or payments change the board; marks are read when the page is opened again
const refreshOn = (type: LiveEvent['type']): boolean => isAttendanceEvent(type) || isFinanceEvent(type);

// The ISO day n days before another
const daysBefore = (iso: string, n: number): string => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};

// The first day of a range that ends on the period's last day so far
const rangeStart = (board: Board, range: Range): string => {
  if (range === '90' || !board.period) return '';
  if (range === 'all') return board.period.startsOn;
  const end = board.today < board.period.endsOn ? board.today : board.period.endsOn;
  return daysBefore(end, Number(range) - 1);
};

// Reportes: the direction board of the institution. Every figure is an aggregate; tesorería sees only collection
export const ReportsPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const [q, setQ] = useState<BoardQuery>({ periodId: '', levelId: '', subject: '', from: '', to: '' });
  const [range, setRange] = useState<Range>('90');
  const { data, error, reload } = useAcademicData(`reports:${slug}:${q.periodId}:${q.levelId}:${q.subject}:${q.from}`, () => getBoardAction(slug, q), refreshOn);
  const [tab, setTab] = useState<Tab>('attendance');
  const tabs: Array<[Tab, string]> = data?.academic
    ? [
        ['attendance', 'Asistencia'],
        ['performance', 'Rendimiento'],
        ['finance', 'Cobranza'],
        ['enrollment', 'Matrícula'],
        ['compare', 'Comparativo'],
      ]
    : [
        ['finance', 'Cobranza'],
        ['compare', 'Comparativo'],
      ];
  const shown = tabs.some(([k]) => k === tab) ? tab : tabs[0][0];
  // A new period or level starts over: the default range and every area
  const pick = (patch: Partial<BoardQuery>): void => {
    setQ({ ...q, subject: '', from: '', ...patch });
    setRange('90');
  };
  return (
    <AcademicPage
      titleId="reports-title"
      title="Reportes"
      // Read only: nothing to manage, and no "read only" banner either
      context={null}
      description={
        data && !data.academic ? 'La cobranza del periodo: lo vencido, lo pagado, la deuda por antigüedad y la comparación con otros periodos.' : 'Asistencia, rendimiento, cobranza y matrícula del periodo, y cómo se compara con los anteriores. Solo cifras agregadas, sin datos de estudiantes.'
      }
    >
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : !data.period ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">Todavía no hay un periodo en curso ni cerrado para reportar.</p>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-56">
              <Filter id="rep-period" label="Periodo" value={data.period.id} options={data.periods.map((p) => ({ value: p.id, label: p.status === 'closed' ? `${p.name} (cerrado)` : p.name }))} onChange={(v): void => pick({ periodId: v })} />
            </div>
            {data.levels.length > 1 && (
              <div className="w-56">
                <Filter id="rep-level" label="Nivel" value={data.levelId} options={[{ value: '', label: 'Todos los niveles' }, ...data.levels.map((l) => ({ value: l.id, label: l.name }))]} onChange={(v): void => pick({ levelId: v })} />
              </div>
            )}
          </div>

          <Kpis board={data} />

          <div role="tablist" aria-label="Secciones del reporte" className="flex gap-1 overflow-x-auto border-b border-border">
            {tabs.map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="tab"
                id={`rep-tab-${k}`}
                aria-selected={shown === k}
                aria-controls="rep-panel"
                onClick={(): void => setTab(k)}
                className={cn('-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium', shown === k ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}
              >
                {label}
              </button>
            ))}
          </div>
          <div id="rep-panel" role="tabpanel" aria-labelledby={`rep-tab-${shown}`}>
            {shown === 'attendance' && (
              <AttendanceSection
                board={data}
                range={range}
                canExport
                onRange={(r): void => {
                  setRange(r);
                  setQ({ ...q, from: rangeStart(data, r) });
                }}
              />
            )}
            {shown === 'performance' && <PerformanceSection board={data} canExport onSubject={(s): void => setQ({ ...q, subject: s })} />}
            {shown === 'finance' && <FinanceSection board={data} canExport />}
            {shown === 'enrollment' && <EnrollmentSection board={data} canExport />}
            {shown === 'compare' && <CompareSection board={data} canExport />}
          </div>
        </div>
      )}
    </AcademicPage>
  );
};

// The headline figures: the period so far, with the change against the period before when there is one
const Kpis = ({ board }: { board: Board }): JSX.Element => {
  const i = board.compare.findIndex((k) => k.periodId === board.period?.id);
  const now: PeriodKpi | undefined = board.compare[i];
  const before: PeriodKpi | undefined = i > 0 ? board.compare[i - 1] : undefined;
  const change = (k: 'attendance' | 'achievement' | 'collection'): number | undefined => (now && before && now[k] >= 0 && before[k] >= 0 ? now[k] - before[k] : undefined);
  const f = board.finance;
  const due = f ? f.expected - f.discounts : 0;
  const since = before ? `frente a ${before.name}` : 'en el periodo';
  if (!board.academic) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        <Kpi label="Cobrado del periodo" value={soles(f?.collected)} hint={`de ${soles(due)} por cobrar en todo el periodo`} />
        <Kpi label="Cobranza al día" value={pct(now?.collection)} hint={`de lo que ya venció, ${since}`} delta={change('collection')} />
        <Kpi label="Vencido sin pagar" value={soles(f?.overdue)} hint={`${num(f?.debtors)} estudiantes con deuda vencida`} />
      </div>
    );
  }
  const e = board.enrollment;
  const enrolled = (e?.active ?? 0) + (e?.completed ?? 0);
  const range = board.attendanceDays.reduce(
    (t, d) => ({ present: t.present + (d.counts?.present ?? 0), late: t.late + (d.counts?.late ?? 0), absent: t.absent + (d.counts?.absent ?? 0), justified: t.justified + (d.counts?.justified ?? 0) }),
    { present: 0, late: 0, absent: 0, justified: 0 },
  );
  const score = board.scale === 'score';
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi label="Estudiantes" value={num(enrolled)} hint={e?.capacity ? `${pct((enrolled * 100) / e.capacity, 0)} de las vacantes` : 'sin vacantes definidas'} />
      <Kpi label="Asistencia del periodo" value={pct(now?.attendance)} hint={`${since} · rango elegido: ${pct(attendanceRate(range))}`} delta={change('attendance')} />
      <Kpi label={score ? 'Puntaje promedio' : (achievementLabel[board.scale] ?? 'Logro')} value={score ? (now && now.achievement >= 0 ? num(now.achievement, 1) : '—') : pct(now?.achievement)} hint={since} delta={score ? undefined : change('achievement')} />
      <Kpi label="Cobranza al día" value={pct(now?.collection)} hint={`${soles(f?.overdue)} vencido sin pagar`} delta={change('collection')} />
    </div>
  );
};
