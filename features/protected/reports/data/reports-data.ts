import type { ChartConfig } from '@/components/ui/chart';
import type { StatusCount } from '../types';

// Chart colors, checked with the dataviz validator against the light (#ffffff) and dark (#211a16) surfaces.
// Categorical slots go in this fixed order and are never cycled
const cat = [
  { light: '#eb6834', dark: '#d95926' },
  { light: '#2a78d6', dark: '#3987e5' },
  { light: '#1baf7a', dark: '#199e70' },
  { light: '#eda100', dark: '#c98500' },
  { light: '#e87ba4', dark: '#d55181' },
  { light: '#008300', dark: '#008300' },
];

// AD/A/B/C as two arms: blue for the expected achievement, orange for "in process" and "starting"
const levelColors = {
  ad: { light: '#1c5cab', dark: '#2464b8' },
  a: { light: '#6da7ec', dark: '#5598e0' },
  b: { light: '#ec9a6a', dark: '#d6744a' },
  c: { light: '#c2410c', dark: '#ad3b0b' },
};

export const levelConfig = {
  ad: { label: 'AD destacado', theme: levelColors.ad },
  a: { label: 'A esperado', theme: levelColors.a },
  b: { label: 'B en proceso', theme: levelColors.b },
  c: { label: 'C en inicio', theme: levelColors.c },
} satisfies ChartConfig;

export const attendanceConfig = {
  present: { label: 'Asistió', theme: { light: '#2a78d6', dark: '#3987e5' } },
  late: { label: 'Tardanza', theme: { light: '#eda100', dark: '#c98500' } },
  justified: { label: 'Falta justificada', theme: { light: '#6250d6', dark: '#9085e9' } },
  absent: { label: 'Falta', theme: { light: '#e34948', dark: '#e66767' } },
} satisfies ChartConfig;

// One series in categorical slot n (0-based)
export const slot = (n: number, label: string): ChartConfig[string] => ({ label, theme: cat[n % cat.length] });

// Collection by group: paid in blue, not due yet in light orange, overdue in dark orange
export const debtConfig = {
  collected: { label: 'Cobrado', theme: levelColors.ad },
  upcoming: { label: 'Por vencer', theme: levelColors.b },
  overdue: { label: 'Vencido', theme: levelColors.c },
} satisfies ChartConfig;

// "94,1 %" (es-PE); "—" when there is no data (the API sends -1)
export const pct = (v: number | undefined, digits = 1): string =>
  v === undefined || v < 0 || Number.isNaN(v) ? '—' : `${v.toLocaleString('es-PE', { minimumFractionDigits: digits, maximumFractionDigits: digits })} %`;

// "1 234" (es-PE)
export const num = (v: number | undefined, digits = 0): string => (v ?? 0).toLocaleString('es-PE', { minimumFractionDigits: digits, maximumFractionDigits: digits });

// Short soles for chart axes: "S/ 12 k", "S/ 1,2 M"
export const solesShort = (cents: number): string => {
  const v = cents / 100;
  if (Math.abs(v) >= 1_000_000) return `S/ ${(v / 1_000_000).toLocaleString('es-PE', { maximumFractionDigits: 1 })} M`;
  if (Math.abs(v) >= 1_000) return `S/ ${Math.round(v / 1_000).toLocaleString('es-PE')} k`;
  return `S/ ${Math.round(v).toLocaleString('es-PE')}`;
};

// Marks counted in a tally
export const totalOf = (c?: StatusCount): number => (c ? c.present + c.late + c.absent + c.justified : 0);

// Share of marks where the student came (on time or late); -1 without marks
export const attendanceRate = (c?: StatusCount): number => {
  const t = totalOf(c);
  return c && t ? ((c.present + c.late) * 100) / t : -1;
};

// Share of one status among the marks
export const share = (part: number, c?: StatusCount): number => {
  const t = totalOf(c);
  return t ? (part * 100) / t : 0;
};

// Share of AD and A among the levels of a mix (the "achievement" the comparison uses)
export const achieved = (m: { ad: number; a: number; count: number }): number => (m.count ? ((m.ad + m.a) * 100) / m.count : -1);

// What the scale calls achievement, for titles and the comparison
export const achievementLabel: Record<string, string> = {
  literal: 'Logro esperado o destacado (AD + A)',
  vigesimal: 'Unidades aprobadas',
  score: 'Puntaje promedio de simulacros',
};

export const enrollmentKindLabels: Record<string, string> = { new: 'Nuevos', continuing: 'Continúan', transferIn: 'Por traslado', reEntry: 'Reingresan' };

// Builds a CSV (semicolon-separated, with BOM so Excel reads tildes) and hands it to the browser
export const downloadCsv = (name: string, columns: string[], rows: Array<Array<string | number>>): void => {
  const cell = (v: string | number): string => {
    const s = typeof v === 'number' ? v.toLocaleString('es-PE', { useGrouping: false, maximumFractionDigits: 2 }) : v;
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const text = [columns, ...rows].map((r) => r.map(cell).join(';')).join('\n');
  const url = URL.createObjectURL(new Blob([`﻿${text}`], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
