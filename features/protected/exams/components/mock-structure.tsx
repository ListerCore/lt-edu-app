'use client';

import { useState, useTransition, type JSX } from 'react';
import { Sparkles, Trash2 } from 'lucide';
import { sileo } from 'sileo';
import { MorphIcon } from '@/components/ui/morph-icon';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { cn } from '@/lib/utils';
import { setStructureAction, suggestStructureAction } from '../actions/exams-actions';
import type { ExamsOverview, MockCourse, MockDetail, MockWeight } from '../types';

interface Props {
  slug: string;
  detail: MockDetail;
  overview: ExamsOverview;
  onSaved: () => void;
}

const wkey = (level: string, course: string): string => `${level}:${course}`;

// Cursos y pesos: which areas take the exam, how many questions each course has and how much it weighs per area
export const MockStructure = ({ slug, detail, overview, onSaved }: Props): JSX.Element => {
  const m = detail.mock;
  const locked = !detail.canEdit || (m?.sheets ?? 0) > 0;
  const [areas, setAreas] = useState<string[]>(() => [...new Set(m?.weights.map((w) => w.levelId) ?? [])]);
  const [courses, setCourses] = useState<MockCourse[]>(m?.courses ?? []);
  const [weights, setWeights] = useState<Record<string, string>>(() => Object.fromEntries((m?.weights ?? []).map((w) => [wkey(w.levelId, w.courseCode), String(w.weight)])));
  const [total, setTotal] = useState(String(m?.questions || 100));
  const [isPending, startTransition] = useTransition();
  const levels = overview.levels.filter((l) => areas.includes(l.id));
  const sum = courses.reduce((n, c) => n + (c.questions || 0), 0);
  const free = overview.courses.filter((c) => !courses.some((x) => x.code === c.code));

  const suggest = (): void =>
    startTransition(async () => {
      const r = await suggestStructureAction(slug, areas, Number(total) || 0);
      if (!r.ok) {
        sileo.error({ title: 'No se pudo sugerir', description: r.message });
        return;
      }
      setCourses(r.data.courses);
      setWeights(Object.fromEntries(r.data.weights.map((w) => [wkey(w.levelId, w.courseCode), String(w.weight)])));
    });

  const save = (): void =>
    startTransition(async () => {
      const list: MockWeight[] = [];
      for (const l of areas) for (const c of courses) list.push({ levelId: l, courseCode: c.code, weight: Number((weights[wkey(l, c.code)] ?? '1').replace(',', '.')) || 0 });
      const r = await setStructureAction(slug, m?.id ?? '', courses, list);
      if (!r.ok) sileo.error({ title: 'No se pudo guardar', description: r.message });
      else {
        sileo.success({ title: 'Estructura guardada' });
        onSaved();
      }
    });

  return (
    <div className="space-y-5">
      {(m?.sheets ?? 0) > 0 && <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">Ya hay respuestas cargadas: la estructura queda fija para que los puntajes no cambien.</p>}
      <section aria-labelledby="mock-areas" className="space-y-2">
        <h3 id="mock-areas" className="text-sm font-semibold text-foreground">
          Áreas que lo rinden
        </h3>
        <div className="flex flex-wrap gap-2">
          {overview.levels.map((l) => {
            const on = areas.includes(l.id);
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={on}
                disabled={locked}
                onClick={(): void => setAreas((a) => (on ? a.filter((x) => x !== l.id) : [...a, l.id]))}
                className={cn('rounded-full border px-3 py-1.5 text-sm transition-colors disabled:opacity-60', on ? 'border-brand bg-brand/10 font-medium text-foreground' : 'border-border text-muted-foreground hover:text-foreground')}
              >
                {l.name}
              </button>
            );
          })}
        </div>
      </section>
      {!locked && (
        <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-background p-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-foreground">Preguntas en total</span>
            <input placeholder="Ej.: 100" inputMode="numeric" value={total} onChange={(e): void => setTotal(e.target.value.replace(/\D/g, '').slice(0, 3))} className="placeholder:text-muted-foreground/60 h-10 w-28 rounded-lg border border-border bg-background px-3 tabular-nums" />
          </label>
          <button type="button" className="btn-alt" disabled={isPending || areas.length === 0} onClick={suggest}>
            <MorphIcon icon={Sparkles} size={16} />
            Sugerir según el plan de cada área
          </button>
          <p className="text-xs text-muted-foreground">Más horas semanales en el plan, más preguntas y más peso. Luego ajusta lo que quieras.</p>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border align-bottom text-muted-foreground">
              <th scope="col" className="min-w-48 px-3 py-3 font-medium">Curso</th>
              <th scope="col" className="px-2 py-3 text-center font-medium">Preguntas</th>
              {levels.map((l) => (
                <th key={l.id} scope="col" className="px-2 py-3 text-center text-xs font-medium" title={l.name}>
                  Peso
                  <span className="block text-foreground">{l.name.replace('San Marcos · ', '')}</span>
                </th>
              ))}
              {!locked && <th scope="col" className="w-10" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {courses.map((c, i) => (
              <tr key={c.code}>
                <td className="px-3 py-1.5 font-medium text-foreground">{c.name}</td>
                <td className="px-2 py-1.5 text-center">
                  <input placeholder="0"
                    aria-label={`Preguntas de ${c.name}`}
                    inputMode="numeric"
                    disabled={locked}
                    value={c.questions || ''}
                    onChange={(e): void => setCourses((cs) => cs.map((x, j) => (j === i ? { ...x, questions: Number(e.target.value.replace(/\D/g, '').slice(0, 3)) || 0 } : x)))}
                    className="placeholder:text-muted-foreground/60 h-8 w-16 rounded-md border border-border bg-background text-center tabular-nums disabled:opacity-100"
                  />
                </td>
                {levels.map((l) => (
                  <td key={l.id} className="px-2 py-1.5 text-center">
                    <input placeholder="1"
                      aria-label={`Peso de ${c.name} en ${l.name}`}
                      inputMode="decimal"
                      disabled={locked}
                      value={weights[wkey(l.id, c.code)] ?? '1'}
                      onChange={(e): void => setWeights((w) => ({ ...w, [wkey(l.id, c.code)]: e.target.value.replace(/[^\d.,]/g, '').slice(0, 5) }))}
                      className={cn('placeholder:text-muted-foreground/60 h-8 w-16 rounded-md border border-border bg-background text-center tabular-nums disabled:opacity-100', (weights[wkey(l.id, c.code)] ?? '1') === '0' && 'text-muted-foreground')}
                    />
                  </td>
                ))}
                {!locked && (
                  <td className="px-1">
                    <button type="button" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label={`Quitar ${c.name}`} onClick={(): void => setCourses((cs) => cs.filter((_, j) => j !== i))}>
                      <MorphIcon icon={Trash2} size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border text-muted-foreground">
              <td className="px-3 py-2">
                {!locked && free.length > 0 && (
                  <div className="w-56">
                    <SelectField id="mock-add-course" value="" placeholder="Agregar curso" options={free.map((c) => ({ value: c.code, label: c.name }))} onChange={(code): void => setCourses((cs) => [...cs, { code, name: free.find((c) => c.code === code)?.name ?? code, questions: 5 }])} />
                  </div>
                )}
              </td>
              <td className="px-2 py-2 text-center font-semibold text-foreground tabular-nums">{sum}</td>
              <td colSpan={levels.length + 1} className="px-2 py-2 text-xs">Peso 0: el curso no cuenta para esa área.</td>
            </tr>
          </tfoot>
        </table>
        {courses.length === 0 && <p className="px-6 py-8 text-center text-sm text-muted-foreground">Elige las áreas y pide la sugerencia, o agrega los cursos uno por uno.</p>}
      </div>
      {!locked && (
        <div className="flex justify-end">
          <button type="button" className="btn-brand" disabled={isPending || courses.length === 0 || areas.length === 0 || sum === 0} onClick={save}>
            Guardar estructura ({sum} preguntas)
          </button>
        </div>
      )}
    </div>
  );
};
