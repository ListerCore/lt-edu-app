'use client';

import { useState, useTransition, type JSX } from 'react';
import { Pencil, Plus } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ConfirmDelete, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { cn } from '@/lib/utils';
import { deleteEvaluationAction, getSheetAction, saveEvaluationAction, saveLevelsAction, saveScoresAction } from '../actions/assessment-actions';
import { cellKey, formatAverage, scoreMap, weightedAverage } from '../data/assessment-data';
import type { Evaluation, EvaluationValues, Sheet } from '../types';
import { CompetencyLegend, ConclusionDialog, LevelCell, LevelLegend, SaveBar, SheetHeader, useLevelDrafts } from './sheet-ui';

interface AreaSheetProps {
  slug: string;
  assignmentId: string;
  termId: string;
  onBack: () => void;
}

// The register of one area (levels per competency) or unit / course (scores 0–20)
export const AreaSheet = ({ slug, assignmentId, termId, onBack }: AreaSheetProps): JSX.Element => {
  // No live refresh while grading: someone else's save must not wipe what is being typed
  const { data, error, reload } = useAcademicData(`sheet:${slug}:${assignmentId}:${termId}`, () => getSheetAction(slug, assignmentId, termId), () => false);
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  return data.kind === 'literal' ? <LevelGrid slug={slug} sheet={data} onBack={onBack} reload={reload} /> : <ScoreGrid slug={slug} sheet={data} onBack={onBack} reload={reload} />;
};

const subtitleOf = (sheet: Sheet): string => [`${sheet.sectionLabel} · ${sheet.levelName}`, sheet.termName, sheet.staffName].filter(Boolean).join(' · ');

interface GridProps {
  slug: string;
  sheet: Sheet;
  onBack: () => void;
  reload: () => void;
}

const LevelGrid = ({ slug, sheet, onBack, reload }: GridProps): JSX.Element => {
  const d = useLevelDrafts(sheet.marks);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<{ studentId: string; competencyId: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const editable = sheet.canEdit;

  const save = (): void =>
    startTransition(async () => {
      const result = await saveLevelsAction(slug, sheet.assignmentId, sheet.termId, d.toMarks());
      if (!result.ok) {
        setErrors(result.fields ?? {});
        sileo.error({ title: 'No se pudo guardar', description: result.fields && Object.keys(result.fields).some((k) => k.includes(':')) ? 'Hay niveles C sin conclusión descriptiva (en rojo).' : result.message });
        return;
      }
      setErrors({});
      d.reset();
      sileo.success({ title: 'Registro guardado' });
      reload();
    });

  const student = editing && sheet.students.find((s) => s.id === editing.studentId);
  const compIndex = editing ? sheet.competencies.findIndex((c) => c.id === editing.competencyId) : -1;
  const counts = sheet.competencies.map((c) => sheet.students.filter((s) => d.valueOf(cellKey(s.id, c.id)).level).length);

  return (
    <div className="space-y-4">
      <SheetHeader slug={slug} sheet={sheet} title={sheet.subjectName} subtitle={subtitleOf(sheet)} onBack={onBack} onChanged={reload} dirty={d.count > 0} />
      <CompetencyLegend competencies={sheet.competencies} />
      <LevelLegend />
      <div className="overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="w-10 px-3 py-3 font-medium whitespace-nowrap">N.°</th>
              <th scope="col" className="min-w-56 px-3 py-3 font-medium">Estudiante</th>
              {sheet.competencies.map((c, i) => (
                <th key={c.id} scope="col" className="px-2 py-3 text-center font-medium" title={c.name}>
                  C{i + 1}
                  <span className="block text-[11px] font-normal tabular-nums">
                    {counts[i]}/{sheet.students.length}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sheet.students.map((s, n) => (
              <tr key={s.id}>
                <td className="px-3 py-1.5 text-muted-foreground tabular-nums">{n + 1}</td>
                <td className="px-3 py-1.5 font-medium text-foreground">{s.name}</td>
                {sheet.competencies.map((c, i) => {
                  const key = cellKey(s.id, c.id);
                  return (
                    <td key={c.id} className="px-2 py-1.5">
                      <div className="flex justify-center">
                        <LevelCell
                          student={s}
                          competency={c}
                          index={i}
                          value={d.valueOf(key)}
                          changed={key in d.drafts}
                          error={errors[key]}
                          disabled={!editable || isPending}
                          onLevel={(level): void => d.set(key, { ...d.valueOf(key), level })}
                          onConclusion={(): void => setEditing({ studentId: s.id, competencyId: c.id })}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {sheet.students.length === 0 && <p className="px-6 py-10 text-center text-sm text-muted-foreground">No hay estudiantes en esta sección.</p>}
      </div>
      {editable && <SaveBar count={d.count} busy={isPending} onDiscard={d.reset} onSave={save} />}
      {editing && student && compIndex >= 0 && (
        <ConclusionDialog
          student={student}
          competency={sheet.competencies[compIndex]}
          value={d.valueOf(cellKey(editing.studentId, editing.competencyId))}
          readOnly={!editable}
          onClose={(): void => setEditing(null)}
          onSave={(v): void => {
            d.set(cellKey(editing.studentId, editing.competencyId), v);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
};

const ScoreGrid = ({ slug, sheet, onBack, reload }: GridProps): JSX.Element => {
  const saved = scoreMap(sheet.scores);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [dialog, setDialog] = useState<Evaluation | 'new' | null>(null);
  const [isPending, startTransition] = useTransition();
  const editable = sheet.canEdit;
  const passing = sheet.passingGrade;
  const count = Object.keys(drafts).length;

  const text = (studentId: string, evaluationId: string): string => {
    const key = `${studentId}:${evaluationId}`;
    if (key in drafts) return drafts[key];
    const v = saved.get(key);
    return v === undefined ? '' : String(v);
  };
  const value = (studentId: string, evaluationId: string): number | null => {
    const t = text(studentId, evaluationId);
    return /^\d{1,2}$/.test(t) && Number(t) <= 20 ? Number(t) : null;
  };
  const invalid = Object.values(drafts).some((t) => t !== '' && !(/^\d{1,2}$/.test(t) && Number(t) <= 20));

  const save = (): void =>
    startTransition(async () => {
      const byEval = new Map<string, Record<string, number | null>>();
      for (const [key, t] of Object.entries(drafts)) {
        const [studentId, evaluationId] = key.split(':');
        const scores = byEval.get(evaluationId) ?? {};
        scores[studentId] = t === '' ? null : Number(t);
        byEval.set(evaluationId, scores);
      }
      for (const [evaluationId, scores] of byEval) {
        const result = await saveScoresAction(slug, sheet.assignmentId, sheet.termId, evaluationId, scores);
        if (!result.ok) {
          sileo.error({ title: 'No se pudo guardar', description: result.message });
          return;
        }
      }
      setDrafts({});
      sileo.success({ title: 'Notas guardadas' });
      reload();
    });

  const remove = (e: Evaluation): void =>
    startTransition(async () => {
      const result = await deleteEvaluationAction(slug, sheet.assignmentId, sheet.termId, e.id);
      if (!result.ok) sileo.error({ title: 'No se pudo eliminar', description: result.message });
      else {
        sileo.success({ title: 'Evaluación eliminada' });
        reload();
      }
    });

  const weights = sheet.evaluations.reduce((n, e) => n + e.weight, 0);

  return (
    <div className="space-y-4">
      <SheetHeader slug={slug} sheet={sheet} title={sheet.subjectName} subtitle={subtitleOf(sheet)} onBack={onBack} onChanged={reload} dirty={count > 0} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          El promedio pondera cada evaluación por su peso{weights > 0 && ` (suman ${weights})`}; las que aún no tienen nota no cuentan.
          {passing !== undefined && ` Aprueba con ${passing}.`}
        </p>
        {editable && (
          <button type="button" className="btn-alt" onClick={(): void => setDialog('new')}>
            <MorphIcon icon={Plus} size={16} />
            Nueva evaluación
          </button>
        )}
      </div>
      {sheet.evaluations.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Aún no hay evaluaciones. Agrega la primera: una práctica, un indicador de logro o un examen.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border align-bottom text-muted-foreground">
                <th scope="col" className="w-10 px-3 py-3 font-medium whitespace-nowrap">N.°</th>
                <th scope="col" className="min-w-56 px-3 py-3 font-medium">Estudiante</th>
                {sheet.evaluations.map((e) => (
                  <th key={e.id} scope="col" className="min-w-28 px-2 py-3 text-center font-medium">
                    <span className="block text-foreground">{e.name}</span>
                    <span className="block text-[11px] font-normal tabular-nums">
                      peso {e.weight}
                      {e.heldOn && ` · ${formatDay(e.heldOn, false)}`}
                    </span>
                    {editable && (
                      <span className="mt-1 flex justify-center gap-1">
                        <button type="button" className="inline-flex size-8 items-center justify-center rounded-md hover:bg-secondary" aria-label={`Editar ${e.name}`} onClick={(): void => setDialog(e)}>
                          <MorphIcon icon={Pencil} size={12} />
                        </button>
                        <ConfirmDelete compact title={`Eliminar «${e.name}»`} description="Se borran también todas sus notas. No se puede deshacer." isPending={isPending} onConfirm={(): void => remove(e)} />
                      </span>
                    )}
                  </th>
                ))}
                <th scope="col" className="px-3 py-3 text-center font-medium">Promedio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sheet.students.map((s, n) => {
                const avg = weightedAverage(sheet.evaluations, (id) => value(s.id, id));
                const failing = avg !== null && passing !== undefined && Math.floor(avg + 0.5) < passing;
                return (
                  <tr key={s.id}>
                    <td className="px-3 py-1.5 text-muted-foreground tabular-nums">{n + 1}</td>
                    <td className="px-3 py-1.5 font-medium text-foreground">{s.name}</td>
                    {sheet.evaluations.map((e) => {
                      const key = `${s.id}:${e.id}`;
                      const t = text(s.id, e.id);
                      const bad = t !== '' && value(s.id, e.id) === null;
                      const low = passing !== undefined && value(s.id, e.id) !== null && (value(s.id, e.id) ?? 0) < passing;
                      return (
                        <td key={e.id} className="px-2 py-1.5 text-center">
                          <input placeholder="–"
                            aria-label={`${e.name} de ${s.name}`}
                            inputMode="numeric"
                            value={t}
                            maxLength={2}
                            disabled={!editable || isPending}
                            onChange={(ev): void => {
                              const next = ev.target.value.replace(/\D/g, '');
                              setDrafts((c) => {
                                const orig = saved.get(key);
                                if ((orig === undefined && next === '') || String(orig) === next) {
                                  const rest = { ...c };
                                  delete rest[key];
                                  return rest;
                                }
                                return { ...c, [key]: next };
                              });
                            }}
                            className={cn(
                              'placeholder:text-muted-foreground/60 h-8 w-14 rounded-md border bg-background text-center tabular-nums disabled:opacity-100',
                              key in drafts ? 'border-brand' : 'border-border',
                              bad && 'border-destructive text-destructive',
                              low && !bad && 'text-destructive',
                            )}
                          />
                        </td>
                      );
                    })}
                    <td className={cn('px-3 py-1.5 text-center font-semibold tabular-nums', failing ? 'text-destructive' : 'text-foreground')}>{formatAverage(avg)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {editable && sheet.evaluations.length > 0 && (
        <SaveBar count={count} busy={isPending || invalid} onDiscard={(): void => setDrafts({})} onSave={save}>
          {invalid && <span className="text-sm text-destructive">Las notas van de 0 a 20.</span>}
        </SaveBar>
      )}
      {dialog && <EvaluationDialog slug={slug} sheet={sheet} evaluation={dialog === 'new' ? null : dialog} onClose={(): void => setDialog(null)} onSaved={reload} />}
    </div>
  );
};

const EvaluationDialog = ({ slug, sheet, evaluation, onClose, onSaved }: { slug: string; sheet: Sheet; evaluation: Evaluation | null; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const n = sheet.evaluations.length + 1;
  const form = useAcademicForm<EvaluationValues, Sheet>({
    initial: { name: evaluation?.name ?? (sheet.passingGrade !== undefined ? `Indicador de logro ${n}` : `Práctica calificada ${n}`), weight: String(evaluation?.weight ?? 1), heldOn: evaluation?.heldOn ?? '' },
    validate: (v): Record<string, string> => {
      const e: Record<string, string> = {};
      if (!v.name.trim()) e.name = 'Ponle un nombre.';
      const w = Number(v.weight);
      if (!/^\d{1,3}$/.test(v.weight) || w < 1 || w > 100) e.weight = 'El peso va de 1 a 100.';
      return e;
    },
    save: (v) => saveEvaluationAction(slug, sheet.assignmentId, sheet.termId, evaluation?.id ?? '', v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });
  const { values, errors, setField } = form;
  return (
    <FormDialog title={evaluation ? 'Editar evaluación' : 'Nueva evaluación'} description={sheet.subjectName} submitLabel={evaluation ? 'Guardar' : 'Agregar'} isPending={form.isPending} onSubmit={form.submit} onClose={onClose}>
      <FormField id="ev-name" label="Nombre" required error={errors.name}>
        <Input placeholder="Ej.: Práctica calificada 1" id="ev-name" value={values.name} maxLength={120} onChange={(e): void => setField('name', e.target.value)} aria-invalid={Boolean(errors.name)} />
      </FormField>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="ev-weight" label="Peso" required error={errors.weight} hint="Pesos iguales: promedio simple.">
          <Input placeholder="1" id="ev-weight" inputMode="numeric" value={values.weight} onChange={(e): void => setField('weight', e.target.value.replace(/\D/g, '').slice(0, 3))} aria-invalid={Boolean(errors.weight)} />
        </FormField>
        <FormField id="ev-date" label="Fecha" error={errors.heldOn}>
          <Input id="ev-date" type="date" value={values.heldOn} onChange={(e): void => setField('heldOn', e.target.value)} />
        </FormField>
      </div>
    </FormDialog>
  );
};
