'use client';

import type { JSX } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2, X } from 'lucide';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { controlClassName } from '@/features/protected/academic/components/academic-ui';
import { cn } from '@/lib/utils';
import { questionKindLabels } from '../data/classroom-data';
import type { QuestionEditorProps } from '../types';

// One question of a quiz: prompt, value and, by kind, the options with the right ones marked or the accepted answers
export const QuestionEditor = ({ question: q, error, index, count, locked, onChange, onRemove, onMove }: QuestionEditorProps): JSX.Element => {
  const choice = q.kind === 'single' || q.kind === 'multiple';
  const toggleCorrect = (i: number): void => onChange({ correct: q.kind === 'single' ? [i] : q.correct.includes(i) ? q.correct.filter((c) => c !== i) : [...q.correct, i] });
  const setOption = (i: number, text: string): void => onChange({ options: q.options.map((o, j) => (j === i ? text : o)) });
  const removeOption = (i: number): void => onChange({ options: q.options.filter((_, j) => j !== i), correct: q.correct.filter((c) => c !== i).map((c) => (c > i ? c - 1 : c)) });

  return (
    <li className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{index + 1}.</span>
        <span className="text-xs text-muted-foreground">{questionKindLabels[q.kind]}</span>
        <label className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          Puntos
          <Input aria-label={`Puntos de la pregunta ${index + 1}`} inputMode="numeric" value={q.points} disabled={locked} onChange={(e): void => onChange({ points: e.target.value.replace(/\D/g, '').slice(0, 3) })} className="h-8 w-14" />
        </label>
        {!locked && (
          <>
            <button type="button" disabled={index === 0} onClick={(): void => onMove(-1)} aria-label="Subir pregunta" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-30">
              <MorphIcon icon={ArrowUp} size={14} />
            </button>
            <button type="button" disabled={index === count - 1} onClick={(): void => onMove(1)} aria-label="Bajar pregunta" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary disabled:opacity-30">
              <MorphIcon icon={ArrowDown} size={14} />
            </button>
            <button type="button" onClick={onRemove} aria-label="Quitar pregunta" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <MorphIcon icon={Trash2} size={14} />
            </button>
          </>
        )}
      </div>
      <Textarea aria-label={`Pregunta ${index + 1}`} rows={2} placeholder="Escribe la pregunta" value={q.prompt} disabled={locked} maxLength={3000} onChange={(e): void => onChange({ prompt: e.target.value })} className="mt-3" />
      {choice && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-muted-foreground">{q.kind === 'single' ? 'Marca la alternativa correcta.' : 'Marca todas las correctas.'}</p>
          {q.options.map((o, i) => (
            <div key={i} className="flex items-center gap-2">
              <button
                type="button"
                disabled={locked}
                onClick={(): void => toggleCorrect(i)}
                aria-pressed={q.correct.includes(i)}
                aria-label={`Alternativa ${i + 1} correcta`}
                className={cn('flex size-6 shrink-0 items-center justify-center border text-xs font-semibold', q.kind === 'single' ? 'rounded-full' : 'rounded-md', q.correct.includes(i) ? 'border-success bg-success text-white' : 'border-border text-muted-foreground')}
              >
                {String.fromCharCode(65 + i)}
              </button>
              <Input aria-label={`Alternativa ${i + 1}`} value={o} disabled={locked} maxLength={500} onChange={(e): void => setOption(i, e.target.value)} className={controlClassName} />
              {!locked && q.options.length > 2 && (
                <button type="button" onClick={(): void => removeOption(i)} aria-label={`Quitar alternativa ${i + 1}`} className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary">
                  <MorphIcon icon={X} size={14} />
                </button>
              )}
            </div>
          ))}
          {!locked && q.options.length < 8 && (
            <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => onChange({ options: [...q.options, ''] })}>
              <MorphIcon icon={Plus} size={12} />
              Alternativa
            </button>
          )}
        </div>
      )}
      {q.kind === 'short' && (
        <div className="mt-3">
          <p className="text-xs text-muted-foreground">Respuestas aceptadas, una por línea. No importan mayúsculas, tildes ni espacios.</p>
          <Textarea aria-label={`Respuestas aceptadas de la pregunta ${index + 1}`} rows={2} value={q.accepted} disabled={locked} onChange={(e): void => onChange({ accepted: e.target.value })} className="mt-1" />
        </div>
      )}
      {q.kind === 'open' && <p className="mt-3 text-xs text-muted-foreground">La califica el docente al revisar la entrega.</p>}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </li>
  );
};
