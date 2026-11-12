'use client';

import Link from 'next/link';
import { useState, useTransition, type JSX } from 'react';
import { LogOut, MoveRight, Plus, Repeat, RotateCcw } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AttachmentsButton } from '@/features/protected/attachments/components/attachments-button';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField, StatusPill } from '@/features/protected/academic/components/academic-ui';
import { lower, periodStatusClass, periodStatusLabels, shiftLabels } from '@/features/protected/academic/data/academic-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { isPeopleEvent } from '@/hooks/use-live';
import { cn } from '@/lib/utils';
import { deleteEnrollmentAction, endEnrollmentAction, getBoardAction } from '../actions/people-actions';
import { enrollmentKindLabels, enrollmentStatusClass, enrollmentStatusLabels, studentPath } from '../data/people-data';
import { useDebounced } from '../hooks/use-debounced';
import { usePeopleContext } from '../hooks/use-people-context';
import type { BoardData, BoardQuery, Enrollment, PeopleContextData } from '../types';
import { EndDialog, EnrollDialog, MoveDialog, RatifyDialog } from './enrollment-dialogs';
import { Pager, SearchBox } from './people-ui';

const PAGE = 50;
type Editing = { kind: 'enroll'; levelId?: string; gradeId?: string; sectionId?: string } | { kind: 'ratify' } | { kind: 'move'; enrollment: Enrollment } | { kind: 'end'; enrollment: Enrollment } | null;

// Matrícula / Inscripción por ciclo: a period's sections filling up, and who is enrolled where
export const EnrollmentPage = (): JSX.Element => {
  const { data: ctx, error, isLoading, reload, slug } = usePeopleContext();
  const cepre = ctx?.context.institutionKind === 'cepre';
  return (
    <AcademicPage
      titleId="enrollment-title"
      title={cepre ? 'Inscripción por ciclo' : 'Matrícula'}
      description="Cuántas vacantes quedan en cada sección y quién está matriculado. Matricula a uno por uno o ratifica a los continuadores de otro periodo."
      context={ctx ? { ...ctx.context, canManage: ctx.canManage } : null}
    >
      {isLoading ? <PageSkeleton /> : error || !ctx ? <LoadError message={error ?? 'Sin datos.'} onRetry={reload} /> : ctx.periods.length === 0 ? <p className="text-sm text-muted-foreground">Primero crea un periodo en la estructura académica.</p> : <Board slug={slug} ctx={ctx} />}
    </AcademicPage>
  );
};

const Board = ({ slug, ctx }: { slug: string; ctx: PeopleContextData }): JSX.Element => {
  const initialPeriod = (ctx.periods.find((p) => p.status === 'active') ?? ctx.periods.find((p) => p.status === 'planning') ?? ctx.periods[0]).id;
  const [q, setQ] = useState<BoardQuery>({ periodId: initialPeriod, levelId: '', gradeId: '', sectionId: '', status: '', query: '', page: 1 });
  const [editing, setEditing] = useState<Editing>(null);
  const [isPending, startTransition] = useTransition();
  const query = useDebounced(q.query);
  const effective = { ...q, query };
  const { data, error, isLoading, reload } = useAcademicData(`board:${slug}:${JSON.stringify(effective)}`, () => getBoardAction(slug, effective, PAGE), isPeopleEvent);
  const period = ctx.periods.find((p) => p.id === q.periodId);
  const editable = ctx.canManage && period?.status !== 'closed';
  const v = ctx.context.vocabulary;
  const set = (patch: Partial<BoardQuery>): void => setQ((c) => ({ ...c, page: 1, ...patch }));
  const act = (action: () => Promise<unknown>): void =>
    startTransition(async (): Promise<void> => {
      await action();
      reload();
    });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-64">
            <SelectField id="board-period" value={q.periodId} options={ctx.periods.map((p) => ({ value: p.id, label: p.name }))} onChange={(id): void => set({ periodId: id, levelId: '', gradeId: '', sectionId: '' })} />
          </div>
          {period && <StatusPill className={periodStatusClass[period.status]}>{periodStatusLabels[period.status]}</StatusPill>}
        </div>
        {editable && (
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-alt" onClick={(): void => setEditing({ kind: 'ratify' })}>
              <MorphIcon icon={Repeat} size={16} />
              Ratificar continuadores
            </button>
            <button type="button" className="btn-brand" onClick={(): void => setEditing({ kind: 'enroll' })}>
              <MorphIcon icon={Plus} size={16} />
              Matricular
            </button>
          </div>
        )}
      </div>

      {error ? (
        <LoadError message={error} onRetry={reload} />
      ) : !data ? (
        <PageSkeleton />
      ) : (
        <>
          <Occupancy ctx={ctx} data={data} selected={q} onPick={(levelId, gradeId, sectionId): void => set({ levelId, gradeId, sectionId })} onEnroll={editable ? (levelId, gradeId, sectionId): void => setEditing({ kind: 'enroll', levelId, gradeId, sectionId }) : undefined} />

          <section aria-labelledby="enrolled-title" className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="enrolled-title" className="text-xl font-semibold text-foreground">
                Matriculados
                {(q.levelId || q.sectionId) && (
                  <button type="button" onClick={(): void => set({ levelId: '', gradeId: '', sectionId: '' })} className="ml-3 text-sm font-medium text-brand hover:underline">
                    Ver todos
                  </button>
                )}
              </h2>
              <div className="flex flex-wrap gap-3">
                <SearchBox value={q.query} onChange={(value): void => setQ((c) => ({ ...c, query: value, page: 1 }))} placeholder="Buscar" className="w-56" />
                <div className="w-44">
                  <SelectField id="board-status" value={q.status} options={[{ value: '', label: 'Cualquier estado' }, ...Object.entries(enrollmentStatusLabels).map(([value, label]) => ({ value, label }))]} onChange={(s): void => set({ status: s })} />
                </div>
              </div>
            </div>
            <div className={cn('overflow-x-auto rounded-2xl border border-border bg-background transition-opacity', isLoading && 'opacity-60')}>
              <table className="w-full min-w-[54rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th scope="col" className="px-4 py-3 font-medium">Estudiante</th>
                    <th scope="col" className="px-4 py-3 font-medium">{v?.level}</th>
                    <th scope="col" className="px-4 py-3 font-medium">{ctx.context.hasGrades ? `${v?.grade} y ${lower(v?.section ?? 'sección')}` : v?.section}</th>
                    <th scope="col" className="px-4 py-3 font-medium">Tipo</th>
                    <th scope="col" className="px-4 py-3 font-medium">Estado</th>
                    {editable && <th scope="col" className="sr-only">Acciones</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.enrollments.map((e) => (
                    <tr key={e.id}>
                      <td className="px-4 py-2.5">
                        <Link href={studentPath(e.studentId)} className="font-medium text-foreground hover:text-brand">
                          {e.studentName}
                        </Link>
                        <span className="block text-xs text-muted-foreground tabular-nums">
                          {e.studentCode} · {e.studentDocument}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-foreground">{e.levelName}</td>
                      <td className="px-4 py-2.5 text-foreground">
                        {e.gradeShort} {e.sectionName || <span className="text-warning">sin asignar</span>}
                        {e.credits > 0 && <span className="block text-xs text-muted-foreground">{e.credits} créditos</span>}
                      </td>
                      <td className="px-4 py-2.5 text-muted-foreground">{enrollmentKindLabels[e.kind]}</td>
                      <td className="px-4 py-2.5">
                        <StatusPill className={enrollmentStatusClass[e.status]}>{enrollmentStatusLabels[e.status]}</StatusPill>
                      </td>
                      {editable && (
                        <td className="px-2 py-2 text-right whitespace-nowrap">
                          <AttachmentsButton
                            iconOnly
                            ownerKind="enrollment"
                            ownerId={e.id}
                            label={`Expediente de ${e.studentName}`}
                            title={`Expediente de matrícula · ${e.studentName}`}
                            description="Documentos entregados para esta matrícula: ficha de matrícula, DNI, partida de nacimiento, certificado de estudios o constancia de traslado."
                            categories={['enrollment_form', 'dni', 'birth_certificate', 'study_certificate', 'transfer_certificate', 'medical_report', 'disability_certificate', 'photo', 'other']}
                          />
                          {e.status === 'active' ? (
                            <>
                              <button type="button" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={(): void => setEditing({ kind: 'move', enrollment: e })} aria-label={`Cambiar de sección a ${e.studentName}`} title="Cambiar de sección">
                                <MorphIcon icon={MoveRight} size={15} />
                              </button>
                              <button type="button" className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={(): void => setEditing({ kind: 'end', enrollment: e })} aria-label={`Retiro o traslado de ${e.studentName}`} title="Retiro o traslado">
                                <MorphIcon icon={LogOut} size={15} />
                              </button>
                            </>
                          ) : (
                            e.status !== 'completed' && (
                              <button type="button" disabled={isPending} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" onClick={(): void => act(() => runAcademicAction(endEnrollmentAction(slug, e.id, { status: 'active', endedOn: '', destination: '' })))} aria-label={`Reactivar a ${e.studentName}`} title="Reactivar">
                                <MorphIcon icon={RotateCcw} size={15} />
                              </button>
                            )
                          )}
                          <ConfirmDelete compact label="Anular" title={`¿Anular la matrícula de ${e.studentName}?`} description="Úsalo solo si se registró por error." onConfirm={(): void => act(() => runAcademicAction(deleteEnrollmentAction(slug, e.id)))} />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.enrollments.length === 0 && <p className="px-6 py-10 text-center text-sm text-muted-foreground">Nadie matriculado con esos filtros.</p>}
            </div>
            <Pager page={q.page} pageSize={PAGE} total={data.total} noun="matrículas" onPage={(page): void => setQ((c) => ({ ...c, page }))} />
          </section>
        </>
      )}

      {editing?.kind === 'enroll' && <EnrollDialog slug={slug} ctx={ctx} periodId={q.periodId} initial={editing} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {editing?.kind === 'ratify' && <RatifyDialog slug={slug} ctx={ctx} toPeriodId={q.periodId} onClose={(): void => setEditing(null)} onDone={reload} />}
      {editing?.kind === 'move' && <MoveDialog slug={slug} ctx={ctx} enrollment={editing.enrollment} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {editing?.kind === 'end' && <EndDialog slug={slug} enrollment={editing.enrollment} onClose={(): void => setEditing(null)} onSaved={reload} />}
    </div>
  );
};

interface OccupancyProps {
  ctx: PeopleContextData;
  data: BoardData;
  selected: BoardQuery;
  onPick: (levelId: string, gradeId: string, sectionId: string) => void;
  onEnroll?: (levelId: string, gradeId: string, sectionId: string) => void;
}

// Every section of the period as a bar of taken places; picking one filters the list below
const Occupancy = ({ ctx, data, selected, onPick, onEnroll }: OccupancyProps): JSX.Element => {
  const v = ctx.context.vocabulary;
  const occupancy = new Map(data.occupancy.map((o) => [o.sectionId, o]));
  const totals = data.occupancy.reduce((acc, o) => ({ active: acc.active + o.active, capacity: acc.capacity + o.capacity }), { active: 0, capacity: 0 });
  if (data.sections.length === 0) {
    return <p className="rounded-xl border border-dashed border-border px-6 py-8 text-center text-sm text-muted-foreground">Este periodo aún no tiene {lower(v?.sections ?? 'secciones')}. Ármalas en la estructura académica › {v?.periods}.</p>;
  }
  const levels = ctx.levels.filter((l) => data.sections.some((s) => s.levelId === l.id));
  return (
    <section aria-labelledby="occupancy-title" className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="occupancy-title" className="text-xl font-semibold text-foreground">
          Vacantes
        </h2>
        <p className="text-sm text-muted-foreground">
          <span className="text-2xl font-semibold text-foreground tabular-nums">{totals.active}</span> de {totals.capacity} ocupadas · {Math.max(0, totals.capacity - totals.active)} libres
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {levels.map((level) => {
          const rows = ctx.context.hasGrades ? level.grades.map((g) => ({ id: g.id, label: g.shortName, sections: data.sections.filter((s) => s.levelId === level.id && s.gradeId === g.id) })).filter((r) => r.sections.length > 0) : [{ id: '', label: '', sections: data.sections.filter((s) => s.levelId === level.id) }];
          return (
            <div key={level.id} className={cn('rounded-2xl border bg-background', selected.levelId === level.id ? 'border-brand/50' : 'border-border')}>
              <button type="button" onClick={(): void => onPick(level.id, '', '')} className="flex w-full items-center justify-between gap-3 border-b border-border px-5 py-3 text-left">
                <span className="font-semibold text-foreground">{level.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {rows.flatMap((r) => r.sections).reduce((sum, s) => sum + (occupancy.get(s.id)?.active ?? 0), 0)} matriculados
                </span>
              </button>
              <ul className="divide-y divide-border">
                {rows.map((row) => (
                  <li key={row.id || level.id} className="flex items-start gap-3 px-5 py-2.5">
                    {row.label && <span className="mt-1.5 w-9 shrink-0 text-sm font-semibold text-foreground tabular-nums">{row.label}</span>}
                    <div className="grid min-w-0 flex-1 grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-2">
                      {row.sections.map((s) => {
                        const o = occupancy.get(s.id);
                        const active = o?.active ?? 0;
                        const ratio = s.capacity > 0 ? Math.min(1, active / s.capacity) : 0;
                        const full = active >= s.capacity;
                        const isSelected = selected.sectionId === s.id;
                        return (
                          <div key={s.id} className={cn('group relative rounded-lg border px-3 py-2 transition-colors', isSelected ? 'border-brand bg-brand-soft' : 'border-border hover:border-brand/50')}>
                            <button type="button" onClick={(): void => onPick(level.id, s.gradeId, s.id)} className="block w-full text-left" aria-label={`${row.label} ${s.name}: ${active} de ${s.capacity}`}>
                              <span className="flex items-baseline justify-between gap-2 text-sm">
                                <span className="truncate font-semibold text-foreground">{s.name}</span>
                                <span className={cn('text-xs tabular-nums', full ? 'font-semibold text-warning' : 'text-muted-foreground')}>
                                  {active}/{s.capacity}
                                </span>
                              </span>
                              <span aria-hidden="true" className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-secondary">
                                <span className={cn('block h-full rounded-full', full ? 'bg-warning' : 'bg-brand-solid')} style={{ width: `${Math.round(ratio * 100)}%` }} />
                              </span>
                              <span className="mt-1 block text-[11px] text-muted-foreground">{shiftLabels[s.shift]}</span>
                            </button>
                            {onEnroll && !full && (
                              <button type="button" onClick={(): void => onEnroll(level.id, s.gradeId, s.id)} className="absolute top-1.5 right-1.5 hidden size-6 items-center justify-center rounded-md bg-brand-solid text-white group-hover:flex" aria-label={`Matricular en ${row.label} ${s.name}`}>
                                <MorphIcon icon={Plus} size={13} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
};
