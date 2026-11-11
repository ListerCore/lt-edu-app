'use client';

import type { JSX } from 'react';
import { ArrowLeft, Printer } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { cn } from '@/lib/utils';
import { getBookletAction } from '../actions/exams-actions';
import { letters } from '../data/exams-data';

// The printable booklet (questions by course) or the answer key with the solutions, for the teachers
export const BookletView = ({ slug, id, withKey, onBack }: { slug: string; id: string; withKey: boolean; onBack: () => void }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`booklet:${slug}:${id}`, () => getBookletAction(slug, id), () => false);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  const { mock, items } = data;
  const groups: Array<{ course: string; items: typeof items }> = [];
  for (const it of items) {
    const g = groups[groups.length - 1];
    if (g && g.course === it.course) g.items.push(it);
    else groups.push({ course: it.course, items: [it] });
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between gap-3 print:hidden">
        <button type="button" className="btn-alt" onClick={onBack}>
          <MorphIcon icon={ArrowLeft} size={16} />
          Volver al simulacro
        </button>
        <button type="button" className="btn-brand" onClick={(): void => window.print()}>
          <MorphIcon icon={Printer} size={16} />
          Imprimir o guardar PDF
        </button>
      </div>
      <div data-print-cards>
        <article data-print-card className="rounded-2xl border border-border bg-background p-6 md:p-8 print:rounded-none print:border-0 print:p-0">
          <header className="border-b-2 border-brand pb-3">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {mock.name}
              {withKey && ' · Clave de respuestas'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {mock.periodName} · {formatDay(mock.heldOn)} · {mock.questions} preguntas · {mock.durationMinutes} minutos
            </p>
            {!withKey && <p className="mt-2 text-xs text-muted-foreground">Marca una sola alternativa por pregunta. Cada respuesta correcta suma {mock.pointsRight} puntos y cada incorrecta resta {mock.pointsWrong}; en blanco no suma ni resta.</p>}
          </header>
          {withKey && (
            <ol className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-1.5 text-sm print:grid-cols-10">
              {items.map((it) => (
                <li key={it.number} className="flex justify-between rounded border border-border px-2 py-1 tabular-nums">
                  <span className="text-muted-foreground">{it.number}</span>
                  <span className="font-semibold text-foreground">{it.answer || '—'}</span>
                </li>
              ))}
            </ol>
          )}
          {groups.map((g) => (
            <section key={g.course} className="mt-6">
              <h3 className="border-b border-border pb-1 text-sm font-semibold tracking-wide text-brand">{g.course}</h3>
              <ol className="mt-3 space-y-4">
                {g.items.map((it) => (
                  <li key={it.number} className="break-inside-avoid text-sm">
                    <p className="text-foreground">
                      <span className="mr-1 font-semibold tabular-nums">{it.number}.</span>
                      {it.question ? <span className="whitespace-pre-line">{it.question.stem}</span> : <span className="text-muted-foreground">Pregunta fuera del banco (solo clave).</span>}
                    </p>
                    {it.question && (
                      <ol className="mt-1.5 grid gap-x-6 gap-y-0.5 pl-6 sm:grid-cols-2">
                        {it.question.options.map((o, i) => (
                          <li key={letters[i]} className={cn(withKey && letters[i] === it.answer && 'font-semibold text-success')}>
                            {letters[i]}) {o}
                          </li>
                        ))}
                      </ol>
                    )}
                    {withKey && it.question?.explanation && <p className="mt-1 pl-6 text-xs text-muted-foreground">Solución: {it.question.explanation}</p>}
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
};
