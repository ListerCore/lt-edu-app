'use client';

import type { JSX } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { monthLabel } from '@/features/protected/finance/data/finance-data';
import { attendanceConfig, attendanceRate, num, pct, share, slot, totalOf } from '../data/reports-data';
import type { Board } from '../types';
import { ChartCard, Segmented } from './report-ui';

export type Range = '7' | '30' | '90' | 'all';

const rangeOptions: Array<[Range, string]> = [
  ['7', '7 días'],
  ['30', '30 días'],
  ['90', '90 días'],
  ['all', 'Todo el periodo'],
];

// Asistencia: who missed or came late each school day of the range, the rate by level or grade and by term
export const AttendanceSection = ({ board, range, onRange, canExport }: { board: Board; range: Range; onRange: (r: Range) => void; canExport: boolean }): JSX.Element => {
  const days = board.attendanceDays.map((d) => ({ day: d.day, late: d.counts?.late ?? 0, justified: d.counts?.justified ?? 0, absent: d.counts?.absent ?? 0, present: d.counts?.present ?? 0 }));
  const groups = board.attendanceGroups.map((g) => ({ label: g.label, absent: share((g.counts?.absent ?? 0) + (g.counts?.justified ?? 0), g.counts), late: share(g.counts?.late ?? 0, g.counts), marks: totalOf(g.counts) }));
  const timeline = board.attendanceTimeline.map((t) => ({ label: /^\d{4}-\d{2}$/.test(t.label) ? monthLabel(t.label) : t.label, rate: attendanceRate(t.counts), marks: totalOf(t.counts) }));
  const rates = timeline.map((t) => t.rate).filter((r) => r >= 0);
  const floor = rates.length ? Math.max(0, Math.floor(Math.min(...rates) - 2)) : 0;
  const groupConfig = { absent: { ...attendanceConfig.absent, label: 'Faltas (incluye justificadas)' }, late: { ...attendanceConfig.late, label: 'Tardanzas' } };
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        className="lg:col-span-2"
        title="Faltas y tardanzas por día"
        description={`${formatDay(board.from, false)} al ${formatDay(board.to)} · estudiantes que no llegaron a tiempo cada día de clases`}
        file="asistencia-diaria"
        canExport={canExport}
        action={<Segmented label="Rango" value={range} options={rangeOptions} onChange={onRange} />}
        table={{ columns: ['Día', 'Asistió', 'Tardanza', 'Falta justificada', 'Falta', 'Asistencia (%)'], rows: days.map((d) => [d.day, d.present, d.late, d.justified, d.absent, Number(attendanceRate(d).toFixed(1))]) }}
      >
        <ChartContainer config={attendanceConfig} className="aspect-auto h-72 w-full">
          <AreaChart data={days} margin={{ left: 0, right: 8, top: 8 }}>
            <defs>
              {(['late', 'justified', 'absent'] as const).map((k) => (
                <linearGradient key={k} id={`fill-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${k})`} stopOpacity={0.7} />
                  <stop offset="95%" stopColor={`var(--color-${k})`} stopOpacity={0.12} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={(v: string): string => formatDay(v, false)} />
            <YAxis tickLine={false} axisLine={false} width={40} allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(_, p): string => {
                    const d = p?.[0]?.payload as (typeof days)[number] | undefined;
                    return d ? `${formatDay(d.day)} · asistencia ${pct(attendanceRate(d))}` : '';
                  }}
                />
              }
            />
            {(['absent', 'justified', 'late'] as const).map((k) => (
              <Area key={k} dataKey={k} type="monotone" stackId="a" fill={`url(#fill-${k})`} stroke={`var(--color-${k})`} strokeWidth={2} />
            ))}
            <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
          </AreaChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        title={board.levelId ? 'Inasistencia por grado' : 'Inasistencia por nivel'}
        description="Porcentaje de los días marcados en el rango"
        file="inasistencia-por-grupo"
        canExport={canExport}
        table={{ columns: ['Grupo', 'Faltas (%)', 'Tardanzas (%)', 'Marcas'], rows: groups.map((g) => [g.label, Number(g.absent.toFixed(1)), Number(g.late.toFixed(1)), g.marks]) }}
      >
        <ChartContainer config={groupConfig} className="aspect-auto w-full" style={{ height: Math.max(180, groups.length * 52 + 40) }}>
          <BarChart data={groups} layout="vertical" margin={{ left: 4, right: 40 }} barGap={2}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={96} />
            <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v: number): string => `${v} %`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(v, name): string => `${groupConfig[name as keyof typeof groupConfig]?.label}: ${pct(Number(v))}`} />} />
            <Bar dataKey="absent" fill="var(--color-absent)" radius={4}>
              <LabelList dataKey="absent" position="right" className="fill-foreground" fontSize={11} formatter={(v: unknown): string => pct(Number(v))} />
            </Bar>
            <Bar dataKey="late" fill="var(--color-late)" radius={4} />
            <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
          </BarChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        title={board.period?.termScheme === 'none' ? 'Asistencia por mes' : 'Asistencia por periodo de evaluación'}
        description="Todo el periodo hasta hoy, para comparar los tramos del año"
        file="asistencia-por-tramo"
        canExport={canExport}
        table={{ columns: ['Tramo', 'Asistencia (%)', 'Marcas'], rows: timeline.map((t) => [t.label, Number(t.rate.toFixed(1)), t.marks]) }}
      >
        <ChartContainer config={{ rate: slot(1, 'Asistencia') }} className="aspect-auto h-64 w-full">
          <LineChart data={timeline} margin={{ left: 0, right: 24, top: 24 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[floor, 100]} tickLine={false} axisLine={false} width={52} tickFormatter={(v: number): string => `${v} %`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(v): string => `Asistencia: ${pct(Number(v))}`} />} />
            <Line dataKey="rate" type="monotone" stroke="var(--color-rate)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-rate)' }} activeDot={{ r: 6 }}>
              <LabelList dataKey="rate" position="top" offset={10} className="fill-foreground" fontSize={11} formatter={(v: unknown): string => pct(Number(v))} />
            </Line>
          </LineChart>
        </ChartContainer>
        <p className="mt-2 text-xs text-muted-foreground">El eje empieza en {num(floor)} % para que se noten las diferencias.</p>
      </ChartCard>
    </div>
  );
};
