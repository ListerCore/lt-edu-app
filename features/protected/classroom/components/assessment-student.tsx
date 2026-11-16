'use client';

import type { JSX } from 'react';
import { CloudCheck, LoaderCircle, Send } from 'lucide';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { StatusPill } from '@/features/protected/academic/components/academic-ui';
import { AttachmentsPanel } from '@/features/protected/attachments/components/attachments-panel';
import { cn } from '@/lib/utils';
import { formatLive, submissionCategories, submissionStatusClass, submissionStatusLabels } from '../data/classroom-data';
import { useAttempt } from '../hooks/use-attempt';
import type { AssessmentStudentProps } from '../types';
import { SubmissionReview } from './submission-review';

// Student's view: when it is open and how many attempts are left, the attempt in progress (answers save on their
// own), handing in (with files for a task) and the results of earlier attempts
export const AssessmentStudent = ({ data, onChanged }: AssessmentStudentProps): JSX.Element => {
  const a = data.assessment;
  const attempt = useAttempt(data, onChanged);
  const used = data.attempts.length;
  const finished = data.attempts.filter((s) => s.status !== 'in_progress');
  const closes = data.extension || a.closesAt;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-surface p-4 text-sm md:p-5">
        {a.instructions && <p className="leading-7 whitespace-pre-line text-foreground">{a.instructions}</p>}
        <dl className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
          <div>
            <dt>Abre</dt>
            <dd className="text-foreground first-letter:uppercase">{a.opensAt ? formatLive(a.opensAt) : 'Ya está abierta'}</dd>
          </div>
          <div>
            <dt>Cierra{data.extension && ' (tu prórroga)'}</dt>
            <dd className="text-foreground first-letter:uppercase">{closes ? formatLive(closes) : 'Sin fecha límite'}</dd>
          </div>
          <div>
            <dt>Intentos</dt>
            <dd className="text-foreground">
              {used} de {a.maxAttempts}
            </dd>
          </div>
        </dl>
      </section>

      {attempt.current ? (
        <section aria-labelledby="attempt-title" className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 id="attempt-title" className="text-base font-semibold text-foreground">
              Intento {attempt.current.attempt}
            </h2>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
              {attempt.saveState === 'saving' && <MorphIcon icon={LoaderCircle} size={12} className="animate-spin" />}
              {attempt.saveState === 'saved' && <MorphIcon icon={CloudCheck} size={12} className="text-success" />}
              {attempt.saveState === 'saving' ? 'Guardando…' : attempt.saveState === 'saved' ? 'Respuestas guardadas' : attempt.saveState === 'error' ? 'Sin conexión: no se guardó' : ''}
            </span>
          </div>
          <ol className="space-y-3">
            {a.questions.map((q, i) => {
              const ans = attempt.answers[q.id];
              const multiple = q.kind === 'multiple';
              return (
                <li key={q.id} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-sm font-medium text-foreground">
                    {i + 1}. {q.prompt}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {q.points} {q.points === 1 ? 'punto' : 'puntos'}
                    {multiple && ' · marca todas las correctas'}
                  </p>
                  {q.options.length > 0 ? (
                    <div className="mt-3 space-y-2" role={multiple ? 'group' : 'radiogroup'} aria-label={q.prompt}>
                      {q.options.map((o, j) => {
                        const chosen = ans?.choices.includes(j) ?? false;
                        return (
                          <button
                            key={j}
                            type="button"
                            role={multiple ? 'checkbox' : 'radio'}
                            aria-checked={chosen}
                            onClick={(): void => attempt.setChoice(q.id, j, multiple)}
                            className={cn('flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors', chosen ? 'border-brand bg-brand-soft text-foreground' : 'border-border hover:border-brand/50')}
                          >
                            <span className={cn('flex size-6 shrink-0 items-center justify-center border text-xs font-semibold', multiple ? 'rounded-md' : 'rounded-full', chosen ? 'border-brand bg-brand text-white' : 'border-border text-muted-foreground')}>
                              {String.fromCharCode(65 + j)}
                            </span>
                            {o}
                          </button>
                        );
                      })}
                    </div>
                  ) : q.kind === 'short' ? (
                    <Input aria-label={q.prompt} value={ans?.text ?? ''} maxLength={300} onChange={(e): void => attempt.setText(q.id, e.target.value)} className="mt-3 h-10" />
                  ) : (
                    <Textarea aria-label={q.prompt} rows={4} value={ans?.text ?? ''} maxLength={5000} onChange={(e): void => attempt.setText(q.id, e.target.value)} className="mt-3" />
                  )}
                </li>
              );
            })}
          </ol>
          {a.kind === 'task' && (
            <AttachmentsPanel ownerKind="submission" ownerId={attempt.current.id} module="classroom" title="Tu trabajo" description="Sube fotos, PDF o archivos de Word o Excel con tu trabajo. Luego presiona Entregar." categories={[...submissionCategories]} />
          )}
          <div className="flex justify-end">
            <button type="button" className="btn-brand" onClick={attempt.handIn} disabled={attempt.isHandingIn}>
              <MorphIcon icon={Send} size={16} />
              {attempt.isHandingIn ? 'Entregando…' : 'Entregar'}
            </button>
          </div>
        </section>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">
            {data.canStart ? (used === 0 ? 'Cuando estés listo, empieza. Tus respuestas se guardan solas mientras respondes.' : 'Puedes intentarlo de nuevo; se considera el último intento.') : !data.openNow ? 'Esta evaluación no está abierta ahora.' : 'Ya usaste todos tus intentos.'}
          </p>
          {data.canStart && (
            <button type="button" className="btn-brand" onClick={attempt.start} disabled={attempt.isStarting}>
              {attempt.isStarting ? 'Abriendo…' : used === 0 ? (a.kind === 'task' ? 'Empezar la entrega' : 'Empezar') : 'Nuevo intento'}
            </button>
          )}
        </div>
      )}

      {finished.length > 0 && (
        <section aria-labelledby="results-title" className="space-y-3">
          <h2 id="results-title" className="text-base font-semibold text-foreground">
            Tus entregas
          </h2>
          {finished.map((s) => (
            <article key={s.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium text-foreground">Intento {s.attempt}</span>
                <StatusPill className={submissionStatusClass[s.status]}>{submissionStatusLabels[s.status]}</StatusPill>
                {s.late && <span className="text-xs text-warning">Fuera de plazo</span>}
                {s.status === 'graded' && s.autoTotal > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {s.autoPoints} de {s.autoTotal} puntos automáticos
                  </span>
                )}
              </div>
              {s.status === 'graded' ? <SubmissionReview assessment={a} competencies={data.competencies} submission={s} /> : <p className="text-sm text-muted-foreground">Tu docente aún no lo califica.</p>}
              {a.kind === 'task' && s.files > 0 && <AttachmentsPanel ownerKind="submission" ownerId={s.id} module="classroom" variant="compact" title="Lo que entregaste" categories={[...submissionCategories]} readOnly />}
            </article>
          ))}
        </section>
      )}
    </div>
  );
};
