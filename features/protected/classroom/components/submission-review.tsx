'use client';

import type { JSX } from 'react';
import { Check, X } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { levelClass } from '../data/classroom-data';
import type { SubmissionReviewProps } from '../types';

// What a student answered, question by question, and the right answer when it is known (staff, or the student once
// the teacher shows them); then the levels and feedback
export const SubmissionReview = ({ assessment, competencies, submission }: SubmissionReviewProps): JSX.Element => (
  <div className="space-y-4">
    {assessment.questions.length > 0 && (
      <ol className="space-y-3">
        {assessment.questions.map((q, i) => {
          const ans = submission.answers[q.id];
          const known = q.correct.length > 0 || q.accepted.length > 0;
          return (
            <li key={q.id} className="rounded-lg border border-border p-3 text-sm">
              <p className="font-medium text-foreground">
                {i + 1}. {q.prompt}
              </p>
              {q.options.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {q.options.map((o, j) => {
                    const chosen = ans?.choices.includes(j) ?? false;
                    const right = q.correct.includes(j);
                    return (
                      <li key={j} className={cn('flex items-center gap-2 rounded px-2 py-1', chosen && known && (right ? 'bg-success/10' : 'bg-destructive/10'), chosen && !known && 'bg-secondary')}>
                        <span className="w-4 text-xs text-muted-foreground">{String.fromCharCode(65 + j)}</span>
                        <span className="flex-1">{o}</span>
                        {known && right && <MorphIcon icon={Check} size={14} className="text-success" aria-label="Correcta" />}
                        {known && chosen && !right && <MorphIcon icon={X} size={14} className="text-destructive" aria-label="Incorrecta" />}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="mt-2 rounded bg-secondary px-2 py-1.5 whitespace-pre-line text-foreground">{ans?.text || <span className="text-muted-foreground">Sin respuesta</span>}</p>
              )}
              {q.kind === 'short' && q.accepted.length > 0 && <p className="mt-1 text-xs text-muted-foreground">Aceptadas: {q.accepted.join(', ')}</p>}
              {q.kind === 'open' && submission.openPoints[q.id] !== undefined && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {submission.openPoints[q.id]} de {q.points} puntos
                </p>
              )}
            </li>
          );
        })}
      </ol>
    )}
    {Object.keys(submission.levels).length > 0 && (
      <ul className="space-y-1.5">
        {competencies
          .filter((c) => submission.levels[c.id])
          .map((c) => (
            <li key={c.id} className="flex items-start gap-2 text-sm">
              <span className={cn('mt-0.5 w-8 shrink-0 rounded py-0.5 text-center text-xs font-semibold', levelClass[submission.levels[c.id]])}>{submission.levels[c.id]}</span>
              <span className="text-foreground">{c.name}</span>
            </li>
          ))}
      </ul>
    )}
    {submission.feedback && <p className="rounded-lg bg-brand-soft px-3 py-2 text-sm whitespace-pre-line text-foreground">{submission.feedback}</p>}
  </div>
);
