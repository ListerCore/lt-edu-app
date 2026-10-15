'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { Eye, FileSpreadsheet, FileText } from 'lucide-react';
import type { ReportRow } from '../data/reports-data';

const downloadCsv = (filename: string, content: string): void => {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const ReportsMatrix = ({ rows }: { rows: ReportRow[] }): JSX.Element => {
  const [selectedRow, setSelectedRow] = useState<ReportRow | null>(null);
  const total = rows.reduce((sum, row) => sum + row.students, 0);
  const atRisk = rows.reduce((sum, row) => sum + row.atRisk, 0);
  const weightedMean = (key: 'attendance' | 'achievement'): string => (total ? (rows.reduce((sum, row) => sum + row[key] * row.students, 0) / total).toFixed(1) : '0.0');

  return (
    <section aria-labelledby="reports-matrix-heading" className="min-w-0 overflow-hidden rounded-lg border border-border bg-card">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 p-4 sm:p-5">
        <div className="min-w-0">
          <h2 id="reports-matrix-heading" className="font-heading text-sm font-bold text-foreground">
            Matriz de consolidado por ciclos y grados
          </h2>
          <p className="mt-1 text-[9px] text-muted-foreground">Asistencia, rendimiento y estado de transmisión SIAGIE.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-[8px]">
          <span className="rounded bg-secondary/10 px-2 py-1 font-semibold text-secondary">{rows.filter(({ siagie }) => siagie === 'Cerrado').length} secciones transmitidas</span>
          <span className="rounded bg-accent px-2 py-1 font-semibold text-primary">{rows.filter(({ siagie }) => siagie === 'En proceso').length} en proceso</span>
        </div>
      </header>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-265 border-collapse text-left">
          <thead className="bg-muted/50 text-[8px] font-bold uppercase tracking-wide text-muted-foreground">
            <tr>
              {['Ciclo / grado', 'Secc.', 'Matrícula', 'Asistencia LMS', '% AD/A', '% B/C', 'En riesgo', 'Docente coordinador', 'SIAGIE', 'Ficha'].map((heading) => (
                <th key={heading} scope="col" className="px-3 py-3 first:pl-4">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.grade} className="hover:bg-muted/20">
                <th scope="row" className="max-w-44 px-3 py-3 pl-4">
                  <span className="block text-[9px] font-semibold text-foreground">
                    {row.level} · {row.grade}
                  </span>
                  <span className="mt-1 block text-[8px] font-normal text-muted-foreground">{row.track}</span>
                </th>
                <td className="px-3 py-3 text-[9px] text-muted-foreground">{row.sections}</td>
                <td className="whitespace-nowrap px-3 py-3 text-[9px] font-semibold text-foreground">{row.students} est.</td>
                <td className="px-3 py-3">
                  <span className="text-[9px] font-semibold text-secondary">{row.attendance}%</span>
                  <span className="mt-1 block text-[8px] text-muted-foreground">{row.hours} h/sem</span>
                </td>
                <td className="px-3 py-3 text-[9px] font-semibold text-secondary">
                  {row.achievement}% <span className="font-normal text-muted-foreground">({Math.round((row.students * row.achievement) / 100)})</span>
                </td>
                <td className="px-3 py-3 text-[9px] text-muted-foreground">{row.developing.toFixed(1)}%</td>
                <td className="px-3 py-3">
                  <span className={`rounded px-1.5 py-1 text-[8px] font-semibold ${row.atRisk >= 7 ? 'bg-destructive/10 text-destructive' : 'bg-accent text-primary'}`}>{row.atRisk} casos</span>
                </td>
                <td className="max-w-40 px-3 py-3">
                  <span className="block text-[9px] font-medium text-foreground">{row.coordinator}</span>
                  <span className="mt-0.5 block text-[8px] text-muted-foreground">{row.area}</span>
                </td>
                <td className="px-3 py-3">
                  <span className={`whitespace-nowrap rounded px-1.5 py-1 text-[8px] font-semibold ${row.siagie === 'Cerrado' ? 'bg-secondary/10 text-secondary' : 'bg-accent text-primary'}`}>{row.siagie}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button type="button" aria-label={`Descargar acta ${row.grade}`} onClick={(): void => window.print()} className="grid size-7 place-items-center rounded text-primary hover:bg-muted">
                      <FileText aria-hidden="true" className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Descargar consolidado ${row.grade}`}
                      onClick={(): void => downloadCsv(`sige-jl-${row.grade.replaceAll(' ', '-')}.csv`, `Ciclo,Grado,Secciones,Matrícula,Asistencia,Logro AD/A,En riesgo,SIAGIE\n${row.level},${row.grade},${row.sections},${row.students},${row.attendance}%,${row.achievement}%,${row.atRisk},${row.siagie}`)}
                      className="grid size-7 place-items-center rounded text-secondary hover:bg-muted"
                    >
                      <FileSpreadsheet aria-hidden="true" className="size-3.5" />
                    </button>
                    <button type="button" aria-label={`Ver ficha ${row.grade}`} onClick={(): void => setSelectedRow(row)} className="grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Eye aria-hidden="true" className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-xs text-muted-foreground">
                  No hay grados para los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-accent/50 text-[9px] font-bold text-foreground">
            <tr>
              <th scope="row" className="px-3 py-3 pl-4">
                Total institucional EBA
              </th>
              <td className="px-3 py-3">{rows.reduce((sum, row) => sum + Number(row.sections === 'Única' ? 1 : row.sections.split(',').length), 0)} secc.</td>
              <td className="px-3 py-3">{total} alumnos</td>
              <td className="px-3 py-3">{weightedMean('attendance')}%</td>
              <td className="px-3 py-3">{weightedMean('achievement')}%</td>
              <td className="px-3 py-3">{(100 - Number(weightedMean('achievement'))).toFixed(1)}%</td>
              <td className="px-3 py-3 text-destructive">{atRisk} alumnos</td>
              <td className="px-3 py-3">45 docentes</td>
              <td className="px-3 py-3">{rows.length ? Math.round((rows.filter(({ siagie }) => siagie === 'Cerrado').length / rows.length) * 100) : 0}% cerrado</td>
              <td className="px-3 py-3">—</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {selectedRow && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="report-row-heading" className="w-full max-w-md rounded-lg border border-border bg-card p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="report-row-heading" className="font-heading text-sm font-bold text-foreground">
                  Ficha de {selectedRow.level} · {selectedRow.grade}
                </h3>
                <p className="mt-1 text-[10px] text-muted-foreground">{selectedRow.track}</p>
              </div>
              <button type="button" onClick={(): void => setSelectedRow(null)} className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted">
                Cerrar
              </button>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                ['Matrícula', `${selectedRow.students} estudiantes`],
                ['Secciones', selectedRow.sections],
                ['Asistencia LMS', `${selectedRow.attendance}%`],
                ['Logro AD/A', `${selectedRow.achievement}%`],
                ['Estudiantes en riesgo', String(selectedRow.atRisk)],
                ['Estado SIAGIE', selectedRow.siagie],
                ['Coordinación', selectedRow.coordinator],
                ['Área', selectedRow.area],
              ].map(([term, value]) => (
                <div key={term} className="min-w-0 rounded-md bg-muted/50 p-3">
                  <dt className="text-[8px] text-muted-foreground">{term}</dt>
                  <dd className="mt-1 wrap-break-word text-[10px] font-semibold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}
    </section>
  );
};

export { ReportsMatrix };
