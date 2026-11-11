'use client';

import type { JSX } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { achievementLabel, enrollmentKindLabels, num, pct, slot } from '../data/reports-data';
import type { Board } from '../types';
import { ChartCard } from './report-ui';

// Matrícula: students against the seats of each level or grade, how they came, and the occupancy of the period
export const EnrollmentSection = ({ board, canExport }: { board: Board; canExport: boolean }): JSX.Element => {
  const e = board.enrollment;
  const enrolled = (e?.active ?? 0) + (e?.completed ?? 0);
  const occupancy = e?.capacity ? Math.min(100, (enrolled * 100) / e.capacity) : 0;
  const groups = e?.groups ?? [];
  const groupConfig = { active: slot(1, 'Matriculados'), capacity: slot(3, 'Vacantes') } satisfies ChartConfig;
  const kinds = (['new', 'continuing', 'transferIn', 'reEntry'] as const).map((k) => ({ kind: k, value: e?.[k] ?? 0, fill: `var(--color-${k})` })).filter((k) => k.value > 0);
  const kindConfig = Object.fromEntries((['new', 'continuing', 'transferIn', 'reEntry'] as const).map((k, i) => [k, slot(i, enrollmentKindLabels[k] ?? k)])) satisfies ChartConfig;
  return (
    <div className="grid items-start gap-4 lg:grid-cols-3">
      <ChartCard
        className="lg:col-span-2"
        title={board.levelId ? 'Matriculados y vacantes por grado' : 'Matriculados y vacantes por nivel'}
        description="Estudiantes que siguen matriculados (o terminaron) frente a la capacidad de las secciones"
        file="matricula-por-grupo"
        canExport={canExport}
        table={{ columns: ['Grupo', 'Matriculados', 'Vacantes', 'Ocupación (%)'], rows: groups.map((g) => [g.label, g.active, g.capacity, g.capacity ? Number(((g.active * 100) / g.capacity).toFixed(1)) : 0]) }}
      >
        <ChartContainer config={groupConfig} className="aspect-auto w-full" style={{ height: Math.max(200, groups.length * 52 + 56) }}>
          <BarChart data={groups} layout="vertical" margin={{ left: 4, right: 40 }} barGap={2}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={96} />
            <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent />} />
            <Bar dataKey="active" fill="var(--color-active)" radius={4}>
              <LabelList dataKey="active" position="right" className="fill-foreground" fontSize={11} />
            </Bar>
            <Bar dataKey="capacity" fill="var(--color-capacity)" radius={4} />
            <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
          </BarChart>
        </ChartContainer>
      </ChartCard>

      <div className="grid gap-4">
        <ChartCard title="Ocupación" description={`${num(enrolled)} de ${num(e?.capacity)} vacantes`} file="ocupacion" canExport={canExport} table={{ columns: ['Matriculados', 'Vacantes', 'Ocupación (%)'], rows: [[enrolled, e?.capacity ?? 0, Number(occupancy.toFixed(1))]] }}>
          <ChartContainer config={{ value: slot(1, 'Ocupación') }} className="mx-auto aspect-square max-h-44">
            <RadialBarChart data={[{ value: occupancy, fill: 'var(--color-value)' }]} innerRadius="74%" outerRadius="100%" startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" background cornerRadius={8} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-semibold">
                {pct(occupancy, 0)}
              </text>
            </RadialBarChart>
          </ChartContainer>
        </ChartCard>
        <ChartCard
          title="Cómo llegaron"
          description={`${num(e?.withdrawn)} retiros y ${num(e?.transferred)} traslados en el periodo`}
          file="tipo-de-matricula"
          canExport={canExport}
          table={{ columns: ['Tipo', 'Estudiantes'], rows: kinds.map((k) => [enrollmentKindLabels[k.kind] ?? k.kind, k.value]) }}
        >
          <ChartContainer config={kindConfig} className="mx-auto aspect-square max-h-52">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="kind" hideLabel />} />
              <Pie data={kinds} dataKey="value" nameKey="kind" innerRadius="55%" strokeWidth={2} stroke="var(--background)">
                {kinds.map((k) => (
                  <Cell key={k.kind} fill={k.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="kind" />} className="flex-wrap gap-2" />
            </PieChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  );
};

// Comparativo: the rates of every period side by side (same unit, one axis), and the table with the change
export const CompareSection = ({ board, canExport }: { board: Board; canExport: boolean }): JSX.Element => {
  const scoreScale = board.scale === 'score';
  const rows = board.compare.map((k) => ({ name: k.name, students: k.students, attendance: k.attendance < 0 ? null : k.attendance, achievement: k.achievement < 0 ? null : k.achievement, collection: k.collection < 0 ? null : k.collection, current: k.periodId === board.period?.id }));
  const config = {
    attendance: slot(1, 'Asistencia'),
    ...(!scoreScale && board.academic ? { achievement: slot(2, achievementLabel[board.scale] ?? 'Logro') } : {}),
    collection: slot(0, 'Cobranza al día'),
  } as ChartConfig;
  const keys = (Object.keys(config) as Array<'attendance' | 'achievement' | 'collection'>).filter((k) => board.academic || k === 'collection');
  const delta = (i: number, k: 'attendance' | 'achievement' | 'collection'): string => {
    const a = rows[i]?.[k];
    const b = rows[i - 1]?.[k];
    if (i === 0 || a == null || b == null) return '';
    const d = a - b;
    return `${d >= 0 ? '+' : '−'}${Math.abs(d).toLocaleString('es-PE', { maximumFractionDigits: 1 })}`;
  };
  return (
    <div className="grid gap-4">
      <ChartCard
        title="Comparativo entre periodos"
        description="Asistencia (presentes y tardanzas), logro y la parte pagada de lo que ya venció, en cada periodo"
        file="comparativo-periodos"
        canExport={canExport}
        table={{
          columns: ['Periodo', 'Estudiantes', ...keys.map((k) => `${String(config[k]?.label)} (%)`), ...(scoreScale && board.academic ? ['Puntaje promedio'] : [])],
          rows: board.compare.map((k) => [k.name, k.students, ...keys.map((x) => (k[x] < 0 ? '—' : Number(k[x].toFixed(1)))), ...(scoreScale && board.academic ? [k.achievement < 0 ? '—' : Number(k.achievement.toFixed(1))] : [])]),
        }}
      >
        <ChartContainer config={config} className="aspect-auto h-72 w-full">
          <BarChart data={rows} margin={{ left: 0, right: 8, top: 24 }} barGap={4} barCategoryGap="22%">
            <CartesianGrid vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={44} tickFormatter={(v: number): string => `${v} %`} />
            <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent formatter={(v, n): string => `${String(config[n as string]?.label)}: ${pct(Number(v))}`} />} />
            {keys.map((k) => (
              <Bar key={k} dataKey={k} fill={`var(--color-${k})`} radius={[4, 4, 0, 0]}>
                <LabelList dataKey={k} position="top" className="fill-foreground" fontSize={10} formatter={(v: unknown): string => (v == null ? '' : pct(Number(v), 0))} />
              </Bar>
            ))}
            <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
          </BarChart>
        </ChartContainer>
      </ChartCard>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <caption className="sr-only">Indicadores por periodo y cambio frente al anterior</caption>
          <thead className="bg-secondary text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">
                Periodo
              </th>
              <th scope="col" className="px-4 py-2 text-right font-medium">
                Estudiantes
              </th>
              {keys.map((k) => (
                <th key={k} scope="col" className="px-4 py-2 text-right font-medium">
                  {String(config[k]?.label)}
                </th>
              ))}
              {scoreScale && board.academic && (
                <th scope="col" className="px-4 py-2 text-right font-medium">
                  Puntaje promedio
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => (
              <tr key={r.name} className={cn(r.current && 'bg-brand-soft/40')}>
                <th scope="row" className="px-4 py-2 text-left font-medium text-foreground">
                  {r.name}
                  {r.current && <span className="ml-2 text-xs font-normal text-muted-foreground">(en pantalla)</span>}
                </th>
                <td className="px-4 py-2 text-right tabular-nums">{num(r.students)}</td>
                {keys.map((k) => (
                  <td key={k} className="px-4 py-2 text-right tabular-nums">
                    {r[k] == null ? '—' : pct(r[k])}
                    {delta(i, k) && <span className="ml-1.5 text-xs text-muted-foreground">{delta(i, k)}</span>}
                  </td>
                ))}
                {scoreScale && board.academic && <td className="px-4 py-2 text-right tabular-nums">{board.compare[i] && board.compare[i].achievement >= 0 ? num(board.compare[i].achievement, 1) : '—'}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
