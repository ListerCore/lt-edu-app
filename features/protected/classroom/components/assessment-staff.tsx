'use client';

import { useState, type JSX } from 'react';
import { BookCheck, Clock3, Plus } from 'lucide';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Switch } from '@/components/ui/switch';
import { ChoiceChips, StatusPill, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { cn } from '@/lib/utils';
import { formatLive, levelClass, questionKindLabels, submissionStatusClass, submissionStatusLabels } from '../data/classroom-data';
import { useAssessmentEditor } from '../hooks/use-assessment-editor';
import { useRecordLevels } from '../hooks/use-record-levels';
import type { AssessmentStaffProps, RosterRow, Submission } from '../types';
import { ExtensionDialog } from './extension-dialog';
import { GradeDialog } from './grade-dialog';
import { QuestionEditor } from './question-editor';

// Teacher's view of a quiz or task: settings and questions (locked once someone handed it in), the students with
// their latest attempt, grading, extensions and taking the levels to the official record
export const AssessmentStaff = ({ data, onChanged }: AssessmentStaffProps): JSX.Element => {
  const a = data.assessment;
  const editor = useAssessmentEditor(data, onChanged);
  const { record, isRecording } = useRecordLevels(a.itemId, onChanged);
  const [grading, setGrading] = useState<Submission | null>(null);
  const [extending, setExtending] = useState<RosterRow | null>(null);
  const locked = data.questionsLocked || !data.canEdit;
  const handed = data.roster.filter((r) => r.latest && r.latest.status !== 'in_progress').length;
  const graded = data.roster.filter((r) => r.latest?.status === 'graded').length;
  const pendingRecord = data.roster.filter((r) => r.latest?.status === 'graded' && !r.latest.recordedAt && Object.keys(r.latest.levels).length > 0).length;
  const { values, errors, setField, submit, isPending } = editor;

  return (
    <div className="space-y-8">
      <section aria-labelledby="settings-title" className="rounded-2xl border border-border bg-surface p-4 md:p-5">
        <h2 id="settings-title" className="text-base font-semibold text-foreground">
          Ajustes
        </h2>
        <fieldset disabled={!data.canEdit} className="mt-4 grid gap-4 sm:grid-cols-3">
          <FormField id="as-opens" label="Abre (Lima)" error={errors.opensAt} hint="Vacío: ya está abierta.">
            <Input id="as-opens" type="datetime-local" value={values.opensAt} onChange={(e): void => setField('opensAt', e.target.value)} className={controlClassName} />
          </FormField>
          <FormField id="as-closes" label="Cierra (Lima)" error={errors.closesAt} hint="Vacío: sin fecha límite.">
            <Input id="as-closes" type="datetime-local" value={values.closesAt} onChange={(e): void => setField('closesAt', e.target.value)} aria-invalid={Boolean(errors.closesAt)} className={controlClassName} />
          </FormField>
          <FormField id="as-attempts" label="Intentos" required error={errors.maxAttempts}>
            <Input id="as-attempts" inputMode="numeric" value={values.maxAttempts} onChange={(e): void => setField('maxAttempts', e.target.value.replace(/\D/g, '').slice(0, 2))} aria-invalid={Boolean(errors.maxAttempts)} className={controlClassName} />
          </FormField>
        </fieldset>
        <div className="mt-4">
          <FormField id="as-comps" label="Competencias que evalúa" error={errors.competencyIds}>
            <ChoiceChips label="Competencias" options={data.competencies.map((c) => ({ value: c.id, label: c.name }))} selected={values.competencyIds} onChange={(next): void => setField('competencyIds', next)} disabled={!data.canEdit} />
          </FormField>
        </div>
        {a.kind === 'quiz' && (
          <label className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5 text-sm">
            <span>
              <span className="block font-medium text-foreground">Mostrar respuestas correctas</span>
              <span className="text-xs text-muted-foreground">El estudiante las ve cuando su intento esté calificado</span>
            </span>
            <Switch checked={values.showAnswers} disabled={!data.canEdit} onCheckedChange={(next): void => setField('showAnswers', next)} />
          </label>
        )}

        {a.kind === 'quiz' && (
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                Preguntas · {editor.questions.length} · {editor.totalPoints} puntos
              </h3>
              {data.questionsLocked && <p className="text-xs text-warning">Ya hay entregas: las preguntas no se pueden cambiar.</p>}
            </div>
            {errors.questions && <p className="mt-2 text-sm text-destructive">{errors.questions}</p>}
            <ol className="mt-3 space-y-3">
              {editor.questions.map((q, i) => (
                <QuestionEditor
                  key={q.key}
                  question={q}
                  error={errors[`questions.${i}`]}
                  index={i}
                  count={editor.questions.length}
                  locked={locked}
                  onChange={(patch): void => editor.updateQuestion(q.key, patch)}
                  onRemove={(): void => editor.removeQuestion(q.key)}
                  onMove={(d): void => editor.moveQuestion(q.key, d)}
                />
              ))}
            </ol>
            {!locked && (
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(questionKindLabels).map(([kind, label]) => (
                  <button key={kind} type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => editor.addQuestion(kind)}>
                    <MorphIcon icon={Plus} size={12} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {data.canEdit && (
          <div className="mt-6 flex justify-end">
            <button type="button" className="btn-brand" onClick={submit} disabled={isPending}>
              {isPending ? 'Guardando…' : 'Guardar ajustes'}
            </button>
          </div>
        )}
      </section>

      <section aria-labelledby="roster-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="roster-title" className="text-base font-semibold text-foreground">
              Entregas
            </h2>
            <p className="text-sm text-muted-foreground">
              {handed} de {data.roster.length} entregaron · {graded} calificados
            </p>
          </div>
          {data.canEdit && (
            <button type="button" className="btn-alt" onClick={record} disabled={isRecording || pendingRecord === 0} title={pendingRecord === 0 ? 'No hay calificaciones nuevas para llevar' : undefined}>
              <MorphIcon icon={BookCheck} size={16} />
              {isRecording ? 'Llevando…' : `Llevar al registro${pendingRecord > 0 ? ` (${pendingRecord})` : ''}`}
            </button>
          )}
        </div>
        {data.roster.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">No hay estudiantes matriculados en este grado.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[40rem] text-sm">
              <thead className="bg-surface text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Estudiante</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                  <th className="px-3 py-2 font-medium">Puntos</th>
                  <th className="px-3 py-2 font-medium">Niveles</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.roster.map((r) => (
                  <tr key={r.studentId}>
                    <td className="px-3 py-2">
                      <p className="font-medium text-foreground">{r.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.studentCode}
                        {r.extension && ` · prórroga hasta el ${formatLive(r.extension)}`}
                      </p>
                    </td>
                    <td className="px-3 py-2">
                      {r.latest ? <StatusPill className={submissionStatusClass[r.latest.status]}>{submissionStatusLabels[r.latest.status]}</StatusPill> : <span className="text-xs text-muted-foreground">Sin entregar</span>}
                      {r.latest?.late && <span className="ml-1 text-xs text-warning">Tarde</span>}
                      {r.latest?.recordedAt && <span className="ml-1 text-xs text-success">En registro</span>}
                    </td>
                    <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">{r.latest && r.latest.autoTotal > 0 ? `${r.latest.autoPoints}/${r.latest.autoTotal}` : '—'}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {Object.values(r.latest?.levels ?? {}).map((l, i) => (
                          <span key={i} className={cn('rounded px-1.5 py-0.5 text-xs font-semibold', levelClass[l])}>
                            {l}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      {data.canEdit && (
                        <button type="button" onClick={(): void => setExtending(r)} aria-label={`Prórroga para ${r.studentName}`} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary">
                          <MorphIcon icon={Clock3} size={14} />
                        </button>
                      )}
                      {r.latest && r.latest.status !== 'in_progress' && (
                        <button type="button" className="btn-alt h-8 px-3 text-xs" onClick={(): void => setGrading(r.latest ?? null)}>
                          {data.canEdit ? (r.latest.status === 'graded' ? 'Revisar' : 'Calificar') : 'Ver'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {grading && <GradeDialog assessment={a} competencies={data.competencies} submission={grading} onClose={(): void => setGrading(null)} onSaved={onChanged} />}
      {extending && <ExtensionDialog itemId={a.itemId} row={extending} onClose={(): void => setExtending(null)} onSaved={onChanged} />}
    </div>
  );
};
