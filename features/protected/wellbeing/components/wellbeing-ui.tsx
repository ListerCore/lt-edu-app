'use client';

import { useEffect, useState, useTransition, type JSX, type ReactNode } from 'react';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import type { AcademicResult } from '@/features/protected/academic/types';
import { useDebounced } from '@/features/protected/people/hooks/use-debounced';
import { cn } from '@/lib/utils';
import { listStudentsAction } from '../actions/wellbeing-actions';
import type { WellStudent } from '../types';

// Runs a server action with a toast for the outcome; the first field error explains a refused form
export const useAct = (): [boolean, (work: () => Promise<AcademicResult<unknown>>, done?: () => void) => void] => {
  const [isPending, start] = useTransition();
  const run = (work: () => Promise<AcademicResult<unknown>>, done?: () => void): void =>
    start(async () => {
      const r = await work();
      if (!r.ok) {
        const field = r.fields ? Object.values(r.fields)[0] : undefined;
        sileo.error({ title: 'No se pudo completar', description: field ?? r.message });
        return;
      }
      if (r.message) sileo.success({ title: r.message });
      done?.();
    });
  return [isPending, run];
};

// A labelled multi-line text control
export const TextArea = ({ id, label, value, onChange, max, required, hint, rows = 3, placeholder }: { id: string; label: string; value: string; onChange: (v: string) => void; max: number; required?: boolean; hint?: string; rows?: number; placeholder?: string }): JSX.Element => (
  <FormField id={id} label={label} required={required} hint={hint}>
    <Textarea id={id} value={value} maxLength={max} rows={rows} placeholder={placeholder} onChange={(e): void => onChange(e.target.value)} className="min-h-20" />
  </FormField>
);

// A labelled date control (no future dates unless max is given)
export const DateInput = ({ id, label, value, onChange, max, min, required }: { id: string; label: string; value: string; onChange: (v: string) => void; max?: string; min?: string; required?: boolean }): JSX.Element => (
  <FormField id={id} label={label} required={required}>
    <Input id={id} type="date" value={value} max={max || undefined} min={min || undefined} onChange={(e): void => onChange(e.target.value)} />
  </FormField>
);

// Picks one of the students the person may see, by name, code or section
export const StudentPicker = ({ slug, value, onChange, specialNeeds }: { slug: string; value: WellStudent | null; onChange: (s: WellStudent | null) => void; specialNeeds?: boolean }): JSX.Element => {
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query, 250);
  const [found, setFound] = useState<WellStudent[]>([]);
  useEffect(() => {
    let active = true;
    if (debounced.trim().length < 2) return;
    void listStudentsAction(slug, debounced, specialNeeds).then((r) => {
      if (active && r.ok) setFound(r.data.students.slice(0, 8));
    });
    return (): void => {
      active = false;
    };
  }, [slug, debounced, specialNeeds]);
  if (value)
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm">
        <span>
          <span className="block font-medium text-foreground">{value.name}</span>
          <span className="block text-xs text-muted-foreground">
            {value.code} · {value.placement}
          </span>
        </span>
        <button type="button" className="text-xs font-medium text-brand" onClick={(): void => onChange(null)}>
          Cambiar
        </button>
      </div>
    );
  const shown = debounced.trim().length < 2 ? [] : found;
  return (
    <div className="space-y-1.5">
      <Input id="wb-student" value={query} autoComplete="off" placeholder="Escribe nombre, código o sección" onChange={(e): void => setQuery(e.target.value)} />
      {shown.length > 0 && (
        <ul className="max-h-56 divide-y divide-border overflow-y-auto rounded-lg border border-border">
          {shown.map((s) => (
            <li key={s.id}>
              <button type="button" className="w-full px-3 py-2 text-left text-sm hover:bg-surface" onClick={(): void => onChange(s)}>
                <span className="block text-foreground">{s.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {s.code} · {s.placement}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Toggle chips for a single choice (kind of interview, party, severity…)
export const OneOf = ({ label, value, options, onChange }: { label: string; value: string; options: Array<[string, string]>; onChange: (v: string) => void }): JSX.Element => (
  <div className="flex flex-col gap-2">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={(): void => onChange(v)}
          className={cn('h-9 rounded-full border px-3.5 text-sm font-medium transition-colors', value === v ? 'border-brand bg-brand-soft text-brand' : 'border-border text-foreground hover:border-brand/50')}
        >
          {l}
        </button>
      ))}
    </div>
  </div>
);

// A titled block of the student file
export const Block = ({ title, action, children, empty }: { title: string; action?: ReactNode; children?: ReactNode; empty?: string }): JSX.Element => (
  <section aria-label={title} className="space-y-2">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {action}
    </div>
    {children ?? <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">{empty}</p>}
  </section>
);

// One-field dialog: a reason, a resolution, a date
export const PromptDialog = ({
  title,
  description,
  label,
  submitLabel,
  kind = 'text',
  max = 2000,
  initial = '',
  options,
  onClose,
  onSubmit,
  isPending,
}: {
  title: string;
  description?: string;
  label: string;
  submitLabel: string;
  kind?: 'text' | 'date';
  max?: number;
  initial?: string;
  options?: Array<[string, string]>;
  onClose: () => void;
  onSubmit: (value: string, option: string) => void;
  isPending: boolean;
}): JSX.Element => {
  const [value, setValue] = useState(initial);
  const [option, setOption] = useState(options?.[0]?.[0] ?? '');
  return (
    <FormDialog title={title} description={description} submitLabel={submitLabel} isPending={isPending} disabled={!value.trim()} onSubmit={(): void => onSubmit(value, option)} onClose={onClose}>
      {options && <OneOf label="Decisión" value={option} options={options} onChange={setOption} />}
      {kind === 'date' ? <DateInput id="prompt-date" label={label} value={value} onChange={setValue} required /> : <TextArea id="prompt-text" label={label} value={value} onChange={setValue} max={max} required rows={4} />}
    </FormDialog>
  );
};

// A small select with its label, for filters
export const Filter = ({ id, label, value, options, onChange }: { id: string; label: string; value: string; options: Array<{ value: string; label: string }>; onChange: (v: string) => void }): JSX.Element => (
  <label htmlFor={id} className="flex min-w-40 flex-col gap-1 text-sm">
    <span className="font-medium text-foreground">{label}</span>
    <SelectField id={id} value={value} options={options} onChange={onChange} />
  </label>
);
