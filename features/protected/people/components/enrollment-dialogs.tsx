'use client';

import { useEffect, useState, useTransition, type JSX } from 'react';
import { Check, LoaderCircle } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { Textarea } from '@/components/ui/textarea';
import { controlClassName, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { attentionModeLabels, items, lower, shiftLabels, todayISO } from '@/features/protected/academic/data/academic-data';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { cn } from '@/lib/utils';
import { endEnrollmentAction, enrollAction, getBoardAction, moveEnrollmentAction, ratifyAction, searchStudentsAction } from '../actions/people-actions';
import { enrollmentKindLabels, fullName } from '../data/people-data';
import { useDebounced } from '../hooks/use-debounced';
import type { BoardData, EndFormValues, Enrollment, EnrollFormValues, Level, MoveFormValues, PeopleContextData, RatifyResult, Section, Student } from '../types';
import { SearchBox } from './people-ui';

const emptyBoard = { periodId: '', levelId: '', gradeId: '', sectionId: '', status: 'active', query: '', page: 1 };

// The sections of a period with their free places, and the institute units, for the pickers
const useBoard = (slug: string, periodId: string): BoardData | null => {
  const { data } = useAcademicData(`board-meta:${slug}:${periodId}`, async () => (periodId ? getBoardAction(slug, { ...emptyBoard, periodId }, 1) : { ok: false as const, message: '' }));
  return data;
};

const freeOf = (board: BoardData | null, sectionId: string): number | null => {
  const o = board?.occupancy.find((x) => x.sectionId === sectionId);
  return o ? o.capacity - o.active : null;
};

interface SectionPickerProps {
  ctx: PeopleContextData;
  board: BoardData | null;
  levelId: string;
  gradeId: string;
  sectionId: string;
  errors: Record<string, string>;
  onLevel: (levelId: string) => void;
  onGrade: (gradeId: string) => void;
  onSection: (sectionId: string) => void;
  lockLevel?: boolean;
}

// Level → grade → section, each section with its shift and free places
const SectionPicker = ({ ctx, board, levelId, gradeId, sectionId, errors, onLevel, onGrade, onSection, lockLevel }: SectionPickerProps): JSX.Element => {
  const v = ctx.context.vocabulary;
  const level = ctx.levels.find((l) => l.id === levelId);
  const sections = (board?.sections ?? []).filter((s) => s.levelId === levelId && (!ctx.context.hasGrades || s.gradeId === gradeId));
  return (
    <>
      <div className={cn('grid gap-5', ctx.context.hasGrades && 'sm:grid-cols-2')}>
        <FormField id="en-level" label={v?.level ?? 'Nivel'} required error={errors.levelId}>
          <SelectField id="en-level" value={levelId} disabled={lockLevel} options={ctx.levels.filter((l) => l.isActive).map((l) => ({ value: l.id, label: l.name }))} onChange={onLevel} invalid={Boolean(errors.levelId)} />
        </FormField>
        {ctx.context.hasGrades && (
          <FormField id="en-grade" label={v?.grade ?? 'Grado'} required error={errors.gradeId}>
            <SelectField id="en-grade" value={gradeId} options={(level?.grades ?? []).map((g) => ({ value: g.id, label: g.name }))} onChange={onGrade} invalid={Boolean(errors.gradeId)} />
          </FormField>
        )}
      </div>
      <FormField id="en-section" label={v?.section ?? 'Sección'} error={errors.sectionId} hint={sections.length === 0 ? `Este periodo aún no tiene ${lower(v?.sections ?? 'secciones')} para lo elegido; puedes asignarla después.` : undefined}>
        <div role="radiogroup" aria-label={v?.section ?? 'Sección'} className="flex flex-wrap gap-2">
          <SectionOption selected={sectionId === ''} label="Asignar después" detail="" onSelect={(): void => onSection('')} />
          {sections.map((s: Section) => {
            const free = freeOf(board, s.id);
            return <SectionOption key={s.id} selected={sectionId === s.id} disabled={free !== null && free <= 0} label={s.name} detail={`${shiftLabels[s.shift]}${s.attentionMode ? ` · ${attentionModeLabels[s.attentionMode]}` : ''} · ${free === null ? s.capacity : free <= 0 ? 'llena' : `${free} libres`}`} onSelect={(): void => onSection(s.id)} />;
          })}
        </div>
      </FormField>
    </>
  );
};

const SectionOption = ({ selected, disabled, label, detail, onSelect }: { selected: boolean; disabled?: boolean; label: string; detail: string; onSelect: () => void }): JSX.Element => (
  <button type="button" role="radio" aria-checked={selected} disabled={disabled} onClick={onSelect} className={cn('flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:opacity-45', selected ? 'border-brand bg-brand-soft text-brand' : 'border-border hover:border-brand/50')}>
    {selected && <MorphIcon icon={Check} size={14} strokeWidth={2.5} />}
    <span className="font-semibold">{label}</span>
    {detail && <span className="text-xs text-muted-foreground">{detail}</span>}
  </button>
);

// Institutes: the units of the program, grouped by semester; the semester's own are the default
const UnitPicker = ({ board, level, selected, onChange, error }: { board: BoardData | null; level: Level | undefined; selected: string[]; onChange: (ids: string[]) => void; error?: string }): JSX.Element | null => {
  if (!board || !level) return null;
  const units = board.units.filter((_, i) => board.unitLevelIds[i] === level.id);
  if (units.length === 0) return <p className="text-sm text-warning">El programa no tiene un plan de estudios vigente.</p>;
  const credits = units.filter((u) => selected.includes(u.id)).reduce((sum, u) => sum + (u.theoryCredits ?? 0) + (u.practiceCredits ?? 0), 0);
  return (
    <FormField id="en-units" label={`Unidades didácticas · ${credits} créditos`} error={error}>
      <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border border-border p-3">
        {level.grades.map((g) => {
          const own = units.filter((u) => u.gradeIds.includes(g.id));
          if (own.length === 0) return null;
          return (
            <div key={g.id}>
              <p className="mb-1 text-xs font-semibold text-muted-foreground">{g.name}</p>
              <ul className="space-y-1">
                {own.map((u) => {
                  const on = selected.includes(u.id);
                  return (
                    <li key={u.id}>
                      <button type="button" aria-pressed={on} onClick={(): void => onChange(on ? selected.filter((id) => id !== u.id) : [...selected, u.id])} className={cn('flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm', on ? 'bg-brand-soft text-foreground' : 'hover:bg-secondary')}>
                        <span className={cn('flex size-4 shrink-0 items-center justify-center rounded border', on ? 'border-brand bg-brand-solid text-white' : 'border-input')}>{on && <MorphIcon icon={Check} size={11} strokeWidth={3} />}</span>
                        <span className="min-w-0 flex-1 truncate">{u.name}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">{(u.theoryCredits ?? 0) + (u.practiceCredits ?? 0)} cr.</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </FormField>
  );
};

const semesterUnits = (board: BoardData | null, levelId: string, gradeId: string): string[] => (board ? board.units.filter((u, i) => board.unitLevelIds[i] === levelId && u.gradeIds.includes(gradeId)).map((u) => u.id) : []);

interface EnrollDialogProps {
  slug: string;
  ctx: PeopleContextData;
  periodId?: string;
  student?: Student | null;
  initial?: { levelId?: string; gradeId?: string; sectionId?: string };
  onClose: () => void;
  onSaved: (e: Enrollment) => void;
}

// Enroll one student: who (searched among those not yet enrolled in the period), where, and how they arrive
export const EnrollDialog = ({ slug, ctx, periodId: fixedPeriod, student, initial, onClose, onSaved }: EnrollDialogProps): JSX.Element => {
  const institute = ctx.context.usesFormativeLevels;
  const defaultPeriod = fixedPeriod ?? (ctx.periods.find((p) => p.status === 'active') ?? ctx.periods.find((p) => p.status === 'planning'))?.id ?? '';
  const firstLevel = ctx.levels.find((l) => l.id === initial?.levelId) ?? ctx.levels.find((l) => l.isActive);
  const [today] = useState(todayISO);
  const [picked, setPicked] = useState<Student | null>(student ?? null);
  const [search, setSearch] = useState('');
  const { values, errors, isPending, setField, submit } = useAcademicForm<EnrollFormValues, Enrollment>({
    initial: {
      studentId: student?.id ?? '',
      periodId: defaultPeriod,
      levelId: firstLevel?.id ?? '',
      gradeId: initial?.gradeId ?? firstLevel?.grades[0]?.id ?? '',
      sectionId: initial?.sectionId ?? '',
      kind: 'new',
      enrolledOn: today,
      origin: '',
      notes: '',
      unitIds: [],
    },
    validate: (v): Record<string, string> => ({ ...(v.studentId ? {} : { studentId: 'Elige un estudiante.' }), ...(v.periodId ? {} : { periodId: 'Elige el periodo.' }) }),
    save: (v) => enrollAction(slug, v),
    onSaved: (e) => {
      onSaved(e);
      onClose();
    },
  });
  const board = useBoard(slug, values.periodId);
  const level = ctx.levels.find((l) => l.id === values.levelId);
  const unitsKey = `${values.levelId}:${values.gradeId}:${board ? 'ready' : 'none'}`;
  // Institutes start with the units of the chosen semester
  const [unitsFor, setUnitsFor] = useState('');
  if (institute && board && unitsFor !== unitsKey) {
    setUnitsFor(unitsKey);
    setField('unitIds', semesterUnits(board, values.levelId, values.gradeId));
  }

  const query = useDebounced(search);
  const { data: results } = useAcademicData(`enroll-search:${slug}:${values.periodId}:${query}`, async () => (picked || student ? { ok: true as const, data: [] as Student[] } : searchStudentsAction(slug, query, values.periodId)));
  const periods = ctx.periods.filter((p) => p.status !== 'closed');

  return (
    <FormDialog title="Matricular" description={picked ? fullName(picked) : 'Busca al estudiante entre los que aún no están matriculados en el periodo.'} submitLabel="Matricular" isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      {!student && (
        <FormField id="en-student" label="Estudiante" required error={errors.studentId}>
          {picked ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-brand/40 bg-brand-soft px-4 py-2.5 text-sm">
              <span className="font-medium text-foreground">
                {fullName(picked)} <span className="text-muted-foreground">· {picked.code}</span>
              </span>
              <button
                type="button"
                className="text-sm font-medium text-brand hover:underline"
                onClick={(): void => {
                  setPicked(null);
                  setField('studentId', '');
                }}
              >
                Cambiar
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <SearchBox value={search} onChange={setSearch} placeholder="Nombre, código o DNI" autoFocus />
              <ul className="max-h-48 divide-y divide-border overflow-y-auto rounded-lg border border-border">
                {(results ?? []).map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-secondary"
                      onClick={(): void => {
                        setPicked(s);
                        setField('studentId', s.id);
                      }}
                    >
                      <span className="text-foreground">{fullName(s)}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {s.code} · {s.documentNumber}
                      </span>
                    </button>
                  </li>
                ))}
                {results && results.length === 0 && <li className="px-3 py-3 text-sm text-muted-foreground">{query ? 'Nadie sin matrícula con ese texto. Si es nuevo, regístralo primero en Estudiantes.' : 'Todos los estudiantes activos ya están matriculados en este periodo. Si es nuevo, regístralo primero en Estudiantes.'}</li>}
              </ul>
            </div>
          )}
        </FormField>
      )}
      {!fixedPeriod && (
        <FormField id="en-period" label={ctx.context.vocabulary?.period ?? 'Periodo'} required error={errors.periodId}>
          <SelectField id="en-period" value={values.periodId} options={periods.map((p) => ({ value: p.id, label: p.name }))} onChange={(v): void => setField('periodId', v)} invalid={Boolean(errors.periodId)} />
        </FormField>
      )}
      <SectionPicker
        ctx={ctx}
        board={board}
        levelId={values.levelId}
        gradeId={values.gradeId}
        sectionId={values.sectionId}
        errors={errors}
        onLevel={(id): void => {
          setField('levelId', id);
          setField('gradeId', ctx.levels.find((l) => l.id === id)?.grades[0]?.id ?? '');
          setField('sectionId', '');
        }}
        onGrade={(id): void => {
          setField('gradeId', id);
          setField('sectionId', '');
        }}
        onSection={(id): void => setField('sectionId', id)}
      />
      {institute && <UnitPicker board={board} level={level} selected={values.unitIds} onChange={(ids): void => setField('unitIds', ids)} error={errors.unitIds} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="en-kind" label="Tipo de matrícula" required error={errors.kind}>
          <SelectField id="en-kind" value={values.kind} options={items(enrollmentKindLabels)} onChange={(v): void => setField('kind', v)} />
        </FormField>
        <FormField id="en-date" label="Fecha" error={errors.enrolledOn}>
          <Input id="en-date" type="date" value={values.enrolledOn} onChange={(e): void => setField('enrolledOn', e.target.value)} className={controlClassName} />
        </FormField>
      </div>
      {values.kind === 'transfer_in' && (
        <FormField id="en-origin" label="Institución de procedencia" required error={errors.origin}>
          <Input id="en-origin" value={values.origin} maxLength={160} onChange={(e): void => setField('origin', e.target.value)} aria-invalid={Boolean(errors.origin)} className={controlClassName} />
        </FormField>
      )}
      <FormField id="en-notes" label="Observaciones" error={errors.notes}>
        <Textarea id="en-notes" rows={2} maxLength={1000} value={values.notes} onChange={(e): void => setField('notes', e.target.value)} className="rounded-lg bg-background" />
      </FormField>
    </FormDialog>
  );
};

interface MoveDialogProps {
  slug: string;
  ctx: PeopleContextData;
  enrollment: Enrollment;
  onClose: () => void;
  onSaved: () => void;
}

// Change of section (or grade) inside the same level and period; institutes can change units too
export const MoveDialog = ({ slug, ctx, enrollment, onClose, onSaved }: MoveDialogProps): JSX.Element => {
  const institute = ctx.context.usesFormativeLevels;
  const board = useBoard(slug, enrollment.periodId);
  const level = ctx.levels.find((l) => l.id === enrollment.levelId);
  const { values, errors, isPending, setField, submit } = useAcademicForm<MoveFormValues, Enrollment>({
    initial: { gradeId: enrollment.gradeId, sectionId: enrollment.sectionId, notes: enrollment.notes, unitIds: enrollment.unitIds },
    save: (v) => moveEnrollmentAction(slug, enrollment.id, v, institute),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });
  return (
    <FormDialog title="Cambiar de sección" description={`${enrollment.studentName} · ${enrollment.periodName}`} submitLabel="Guardar cambios" isPending={isPending} onSubmit={submit} onClose={onClose} wide>
      <SectionPicker
        ctx={ctx}
        board={board}
        levelId={enrollment.levelId}
        gradeId={values.gradeId}
        sectionId={values.sectionId}
        errors={errors}
        lockLevel
        onLevel={(): void => undefined}
        onGrade={(id): void => {
          setField('gradeId', id);
          setField('sectionId', '');
        }}
        onSection={(id): void => setField('sectionId', id)}
      />
      {institute && <UnitPicker board={board} level={level} selected={values.unitIds} onChange={(ids): void => setField('unitIds', ids)} error={errors.unitIds} />}
      <FormField id="mv-notes" label="Observaciones" error={errors.notes}>
        <Textarea id="mv-notes" rows={2} maxLength={1000} value={values.notes} onChange={(e): void => setField('notes', e.target.value)} className="rounded-lg bg-background" />
      </FormField>
    </FormDialog>
  );
};

// Withdrawal or transfer to another institution, with its date
export const EndDialog = ({ slug, enrollment, onClose, onSaved }: { slug: string; enrollment: Enrollment; onClose: () => void; onSaved: () => void }): JSX.Element => {
  const [today] = useState(todayISO);
  const { values, errors, isPending, setField, submit } = useAcademicForm<EndFormValues, Enrollment>({
    initial: { status: 'withdrawn', endedOn: today, destination: '' },
    validate: (v): Record<string, string> => (v.status === 'transferred' && v.destination.trim() === '' ? { destination: 'Indica a qué institución se traslada.' } : {}),
    save: (v) => endEnrollmentAction(slug, enrollment.id, v),
    onSaved: () => {
      onSaved();
      onClose();
    },
  });
  return (
    <FormDialog title="Retiro o traslado" description={`${enrollment.studentName} deja de ocupar su vacante desde la fecha indicada. Su historial se conserva.`} submitLabel="Registrar" isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="end-status" label="Motivo" required>
        <SelectField id="end-status" value={values.status} options={[{ value: 'withdrawn', label: 'Retiro' }, { value: 'transferred', label: 'Traslado a otra institución' }]} onChange={(v): void => setField('status', v)} />
      </FormField>
      <FormField id="end-date" label="Fecha" required error={errors.endedOn}>
        <Input id="end-date" type="date" min={enrollment.enrolledOn} value={values.endedOn} onChange={(e): void => setField('endedOn', e.target.value)} aria-invalid={Boolean(errors.endedOn)} className={controlClassName} />
      </FormField>
      {values.status === 'transferred' && (
        <FormField id="end-destination" label="Institución de destino" required error={errors.destination}>
          <Input id="end-destination" value={values.destination} maxLength={160} onChange={(e): void => setField('destination', e.target.value)} aria-invalid={Boolean(errors.destination)} className={controlClassName} />
        </FormField>
      )}
    </FormDialog>
  );
};

interface RatifyDialogProps {
  slug: string;
  ctx: PeopleContextData;
  toPeriodId: string;
  onClose: () => void;
  onDone: () => void;
}

// Continuing students of a previous period into the next grade of this one: preview the counts, then confirm
export const RatifyDialog = ({ slug, ctx, toPeriodId, onClose, onDone }: RatifyDialogProps): JSX.Element => {
  const sources = ctx.periods.filter((p) => p.id !== toPeriodId && p.sectionCount > 0);
  const [from, setFrom] = useState(sources[0]?.id ?? '');
  const [preview, setPreview] = useState<RatifyResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const target = ctx.periods.find((p) => p.id === toPeriodId);
  const v = ctx.context.vocabulary;

  useEffect(() => {
    if (!from) return;
    let active = true;
    void ratifyAction(slug, from, toPeriodId, true).then((r) => {
      if (active) setPreview(r.ok ? r.data : null);
    });
    return () => {
      active = false;
    };
  }, [slug, from, toPeriodId]);

  const confirm = (): void =>
    startTransition(async (): Promise<void> => {
      const r = await ratifyAction(slug, from, toPeriodId, false);
      if (!r.ok) {
        sileo.error({ title: 'No se pudo ratificar', description: r.message });
        return;
      }
      sileo.success({ title: `${r.data.enrolled} matrículas registradas`, description: r.data.withoutSection > 0 ? `${r.data.withoutSection} quedaron sin ${lower(v?.section ?? 'sección')}: asígnalas en la lista.` : undefined });
      onDone();
      onClose();
    });

  const row = (label: string, value: number | undefined, hint?: string): JSX.Element => (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <span className="text-sm text-foreground">
        {label}
        {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
      </span>
      <span className="text-lg font-semibold text-foreground tabular-nums">{value ?? '…'}</span>
    </div>
  );

  return (
    <FormDialog title="Ratificar continuadores" description={`Matricula en ${target?.name ?? 'este periodo'} a quienes estuvieron en otro, en el ${lower(v?.grade || 'grado')} siguiente y en la ${lower(v?.section ?? 'sección')} del mismo nombre.`} submitLabel={isPending ? 'Ratificando…' : `Matricular a ${preview?.enrolled ?? 0}`} isPending={isPending || !preview || preview.enrolled === 0} onSubmit={confirm} onClose={onClose}>
      {sources.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay otro periodo con estudiantes de donde ratificar.</p>
      ) : (
        <>
          <FormField id="ratify-from" label="Desde">
            <SelectField id="ratify-from" value={from} options={sources.map((p) => ({ value: p.id, label: p.name }))} onChange={(id): void => { setPreview(null); setFrom(id); }} />
          </FormField>
          <div className="divide-y divide-border rounded-lg border border-border px-4">
            {row('Se matricularán', preview?.enrolled)}
            {row(`Quedarán sin ${lower(v?.section ?? 'sección')}`, preview?.withoutSection, 'No hay una del mismo nombre o está llena.')}
            {row('Ya matriculados', preview?.already)}
            {row('Terminan sus estudios', preview?.finishing, 'Estaban en el último grado.')}
            {row('Inactivos', preview?.inactive)}
          </div>
          {!preview && from && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MorphIcon icon={LoaderCircle} size={14} className="animate-spin" />
              Calculando…
            </p>
          )}
          <p className="text-xs text-muted-foreground">Supone que todos fueron promovidos; la situación final (promovido, permanece o recuperación) llega con el cierre del año.</p>
        </>
      )}
    </FormDialog>
  );
};
