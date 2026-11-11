'use client';

import { useState, useTransition, type JSX } from 'react';
import { Sparkles } from 'lucide';
import { sileo } from 'sileo';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, controlClassName, LoadError, PageSkeleton, SelectField } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { lower, shiftLabels, weekdayLabels } from '@/features/protected/academic/data/academic-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { usePeopleContext } from '@/features/protected/people/hooks/use-people-context';
import { cn } from '@/lib/utils';
import { autoFillAction, clearSectionAction, getMyScheduleAction, getPlannerAction, placeClassAction, removeClassAction } from '../actions/schedule-actions';
import type { MyScheduleData, PlannerData, Section, TimeBlock } from '../types';
import { BlocksView, LoadView } from './load-views';
import { blocksFor, EmptyNote, toneFor, WeekGrid } from './week-grid';

type Tab = 'mine' | 'section' | 'teacher' | 'load' | 'blocks';

// Horarios: my week (teachers, students, families), each section's timetable, each teacher's week, the teaching
// load and the school day of each shift
export const SchedulesPage = (): JSX.Element => {
  const { data: ctx, error, isLoading, reload, slug } = usePeopleContext();
  const { data: mine } = useAcademicData(`my-schedule:${slug}`, () => getMyScheduleAction(slug));
  const periods = (ctx?.periods ?? []).filter((p) => p.status !== 'closed');
  const [periodId, setPeriodId] = useState('');
  const period = periods.find((p) => p.id === periodId) ?? periods.find((p) => p.status === 'active') ?? periods[0];
  const hasMine = Boolean(mine && mine.kind !== 'none');
  const [tab, setTab] = useState<Tab | null>(null);
  const current: Tab = tab ?? (hasMine ? 'mine' : 'section');
  const staffView = Boolean(ctx);

  const tabs: Array<[Tab, string]> = [...(hasMine ? ([['mine', 'Mi horario']] as Array<[Tab, string]>) : []), ...(staffView ? ([['section', 'Por sección'], ['teacher', 'Por docente'], ['load', 'Carga docente'], ['blocks', 'Horas del día']] as Array<[Tab, string]>) : [])];

  return (
    <AcademicPage titleId="schedules-title" title="Horarios" description="La carga docente de cada sección y su horario semanal, sin docentes en dos lugares a la vez." context={ctx ? { ...ctx.context, canManage: ctx.context.canManage } : hasMine ? { canManage: false } : null}>
      {isLoading && !mine ? (
        <PageSkeleton />
      ) : !ctx && !hasMine ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div role="tablist" aria-label="Vistas" className="flex gap-1 overflow-x-auto border-b border-border">
              {tabs.map(([key, label]) => (
                <button key={key} type="button" role="tab" aria-selected={current === key} onClick={(): void => setTab(key)} className={cn('-mb-px border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors', current === key ? 'border-brand text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground')}>
                  {label}
                </button>
              ))}
            </div>
            {ctx && current !== 'mine' && current !== 'blocks' && period && (
              <div className="w-60">
                <SelectField id="sched-period" value={period.id} options={periods.map((p) => ({ value: p.id, label: p.name }))} onChange={setPeriodId} />
              </div>
            )}
          </div>
          {current === 'mine' && mine ? <MineView data={mine} /> : ctx && period ? <PlannerViews key={period.id} slug={slug} periodId={period.id} tab={current} /> : ctx ? <EmptyNote>No hay periodos abiertos.</EmptyNote> : null}
        </div>
      )}
    </AcademicPage>
  );
};

const PlannerViews = ({ slug, periodId, tab }: { slug: string; periodId: string; tab: Tab }): JSX.Element => {
  const { data, error, reload } = useAcademicData(`planner:${slug}:${periodId}`, () => getPlannerAction(slug, periodId));
  if (error) return <LoadError message={error} onRetry={reload} />;
  if (!data) return <PageSkeleton />;
  switch (tab) {
    case 'teacher':
      return <TeacherView data={data} />;
    case 'load':
      return <LoadView slug={slug} data={data} onChange={reload} />;
    case 'blocks':
      return <BlocksView slug={slug} data={data} onChange={reload} />;
    default:
      return <SectionView slug={slug} data={data} onChange={reload} />;
  }
};

const sectionLabel = (s: Section): string => `${s.gradeShort ? `${s.gradeShort} ` : ''}${s.name} · ${s.levelName}`;

const SectionView = ({ slug, data, onChange }: { slug: string; data: PlannerData; onChange: () => void }): JSX.Element => {
  // Start on the first section that has hours to place (inicial plans carry none)
  const [sectionId, setSectionId] = useState((data.sections.find((s) => data.assignments.some((a) => a.sectionId === s.id && a.weeklyHours > 0)) ?? data.sections[0])?.id ?? '');
  const [placing, setPlacing] = useState<{ weekday: number; block: TimeBlock } | null>(null);
  const [isPending, startTransition] = useTransition();
  const section = data.sections.find((s) => s.id === sectionId);
  const canManage = data.context.canManage && data.period.status !== 'closed';
  const days = data.context.settings?.weekDays ?? [1, 2, 3, 4, 5];
  if (!section) return <EmptyNote>Este periodo no tiene {lower(data.context.vocabulary?.sections ?? 'secciones')}.</EmptyNote>;
  const blocks = blocksFor(data.blocks, [section.shift]);
  const entries = data.entries.filter((e) => e.sectionId === section.id);
  const assignments = data.assignments.filter((a) => a.sectionId === section.id);
  const scheduled = (id: string): number => entries.filter((e) => e.assignmentId === id).length;
  const totalHours = assignments.reduce((s, a) => s + a.weeklyHours, 0);
  const auto = (sid: string): void =>
    startTransition(async (): Promise<void> => {
      const r = await autoFillAction(slug, data.period.id, sid);
      if (r.ok) sileo.success({ title: `${r.data.placed} horas ubicadas`, description: r.data.pending > 0 ? `${r.data.pending} no encontraron hora libre (docente ocupado o semana llena).` : undefined });
      else sileo.error({ title: 'No se pudo completar', description: r.message });
      onChange();
    });
  // A teacher's classes in other sections, to show the slot as busy while choosing
  const teacherBusy = (staffId: string, weekday: number, block: TimeBlock): string | null => {
    const other = [...data.entries, ...data.elsewhere].find((e) => e.staffId === staffId && e.sectionId !== section.id && e.weekday === weekday && e.startsAt < block.endsAt && block.startsAt < e.endsAt);
    return other ? `${other.sectionLabel} · ${other.subjectName}` : null;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-72">
          <SelectField id="sched-section" value={section.id} options={data.sections.map((s) => ({ value: s.id, label: sectionLabel(s) }))} onChange={setSectionId} />
        </div>
        <p className="text-sm text-muted-foreground">
          {shiftLabels[section.shift]} · tutor: {section.tutorName || 'sin asignar'} · <span className="font-medium text-foreground tabular-nums">{entries.length}</span> de {totalHours} horas
        </p>
        {canManage && (
          <div className="flex flex-wrap gap-2">
            <ConfirmDelete label="Vaciar" title={`¿Vaciar el horario de ${sectionLabel(section)}?`} description="Se quitan todas sus clases; la carga docente se mantiene." onConfirm={(): void => startTransition(async (): Promise<void> => { await runAcademicAction(clearSectionAction(slug, section.id)); onChange(); })} isPending={isPending} />
            <button type="button" className="btn-alt" disabled={isPending} onClick={(): void => auto('')}>
              <MorphIcon icon={Sparkles} size={16} />
              Completar todas
            </button>
            <button type="button" className="btn-brand" disabled={isPending} onClick={(): void => auto(section.id)}>
              <MorphIcon icon={Sparkles} size={16} />
              Completar esta
            </button>
          </div>
        )}
      </div>
      {blocks.length === 0 ? (
        <EmptyNote>El turno {lower(shiftLabels[section.shift])} no tiene horas definidas. Configúralas en «Horas del día».</EmptyNote>
      ) : (
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_18rem]">
          <WeekGrid
            days={days}
            blocks={blocks}
            entries={entries}
            caption={`Horario de ${sectionLabel(section)}`}
            detail={(e): string => e.staffName || 'Sin docente'}
            onEmpty={canManage ? (weekday, block): void => setPlacing({ weekday, block }) : undefined}
            onRemove={canManage ? (e): void => startTransition(async (): Promise<void> => { await runAcademicAction(removeClassAction(slug, e.id)); onChange(); }) : undefined}
          />
          <aside className="rounded-2xl border border-border bg-background p-4">
            <h3 className="text-sm font-semibold text-foreground">Horas por curso</h3>
            {assignments.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Sin carga docente. Prepárala en «Carga docente».</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {assignments.map((a) => {
                  const done = scheduled(a.id);
                  return (
                    <li key={a.id} className="text-sm">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-foreground" title={a.subjectName}>
                          {a.subjectName}
                        </span>
                        <span className={cn('shrink-0 text-xs tabular-nums', done < a.weeklyHours ? 'text-warning' : 'text-success')}>
                          {done}/{a.weeklyHours}
                        </span>
                      </div>
                      <div aria-hidden="true" className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                        <div className={cn('h-full rounded-full', toneFor(a.subjectName).split(' ')[1])} style={{ width: `${a.weeklyHours ? Math.min(100, (done / a.weeklyHours) * 100) : 0}%` }} />
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{a.staffName || 'Sin docente'}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>
      )}
      {placing && <PlaceDialog slug={slug} data={data} section={section} weekday={placing.weekday} block={placing.block} scheduled={scheduled} busy={teacherBusy} onClose={(): void => setPlacing(null)} onSaved={onChange} />}
    </div>
  );
};

interface PlaceDialogProps {
  slug: string;
  data: PlannerData;
  section: Section;
  weekday: number;
  block: TimeBlock;
  scheduled: (assignmentId: string) => number;
  busy: (staffId: string, weekday: number, block: TimeBlock) => string | null;
  onClose: () => void;
  onSaved: () => void;
}

// Choose which course goes in a free hour: the ones with hours left, and whether their teacher is free then
const PlaceDialog = ({ slug, data, section, weekday, block, scheduled, busy, onClose, onSaved }: PlaceDialogProps): JSX.Element => {
  const options = data.assignments.filter((a) => a.sectionId === section.id).map((a) => ({ a, left: a.weeklyHours - scheduled(a.id), taken: a.staffId ? busy(a.staffId, weekday, block) : null }));
  const firstFree = options.find((o) => o.left > 0 && !o.taken);
  const [assignmentId, setAssignmentId] = useState(firstFree?.a.id ?? '');
  const [room, setRoom] = useState(section.room);
  const [isPending, startTransition] = useTransition();
  const submit = (): void =>
    startTransition(async (): Promise<void> => {
      const r = await placeClassAction(slug, section.id, assignmentId, weekday, block.id, room);
      if (!r.ok) {
        sileo.error({ title: 'No se pudo ubicar', description: r.message });
        return;
      }
      onSaved();
      onClose();
    });
  return (
    <FormDialog title={`${weekdayLabels[String(weekday)]}, ${block.startsAt}–${block.endsAt}`} description={sectionLabel(section)} submitLabel="Ubicar" isPending={isPending} disabled={!assignmentId} onSubmit={submit} onClose={onClose}>
      <div role="radiogroup" aria-label="Curso" className="max-h-80 space-y-1.5 overflow-y-auto">
        {options.map(({ a, left, taken }) => {
          const disabled = left <= 0 || Boolean(taken);
          return (
            <button key={a.id} type="button" role="radio" aria-checked={assignmentId === a.id} disabled={disabled} onClick={(): void => setAssignmentId(a.id)} className={cn('flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors disabled:opacity-45', assignmentId === a.id ? 'border-brand bg-brand-soft' : 'border-border hover:border-brand/50')}>
              <span className={cn('size-3 shrink-0 rounded-sm border-l-4', toneFor(a.subjectName))} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">{a.subjectName}</span>
                <span className="block truncate text-xs text-muted-foreground">{taken ? `${a.staffName} está en ${taken}` : a.staffName || 'Sin docente'}</span>
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">{left > 0 ? `faltan ${left}` : 'completo'}</span>
            </button>
          );
        })}
      </div>
      <FormField id="place-room" label="Ambiente" hint="Opcional. Se avisa si ya está ocupado a esa hora.">
        <Input id="place-room" value={room} maxLength={60} onChange={(e): void => setRoom(e.target.value)} className={controlClassName} />
      </FormField>
    </FormDialog>
  );
};

const TeacherView = ({ data }: { data: PlannerData }): JSX.Element => {
  const teaching = data.teachers.filter((t) => data.assignments.some((a) => a.staffId === t.id));
  const [teacherId, setTeacherId] = useState(teaching[0]?.id ?? '');
  const teacher = data.teachers.find((t) => t.id === teacherId);
  const days = data.context.settings?.weekDays ?? [1, 2, 3, 4, 5];
  if (!teacher) return <EmptyNote>Aún no hay docentes con carga en este periodo.</EmptyNote>;
  const entries = [...data.entries, ...data.elsewhere].filter((e) => e.staffId === teacher.id);
  const shifts = [...new Set([...entries.map((e) => e.shift), ...data.sections.filter((s) => data.assignments.some((a) => a.sectionId === s.id && a.staffId === teacher.id)).map((s) => s.shift)])];
  const assigned = data.assignments.filter((a) => a.staffId === teacher.id).reduce((s, a) => s + a.weeklyHours, 0);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="w-80">
          <SelectField id="sched-teacher" value={teacher.id} options={teaching.map((t) => ({ value: t.id, label: `${t.surnames}, ${t.givenNames}` }))} onChange={setTeacherId} />
        </div>
        <p className="text-sm text-muted-foreground">
          {teacher.specialty || teacher.position} · <span className="font-medium text-foreground tabular-nums">{entries.length}</span> horas en el horario · {assigned}
          {teacher.maxWeeklyHours !== undefined && ` de ${teacher.maxWeeklyHours}`} asignadas
        </p>
      </div>
      <WeekGrid days={days} blocks={blocksFor(data.blocks, shifts.length ? shifts : ['morning'])} entries={entries} caption={`Horario de ${teacher.givenNames} ${teacher.surnames}`} detail={(e): string => e.sectionLabel} />
    </div>
  );
};

// The signed-in person's week: theirs (teacher) or their section's (student; a guardian sees one per child)
const MineView = ({ data }: { data: MyScheduleData }): JSX.Element => (
  <div className="space-y-8">
    {data.groups.map((g) => {
      const shifts = [...new Set(g.entries.map((e) => e.shift))];
      return (
        <section key={g.title + g.detail} className="space-y-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{g.title}</h2>
            <p className="text-sm text-muted-foreground">{g.detail}</p>
          </div>
          {g.entries.length === 0 ? <EmptyNote>Aún no hay clases en el horario.</EmptyNote> : <WeekGrid days={data.weekDays} blocks={blocksFor(data.blocks, shifts)} entries={g.entries} caption={`Horario de ${g.title}`} detail={(e): string => (data.kind === 'teacher' ? e.sectionLabel : e.staffName)} />}
        </section>
      );
    })}
  </div>
);
