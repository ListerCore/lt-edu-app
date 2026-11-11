'use client';

import { useState, type JSX, type ReactNode } from 'react';
import { ChartColumn, Download, Table2 } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { downloadCsv } from '../data/reports-data';

export type ReportTable = { columns: string[]; rows: Array<Array<string | number>> };

// A chart with its table view: the table carries the exact values (the relief for colors under 3:1 and for screen
// readers) and the CSV export of what the chart shows
export const ChartCard = ({
  title,
  description,
  table,
  file,
  action,
  canExport,
  className,
  children,
}: {
  title: string;
  description?: string;
  table: ReportTable;
  file: string;
  action?: ReactNode;
  canExport: boolean;
  className?: string;
  children: ReactNode;
}): JSX.Element => {
  const [asTable, setAsTable] = useState(false);
  const empty = table.rows.length === 0;
  return (
    <section className={cn('flex min-w-0 flex-col rounded-2xl border border-border bg-background p-4 md:p-5', className)}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {action}
          {!empty && (
            <button type="button" className="btn-alt h-8 px-2.5 text-xs" aria-pressed={asTable} onClick={(): void => setAsTable(!asTable)}>
              <MorphIcon icon={asTable ? ChartColumn : Table2} size={14} />
              {asTable ? 'Gráfico' : 'Tabla'}
            </button>
          )}
          {!empty && canExport && (
            <button type="button" className="btn-alt h-8 px-2.5 text-xs" onClick={(): void => downloadCsv(file, table.columns, table.rows)} aria-label={`Descargar ${title} en CSV`}>
              <MorphIcon icon={Download} size={14} />
              CSV
            </button>
          )}
        </div>
      </header>
      <div className="mt-4 min-w-0 flex-1">
        {empty ? (
          <p className="flex h-full min-h-40 items-center justify-center rounded-xl border border-dashed border-border px-6 text-center text-sm text-muted-foreground">Todavía no hay datos para este gráfico.</p>
        ) : asTable ? (
          <DataTable table={table} />
        ) : (
          children
        )}
      </div>
    </section>
  );
};

// The plain table behind a chart
const DataTable = ({ table }: { table: ReportTable }): JSX.Element => (
  <div className="max-h-96 overflow-auto rounded-xl border border-border">
    <table className="w-full text-sm">
      <thead className="sticky top-0 bg-secondary text-left text-xs text-muted-foreground">
        <tr>
          {table.columns.map((c, i) => (
            <th key={c} scope="col" className={cn('px-3 py-2 font-medium', i > 0 && 'text-right')}>
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {table.rows.map((r, i) => (
          <tr key={i}>
            {r.map((v, j) => (
              <td key={j} className={cn('px-3 py-1.5 text-foreground', j > 0 && 'text-right tabular-nums')}>
                {typeof v === 'number' ? v.toLocaleString('es-PE', { maximumFractionDigits: 1 }) : v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// One headline figure of the board, with its context line and, when there is a previous period, the change
export const Kpi = ({ label, value, hint, delta, invert }: { label: string; value: string; hint: string; delta?: number; invert?: boolean }): JSX.Element => {
  const show = delta !== undefined && Number.isFinite(delta) && Math.abs(delta) >= 0.05;
  const good = show && (invert ? delta < 0 : delta > 0);
  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-3.5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {show && (
          <span className={cn('mr-1.5 font-medium tabular-nums', good ? 'text-success' : 'text-destructive')}>
            {delta > 0 ? '▲' : '▼'} {Math.abs(delta).toLocaleString('es-PE', { maximumFractionDigits: 1 })} pts
          </span>
        )}
        {hint}
      </p>
    </div>
  );
};

// A row of segmented options (the range of the attendance chart, the views of the performance)
export const Segmented = <T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<[T, string]>; onChange: (v: T) => void }): JSX.Element => (
  <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg bg-secondary p-0.5">
    {options.map(([k, text]) => (
      <button
        key={k}
        type="button"
        role="radio"
        aria-checked={value === k}
        onClick={(): void => onChange(k)}
        className={cn('h-7 rounded-md px-2.5 text-xs font-medium', value === k ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
      >
        {text}
      </button>
    ))}
  </div>
);
