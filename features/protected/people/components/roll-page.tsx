'use client';

import Link from 'next/link';
import { useState, type JSX } from 'react';
import { CircleAlert, Download, FileSpreadsheet, FileText, RotateCcw, Send } from 'lucide';
import { Checkbox } from '@/components/ui/checkbox';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField, StatusPill } from '@/features/protected/academic/components/academic-ui';
import { usePdf } from '@/features/protected/documents/lib/use-pdf';
import { cn } from '@/lib/utils';
import { rollPdfAction } from '../actions/roll-pdf';
import { rollXlsxAction } from '../actions/roll-xlsx';
import { siagieClass, siagieLabels, siagieSituationLabels, studentPath } from '../data/people-data';
import { usePeopleContext } from '../hooks/use-people-context';
import { useRollPage } from '../hooks/use-roll-page';
import type { RollPageProps, RollRow } from '../types';
import { ExemptionDialog } from './exemption-dialog';
import { ObserveDialog } from './observe-dialog';
import { SiagieExportDialog } from './siagie-export-dialog';

// Nómina de matrícula y SIAGIE (EBA): who is enrolled where, their exemption from Educación Religiosa and whether
// their enrollment is loaded in the SIAGIE; the nómina prints as PDF or Excel and the SIAGIE spreadsheet downloads
export const RollPage = (): JSX.Element => {
  const { data: ctx, error, isLoading, reload, slug } = usePeopleContext();
  return (
    <AcademicPage
      titleId="roll-title"
      title="Nómina y SIAGIE"
      description="La nómina de matrícula por ciclo, grado y sección, la exoneración de Educación Religiosa y el estado de carga de cada matrícula en el SIAGIE."
      context={ctx ? { ...ctx.context, canManage: ctx.canManage } : null}
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !ctx ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : !ctx.context.usesAttentionModes ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">La nómina con exportación al SIAGIE está disponible para los CEBA.</p>
      ) : ctx.periods.length === 0 ? (
        <p className="text-sm text-muted-foreground">Primero crea un periodo promocional en la estructura académica.</p>
      ) : (
        <Roll ctx={ctx} slug={slug} />
      )}
    </AcademicPage>
  );
};

const Roll = ({ ctx, slug }: RollPageProps): JSX.Element => {
  const page = useRollPage(slug, ctx);
  const [exempting, setExempting] = useState<RollRow | null>(null);
  const [observing, setObserving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [isDownloading, download] = usePdf();
  const data = page.data;
  const rows = data?.rows ?? [];
  const canManage = Boolean(data?.canManage && ctx.canManage);
  const level = ctx.levels.find((l) => l.id === page.filter.levelId);
  const allOn = rows.length > 0 && page.selected.length === rows.length;
  const counters: Array<{ key: string; label: string; value: number }> = [
    { key: 'pending', label: 'Pendientes', value: data?.pending ?? 0 },
    { key: 'exported', label: 'Exportadas', value: data?.exported ?? 0 },
    { key: 'observed', label: 'Observadas', value: data?.observed ?? 0 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-60">
          <SelectField id="roll-period" value={page.filter.periodId} options={ctx.periods.map((p) => ({ value: p.id, label: p.name }))} onChange={(v): void => page.setFilter({ periodId: v })} />
        </div>
        <div className="w-48">
          <SelectField id="roll-level" value={page.filter.levelId} options={[{ value: '', label: 'Todos los ciclos' }, ...ctx.levels.map((l) => ({ value: l.id, label: l.name }))]} onChange={(v): void => page.setFilter({ levelId: v, gradeId: '', sectionId: '' })} />
        </div>
        {level && (
          <div className="w-40">
            <SelectField id="roll-grade" value={page.filter.gradeId} options={[{ value: '', label: 'Todos los grados' }, ...level.grades.map((g) => ({ value: g.id, label: g.name }))]} onChange={(v): void => page.setFilter({ gradeId: v, sectionId: '' })} />
          </div>
        )}
        {page.sections.length > 1 && (
          <div className="w-36">
            <SelectField id="roll-section" value={page.filter.sectionId} options={[{ value: '', label: 'Todas' }, ...page.sections]} onChange={(v): void => page.setFilter({ sectionId: v })} />
          </div>
        )}
        <div className="ml-auto flex flex-wrap gap-2">
          <button type="button" className="btn-alt" disabled={isDownloading || rows.length === 0} onClick={(): void => download(() => rollPdfAction(slug, page.filter))}>
            <MorphIcon icon={FileText} size={16} />
            Nómina PDF
          </button>
          <button type="button" className="btn-alt" disabled={isDownloading || rows.length === 0} onClick={(): void => download(() => rollXlsxAction(slug, page.filter))}>
            <MorphIcon icon={FileSpreadsheet} size={16} />
            Excel
          </button>
          <button type="button" className="btn-brand" disabled={rows.length === 0} onClick={(): void => setExporting(true)}>
            <MorphIcon icon={Download} size={16} />
            Planilla SIAGIE
          </button>
        </div>
      </div>

      <div role="group" aria-label="Estado de carga en el SIAGIE" className="flex flex-wrap items-center gap-2">
        {counters.map((c) => {
          const on = page.filter.siagieStatus === c.key;
          return (
            <button key={c.key} type="button" aria-pressed={on} onClick={(): void => page.setFilter({ siagieStatus: on ? '' : c.key })} className={cn('rounded-full border px-3 py-1 text-sm transition-colors', on ? 'border-brand bg-brand-soft text-brand' : 'border-border hover:border-brand/50')}>
              {c.label} <span className="font-semibold tabular-nums">{c.value}</span>
            </button>
          );
        })}
        <span className="text-sm text-muted-foreground">· {data?.exempt ?? 0} exonerados de Religión</span>
      </div>

      {canManage && page.selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-brand/30 bg-brand-soft/50 px-3 py-2 text-sm">
          <span className="font-medium text-foreground">{page.selected.length} seleccionadas</span>
          <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={page.isMarking} onClick={(): void => page.mark('exported')}>
            <MorphIcon icon={Send} size={13} />
            Marcar exportadas
          </button>
          <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setObserving(true)}>
            <MorphIcon icon={CircleAlert} size={13} />
            Observar
          </button>
          <button type="button" className="btn-alt h-8 px-3 text-xs" disabled={page.isMarking} onClick={(): void => page.mark('pending')}>
            <MorphIcon icon={RotateCcw} size={13} />
            Volver a pendiente
          </button>
        </div>
      )}

      {page.error ? (
        <LoadError message={page.error} onRetry={page.reload} />
      ) : page.isLoading && !data ? (
        <PageSkeleton />
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">No hay matrículas con este filtro.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[64rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                {canManage && (
                  <th scope="col" className="w-10 px-3 py-3">
                    <Checkbox aria-label="Seleccionar todas" checked={allOn} onCheckedChange={(c): void => page.toggleAll(c === true)} />
                  </th>
                )}
                <th scope="col" className="px-3 py-3 font-medium">N.°</th>
                <th scope="col" className="px-3 py-3 font-medium">Estudiante</th>
                <th scope="col" className="px-3 py-3 font-medium">Documento</th>
                <th scope="col" className="px-3 py-3 font-medium">Grado y sección</th>
                <th scope="col" className="px-3 py-3 font-medium">Situación</th>
                <th scope="col" className="px-3 py-3 font-medium">Religión</th>
                <th scope="col" className="px-3 py-3 font-medium">SIAGIE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r, i) => (
                <tr key={r.enrollmentId} className={cn(page.selected.includes(r.enrollmentId) && 'bg-brand-soft/30')}>
                  {canManage && (
                    <td className="px-3 py-2">
                      <Checkbox aria-label={`Seleccionar a ${r.studentName}`} checked={page.selected.includes(r.enrollmentId)} onCheckedChange={(c): void => page.toggle(r.enrollmentId, c === true)} />
                    </td>
                  )}
                  <td className="px-3 py-2 text-muted-foreground tabular-nums">{i + 1}</td>
                  <td className="px-3 py-2">
                    <Link href={studentPath(r.studentId)} className="font-medium text-foreground hover:text-brand">
                      {r.studentName}
                    </Link>
                    {r.placement && <span className="block text-xs text-muted-foreground">{r.placement}</span>}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground tabular-nums">{r.documentNumber}</td>
                  <td className="px-3 py-2 text-foreground">
                    {r.gradeName} {r.sectionName && `· ${r.sectionName}`}
                    <span className="block text-xs text-muted-foreground">{r.levelName}</span>
                  </td>
                  <td className="px-3 py-2 text-foreground">{siagieSituationLabels[r.kind]}</td>
                  <td className="px-3 py-2">
                    {canManage ? (
                      <button type="button" onClick={(): void => setExempting(r)} className={cn('rounded-md px-2 py-1 text-xs font-medium', r.religionExempt ? 'bg-brand-soft text-brand' : 'text-muted-foreground hover:bg-secondary')}>
                        {r.religionExempt ? 'Exonerado' : 'Cursa'}
                      </button>
                    ) : (
                      <span className="text-xs">{r.religionExempt ? 'Exonerado' : 'Cursa'}</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <StatusPill className={siagieClass[r.siagieStatus]}>{siagieLabels[r.siagieStatus]}</StatusPill>
                    {r.siagieNote && <span className="mt-1 block max-w-56 text-xs text-warning">{r.siagieNote}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {exempting && <ExemptionDialog slug={slug} row={exempting} onClose={(): void => setExempting(null)} onSaved={page.reload} />}
      {observing && <ObserveDialog slug={slug} enrollmentIds={page.selected} onClose={(): void => setObserving(false)} onSaved={(): void => { page.toggleAll(false); page.reload(); }} />}
      {exporting && <SiagieExportDialog slug={slug} filter={page.filter} pending={data?.pending ?? 0} canManage={canManage} onClose={(): void => setExporting(false)} onDone={page.reload} />}
    </div>
  );
};
