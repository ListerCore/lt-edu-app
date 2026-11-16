'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { AttachmentsPanel } from '@/features/protected/attachments/components/attachments-panel';
import { cn } from '@/lib/utils';
import { LEVELS, levelClass, submissionCategories } from '../data/classroom-data';
import { useGradeSubmission } from '../hooks/use-grade-submission';
import type { GradeDialogProps } from '../types';
import { SubmissionReview } from './submission-review';

// Grade one attempt: read the answers (and files), give points to open questions, a level per competency and feedback
export const GradeDialog = ({ assessment, competencies, submission, onClose, onSaved }: GradeDialogProps): JSX.Element => {
  const assessed = competencies.filter((c) => assessment.competencyIds.includes(c.id));
  const { values, errors, isPending, setField, submit } = useGradeSubmission(
    {
      submission,
      onSaved: (): void => {
        onSaved();
        onClose();
      },
    },
    assessed.map((c) => c.id),
  );
  const openQuestions = assessment.questions.filter((q) => q.kind === 'open');

  return (
    <FormDialog
      title={`Calificar · ${submission.studentName}`}
      description={`Intento ${submission.attempt}${submission.late ? ' · entregado fuera de plazo' : ''}${submission.autoTotal > 0 ? ` · ${submission.autoPoints} de ${submission.autoTotal} puntos automáticos (sugiere ${submission.suggestedLevel})` : ''}`}
      submitLabel="Guardar calificación"
      isPending={isPending}
      onSubmit={submit}
      onClose={onClose}
      wide
    >
      <SubmissionReview assessment={assessment} competencies={[]} submission={{ ...submission, levels: {}, feedback: '' }} />
      {(assessment.kind === 'task' || submission.files > 0) && <AttachmentsPanel ownerKind="submission" ownerId={submission.id} module="classroom" variant="compact" title="Archivos entregados" categories={[...submissionCategories]} readOnly />}
      {openQuestions.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {openQuestions.map((q) => (
            <FormField key={q.id} id={`open-${q.id}`} label={`Puntos: ${q.prompt.slice(0, 60)}`} error={errors.openPoints}>
              <Input
                id={`open-${q.id}`}
                inputMode="numeric"
                placeholder={`0 a ${q.points}`}
                value={values.openPoints[q.id] ?? ''}
                onChange={(e): void => setField('openPoints', { ...values.openPoints, [q.id]: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                className="h-10"
              />
            </FormField>
          ))}
        </div>
      )}
      {assessed.length === 0 ? (
        <p className="rounded-lg bg-secondary px-3 py-2.5 text-sm text-muted-foreground">Esta evaluación no tiene competencias. Elige cuáles evalúa en sus ajustes para poner niveles.</p>
      ) : (
        <fieldset className="space-y-2">
          <legend className="mb-1 text-sm font-medium text-foreground">Nivel de logro</legend>
          {assessed.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2">
              <span className="min-w-0 flex-1 text-sm text-foreground">{c.name}</span>
              <div className="flex gap-1" role="radiogroup" aria-label={c.name}>
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    role="radio"
                    aria-checked={values.levels[c.id] === l}
                    onClick={(): void => setField('levels', { ...values.levels, [c.id]: values.levels[c.id] === l ? '' : l })}
                    className={cn('h-8 w-10 rounded-md border text-xs font-semibold transition-colors', values.levels[c.id] === l ? cn(levelClass[l], 'border-transparent') : 'border-border text-muted-foreground hover:text-foreground')}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {errors.levels && <p className="text-sm text-destructive">{errors.levels}</p>}
        </fieldset>
      )}
      <FormField id="grade-feedback" label="Retroalimentación" error={errors.feedback} hint="El estudiante la lee. Al llevar al registro, es la conclusión descriptiva.">
        <Textarea id="grade-feedback" rows={4} value={values.feedback} maxLength={1000} onChange={(e): void => setField('feedback', e.target.value)} aria-invalid={Boolean(errors.feedback)} />
      </FormField>
    </FormDialog>
  );
};
