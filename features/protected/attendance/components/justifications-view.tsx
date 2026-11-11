'use client';

import { useState, type JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoadError, PageSkeleton, SelectField, StatusPill } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay, formatRange } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { Pager } from '@/features/protected/people/components/people-ui';
import { isAttendanceEvent } from '@/hooks/use-live';
import { getJustificationsAction, reviewJustificationAction, submitJustificationAction } from '../actions/attendance-actions';
import { justificationClass, justificationLabels, reasonLabels } from '../data/attendance-data';
import type { Justification, JustificationValues } from '../types';
import { Empty } from './attendance-ui';

const statusFilters = [
  { value: 'pending', label: 'Por revisar' },
  { value: '', label: 'Todas' },
  { value: 'approved', label: 'Aceptadas' },
  { value: 'rejected', label: 'Observadas' },
];

// One justification as a card: who, which days, why, and the answer
export const JustificationCard = ({ j, onReview, showStudent = true }: { j: Justification; onReview?: (j: Justification) => void; showStudent?: boolean }): JSX.Element => (
  <article className="rounded-2xl border border-border bg-background p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        {showStudent && (
          <h3 className="font-semibold text-foreground">
            {j.studentName}
            {j.sectionLabel && <span className="ml-2 text-xs font-normal text-muted-foreground">{j.sectionLabel}</span>}
          </h3>
        )}
        <p className="text-sm text-foreground tabular-nums">
          {j.fromDay === j.toDay ? formatDay(j.fromDay) : formatRange(j.fromDay, j.toDay)}
          <span className="text-muted-foreground"> · {reasonLabels[j.reason] ?? j.reason}</span>
          {j.absentDays > 0 && <span className="text-muted-foreground"> · {j.absentDays === 1 ? '1 falta' : `${j.absentDays} faltas`} en esas fechas</span>}
        </p>
      </div>
      <StatusPill className={justificationClass[j.status]}>{justificationLabels[j.status]}</StatusPill>
    </div>
    <p className="mt-3 text-sm leading-6 text-pretty text-foreground">{j.description}</p>
    <p className="mt-2 text-xs text-muted-foreground">Enviada por {j.submittedName || 'la familia'}</p>
    {j.status !== 'pending' && (
      <p className="mt-3 rounded-lg bg-secondary px-3 py-2 text-sm text-foreground">
        <span className="font-medium">{j.reviewedName || 'La institución'}:</span> {j.reviewNote || (j.status === 'approved' ? 'Aceptada.' : '')}
      </p>
    )}
    {onReview && j.status === 'pending' && (
      <div className="mt-4 flex justify-end">
        <button type="button" className="btn-brand" onClick={(): void => onReview(j)}>
          Revisar
        </button>
      </div>
    )}
  </article>
);

// Justificaciones: what families sent, waiting for the office or the tutor
export const JustificationsView = ({ slug }: { slug: string }): JSX.Element => {
  const [status, setStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const { data, error, reload } = useAcademicData(`att-just:${slug}:${status}:${page}`, () => getJustificationsAction(slug, status, '', page), isAttendanceEvent);
  const [reviewing, setReviewing] = useState<Justification | null>(null);

  return (
    <div className="space-y-4">
      <div className="w-60">
        <SelectField
          id="att-just-status"
          value={status}
          options={statusFilters}
          onChange={(v): void => {
            setStatus(v);
            setPage(1);
          }}
        />
      </div>
      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : data.items.length === 0 ? (
        <Empty>{status === 'pending' ? 'No hay justificaciones por revisar.' : 'No hay justificaciones con ese filtro.'}</Empty>
      ) : (
        <>
          <div className="grid gap-3 lg:grid-cols-2">
            {data.items.map((j) => (
              <JustificationCard key={j.id} j={j} onReview={data.canReview ? setReviewing : undefined} />
            ))}
          </div>
          <Pager page={page} pageSize={20} total={data.total} noun="justificaciones" onPage={setPage} />
        </>
      )}
      {reviewing && <ReviewDialog slug={slug} j={reviewing} onClose={(): void => setReviewing(null)} onDone={(): void => { setReviewing(null); reload(); }} />}
    </div>
  );
};

const ReviewDialog = ({ slug, j, onClose, onDone }: { slug: string; j: Justification; onClose: () => void; onDone: () => void }): JSX.Element => {
  const form = useAcademicForm<{ approve: string; note: string }, Justification>({
    initial: { approve: 'yes', note: '' },
    validate: (v): Record<string, string> => (v.approve === 'no' && !v.note.trim() ? { note: 'Explica a la familia por qué no se acepta.' } : {}),
    save: (v) => reviewJustificationAction(slug, j.id, v.approve === 'yes', v.note),
    onSaved: onDone,
  });
  const { values, errors, setField } = form;
  return (
    <FormDialog title={`Justificación de ${j.studentName}`} description={`${j.fromDay === j.toDay ? formatDay(j.fromDay) : formatRange(j.fromDay, j.toDay)} · ${reasonLabels[j.reason] ?? j.reason}`} submitLabel={values.approve === 'yes' ? 'Aceptar' : 'Observar'} isPending={form.isPending} onSubmit={form.submit} onClose={onClose}>
      <p className="rounded-lg bg-secondary px-3 py-2 text-sm leading-6 text-foreground">{j.description}</p>
      <FormField id="review-decision" label="Decisión" required>
        <SelectField
          id="review-decision"
          value={values.approve}
          options={[
            { value: 'yes', label: 'Aceptar: las faltas de esas fechas pasan a justificadas' },
            { value: 'no', label: 'Observar: las faltas siguen como faltas' },
          ]}
          onChange={(v): void => setField('approve', v)}
        />
      </FormField>
      <FormField id="review-note" label="Respuesta a la familia" required={values.approve === 'no'} error={errors.note} hint="La familia la verá junto a su justificación.">
        <Textarea id="review-note" value={values.note} maxLength={500} rows={3} onChange={(e): void => setField('note', e.target.value)} aria-invalid={Boolean(errors.note)} />
      </FormField>
    </FormDialog>
  );
};

interface SubmitDialogProps {
  slug: string;
  students: Array<{ id: string; name: string }>;
  today: string;
  defaultDay?: string;
  onClose: () => void;
  onDone: () => void;
}

// A family (or the office, from a paper note) explains an absence
export const SubmitJustificationDialog = ({ slug, students, today, defaultDay, onClose, onDone }: SubmitDialogProps): JSX.Element => {
  const start = defaultDay || today;
  const form = useAcademicForm<JustificationValues, Justification>({
    initial: { studentId: students[0]?.id ?? '', fromDay: start, toDay: start, reason: 'health', description: '' },
    validate: (v) => {
      const e: Record<string, string> = {};
      if (!v.fromDay) e.fromDay = 'Indica desde qué día.';
      if (!v.toDay) e.toDay = 'Indica hasta qué día.';
      else if (v.fromDay && v.toDay < v.fromDay) e.toDay = 'La fecha final no puede ser antes de la inicial.';
      if (!v.description.trim()) e.description = 'Cuéntanos brevemente qué pasó.';
      return e;
    },
    save: (v) => submitJustificationAction(slug, v),
    onSaved: onDone,
  });
  const { values, errors, setField } = form;
  return (
    <FormDialog title="Justificar una inasistencia" description="La institución la revisa; cuando la acepta, las faltas de esas fechas quedan como justificadas." submitLabel="Enviar justificación" isPending={form.isPending} onSubmit={form.submit} onClose={onClose}>
      {students.length > 1 && (
        <FormField id="just-student" label="Estudiante" required>
          <SelectField id="just-student" value={values.studentId} options={students.map((s) => ({ value: s.id, label: s.name }))} onChange={(v): void => setField('studentId', v)} />
        </FormField>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="just-from" label="Desde" required error={errors.fromDay}>
          <Input id="just-from" type="date" value={values.fromDay} onChange={(e): void => setField('fromDay', e.target.value)} aria-invalid={Boolean(errors.fromDay)} />
        </FormField>
        <FormField id="just-to" label="Hasta" required error={errors.toDay}>
          <Input id="just-to" type="date" value={values.toDay} min={values.fromDay} onChange={(e): void => setField('toDay', e.target.value)} aria-invalid={Boolean(errors.toDay)} />
        </FormField>
      </div>
      <FormField id="just-reason" label="Motivo" required error={errors.reason}>
        <SelectField id="just-reason" value={values.reason} options={Object.entries(reasonLabels).map(([value, label]) => ({ value, label }))} onChange={(v): void => setField('reason', v)} />
      </FormField>
      <FormField id="just-desc" label="¿Qué pasó?" required error={errors.description} hint="Si tienes una constancia médica, llévala a secretaría.">
        <Textarea id="just-desc" value={values.description} maxLength={1000} rows={4} onChange={(e): void => setField('description', e.target.value)} aria-invalid={Boolean(errors.description)} />
      </FormField>
    </FormDialog>
  );
};
