'use client';

import { useMemo, useState, useTransition, type ChangeEvent, type JSX } from 'react';
import { Download, FileUp, Upload } from 'lucide';
import { sileo } from 'sileo';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { cn } from '@/lib/utils';
import type { ImportRollResponse, ImportRow } from '@/lib/api/grpc/gen/joseph/people/v1/people';
import { importRollAction } from '../actions/import-roll';
import { importColumns, importStatusClass, importStatusLabels, parseCsv, readSheet, templateCsv } from '../data/import-data';
import { usePeopleContext } from '../hooks/use-people-context';

const download = (name: string, text: string): void => {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Loading the real roll from a spreadsheet: the file is read in the browser, the API checks every row with the rules
// of enrolling by hand and reconciles the totals per section, and only a clean check can be imported
export const ImportRollPage = (): JSX.Element => {
  const { data: ctx, error, isLoading, reload, slug } = usePeopleContext();
  const [periodId, setPeriodId] = useState('');
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [missing, setMissing] = useState<string[]>([]);
  const [report, setReport] = useState<ImportRollResponse | null>(null);
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [isPending, start] = useTransition();
  const period = periodId || ctx?.periods.find((p) => p.status === 'active')?.id || ctx?.periods[0]?.id || '';
  const shown = useMemo(() => (report?.rows ?? []).filter((r) => !onlyErrors || r.status === 'error'), [report, onlyErrors]);

  const check = (list: ImportRow[], commit: boolean): void =>
    start(async () => {
      const r = commit ? await runAcademicAction(importRollAction(slug, period, list, true)) : await importRollAction(slug, period, list, false);
      if (!r.ok) {
        if (!commit) sileo.error({ title: 'No se pudo revisar el archivo', description: r.message });
        return;
      }
      setReport(r.data);
      if (commit) reload();
    });

  const onFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!/\.csv$/i.test(file.name)) {
      sileo.error({ title: 'Usa un archivo CSV', description: 'En Excel: Archivo › Guardar como › CSV UTF-8 (delimitado por comas).' });
      return;
    }
    void file.text().then((text) => {
      const sheet = readSheet(parseCsv(text));
      setFileName(file.name);
      setRows(sheet.rows);
      setMissing(sheet.missing);
      setReport(null);
      if (sheet.missing.length === 0 && sheet.rows.length > 0 && sheet.rows.length <= 2000) check(sheet.rows, false);
    });
  };

  return (
    <AcademicPage
      wide
      titleId="import-title"
      title="Importar nómina"
      description="Carga los estudiantes reales del periodo desde una hoja de cálculo. Cada fila se revisa con las mismas reglas que la matrícula manual (edad mínima, forma autorizada, vacantes) y se concilian los totales por sección antes de importar."
      context={ctx ? ctx.context : null}
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !ctx ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-72">
              <label htmlFor="import-period" className="mb-1.5 block text-sm font-medium text-foreground">
                Periodo
              </label>
              <SelectField id="import-period" value={period} options={ctx.periods.map((p) => ({ value: p.id, label: p.name }))} onChange={(v): void => (setPeriodId(v), setReport(null))} />
            </div>
            <label className={cn('btn-brand cursor-pointer', isPending && 'pointer-events-none opacity-60')}>
              <MorphIcon icon={FileUp} size={16} />
              {fileName ? 'Elegir otro archivo' : 'Elegir archivo CSV'}
              <input type="file" accept=".csv,text/csv" className="sr-only" onChange={onFile} />
            </label>
            <button type="button" className="btn-alt" onClick={(): void => download('plantilla-nomina.csv', templateCsv())}>
              <MorphIcon icon={Download} size={16} />
              Plantilla
            </button>
          </div>

          <details className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">Qué columnas lleva el archivo</summary>
            <p className="mt-2">
              Una fila por estudiante. Obligatorias: {importColumns.filter((c) => c.required).map((c) => c.header).join(', ')}. Opcionales: {importColumns.filter((c) => !c.required).map((c) => c.header).join(', ')}. Sexo: M (mujer) o H (hombre), como en el SIAGIE. Fecha: dd/mm/aaaa. Situación: nuevo, promovido, trasladado (con procedencia) o reentrante. Un estudiante que ya existe (por su documento) se matricula sin duplicarse. La nómina exportada desde «Nómina y SIAGIE» sirve como archivo.
            </p>
          </details>

          {fileName && missing.length > 0 && (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              A «{fileName}» le faltan columnas obligatorias: {missing.join(', ')}. Descarga la plantilla para ver los nombres.
            </p>
          )}
          {fileName && missing.length === 0 && rows.length > 2000 && <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">El archivo tiene {rows.length} filas: importa hasta 2000 por vez.</p>}
          {isPending && !report && <p className="text-sm text-muted-foreground">Revisando {rows.length} filas…</p>}

          {report && (
            <>
              <dl className="grid gap-3 sm:grid-cols-4">
                {[
                  ['Filas del archivo', report.total],
                  [report.committed ? 'Matriculados' : 'Listas para importar', report.committed ? report.enrolled : report.ready],
                  ['Ya matriculados', report.skipped],
                  ['Con error', report.errors],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-border bg-background p-4">
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className={cn('mt-1 text-2xl font-semibold tabular-nums', label === 'Con error' && Number(value) > 0 ? 'text-destructive' : 'text-foreground')}>{value}</dd>
                  </div>
                ))}
              </dl>

              <section aria-labelledby="import-sections" className="space-y-2">
                <h2 id="import-sections" className="text-sm font-semibold text-foreground">
                  Conciliación por sección · el periodo pasa de {report.periodBefore} a {report.periodAfter} matriculados
                </h2>
                <div className="overflow-x-auto rounded-2xl border border-border bg-background">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th scope="col" className="px-3 py-2.5 font-medium">Sección</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-medium">Antes</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-medium">Del archivo</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-medium">{report.committed ? 'Ahora' : 'Después'}</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-medium">Vacantes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border tabular-nums">
                      {report.sections.map((s) => (
                        <tr key={s.sectionId}>
                          <td className="px-3 py-2 text-foreground">{s.label}</td>
                          <td className="px-3 py-2 text-right">{s.before}</td>
                          <td className="px-3 py-2 text-right">+{s.incoming}</td>
                          <td className="px-3 py-2 text-right font-medium text-foreground">{s.after}</td>
                          <td className="px-3 py-2 text-right text-muted-foreground">{s.capacity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section aria-labelledby="import-rows" className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="import-rows" className="text-sm font-semibold text-foreground">
                    Filas
                  </h2>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input type="checkbox" className="size-4 accent-brand" checked={onlyErrors} onChange={(e): void => setOnlyErrors(e.target.checked)} />
                    Solo con error
                  </label>
                </div>
                <div className="max-h-[32rem] overflow-auto rounded-2xl border border-border bg-background">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-background">
                      <tr className="border-b border-border text-muted-foreground">
                        <th scope="col" className="w-14 px-3 py-2.5 font-medium">Fila</th>
                        <th scope="col" className="px-3 py-2.5 font-medium">Estudiante</th>
                        <th scope="col" className="px-3 py-2.5 font-medium">Sección</th>
                        <th scope="col" className="px-3 py-2.5 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {shown.map((r) => (
                        <tr key={r.line}>
                          <td className="px-3 py-2 text-muted-foreground tabular-nums">{r.line}</td>
                          <td className="px-3 py-2 text-foreground">{r.studentName}</td>
                          <td className="px-3 py-2 text-muted-foreground">{r.placement || '—'}</td>
                          <td className="px-3 py-2">
                            <span className={cn('pill', importStatusClass[r.status])}>{importStatusLabels[r.status] ?? r.status}</span>
                            {r.message && <span className="ml-2 text-xs text-muted-foreground">{r.message}</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {!report.committed && (
                <div className="flex flex-wrap items-center justify-end gap-3">
                  {report.errors > 0 && <p className="text-sm text-destructive">Corrige las {report.errors} filas con error en el archivo y vuelve a elegirlo.</p>}
                  <button type="button" className="btn-brand" disabled={isPending || report.errors > 0 || report.ready === 0} onClick={(): void => check(rows, true)}>
                    <MorphIcon icon={Upload} size={16} />
                    {isPending ? 'Importando…' : `Importar ${report.ready} ${report.ready === 1 ? 'estudiante' : 'estudiantes'}`}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </AcademicPage>
  );
};
