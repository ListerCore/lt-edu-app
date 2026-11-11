'use client';

import { useState, useTransition, type JSX } from 'react';
import { Clock, LoaderCircle, Lock } from 'lucide';
import { sileo } from 'sileo';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { useToday } from '@/features/protected/academic/hooks/use-today';
import { isAttendanceEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { closeStaffDayAction, getStaffDayAction, markStaffAction } from '../actions/attendance-actions';
import { formatClock, markLabels, sourceLabels } from '../data/attendance-data';
import type { MarkDraft, Tally } from '../types';
import { DayPicker, Empty, MarkPicker, TallyBar, TallyLine } from './attendance-ui';

// Asistencia del personal: who of the staff came (their own card at the gate), corrected by hand and closed at the end
export const StaffAttendancePage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const today = useToday();
  const [day, setDay] = useState('');
  const current = day || today;
  const { data, error, reload } = useAcademicData(`att-staff:${slug}:${current}`, () => getStaffDayAction(slug, current), isAttendanceEvent);
  const [drafts, setDrafts] = useState<Record<string, MarkDraft>>({});
  const [isPending, startTransition] = useTransition();
  const changed = Object.keys(drafts).length;

  const changeDay = (d: string): void => {
    setDrafts({});
    setDay(d);
  };

  const run = (work: () => Promise<boolean>): void =>
    startTransition(async () => {
      if (await work()) {
        setDrafts({});
        reload();
      }
    });

  const save = (): void =>
    run(async () => {
      const result = await markStaffAction(slug, data?.day ?? current, Object.values(drafts));
      if (!result.ok) sileo.error({ title: 'No se pudo guardar', description: result.message });
      else sileo.success({ title: changed === 1 ? '1 cambio guardado' : `${changed} cambios guardados` });
      return result.ok;
    });

  const close = (): void =>
    run(async () => {
      if (changed > 0) {
        const saved = await markStaffAction(slug, data?.day ?? current, Object.values(drafts));
        if (!saved.ok) {
          sileo.error({ title: 'No se pudo guardar', description: saved.message });
          return false;
        }
      }
      const result = await closeStaffDayAction(slug, data?.day ?? current);
      if (!result.ok) sileo.error({ title: 'No se pudo cerrar', description: result.message });
      else sileo.success({ title: result.data === 0 ? 'Todos ya tenían marca' : `${result.data} sin marca quedaron con falta` });
      return result.ok;
    });

  const status = (id: string, s: string): string => drafts[id]?.status ?? s;
  const tally: Tally = { present: 0, late: 0, absent: 0, justified: 0 };
  let unmarked = 0;
  for (const r of data?.rows ?? []) {
    const s = status(r.staffId, r.status);
    if (s === 'present' || s === 'late' || s === 'absent' || s === 'justified') tally[s] += 1;
    else unmarked += 1;
  }
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
    <AcademicPage wide titleId="staff-att-title" title="Asistencia del personal" description="Docentes y personal registran su llegada con su carnet en la puerta; aquí se corrige y se cierra el día." context={null}>
      <div className="space-y-6">
        <DayPicker day={data?.day ?? current} today={today} onChange={changeDay} />
        {error ? (
          <LoadError message={error} onRetry={reload} />
        ) : !data ? (
          <PageSkeleton />
        ) : !data.schoolDay ? (
          <Empty>Este día no hay clases según la configuración de la institución.</Empty>
        ) : (
          <>
            <div className="space-y-3 rounded-2xl border border-border bg-background p-5">
              <p className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                {tally.present + tally.late}
                <span className="text-lg font-normal text-muted-foreground"> de {data.rows.length} llegaron</span>
              </p>
              <TallyBar tally={tally} total={data.rows.length} className="h-3" />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <TallyLine tally={tally} unmarked={unmarked} />
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MorphIcon icon={Clock} size={14} />
                  {data.lateAfter ? `Tardanza desde las ${data.lateAfter}` : 'Sin horario de clases'}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-border bg-background">
              <table className="w-full min-w-[46rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th scope="col" className="px-4 py-3 font-medium">Persona</th>
                    <th scope="col" className="px-4 py-3 font-medium">Marca</th>
                    <th scope="col" className="px-4 py-3 font-medium">Llegada</th>
                    <th scope="col" className="px-4 py-3 font-medium">Observación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.rows.map((r) => {
                    const draft = drafts[r.staffId];
                    return (
                      <tr key={r.staffId} className={cn(draft && 'bg-brand/5')}>
                        <td className="px-4 py-2.5">
                          <span className="block font-medium text-foreground">{r.name}</span>
                          <span className="block text-xs text-muted-foreground">{r.position}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <MarkPicker label={`Marca de ${r.name}`} value={status(r.staffId, r.status)} disabled={isPending} onChange={(s): void => set(r.staffId, { status: s }, r)} />
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground tabular-nums">
                          {r.arrivedAt ? formatClock(r.arrivedAt) : '—'}
                          {draft ? <span className="block text-brand">Sin guardar: {markLabels[draft.status]}</span> : r.source && <span className="block">{sourceLabels[r.source] ?? r.source}</span>}
                        </td>
                        <td className="px-4 py-2.5">
                          <Input aria-label={`Observación de ${r.name}`} value={draft?.note ?? r.note} maxLength={300} onChange={(e): void => set(r.staffId, { note: e.target.value }, r)} className="h-9 min-w-40" placeholder="Opcional" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="sticky bottom-4 flex flex-wrap justify-end gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-sm backdrop-blur">
              {changed > 0 && (
                <button type="button" className="btn-alt" disabled={isPending} onClick={(): void => setDrafts({})}>
                  Descartar
                </button>
              )}
              {unmarked > 0 && (
                <button type="button" className="btn-alt" disabled={isPending} onClick={close}>
                  <MorphIcon icon={Lock} size={16} />
                  Cerrar: {unmarked} sin marcar quedan con falta
                </button>
              )}
              <button type="button" className="btn-brand" disabled={isPending || changed === 0} onClick={save}>
                {isPending && <MorphIcon icon={LoaderCircle} size={16} className="animate-spin" />}
                {changed > 0 ? `Guardar ${changed} ${changed === 1 ? 'cambio' : 'cambios'}` : 'Sin cambios'}
              </button>
            </div>
          </>
        )}
      </div>
    </AcademicPage>
  );
};
