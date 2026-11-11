'use client';

import { useMemo, useState, useTransition, type JSX } from 'react';
import { ArrowLeft, Clock, FileClock, LoaderCircle, Lock } from 'lucide';
import { sileo } from 'sileo';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { shiftLabels } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { isAttendanceEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { closeDayAction, getRosterAction, markStudentsAction } from '../actions/attendance-actions';
import { formatClock, markLabels, sourceLabels, tallyTotal } from '../data/attendance-data';
import type { MarkDraft, Overview, SectionDay } from '../types';
import { Empty, MarkPicker, TallyBar, TallyLine } from './attendance-ui';

const marked = (s: SectionDay): number => tallyTotal(s.tally);

interface DayViewProps {
  slug: string;
  overview: Overview;
  reload: () => void;
}

// The day of every section: how many came, who is missing, and each section's register
export const DayView = ({ slug, overview, reload }: DayViewProps): JSX.Element => {
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const sectionWord = overview.vocabulary?.section ?? 'Sección';
  const totals = useMemo(() => {
    const t = { enrolled: 0, present: 0, late: 0, absent: 0, justified: 0 };
    for (const s of overview.sections) {
      t.enrolled += s.enrolled;
      t.present += s.tally?.present ?? 0;
      t.late += s.tally?.late ?? 0;
      t.absent += s.tally?.absent ?? 0;
      t.justified += s.tally?.justified ?? 0;
    }
    return t;
  }, [overview.sections]);
  const unmarked = totals.enrolled - totals.present - totals.late - totals.absent - totals.justified;
  const mine = new Set(overview.tutoring);
  const sorted = [...overview.sections].sort((a, b) => Number(mine.has(b.sectionId)) - Number(mine.has(a.sectionId)));

  if (sectionId) {
    const section = overview.sections.find((s) => s.sectionId === sectionId);
    return <RosterView key={`${sectionId}:${overview.day}`} slug={slug} sectionId={sectionId} day={overview.day} label={section?.sectionLabel ?? sectionWord} onBack={(): void => setSectionId(null)} />;
  }

  const closeAll = (): void =>
    startTransition(async () => {
      const result = await closeDayAction(slug, overview.day, '');
      if (!result.ok) {
        sileo.error({ title: 'No se pudo cerrar el día', description: result.message });
        return;
      }
      sileo.success({ title: result.data === 1 ? 'Se marcó 1 falta' : `Se marcaron ${result.data} faltas`, description: 'Quien no llegó quedó como falta; si tenía una justificación aceptada, como justificada.' });
      reload();
    });

  if (!overview.schoolDay) return <Empty>Este día no hay clases según la configuración de la institución.</Empty>;
  if (overview.sections.length === 0) return <Empty>No hay {sectionWord.toLowerCase()}s con periodo en curso este día.</Empty>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 rounded-2xl border border-border bg-background p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-6">
        <div className="min-w-0 space-y-3">
          <p className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            {totals.present + totals.late}
            <span className="text-lg font-normal text-muted-foreground"> de {totals.enrolled} llegaron</span>
          </p>
          <TallyBar tally={{ present: totals.present, late: totals.late, absent: totals.absent, justified: totals.justified }} total={totals.enrolled} className="h-3" />
          <TallyLine tally={{ present: totals.present, late: totals.late, absent: totals.absent, justified: totals.justified }} unmarked={unmarked} />
        </div>
        {overview.canScan && unmarked > 0 && (
          <button type="button" className="btn-alt" disabled={isPending} onClick={closeAll}>
            <MorphIcon icon={isPending ? LoaderCircle : Lock} size={16} className={cn(isPending && 'animate-spin')} />
            Cerrar el día ({unmarked} sin marcar)
          </button>
        )}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((s) => {
          const pending = s.enrolled - marked(s);
          return (
            <li key={s.sectionId}>
              <button type="button" onClick={(): void => setSectionId(s.sectionId)} className="w-full rounded-2xl border border-border bg-background p-4 text-left transition-colors hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-brand">
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-semibold text-foreground">{s.sectionLabel}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {shiftLabels[s.shift] ?? s.shift}
                      {s.tutorName && ` · Tutoría: ${s.tutorName}`}
                    </span>
                  </span>
                  {mine.has(s.sectionId) && <span className="pill shrink-0 bg-brand/12 text-brand">Tu tutoría</span>}
                </span>
                <TallyBar tally={s.tally} total={s.enrolled} className="mt-4" />
                <span className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
                  <span>
                    {(s.tally?.present ?? 0) + (s.tally?.late ?? 0)}/{s.enrolled} llegaron
                    {(s.tally?.late ?? 0) > 0 && ` · ${s.tally?.late} tarde`}
                  </span>
                  <span className={cn(pending > 0 ? 'text-foreground' : (s.tally?.absent ?? 0) > 0 && 'text-destructive')}>{pending > 0 ? `${pending} sin marcar` : `${s.tally?.absent ?? 0} faltas`}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

interface RosterViewProps {
  slug: string;
  sectionId: string;
  day: string;
  label: string;
  onBack: () => void;
}

// The register of one section on one day: the gate fills most of it; the tutor (or the office) corrects and closes
const RosterView = ({ slug, sectionId, day, label, onBack }: RosterViewProps): JSX.Element => {
  const { data, error, reload } = useAcademicData(`att-roster:${slug}:${sectionId}:${day}`, () => getRosterAction(slug, sectionId, day), isAttendanceEvent);
  const [drafts, setDrafts] = useState<Record<string, MarkDraft>>({});
  const [isPending, startTransition] = useTransition();
  const changed = Object.keys(drafts).length;

  const save = (): void =>
    startTransition(async () => {
      const result = await markStudentsAction(slug, sectionId, day, Object.values(drafts));
      if (!result.ok) {
        sileo.error({ title: 'No se pudo guardar', description: result.message });
        return;
      }
      sileo.success({ title: changed === 1 ? '1 cambio guardado' : `${changed} cambios guardados` });
      setDrafts({});
      reload();
    });

  const close = (): void =>
    startTransition(async () => {
      if (changed > 0) {
        const saved = await markStudentsAction(slug, sectionId, day, Object.values(drafts));
        if (!saved.ok) {
          sileo.error({ title: 'No se pudo guardar', description: saved.message });
          return;
        }
      }
      const result = await closeDayAction(slug, day, sectionId);
      if (!result.ok) {
        sileo.error({ title: 'No se pudo cerrar', description: result.message });
        return;
      }
      sileo.success({ title: result.data === 0 ? 'Todos ya tenían marca' : `Se marcaron ${result.data} faltas` });
      setDrafts({});
      reload();
    });

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <button type="button" className="btn-alt" onClick={onBack}>
        <MorphIcon icon={ArrowLeft} size={16} />
        Todas las secciones
      </button>
      <h2 className="text-lg font-semibold text-foreground">{label}</h2>
    </div>
  );
  if (error) return <div className="space-y-4">{header}<LoadError message={error} onRetry={reload} /></div>;
  if (!data) return <div className="space-y-4">{header}<PageSkeleton /></div>;

  const status = (id: string, current: string): string => drafts[id]?.status ?? current;
  const unmarked = data.rows.filter((r) => !status(r.studentId, r.status)).length;
  const set = (id: string, patch: Partial<MarkDraft>, row: { status: string; note: string }): void =>
    setDrafts((c) => {
      const next = { personId: id, status: c[id]?.status ?? row.status, note: c[id]?.note ?? row.note, ...patch };
      if (next.status === row.status && next.note === row.note) {
        const rest = { ...c };
        delete rest[id];
        return rest;
      }
      return { ...c, [id]: next };
    });

  return (
    <div className="space-y-4">
      {header}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <MorphIcon icon={Clock} size={16} />
          {data.lateAfter ? `Desde las ${data.lateAfter} cuenta como tardanza.` : 'Sin horario de clases para este turno.'}
          {!data.canEdit && ' Solo lectura: marca su tutor(a) o la oficina.'}
        </span>
        <TallyLine tally={data.section?.tally} unmarked={unmarked} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="w-12 px-4 py-3 font-medium whitespace-nowrap">N.°</th>
              <th scope="col" className="px-4 py-3 font-medium">Estudiante</th>
              <th scope="col" className="px-4 py-3 font-medium">Marca</th>
              <th scope="col" className="px-4 py-3 font-medium">Llegada</th>
              <th scope="col" className="px-4 py-3 font-medium">Observación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.rows.map((r, i) => {
              const draft = drafts[r.studentId];
              return (
                <tr key={r.studentId} className={cn(draft && 'bg-brand/5')}>
                  <td className="px-4 py-2.5 text-muted-foreground tabular-nums">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <span className="block font-medium text-foreground">{r.name}</span>
                    <span className="flex items-center gap-2 text-xs text-muted-foreground tabular-nums">
                      {r.code}
                      {r.pendingJustification && (
                        <span className="inline-flex items-center gap-1 text-warning">
                          <MorphIcon icon={FileClock} size={12} />
                          Justificación por revisar
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <MarkPicker label={`Marca de ${r.name}`} value={status(r.studentId, r.status)} disabled={!data.canEdit || isPending} onChange={(s): void => set(r.studentId, { status: s }, r)} />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">
                    {r.arrivedAt ? formatClock(r.arrivedAt) : '—'}
                    {r.source && !draft && <span className="block">{sourceLabels[r.source] ?? r.source}</span>}
                    {draft && <span className="block text-brand">Sin guardar: {markLabels[draft.status]}</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    {data.canEdit ? (
                      <Input aria-label={`Observación de ${r.name}`} value={draft?.note ?? r.note} maxLength={300} onChange={(e): void => set(r.studentId, { note: e.target.value }, r)} className="h-9 min-w-40" placeholder="Opcional" />
                    ) : (
                      <span className="text-xs text-muted-foreground">{r.note || '—'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.rows.length === 0 && <p className="px-6 py-10 text-center text-sm text-muted-foreground">No hay estudiantes matriculados en esta sección.</p>}
      </div>
      {data.canEdit && data.schoolDay && (
        <div className="sticky bottom-4 flex flex-wrap justify-end gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-sm backdrop-blur">
          {changed > 0 && (
            <button type="button" className="btn-alt" disabled={isPending} onClick={(): void => setDrafts({})}>
              Descartar
            </button>
          )}
          {unmarked > 0 && (
            <button type="button" className="btn-alt" disabled={isPending} onClick={close}>
              <MorphIcon icon={Lock} size={16} />
              Cerrar: {unmarked} sin marcar quedan como falta
            </button>
          )}
          <button type="button" className="btn-brand" disabled={isPending || changed === 0} onClick={save}>
            {isPending && <MorphIcon icon={LoaderCircle} size={16} className="animate-spin" />}
            {changed > 0 ? `Guardar ${changed} ${changed === 1 ? 'cambio' : 'cambios'}` : 'Sin cambios'}
          </button>
        </div>
      )}
    </div>
  );
};
