'use client';

import { useState, useTransition, type JSX } from 'react';
import { ClipboardList, LoaderCircle, Plus, Save, Wand2, X } from 'lucide';
import { sileo } from 'sileo';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ConfirmDelete, SelectField } from '@/features/protected/academic/components/academic-ui';
import { lower, shiftLabels } from '@/features/protected/academic/data/academic-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { cn } from '@/lib/utils';
import { deleteAssignmentAction, prepareLoadAction, setTimeBlocksAction, setTutorAction, updateAssignmentAction } from '../actions/schedule-actions';
import type { Assignment, BlockDraft, PlannerData, Staff } from '../types';
import { EmptyNote } from './week-grid';

const teacherName = (t: Staff): string => `${t.surnames}, ${t.givenNames}`;

// Carga docente: who teaches each subject of each section and how many hours, the tutor of each section, and how
// loaded every teacher ends up
export const LoadView = ({ slug, data, onChange }: { slug: string; data: PlannerData; onChange: () => void }): JSX.Element => {
  const [levelId, setLevelId] = useState('');
  const [isPending, startTransition] = useTransition();
  const canManage = data.context.canManage && data.period.status !== 'closed';
  const levels = [...new Map(data.sections.map((s) => [s.levelId, s.levelName])).entries()];
  const sections = data.sections.filter((s) => !levelId || s.levelId === levelId);
  const teacherOptions = [{ value: '', label: 'Sin docente' }, ...data.teachers.map((t) => ({ value: t.id, label: teacherName(t) }))];
  const loadOf = (id: string): number => data.assignments.filter((a) => a.staffId === id).reduce((s, a) => s + a.weeklyHours, 0);
  const unassigned = data.assignments.filter((a) => !a.staffId).length;

  const prepare = (): void =>
    startTransition(async (): Promise<void> => {
      const r = await prepareLoadAction(slug, data.period.id);
      if (r.ok) sileo.success({ title: r.data > 0 ? `${r.data} cursos agregados a la carga` : 'La carga ya tenía todos los cursos de los planes vigentes' });
      else sileo.error({ title: 'No se pudo preparar', description: r.message });
      onChange();
    });
  const update = (a: Assignment, staffId: string, hours: number): void =>
    startTransition(async (): Promise<void> => {
      const r = await updateAssignmentAction(slug, a.id, staffId, hours);
      if (!r.ok) sileo.error({ title: 'No se pudo cambiar', description: r.message });
      onChange();
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-60">
            <SelectField id="load-level" value={levelId} options={[{ value: '', label: `Todos los ${lower(data.context.vocabulary?.levels ?? 'niveles')}` }, ...levels.map(([value, label]) => ({ value, label }))]} onChange={setLevelId} />
          </div>
          <span className="text-sm text-muted-foreground">
            {data.assignments.length} cursos en la carga · {unassigned > 0 ? <span className="font-medium text-warning">{unassigned} sin docente</span> : 'todos con docente'}
          </span>
        </div>
        {canManage && (
          <button type="button" className="btn-alt" disabled={isPending} onClick={prepare}>
            <MorphIcon icon={ClipboardList} size={16} />
            Preparar desde los planes de estudio
          </button>
        )}
      </div>

      {data.assignments.length === 0 ? (
        <EmptyNote>La carga está vacía. «Preparar desde los planes de estudio» agrega a cada sección los cursos de su plan vigente con sus horas.</EmptyNote>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {sections.map((sec) => {
            const own = data.assignments.filter((a) => a.sectionId === sec.id);
            if (own.length === 0) return null;
            return (
              <section key={sec.id} className="rounded-2xl border border-border bg-background">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
                  <h3 className="font-semibold text-foreground">
                    {sec.gradeShort} {sec.name} <span className="font-normal text-muted-foreground">· {sec.levelName}</span>
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Tutor</span>
                    <div className="w-56">
                      <SelectField
                        id={`tutor-${sec.id}`}
                        value={sec.tutorId}
                        disabled={!canManage || isPending}
                        options={teacherOptions}
                        onChange={(v): void =>
                          startTransition(async (): Promise<void> => {
                            await runAcademicAction(setTutorAction(slug, sec.id, v));
                            onChange();
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <ul className="divide-y divide-border">
                  {own.map((a) => (
                    <li key={a.id} className="grid grid-cols-[minmax(0,1fr)_14rem_4.5rem_2rem] items-center gap-2 px-4 py-2 text-sm">
                      <span className="min-w-0">
                        <span className="block truncate text-foreground" title={a.subjectName}>
                          {a.subjectName}
                        </span>
                        <span className="text-xs text-muted-foreground tabular-nums">{a.scheduled} en el horario</span>
                      </span>
                      <SelectField id={`teacher-${a.id}`} value={a.staffId} disabled={!canManage || isPending} options={teacherOptions} onChange={(v): void => update(a, v, a.weeklyHours)} />
                      <HoursInput value={a.weeklyHours} disabled={!canManage || isPending} onCommit={(h): void => update(a, a.staffId, h)} />
                      {canManage ? (
                        <ConfirmDelete
                          compact
                          label="Quitar"
                          title={`¿Quitar ${a.subjectName} de la carga?`}
                          description="También se quitan sus horas del horario."
                          onConfirm={(): void =>
                            startTransition(async (): Promise<void> => {
                              await runAcademicAction(deleteAssignmentAction(slug, a.id));
                              onChange();
                            })
                          }
                        />
                      ) : (
                        <span />
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {data.teachers.length > 0 && (
        <section aria-labelledby="teachers-load" className="space-y-3">
          <h2 id="teachers-load" className="text-xl font-semibold text-foreground">
            Horas por docente
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {data.teachers
              .map((t) => ({ t, hours: loadOf(t.id) }))
              .sort((x, y) => y.hours - x.hours)
              .map(({ t, hours }) => {
                const max = t.maxWeeklyHours ?? 30;
                const over = hours > max;
                return (
                  <li key={t.id} className="rounded-xl border border-border bg-background px-4 py-3">
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span className="truncate font-medium text-foreground">{teacherName(t)}</span>
                      <span className={cn('shrink-0 tabular-nums', over ? 'font-semibold text-warning' : 'text-muted-foreground')}>
                        {hours}/{max} h
                      </span>
                    </div>
                    <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className={cn('h-full rounded-full', over ? 'bg-warning' : 'bg-brand-solid')} style={{ width: `${Math.min(100, (hours / max) * 100)}%` }} />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{t.specialty || t.position}</p>
                  </li>
                );
              })}
          </ul>
        </section>
      )}
    </div>
  );
};

const HoursInput = ({ value, disabled, onCommit }: { value: number; disabled: boolean; onCommit: (hours: number) => void }): JSX.Element => {
  const [draft, setDraft] = useState(String(value));
  const commit = (): void => {
    const n = Number(draft);
    if (Number.isFinite(n) && n !== value) onCommit(n);
    else setDraft(String(value));
  };
  return (
    <label className="flex items-center gap-1">
      <span className="sr-only">Horas semanales</span>
      <Input placeholder="0" inputMode="numeric" value={draft} disabled={disabled} onChange={(e): void => setDraft(e.target.value.replace(/\D/g, '').slice(0, 2))} onBlur={commit} onKeyDown={(e): void => (e.key === 'Enter' ? commit() : undefined)} className="h-9 w-12 rounded-md bg-background text-center tabular-nums" />
      <span className="text-xs text-muted-foreground">h</span>
    </label>
  );
};

// Horas del día: the class hours and breaks of each shift. A quick builder fills them from a start time
export const BlocksView = ({ slug, data, onChange }: { slug: string; data: PlannerData; onChange: () => void }): JSX.Element => {
  const shifts = data.context.settings?.shifts ?? ['morning'];
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {shifts.map((shift) => (
        <ShiftEditor
          key={
            shift +
            data.blocks
              .filter((b) => b.shift === shift)
              .map((b) => b.startsAt + b.endsAt + b.kind)
              .join()
          }
          slug={slug}
          shift={shift}
          data={data}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

const addMinutes = (clock: string, minutes: number): string => {
  const [h, m] = clock.split(':').map(Number);
  const total = h * 60 + m + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const ShiftEditor = ({ slug, shift, data, onChange }: { slug: string; shift: string; data: PlannerData; onChange: () => void }): JSX.Element => {
  const canManage = data.context.canManage;
  const [rows, setRows] = useState<BlockDraft[]>(() => data.blocks.filter((b) => b.shift === shift).map((b) => ({ startsAt: b.startsAt, endsAt: b.endsAt, kind: b.kind })));
  const [builder, setBuilder] = useState({ start: shift === 'morning' ? '07:45' : shift === 'afternoon' ? '13:00' : '18:30', minutes: '45', classes: '6', breakAfter: '3', breakMinutes: '20' });
  const [isPending, startTransition] = useTransition();
  const used = data.entries.filter((e) => e.shift === shift).length;

  const build = (): void => {
    const minutes = Number(builder.minutes) || 45;
    const classes = Math.min(12, Number(builder.classes) || 6);
    const after = Number(builder.breakAfter) || 0;
    const pause = Number(builder.breakMinutes) || 0;
    const out: BlockDraft[] = [];
    let at = builder.start;
    for (let i = 1; i <= classes; i++) {
      const end = addMinutes(at, minutes);
      out.push({ startsAt: at, endsAt: end, kind: 'class' });
      at = end;
      if (after > 0 && pause > 0 && i === after && i < classes) {
        const back = addMinutes(at, pause);
        out.push({ startsAt: at, endsAt: back, kind: 'break' });
        at = back;
      }
    }
    setRows(out);
  };
  const set = (i: number, patch: Partial<BlockDraft>): void => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const save = (): void =>
    startTransition(async (): Promise<void> => {
      const r = await runAcademicAction(setTimeBlocksAction(slug, shift, rows));
      if (r.ok) onChange();
    });

  return (
    <section className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold text-foreground">Turno {lower(shiftLabels[shift])}</h3>
        <span className="text-sm text-muted-foreground">
          {rows.filter((r) => r.kind === 'class').length} horas de clase · {used} clases en el horario
        </span>
      </div>
      {canManage && (
        <div className="mt-4 flex flex-wrap items-end gap-2 rounded-xl bg-surface p-3 text-sm">
          {(
            [
              ['start', 'Inicio', 'w-20'],
              ['minutes', 'Minutos', 'w-16'],
              ['classes', 'Horas', 'w-14'],
              ['breakAfter', 'Recreo tras', 'w-16'],
              ['breakMinutes', 'Recreo (min)', 'w-16'],
            ] as const
          ).map(([key, label, width]) => (
            <label key={key} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">{label}</span>
              <Input placeholder="07:45" value={builder[key]} onChange={(e): void => setBuilder((b) => ({ ...b, [key]: e.target.value.slice(0, 5) }))} className={cn('h-9 rounded-md bg-background tabular-nums', width)} />
            </label>
          ))}
          <button type="button" className="btn-alt h-9" onClick={build}>
            <MorphIcon icon={Wand2} size={15} />
            Armar
          </button>
        </div>
      )}
      <ol className="mt-4 space-y-1.5">
        {rows.map((r, i) => (
          <li key={i} className={cn('flex items-center gap-2 rounded-lg px-2 py-1', r.kind === 'break' && 'bg-surface')}>
            <span className="w-6 text-xs text-muted-foreground tabular-nums">{r.kind === 'class' ? rows.slice(0, i + 1).filter((x) => x.kind === 'class').length : ''}</span>
            <Input value={r.startsAt} inputMode="numeric" placeholder="07:45" maxLength={5} disabled={!canManage} onChange={(e): void => set(i, { startsAt: e.target.value })} className="h-9 w-20 rounded-md bg-background text-center tabular-nums" aria-label="Inicio (HH:MM)" />
            <span className="text-muted-foreground">–</span>
            <Input value={r.endsAt} inputMode="numeric" placeholder="08:30" maxLength={5} disabled={!canManage} onChange={(e): void => set(i, { endsAt: e.target.value })} className="h-9 w-20 rounded-md bg-background text-center tabular-nums" aria-label="Término (HH:MM)" />
            <div className="w-28">
              <SelectField
                id={`kind-${shift}-${i}`}
                value={r.kind}
                disabled={!canManage}
                options={[
                  { value: 'class', label: 'Clase' },
                  { value: 'break', label: 'Recreo' },
                ]}
                onChange={(v): void => set(i, { kind: v })}
              />
            </div>
            {canManage && (
              <button type="button" onClick={(): void => setRows((x) => x.filter((_, j) => j !== i))} className="ml-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-destructive" aria-label="Quitar bloque">
                <MorphIcon icon={X} size={14} />
              </button>
            )}
          </li>
        ))}
      </ol>
      {canManage && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" className="btn-alt" onClick={(): void => setRows((x) => [...x, { startsAt: x.at(-1)?.endsAt ?? '08:00', endsAt: addMinutes(x.at(-1)?.endsAt ?? '08:00', 45), kind: 'class' }])}>
            <MorphIcon icon={Plus} size={15} />
            Agregar hora
          </button>
          <button type="button" className="btn-brand" disabled={isPending} onClick={save}>
            <MorphIcon icon={isPending ? LoaderCircle : Save} size={15} className={isPending ? 'animate-spin' : ''} />
            Guardar
          </button>
          {used > 0 && <span className="text-xs text-muted-foreground">Si cambias o quitas una hora, sus clases salen del horario.</span>}
        </div>
      )}
    </section>
  );
};
