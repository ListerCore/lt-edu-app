'use client';

import type { JSX } from 'react';
import { ArrowLeft, BookOpen, BookOpenCheck, ChartColumnStacked, ClipboardList, GraduationCap, Layers, Scale, Target } from 'lucide';
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ReferenceLine, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { MorphIcon } from '@/components/ui/morph-icon';
import { achieved, debtConfig, levelConfig, num, pct, slot } from '../data/reports-data';
import type { Board, ResultMix } from '../types';
import { ChartCard, type ReportTable } from './report-ui';

const levelKeys = ['ad', 'a', 'b', 'c'] as const;

// AD/A/B/C as shares of each row, so groups of different size compare
const asShares = (list: ResultMix[]): Array<Record<string, string | number>> =>
  list.map((m) => ({ label: m.label, count: m.count, ...Object.fromEntries(levelKeys.map((k) => [k, m.count ? (m[k] * 100) / m.count : 0])) }));

const levelTable = (first: string, list: ResultMix[]): ReportTable => ({
  columns: [first, 'AD', 'A', 'B', 'C', 'Calificaciones', 'AD + A (%)'],
  rows: list.map((m) => [m.label, m.ad, m.a, m.b, m.c, m.count, Number(achieved(m).toFixed(1))]),
});

// Tooltip line of one level: its share and how many marks it is
const levelFormatter = (v: unknown, name: unknown, item: { payload?: Record<string, number> }): string => {
  const key = name as (typeof levelKeys)[number];
  const n = item.payload?.count ? Math.round((Number(v) * item.payload.count) / 100) : 0;
  return `${levelConfig[key]?.label}: ${pct(Number(v))} (${num(n)})`;
};

// A horizontal 100 % stacked bar of AD/A/B/C, one row per label; clicking a row can drill into it
const LevelBars = ({ list, onPick, labelWidth = 120 }: { list: ResultMix[]; onPick?: (label: string) => void; labelWidth?: number }): JSX.Element => (
  <ChartContainer config={levelConfig} className="aspect-auto w-full" style={{ height: Math.max(160, list.length * 40 + 56) }}>
    <BarChart data={asShares(list)} layout="vertical" margin={{ left: 4, right: 8 }} barCategoryGap={6}>
      <CartesianGrid horizontal={false} />
      <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={labelWidth} tickFormatter={(v: string): string => (v.length > 26 ? `${v.slice(0, 25)}…` : v)} />
      <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tickFormatter={(v: number): string => `${v} %`} />
      <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent formatter={levelFormatter} />} />
      {levelKeys.map((k, i) => (
        <Bar
          key={k}
          dataKey={k}
          stackId="l"
          fill={`var(--color-${k})`}
          stroke="var(--card)"
          strokeWidth={2}
          radius={i === 0 ? [4, 0, 0, 4] : i === 3 ? [0, 4, 4, 0] : 0}
          className={onPick ? 'cursor-pointer' : undefined}
          onClick={onPick ? (d: { payload?: { label?: string } }): void => {
            if (d.payload?.label) onPick(d.payload.label);
          } : undefined}
        />
      ))}
      <ChartLegend content={<ChartLegendContent />} itemSorter={(p): number => levelKeys.indexOf(p.dataKey as (typeof levelKeys)[number])} />
    </BarChart>
  </ChartContainer>
);

// Rendimiento: by competency levels in Educación Básica, by unit averages in institutes, by mock exams in academies
export const PerformanceSection = ({ board, onSubject, canExport }: { board: Board; onSubject: (s: string) => void; canExport: boolean }): JSX.Element => {
  if (board.scale === 'vigesimal') return <VigesimalView board={board} canExport={canExport} />;
  if (board.scale === 'score') return <ScoreView board={board} canExport={canExport} />;
  const group = board.levelId ? 'grado' : 'nivel';
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        icon={ChartColumnStacked}
        title="Niveles de logro por periodo"
        description="Todas las competencias calificadas en cada tramo del año"
        file="logro-por-periodo"
        canExport={canExport}
        table={levelTable('Periodo', board.resultTerms)}
      >
        <ChartContainer config={levelConfig} className="aspect-auto h-72 w-full">
          <BarChart data={asShares(board.resultTerms)} margin={{ left: 0, right: 8, top: 8 }} barCategoryGap="24%">
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={44} tickFormatter={(v: number): string => `${v} %`} />
            <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent formatter={levelFormatter} />} />
            {[...levelKeys].reverse().map((k, i) => (
              <Bar key={k} dataKey={k} stackId="l" fill={`var(--color-${k})`} stroke="var(--card)" strokeWidth={2} radius={i === 3 ? [4, 4, 0, 0] : i === 0 ? [0, 0, 4, 4] : 0} />
            ))}
            <ChartLegend content={<ChartLegendContent />} itemSorter={(p): number => levelKeys.indexOf(p.dataKey as (typeof levelKeys)[number])} />
          </BarChart>
        </ChartContainer>
      </ChartCard>

      <ChartCard
        icon={Layers} title={`Niveles de logro por ${group}`} description="Acumulado del año" file={`logro-por-${group}`} canExport={canExport} table={levelTable(group === 'nivel' ? 'Nivel' : 'Grado', board.resultGroups)}>
        <LevelBars list={board.resultGroups} labelWidth={96} />
      </ChartCard>

      <ChartCard
        icon={BookOpen}
        className="lg:col-span-2"
        title={board.subject ? `Competencias de ${board.subject}` : 'Niveles de logro por área'}
        description={board.subject ? 'Acumulado del año en cada competencia del área' : 'Elige un área para verla por competencias'}
        file={board.subject ? `competencias-${board.subject}` : 'logro-por-area'}
        canExport={canExport}
        action={
          board.subject ? (
            <button type="button" className="btn-alt h-8 px-2.5 text-xs" onClick={(): void => onSubject('')}>
              <MorphIcon icon={ArrowLeft} size={14} />
              Todas las áreas
            </button>
          ) : undefined
        }
        table={levelTable(board.subject ? 'Competencia' : 'Área', board.resultSubjects)}
      >
        <LevelBars list={board.resultSubjects} onPick={board.subject ? undefined : onSubject} labelWidth={board.subject ? 220 : 180} />
        {!board.subject && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Ver un área por competencias">
            {board.resultSubjects.map((s) => (
              <li key={s.label}>
                <button type="button" className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-brand hover:text-foreground" onClick={(): void => onSubject(s.label)}>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </ChartCard>

      {board.conductTerms.length > 0 && (
        <ChartCard
        icon={Scale}
          className="lg:col-span-2"
          title="Nota de conducta"
          description="Promedio de cada periodo; por debajo de 11 desaprueba (DS 021-2026-MINEDU)"
          file="conducta-por-periodo"
          canExport={canExport}
          table={{ columns: ['Periodo', 'Promedio', 'Aprobados', 'Bajo 11', 'Notas'], rows: board.conductTerms.map((c) => [c.label, Number(c.average.toFixed(1)), c.approved, c.failed, c.count]) }}
        >
          <ChartContainer config={{ average: slot(1, 'Promedio de conducta') }} className="aspect-auto h-56 w-full">
            <LineChart data={board.conductTerms} margin={{ left: 0, right: 24, top: 24 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis domain={[0, 20]} ticks={[0, 5, 11, 15, 20]} tickLine={false} axisLine={false} width={32} />
              <ReferenceLine y={11} stroke="var(--muted-foreground)" strokeDasharray="4 4" label={{ value: 'Aprobatoria: 11', position: 'insideBottomRight', fontSize: 11, fill: 'var(--muted-foreground)' }} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent formatter={(v, _n, item): string => `Promedio ${num(Number(v), 1)} · ${num((item.payload as ResultMix).failed)} bajo 11 de ${num((item.payload as ResultMix).count)}`} />}
              />
              <Line dataKey="average" type="monotone" isAnimationActive={false} stroke="var(--color-average)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-average)' }}>
                <LabelList dataKey="average" position="top" offset={10} className="fill-foreground" fontSize={11} formatter={(v: unknown): string => num(Number(v), 1)} />
              </Line>
            </LineChart>
          </ChartContainer>
        </ChartCard>
      )}
    </div>
  );
};

// Institutes: each student's weighted average by unit (0–20) against the passing grade
const VigesimalView = ({ board, canExport }: { board: Board; canExport: boolean }): JSX.Element => {
  const groups = board.resultGroups.map((g) => ({ label: g.label, collected: g.count ? (g.approved * 100) / g.count : 0, overdue: g.count ? (g.failed * 100) / g.count : 0, count: g.count }));
  const passConfig = { collected: { ...debtConfig.collected, label: 'Aprueban' }, overdue: { ...debtConfig.overdue, label: 'Desaprueban' } };
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <ChartCard
        icon={BookOpenCheck}
        className="lg:col-span-3"
        title="Promedio por unidad didáctica"
        description={`Promedio ponderado de cada estudiante en la unidad; aprueba con ${board.passing}`}
        file="promedio-por-unidad"
        canExport={canExport}
        table={{ columns: ['Unidad', 'Promedio', 'Mejor', 'Aprueban', 'Desaprueban'], rows: board.resultSubjects.map((m) => [m.label, Number(m.average.toFixed(1)), Number(m.max.toFixed(1)), m.approved, m.failed]) }}
      >
        <ChartContainer config={{ average: slot(1, 'Promedio') }} className="aspect-auto w-full" style={{ height: Math.max(200, board.resultSubjects.length * 30 + 40) }}>
          <BarChart data={board.resultSubjects} layout="vertical" margin={{ left: 4, right: 36 }}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={210} tickFormatter={(v: string): string => (v.length > 32 ? `${v.slice(0, 31)}…` : v)} />
            <XAxis type="number" domain={[0, 20]} ticks={[0, 5, 10, board.passing, 20]} tickLine={false} axisLine={false} />
            <ReferenceLine x={board.passing} stroke="var(--muted-foreground)" strokeDasharray="4 4" />
            <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent formatter={(v, _n, item): string => `Promedio ${num(Number(v), 1)} · ${num((item.payload as ResultMix).failed)} desaprueban de ${num((item.payload as ResultMix).count)}`} />} />
            <Bar dataKey="average" fill="var(--color-average)" radius={4}>
              <LabelList dataKey="average" position="right" className="fill-foreground" fontSize={11} formatter={(v: unknown): string => num(Number(v), 1)} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </ChartCard>
      <ChartCard
        icon={GraduationCap}
        className="lg:col-span-2"
        title={board.levelId ? 'Aprobados por semestre' : 'Aprobados por programa'}
        description="Unidades con promedio aprobatorio, por estudiante"
        file="aprobados-por-grupo"
        canExport={canExport}
        table={{ columns: ['Grupo', 'Aprueban', 'Desaprueban', 'Promedio'], rows: board.resultGroups.map((g) => [g.label, g.approved, g.failed, Number(g.average.toFixed(1))]) }}
      >
        <ChartContainer config={passConfig} className="aspect-auto w-full" style={{ height: Math.max(180, groups.length * 44 + 56) }}>
          <BarChart data={groups} layout="vertical" margin={{ left: 4, right: 8 }}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={120} tickFormatter={(v: string): string => (v.length > 18 ? `${v.slice(0, 17)}…` : v)} />
            <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tickFormatter={(v: number): string => `${v} %`} />
            <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent formatter={(v, n): string => `${passConfig[n as keyof typeof passConfig]?.label}: ${pct(Number(v))}`} />} />
            <Bar dataKey="collected" stackId="p" fill="var(--color-collected)" stroke="var(--card)" strokeWidth={2} radius={[4, 0, 0, 4]} />
            <Bar dataKey="overdue" stackId="p" fill="var(--color-overdue)" stroke="var(--card)" strokeWidth={2} radius={[0, 4, 4, 0]} />
            <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
          </BarChart>
        </ChartContainer>
      </ChartCard>
    </div>
  );
};

// Academies: the average and best score of each mock exam, and the share of right answers by course
const ScoreView = ({ board, canExport }: { board: Board; canExport: boolean }): JSX.Element => {
  const config = { average: slot(1, 'Promedio'), max: slot(0, 'Mejor puntaje') };
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard
        icon={ClipboardList}
        title="Puntaje de los simulacros"
        description="Promedio y mejor puntaje de cada simulacro publicado"
        file="simulacros"
        canExport={canExport}
        table={{ columns: ['Simulacro', 'Promedio', 'Mejor', 'Hojas'], rows: board.resultTerms.map((m) => [m.label, Number(m.average.toFixed(1)), Number(m.max.toFixed(1)), m.count]) }}
      >
        <ChartContainer config={config} className="aspect-auto h-72 w-full">
          <LineChart data={board.resultTerms} margin={{ left: 0, right: 24, top: 16 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v: string): string => (v.length > 14 ? `${v.slice(0, 13)}…` : v)} />
            <YAxis tickLine={false} axisLine={false} width={48} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent formatter={(v, n): string => `${config[n as keyof typeof config]?.label}: ${num(Number(v), 1)}`} />} />
            <Line dataKey="max" type="monotone" stroke="var(--color-max)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-max)' }} />
            <Line dataKey="average" type="monotone" stroke="var(--color-average)" strokeWidth={2} dot={{ r: 4, fill: 'var(--color-average)' }} />
            <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
          </LineChart>
        </ChartContainer>
      </ChartCard>
      <ChartCard
        icon={Target}
        title="Aciertos por curso"
        description="Porcentaje de respuestas correctas en todos los simulacros"
        file="aciertos-por-curso"
        canExport={canExport}
        table={{ columns: ['Curso', 'Aciertos (%)'], rows: board.resultSubjects.map((m) => [m.label, Number(m.average.toFixed(1))]) }}
      >
        <ChartContainer config={{ average: slot(2, 'Aciertos') }} className="aspect-auto w-full" style={{ height: Math.max(200, board.resultSubjects.length * 26 + 40) }}>
          <BarChart data={board.resultSubjects} layout="vertical" margin={{ left: 4, right: 44 }}>
            <CartesianGrid horizontal={false} />
            <YAxis dataKey="label" type="category" tickLine={false} axisLine={false} width={170} />
            <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tickFormatter={(v: number): string => `${v} %`} />
            <ChartTooltip cursor={{ fillOpacity: 0.4 }} content={<ChartTooltipContent formatter={(v): string => `Aciertos: ${pct(Number(v))}`} />} />
            <Bar dataKey="average" fill="var(--color-average)" radius={4}>
              <LabelList dataKey="average" position="right" className="fill-foreground" fontSize={11} formatter={(v: unknown): string => pct(Number(v), 0)} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </ChartCard>
    </div>
  );
};
