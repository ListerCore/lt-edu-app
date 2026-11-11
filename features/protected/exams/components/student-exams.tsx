'use client';

import { useState, type JSX } from 'react';
import { GraduationCap } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { cn } from '@/lib/utils';
import { formatScore } from '../data/exams-data';
import type { StudentExams, StudentMock } from '../types';

// Score over the mock exams: a line with a dot per exam (labels under each dot)
const Evolution = ({ mocks }: { mocks: StudentMock[] }): JSX.Element | null => {
  if (mocks.length < 2) return null;
  const w = 640;
  const h = 180;
  const pad = 32;
  const scores = mocks.map((m) => m.sheet?.score ?? 0);
  const top = Math.max(...scores);
  const low = Math.min(...scores);
  // Zoom on the range the scores move in, so progress shows
  const minV = Math.max(0, low - (top - low || top * 0.2) * 0.6);
  const maxV = top + (top - low || top * 0.2) * 0.3 || 1;
  const x = (i: number): number => pad + (i * (w - 2 * pad)) / (mocks.length - 1);
  const y = (v: number): number => h - pad - ((v - minV) / (maxV - minV || 1)) * (h - 2 * pad);
  const points = scores.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  return (
    <figure className="rounded-2xl border border-border bg-background p-4">
      <figcaption className="text-sm font-semibold text-foreground">Evolución del puntaje</figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 w-full" role="img" aria-label={`Puntajes: ${scores.map((s) => formatScore(s)).join(', ')}`}>
        <line x1={pad} x2={w - pad} y1={h - pad} y2={h - pad} className="stroke-border" />
        <polyline points={points} fill="none" className="stroke-brand" strokeWidth={2.5} strokeLinejoin="round" />
        {scores.map((v, i) => (
          <g key={mocks[i].mock?.id}>
            <circle cx={x(i)} cy={y(v)} r={4.5} className="fill-brand" />
            <text x={x(i)} y={y(v) - 10} textAnchor="middle" className="fill-foreground text-[11px] font-semibold tabular-nums">
              {Math.round(v)}
            </text>
            <text x={x(i)} y={h - pad + 16} textAnchor="middle" className="fill-muted-foreground text-[10px]">
              {formatDay(mocks[i].mock?.heldOn ?? '', false)}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
};

export const StudentExamsCard = ({ x }: { x: StudentExams }): JSX.Element => {
  const last = x.mocks[x.mocks.length - 1];
  const prev = x.mocks[x.mocks.length - 2];
  const delta = last && prev ? (last.sheet?.score ?? 0) - (prev.sheet?.score ?? 0) : null;
  return (
    <div className="space-y-5">
      {x.admissions.map((a) => (
        <p key={a.id} className="flex items-center gap-3 rounded-2xl border border-success/40 bg-success/8 px-4 py-3 text-sm text-foreground">
          <MorphIcon icon={GraduationCap} size={18} className="text-success" />
          Ingresó a {a.career} · {a.university} ({a.exam}
          {a.place ? `, puesto ${a.place}` : ''})
        </p>
      ))}
      {!last ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Aún no hay simulacros con resultados publicados.</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Último puntaje</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground tabular-nums">{formatScore(last.sheet?.score)}</p>
              {delta !== null && <p className={cn('text-xs tabular-nums', delta >= 0 ? 'text-success' : 'text-destructive')}>{delta >= 0 ? '+' : ''}{formatScore(delta)} respecto al anterior</p>}
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Puesto en su área</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                {last.sheet?.rankLevel}
                <span className="text-base font-normal text-muted-foreground"> de {last.inLevel}</span>
              </p>
              <p className="text-xs text-muted-foreground">{last.sheet?.levelName}</p>
            </div>
            <div className="rounded-2xl border border-border bg-background p-4">
              <p className="text-sm text-muted-foreground">Puesto general</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                {last.sheet?.rankAll}
                <span className="text-base font-normal text-muted-foreground"> de {last.takers}</span>
              </p>
              <p className="text-xs text-muted-foreground">En su aula: {last.sheet?.rankSection}.°</p>
            </div>
          </div>
          <Evolution mocks={x.mocks} />
          <section aria-label="Por curso en el último simulacro" className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Por curso · {last.mock?.name}</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {(last.mock?.courses ?? []).map((c) => {
                const s = last.sheet?.byCourse[c.code];
                const right = s?.right ?? 0;
                const pct = c.questions ? (right * 100) / c.questions : 0;
                return (
                  <li key={c.code} className="rounded-xl border border-border bg-background px-4 py-2.5">
                    <span className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-foreground">{c.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                        {right}/{c.questions} correctas
                      </span>
                    </span>
                    <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
                      <span className={cn('block h-full rounded-full', pct >= 60 ? 'bg-success' : pct >= 35 ? 'bg-warning' : 'bg-destructive')} style={{ width: `${pct}%` }} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
          <section aria-label="Todos los simulacros" className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Simulacros rendidos</h3>
            <ul className="divide-y divide-border rounded-2xl border border-border bg-background">
              {[...x.mocks].reverse().map((m) => (
                <li key={m.mock?.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 text-sm">
                  <span className="min-w-0 basis-full sm:basis-auto sm:flex-1">
                    <span className="block truncate font-medium text-foreground">{m.mock?.name}</span>
                    <span className="block text-xs text-muted-foreground">{formatDay(m.mock?.heldOn ?? '')}</span>
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {m.sheet?.right} buenas · {m.sheet?.wrong} malas · {m.sheet?.blank} en blanco
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums sm:w-20 sm:text-right">{m.sheet?.rankLevel}.° del área</span>
                  <span className="ml-auto font-semibold tabular-nums sm:w-24 sm:text-right">{formatScore(m.sheet?.score)}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
};

// Families with several children (or the student alone)
export const StudentExamsView = ({ items }: { items: StudentExams[] }): JSX.Element => {
  const [id, setId] = useState(items[0]?.studentId ?? '');
  const x = items.find((i) => i.studentId === id) ?? items[0];
  return (
    <div className="space-y-5">
      {items.length > 1 && (
        <div role="tablist" aria-label="Alumnos" className="flex flex-wrap gap-2">
          {items.map((i) => (
            <button key={i.studentId} type="button" role="tab" aria-selected={i.studentId === x?.studentId} onClick={(): void => setId(i.studentId)} className={cn('rounded-full border px-4 py-2 text-sm font-medium', i.studentId === x?.studentId ? 'border-brand bg-brand/10 text-foreground' : 'border-border text-muted-foreground')}>
              {i.studentName.split(' ')[0]}
            </button>
          ))}
        </div>
      )}
      {x && (
        <>
          <h2 className="text-lg font-semibold text-foreground">{x.studentName}</h2>
          <StudentExamsCard x={x} />
        </>
      )}
    </div>
  );
};
