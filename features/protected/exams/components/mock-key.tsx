'use client';

import { useState, useTransition, type JSX } from 'react';
import { Library } from 'lucide';
import { sileo } from 'sileo';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { fillFromBankAction, saveKeyAction } from '../actions/exams-actions';
import { letters } from '../data/exams-data';
import type { MockDetail } from '../types';

// Clave: the right option of every question, grouped by course. Bank questions bring their own; the rest is typed
export const MockKey = ({ slug, detail, onSaved }: { slug: string; detail: MockDetail; onSaved: () => void }): JSX.Element => {
  const m = detail.mock;
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [isPending, startTransition] = useTransition();
  if (!m || detail.key.length === 0) return <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Primero define los cursos y sus preguntas.</p>;
  const editable = detail.canEdit;
  const changed = Object.keys(drafts).length;
  const value = (n: number, saved: string): string => drafts[n] ?? saved;
  const groups = m.courses.map((c) => ({ course: c, items: detail.key.filter((k) => k.courseCode === c.code) }));
  const fromBank = detail.key.filter((k) => k.questionId).length;

  const fill = (): void =>
    startTransition(async () => {
      const r = await fillFromBankAction(slug, m.id);
      if (!r.ok) sileo.error({ title: 'No se pudo completar', description: r.message });
      else {
        sileo.success({ title: r.data.filled ? `${r.data.filled} preguntas tomadas del banco` : 'El banco no tiene más preguntas de esos cursos' });
        onSaved();
      }
    });

  const save = (): void =>
    startTransition(async () => {
      const r = await saveKeyAction(slug, m.id, Object.entries(drafts).map(([n, answer]) => ({ number: Number(n), answer })));
      if (!r.ok) sileo.error({ title: 'No se pudo guardar', description: r.message });
      else {
        sileo.success({ title: m.sheets > 0 ? 'Clave guardada: los puntajes se recalcularon' : 'Clave guardada' });
        setDrafts({});
        onSaved();
      }
    });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {fromBank} de {detail.key.length} preguntas vienen del banco (con enunciado para el cuadernillo); las demás solo tienen la respuesta.
          {m.sheets > 0 && ' Cambiar la clave recalcula los puntajes ya cargados.'}
        </p>
        {editable && m.sheets === 0 && fromBank < detail.key.length && (
          <button type="button" className="btn-alt" disabled={isPending} onClick={fill}>
            <MorphIcon icon={Library} size={16} />
            Completar con el banco
          </button>
        )}
      </div>
      {groups.map(({ course, items }) => (
        <section key={course.code} aria-label={course.name} className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">
            {course.name} <span className="font-normal text-muted-foreground">· {items.length} preguntas</span>
          </h3>
          <ol className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2">
            {items.map((k) => {
              const v = value(k.number, k.answer);
              return (
                <li key={k.number} className={cn('flex items-center gap-1.5 rounded-lg border px-2 py-1.5', k.number in drafts ? 'border-brand' : v ? 'border-border' : 'border-warning/60 bg-warning/8')}>
                  <span className="w-7 text-xs text-muted-foreground tabular-nums">{k.number}</span>
                  <select
                    aria-label={`Respuesta de la pregunta ${k.number}`}
                    value={v}
                    disabled={!editable || isPending}
                    onChange={(e): void => setDrafts((d) => (e.target.value === k.answer ? Object.fromEntries(Object.entries(d).filter(([n]) => Number(n) !== k.number)) : { ...d, [k.number]: e.target.value }))}
                    className="h-7 flex-1 rounded border-0 bg-transparent text-center text-sm font-semibold text-foreground disabled:opacity-100"
                  >
                    <option value="">—</option>
                    {letters.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  {k.questionId && <span className="text-[10px] text-brand" title="Pregunta del banco">B</span>}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      {editable && (
        <div className="sticky bottom-4 flex justify-end gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-sm backdrop-blur">
          {changed > 0 && (
            <button type="button" className="btn-alt" disabled={isPending} onClick={(): void => setDrafts({})}>
              Descartar
            </button>
          )}
          <button type="button" className="btn-brand" disabled={isPending || changed === 0} onClick={save}>
            {changed > 0 ? `Guardar ${changed} ${changed === 1 ? 'cambio' : 'cambios'}` : 'Sin cambios'}
          </button>
        </div>
      )}
    </div>
  );
};
