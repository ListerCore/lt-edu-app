'use client';

import type { JSX } from 'react';
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Label, LabelList, Line, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { methodLabels, monthLabel, soles } from '@/features/protected/finance/data/finance-data';
import { debtConfig, num, pct, slot, solesShort } from '../data/reports-data';
import type { Board } from '../types';
import { ChartCard } from './report-ui';

const toSoles = (cents: number): number => Math.round(cents) / 100;

// Cobranza: month by month what fell due against what is paid, how families pay, how old the debt is, and each
// level's or grade's collection
export const FinanceSection = ({ board, canExport }: { board: Board; canExport: boolean }): JSX.Element => {
  const monthConfig = { expected: slot(1, 'Venció en el mes'), collected: slot(2, 'Pagado de lo vencido'), received: slot(0, 'Ingresó en el mes') } satisfies ChartConfig;
  const months = board.months.map((m) => ({ month: m.month, expected: m.expected, collected: m.collected, received: m.received }));
  // Methods keep one slot each by their fixed order, so a method keeps its color whatever the others do
  const methodOrder = Object.keys(methodLabels);
  const methodConfig = Object.fromEntries(methodOrder.map((k, i) => [k, slot(i, methodLabels[k] ?? k)])) satisfies ChartConfig;
  const methods = board.methods.map((m) => ({ method: m.method, amount: m.amount, count: m.count, fill: `var(--color-${m.method})` }));
  const received = methods.reduce((n, m) => n + m.amount, 0);
  const groups = board.financeGroups.map((g) => ({ label: g.label, collected: g.collected, overdue: g.overdue, upcoming: Math.max(0, g.expected - g.collected - g.overdue), debtors: g.debtors, expected: g.expected }));
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <ChartCard
        className="lg:col-span-3"
        title="Cobranza mes a mes"
        description="Lo que venció cada mes (neto de descuentos), cuánto de eso ya está pagado y lo que ingresó en caja ese mes"
        file="cobranza-mensual"
        canExport={canExport}
        table={{ columns: ['Mes', 'Venció (S/)', 'Pagado de lo vencido (S/)', 'Ingresó (S/)'], rows: months.map((m) => [m.month, toSoles(m.expected), toSoles(m.collected), toSoles(m.received)]) }}
      >
        <ChartContainer config={monthConfig} className="aspect-auto h-72 w-full">
          <ComposedChart data={months} margin={{ left: 8, right: 8, top: 8 }}>
            <defs>
              {(['expected', 'collected'] as const).map((k) => (
                <linearGradient key={k} id={`fill-m-${k}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${k})`} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={`var(--color-${k})`} stopOpacity={0.06} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={monthLabel} />
            <YAxis tickLine={false} axisLine={false} width={64} tickFormatter={solesShort} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" labelFormatter={(v): string => monthLabel(String(v))} formatter={(v, n): string => `${monthConfig[n as keyof typeof monthConfig]?.label}: ${soles(Number(v))}`} />}
            />
            <Area dataKey="expected" type="monotone" fill="url(#fill-m-expected)" stroke="var(--color-expected)" strokeWidth={2} />
            <Area dataKey="collected" type="monotone" fill="url(#fill-m-collected)" stroke="var(--color-collected)" strokeWidth={2} />
            <Line dataKey="received" type="monotone" stroke="var(--color-received)" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3, fill: 'var(--color-received)' }} />
            <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
          </ComposedChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        title="Medios de pago"
        description="Lo cobrado del periodo, por medio"
        file="medios-de-pago"
        canExport={canExport}
        table={{ columns: ['Medio', 'Monto (S/)', 'Pagos', 'Parte (%)'], rows: methods.map((m) => [methodLabels[m.method] ?? m.method, toSoles(m.amount), m.count, Number(((m.amount * 100) / (received || 1)).toFixed(1))]) }}
      >
        <ChartContainer config={methodConfig} className="mx-auto aspect-square max-h-72">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="method" hideLabel formatter={(v, _n, item): string => `${methodLabels[(item.payload as { method: string }).method]}: ${soles(Number(v))} · ${pct((Number(v) * 100) / (received || 1))}`} />} />
            <Pie data={methods} dataKey="amount" nameKey="method" innerRadius="58%" strokeWidth={2} stroke="var(--background)">
              {methods.map((m) => (
                <Cell key={m.method} fill={m.fill} />
              ))}
              <Label
                content={({ viewBox }): JSX.Element | null =>
                  viewBox && 'cx' in viewBox ? (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-lg font-semibold">
                        {solesShort(received)}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground text-xs">
                        {num(methods.reduce((n, m) => n + m.count, 0))} pagos
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="method" />} className="flex-wrap gap-2" />
          </PieChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        title="Antigüedad de la deuda"
        description="Lo vencido sin pagar, por días desde que venció"
        file="antiguedad-deuda"
        canExport={canExport}
        table={{ columns: ['Antigüedad', 'Monto (S/)', 'Estudiantes'], rows: board.aging.map((a) => [a.label, toSoles(a.amount), a.students]) }}
      >
        <ChartContainer config={{ amount: debtConfig.overdue }} className="aspect-auto h-64 w-full">
          <BarChart data={board.aging} margin={{ left: 8, right: 8, top: 24 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={10} interval={0} />
            <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={solesShort} />
            <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent formatter={(v, _n, item): string => `${soles(Number(v))} · ${num((item.payload as { students: number }).students)} estudiantes`} />} />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="students" position="top" className="fill-muted-foreground" fontSize={11} formatter={(v: unknown): string => num(Number(v))} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        title={board.levelId ? 'Cobranza por grado' : 'Cobranza por nivel'}
        description="Cobrado, vencido sin pagar y por vencer"
        file="cobranza-por-grupo"
        canExport={canExport}
        table={{ columns: ['Grupo', 'Total (S/)', 'Cobrado (S/)', 'Vencido (S/)', 'Por vencer (S/)', 'Con deuda vencida'], rows: groups.map((g) => [g.label, toSoles(g.expected), toSoles(g.collected), toSoles(g.overdue), toSoles(g.upcoming), g.debtors]) }}
      >
        <ChartContainer config={debtConfig} className="aspect-auto w-full" style={{ height: Math.max(200, groups.length * 44 + 56) }}>
          <BarChart data={groups} layout="vertical" margin={{ left: 4, right: 20 }}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={80} />
            <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={solesShort} />
            <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent formatter={(v, n): string => `${debtConfig[n as keyof typeof debtConfig]?.label}: ${soles(Number(v))}`} />} />
            <Bar dataKey="collected" stackId="d" fill="var(--color-collected)" stroke="var(--background)" strokeWidth={2} radius={[4, 0, 0, 4]} />
            <Bar dataKey="overdue" stackId="d" fill="var(--color-overdue)" stroke="var(--background)" strokeWidth={2} />
            <Bar dataKey="upcoming" stackId="d" fill="var(--color-upcoming)" stroke="var(--background)" strokeWidth={2} radius={[0, 4, 4, 0]} />
            <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
          </BarChart>
        </ChartContainer>
      </ChartCard>
    </div>
  );
};
