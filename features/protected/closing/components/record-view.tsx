import type { JSX } from 'react';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { cn } from '@/lib/utils';
import type { RecordData } from '../types';

const cellTone: Record<string, string> = { AD: 'text-success font-semibold', A: 'text-success', B: 'text-warning', C: 'text-destructive font-semibold', EXO: 'text-muted-foreground text-[9px]' };
const situationTone = (s: string): string => (/^(PRO|Aprobado)/.test(s) ? 'text-success' : /^(PER|Desaprobado|Inhabilitado)/.test(s) ? 'text-destructive' : 'text-warning');

// An issued acta, as frozen when it was issued: header, the register (one column per competency or evaluation),
// summary, legend and signatures. Prints in landscape
export const RecordView = ({ data }: { data: RecordData }): JSX.Element => {
  const { record, content: c } = data;
  const columns = c.groups.flatMap((g) => g.columns);
  const grades = c.rows.some((r) => r.grade);
  return (
    <article data-print-card className="acta-sheet rounded-2xl border border-border bg-background p-6 print:rounded-none print:border-0 print:p-0">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-brand pb-3">
        <div>
          <p className="text-sm font-semibold text-brand">{c.institution}</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{c.title}</h2>
          <p className="text-sm text-muted-foreground">
            {c.period} · {c.section} · {c.level}
            {c.subject && ` · ${c.subject}`}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold text-foreground tabular-nums">{record.code}</p>
          <p className="text-muted-foreground">Emitida el {formatDay(c.issuedOn)}</p>
          {record.status === 'replaced' && <p className="pill mt-1 bg-destructive/12 text-destructive">Reemplazada por una emisión posterior</p>}
        </div>
      </header>
      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
        {c.tutor && (
          <div>
            <dt className="inline">Tutor(a): </dt>
            <dd className="inline text-foreground">{c.tutor}</dd>
          </div>
        )}
        {c.teacher && (
          <div>
            <dt className="inline">Docente: </dt>
            <dd className="inline text-foreground">{c.teacher}</dd>
          </div>
        )}
        {c.rule && (
          <div>
            <dt className="inline">Regla aplicada: </dt>
            <dd className="inline text-foreground">{c.rule}</dd>
          </div>
        )}
      </dl>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-[11px] print:text-[8px]">
          <thead>
            <tr className="text-muted-foreground">
              <th rowSpan={2} scope="col" className="border border-border px-1.5 py-1 text-center font-medium whitespace-nowrap">N.°</th>
              <th rowSpan={2} scope="col" className="border border-border px-1.5 py-1 text-left font-medium">Código</th>
              {grades && <th rowSpan={2} scope="col" className="border border-border px-1.5 py-1 text-center font-medium">Grado</th>}
              <th rowSpan={2} scope="col" className="min-w-44 border border-border px-1.5 py-1 text-left font-medium">Apellidos y nombres</th>
              {c.groups.map((g) => (
                <th key={g.name} colSpan={g.columns.length} scope="colgroup" className="border border-border px-1 py-1 text-center font-medium text-foreground">
                  {g.name}
                </th>
              ))}
              <th rowSpan={2} scope="col" className="border border-border px-1.5 py-1 text-center font-medium">Situación</th>
            </tr>
            <tr className="text-muted-foreground">
              {columns.map((col, i) => (
                <th key={`${col.code}-${i}`} scope="col" title={col.name} className="border border-border px-1 py-1 text-center font-normal tabular-nums">
                  {col.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.n} className="break-inside-avoid">
                <td className="border border-border px-1.5 py-1 text-center tabular-nums">{r.n}</td>
                <td className="border border-border px-1.5 py-1 whitespace-nowrap tabular-nums">{r.code}</td>
                {grades && <td className="border border-border px-1.5 py-1 text-center whitespace-nowrap">{r.grade}</td>}
                <td className="border border-border px-1.5 py-1 text-foreground">
                  {r.name}
                  {r.note && <span className="block text-[10px] text-muted-foreground print:text-[7px]">{r.note}</span>}
                </td>
                {r.cells.map((cell, i) => (
                  <td key={i} className={cn('border border-border px-1 py-1 text-center tabular-nums', cellTone[cell])}>
                    {cell}
                  </td>
                ))}
                <td className={cn('border border-border px-1.5 py-1 text-center font-semibold', situationTone(r.situation))}>{r.situation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 grid gap-4 text-xs md:grid-cols-[1fr_auto] print:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <details className="print:hidden">
            <summary className="cursor-pointer text-muted-foreground">Qué es cada columna</summary>
            <ol className="mt-2 grid gap-1 sm:grid-cols-2">
              {columns.map((col, i) => (
                <li key={`${col.code}-${i}`}>
                  <span className="font-semibold tabular-nums">{col.code}</span> {col.name}
                </li>
              ))}
            </ol>
          </details>
          <p className="text-muted-foreground">{c.legend.join(' · ')}</p>
        </div>
        {c.summary && c.summary.length > 0 && (
          <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 rounded-lg border border-border p-3">
            {c.summary.map((s) => (
              <div key={s.label} className="contents">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="text-right font-semibold tabular-nums">{s.count}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <footer className="mt-12 grid grid-cols-2 gap-16 text-center text-xs text-muted-foreground">
        {c.signatures.map((s) => (
          <div key={s} className="border-t border-foreground pt-2">
            {s}
          </div>
        ))}
      </footer>
    </article>
  );
};
