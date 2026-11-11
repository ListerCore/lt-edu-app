'use client';

import { useState, type JSX, type ReactNode } from 'react';
import { ArrowLeft, Check, Lock, MessageSquareText, Send, Undo2 } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { cn } from '@/lib/utils';
import { submitSheetAction } from '../actions/assessment-actions';
import { cellKey, levelClass, levelLabels, levels } from '../data/assessment-data';
import type { Competency, LevelDraft, LevelMark, Sheet, StudentRef } from '../types';

interface SheetHeaderProps {
  slug: string;
  sheet: Sheet;
  title: string;
  subtitle: string;
  onBack: () => void;
  onChanged: () => void;
  dirty: boolean;
}

// Back, what is being graded, the lock or the "sent" state, and the button to send it to coordinación
export const SheetHeader = ({ slug, sheet, title, subtitle, onBack, onChanged, dirty }: SheetHeaderProps): JSX.Element => {
  const [busy, setBusy] = useState(false);
  const sent = Boolean(sheet.submitted);
  const toggle = async (): Promise<void> => {
    setBusy(true);
    const result = await submitSheetAction(slug, sheet.sectionId, sheet.kind === 'tutor' ? '' : sheet.assignmentId, sheet.termId, !sent);
    setBusy(false);
    if (!result.ok) sileo.error({ title: 'No se pudo completar', description: result.message });
    else {
      sileo.success({ title: result.message ?? 'Listo' });
      onChanged();
    }
  };
  return (
    <div className="space-y-3">
      <button type="button" className="btn-alt" onClick={onBack}>
        <MorphIcon icon={ArrowLeft} size={16} />
        Todos los registros
      </button>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {sheet.locked ? (
            <span className="pill bg-secondary text-muted-foreground">
              <MorphIcon icon={Lock} size={12} />
              Cerrado
            </span>
          ) : (
            sent && (
              <span className="pill bg-success/12 text-success">
                <MorphIcon icon={Check} size={12} />
                Enviado por {sheet.submitted?.submittedName}
              </span>
            )
          )}
          {sheet.canEdit && (
            <button type="button" className={sent ? 'btn-alt' : 'btn-brand'} disabled={busy || dirty} title={dirty ? 'Guarda los cambios antes de enviar' : undefined} onClick={(): void => void toggle()}>
              <MorphIcon icon={sent ? Undo2 : Send} size={16} />
              {sent ? 'Retirar envío' : 'Enviar a coordinación'}
            </button>
          )}
        </div>
      </div>
      {!sheet.canEdit && !sheet.locked && <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">Solo lectura: califica el docente del curso o coordinación.</p>}
    </div>
  );
};

// Competency names are long: the grid shows C1, C2… and this legend says which is which
export const CompetencyLegend = ({ competencies }: { competencies: Competency[] }): JSX.Element => (
  <ol className="grid gap-1.5 rounded-2xl border border-border bg-background p-4 text-sm md:grid-cols-2">
    {competencies.map((c, i) => (
      <li key={c.id} className="flex gap-2">
        <span className="w-7 shrink-0 font-semibold text-brand tabular-nums">C{i + 1}</span>
        <span className="text-foreground">{c.name}</span>
      </li>
    ))}
  </ol>
);

export const LevelLegend = (): JSX.Element => (
  <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
    {levels.map((l) => (
      <span key={l} className="flex items-center gap-1.5">
        <span className={cn('inline-flex h-5 min-w-7 items-center justify-center rounded px-1 text-[11px] font-semibold', levelClass[l])}>{l}</span>
        {levelLabels[l]}
      </span>
    ))}
    <span>Con C, la conclusión descriptiva es obligatoria.</span>
  </p>
);

interface LevelCellProps {
  student: StudentRef;
  competency: Competency;
  index: number;
  value: LevelDraft;
  changed: boolean;
  error?: string;
  disabled: boolean;
  onLevel: (level: string) => void;
  onConclusion: () => void;
}

// One cell: the level as a native select (fast with the keyboard) and the conclusion behind the note button
export const LevelCell = ({ student, competency, index, value, changed, error, disabled, onLevel, onConclusion }: LevelCellProps): JSX.Element => {
  const missing = value.level === 'C' && !value.conclusion.trim();
  return (
    <div className={cn('flex items-center gap-1 rounded-lg p-0.5', changed && 'ring-1 ring-brand/50', (error || missing) && 'ring-1 ring-destructive')} title={error}>
      <select
        aria-label={`C${index + 1} de ${student.name}`}
        value={value.level}
        disabled={disabled}
        onChange={(e): void => onLevel(e.target.value)}
        className={cn('h-8 w-14 appearance-none rounded-md border-0 text-center text-sm font-semibold disabled:opacity-100', levelClass[value.level] ?? levelClass[''])}
      >
        <option value="">—</option>
        {levels.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onConclusion}
        aria-label={`Conclusión de ${competency.name} para ${student.name}`}
        title={value.conclusion || (missing ? 'Falta la conclusión descriptiva' : 'Agregar conclusión')}
        className={cn('flex size-7 items-center justify-center rounded-md transition-colors', value.conclusion ? 'text-brand' : missing ? 'text-destructive' : 'text-muted-foreground/50 hover:text-foreground')}
      >
        <MorphIcon icon={MessageSquareText} size={14} />
      </button>
    </div>
  );
};

interface ConclusionDialogProps {
  student: StudentRef;
  competency: Competency;
  value: LevelDraft;
  readOnly: boolean;
  onSave: (value: LevelDraft) => void;
  onClose: () => void;
}

export const ConclusionDialog = ({ student, competency, value, readOnly, onSave, onClose }: ConclusionDialogProps): JSX.Element => {
  const [level, setLevel] = useState(value.level);
  const [text, setText] = useState(value.conclusion);
  const missing = level === 'C' && !text.trim();
  return (
    <FormDialog
      title={student.name}
      description={competency.name}
      submitLabel="Aplicar"
      isPending={false}
      disabled={readOnly || missing}
      onSubmit={(): void => onSave({ level, conclusion: text.trim() })}
      onClose={onClose}
    >
      <div role="radiogroup" aria-label="Nivel de logro" className="flex flex-wrap gap-2">
        {['', ...levels].map((l) => (
          <button
            key={l || 'none'}
            type="button"
            role="radio"
            aria-checked={level === l}
            disabled={readOnly}
            onClick={(): void => setLevel(l)}
            className={cn('rounded-lg border px-3 py-2 text-sm font-medium transition-colors', level === l ? 'border-brand ring-2 ring-brand/30' : 'border-border', l && levelClass[l])}
          >
            {l ? `${l} · ${levelLabels[l]}` : 'Sin nivel'}
          </button>
        ))}
      </div>
      <FormField id="conclusion" label="Conclusión descriptiva" required={level === 'C'} error={missing ? 'Con C, describe qué le falta lograr y cómo se le apoyará.' : undefined} hint="Lo que logra, lo que le falta y cómo se le acompañará. La familia la lee en la libreta.">
        <Textarea id="conclusion" value={text} rows={5} maxLength={1000} readOnly={readOnly} onChange={(e): void => setText(e.target.value)} />
      </FormField>
    </FormDialog>
  );
};

// Drafts of a level grid: what changed, by "student:competency", and the marks to send
export const useLevelDrafts = (marks: LevelMark[]) => {
  const [drafts, setDrafts] = useState<Record<string, LevelDraft>>({});
  const saved = new Map(marks.map((m) => [cellKey(m.studentId, m.competencyId), { level: m.level, conclusion: m.conclusion }]));
  const valueOf = (key: string): LevelDraft => drafts[key] ?? saved.get(key) ?? { level: '', conclusion: '' };
  const set = (key: string, next: LevelDraft): void =>
    setDrafts((c) => {
      const base = saved.get(key) ?? { level: '', conclusion: '' };
      if (base.level === next.level && base.conclusion === next.conclusion) {
        const rest = { ...c };
        delete rest[key];
        return rest;
      }
      return { ...c, [key]: next };
    });
  const toMarks = (): LevelMark[] =>
    Object.entries(drafts).map(([key, v]) => {
      const [studentId, competencyId] = key.split(':');
      return { studentId, competencyId, level: v.level, conclusion: v.conclusion };
    });
  return { drafts, valueOf, set, toMarks, reset: (): void => setDrafts({}), count: Object.keys(drafts).length };
};

export const SaveBar = ({ count, busy, onDiscard, onSave, children }: { count: number; busy: boolean; onDiscard: () => void; onSave: () => void; children?: ReactNode }): JSX.Element => (
  <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-border bg-background/95 p-3 shadow-sm backdrop-blur">
    {children}
    {count > 0 && (
      <button type="button" className="btn-alt" disabled={busy} onClick={onDiscard}>
        Descartar
      </button>
    )}
    <button type="button" className="btn-brand" disabled={busy || count === 0} onClick={onSave}>
      {count > 0 ? `Guardar ${count} ${count === 1 ? 'cambio' : 'cambios'}` : 'Sin cambios'}
    </button>
  </div>
);
