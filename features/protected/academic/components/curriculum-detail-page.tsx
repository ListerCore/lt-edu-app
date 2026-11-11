'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type JSX } from 'react';
import { Archive, ArrowDown, ArrowLeft, ArrowUp, CopyPlus, Pencil, Plus, RotateCcw, ShieldCheck } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { deleteCompetencyAction, deleteCurriculumAction, deleteModuleAction, deleteSubjectAction, getCurriculumAction, reorderSubjectsAction, setCurriculumStatusAction } from '../actions/curriculum-actions';
import { assessedNoun, componentClass, componentLabels, creditsOf, CURRICULA_PATH, curriculumPath, curriculumStatusClass, curriculumStatusLabels, lower, subjectKindLabels, subjectNoun } from '../data/academic-data';
import { runAcademicAction } from '../hooks/use-academic-form';
import { useAcademicData } from '../hooks/use-academic-data';
import { useInstitutionSlug } from '../hooks/use-institution-slug';
import type { AcademicContext, Competency, Curriculum, Level, Module, Subject } from '../types';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, StatusPill } from './academic-ui';
import { CompetencyDialog, ModuleDialog, PlanDialog, SubjectDialog } from './curriculum-dialogs';

type Editing =
  | { kind: 'plan'; mode: 'edit' | 'duplicate' }
  | { kind: 'module'; module: Module | null }
  | { kind: 'subject'; subject: Subject | null; moduleId?: string }
  | { kind: 'competency'; subject: Subject | null; competency: Competency | null }
  | null;

const iconButton = 'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent';

interface Actions {
  editable: boolean;
  isPending: boolean;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subject: Subject) => void;
  onMove: (subject: Subject, step: number) => void;
  onAddCompetency: (subject: Subject | null) => void;
  onEditCompetency: (subject: Subject | null, competency: Competency) => void;
  onDeleteCompetency: (competency: Competency) => void;
}

// One study plan: what it teaches and how it is assessed, laid out for the institution kind
export const CurriculumDetailPage = ({ id }: { id: string }): JSX.Element => {
  const slug = useInstitutionSlug();
  const router = useRouter();
  const { data, isLoading, error, reload } = useAcademicData(`curriculum:${slug}:${id}`, () => getCurriculumAction(slug, id));
  const [editing, setEditing] = useState<Editing>(null);
  const [isPending, startTransition] = useTransition();
  const context = data?.context ?? null;
  const plan = data?.curriculum;
  const level = data?.level;
  const kind = context?.institutionKind ?? 'ebr';
  const editable = Boolean(context?.canManage && plan && plan.status !== 'archived');

  const act = (action: () => Promise<unknown>): void =>
    startTransition(async (): Promise<void> => {
      await action();
      reload();
    });

  const actions: Actions = {
    editable,
    isPending,
    onEditSubject: (subject) => setEditing({ kind: 'subject', subject }),
    onDeleteSubject: (subject) => act(() => runAcademicAction(deleteSubjectAction(slug, subject.id))),
    onMove: (subject, step) => {
      if (!plan) return;
      const order = plan.subjects.map((s) => s.id);
      const index = order.indexOf(subject.id);
      const target = index + step;
      if (target < 0 || target >= order.length) return;
      [order[index], order[target]] = [order[target], order[index]];
      act(() => runAcademicAction(reorderSubjectsAction(slug, plan.id, order)));
    },
    onAddCompetency: (subject) => setEditing({ kind: 'competency', subject, competency: null }),
    onEditCompetency: (subject, competency) => setEditing({ kind: 'competency', subject, competency }),
    onDeleteCompetency: (competency) => act(() => runAcademicAction(deleteCompetencyAction(slug, competency.id))),
  };

  const setStatus = (status: string, success: string): void => act(() => runAcademicAction(setCurriculumStatusAction(slug, id, status), success));
  const remove = (): void =>
    startTransition(async (): Promise<void> => {
      const result = await runAcademicAction(deleteCurriculumAction(slug, id));
      if (result.ok) router.push(CURRICULA_PATH);
    });

  const noun = subjectNoun[kind] ?? subjectNoun.ebr;
  const back = (
    <Link href={CURRICULA_PATH} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
      <MorphIcon icon={ArrowLeft} size={15} />
      Plan de estudios
    </Link>
  );

  return (
    <AcademicPage
      titleId="curriculum-title"
      title={plan?.name ?? (isLoading ? 'Cargando…' : 'Plan de estudios')}
      description={plan ? `${plan.levelName} · ${plan.subjects.length} ${lower(plan.subjects.length === 1 ? noun.one : noun.many)}` : ''}
      context={context}
      back={back}
      actions={
        plan && (
          <>
            {plan.status !== 'archived' && (
              <button type="button" className="btn-alt" onClick={(): void => setEditing({ kind: 'plan', mode: 'edit' })}>
                <MorphIcon icon={Pencil} size={16} />
                Editar
              </button>
            )}
            <button type="button" className="btn-alt" onClick={(): void => setEditing({ kind: 'plan', mode: 'duplicate' })}>
              <MorphIcon icon={CopyPlus} size={16} />
              Nueva versión
            </button>
            {plan.status === 'draft' && (
              <>
                <ConfirmDelete title={`¿Eliminar ${plan.name}?`} description="Se elimina el borrador con todo su contenido. No se puede deshacer." onConfirm={remove} isPending={isPending} />
                <button type="button" className="btn-brand" disabled={isPending} onClick={(): void => setStatus('active', 'Plan en vigencia')}>
                  <MorphIcon icon={ShieldCheck} size={16} />
                  Poner en vigencia
                </button>
              </>
            )}
            {plan.status === 'active' && (
              <button type="button" className="btn-alt" disabled={isPending} onClick={(): void => setStatus('archived', 'Plan archivado')}>
                <MorphIcon icon={Archive} size={16} />
                Archivar
              </button>
            )}
            {plan.status === 'archived' && (
              <button type="button" className="btn-brand" disabled={isPending} onClick={(): void => setStatus('active', 'Plan en vigencia')}>
                <MorphIcon icon={RotateCcw} size={16} />
                Volver a poner en vigencia
              </button>
            )}
          </>
        )
      }
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !context || !plan || !level ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : (
        <div className="space-y-10">
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill className={curriculumStatusClass[plan.status]}>{curriculumStatusLabels[plan.status]}</StatusPill>
            {plan.status === 'draft' && <span className="text-sm text-muted-foreground">Borrador: ajústalo y ponlo en vigencia. El plan vigente de {plan.levelName} se archivará.</span>}
            {plan.status === 'archived' && <span className="text-sm text-muted-foreground">Archivado: solo lectura. Para cambiarlo, crea una nueva versión.</span>}
          </div>
          {plan.notes && <p className="max-w-3xl rounded-xl bg-surface px-5 py-4 text-sm leading-6 whitespace-pre-line text-muted-foreground">{plan.notes}</p>}

          {kind === 'institute' ? (
            <InstitutePlan plan={plan} level={level} actions={actions} context={context} onAddModule={(): void => setEditing({ kind: 'module', module: null })} onEditModule={(module): void => setEditing({ kind: 'module', module })} onDeleteModule={(module): void => act(() => runAcademicAction(deleteModuleAction(slug, module.id)))} onAddUnit={(moduleId): void => setEditing({ kind: 'subject', subject: null, moduleId })} />
          ) : (
            <>
              {context.hasGrades && level.grades.length > 0 && plan.subjects.some((s) => s.weeklyHours !== undefined) && <HoursMatrix plan={plan} level={level} />}
              <section aria-labelledby="subjects-title">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <h2 id="subjects-title" className="text-xl font-semibold text-foreground">
                    {noun.many}
                  </h2>
                  {editable && (
                    <button type="button" className="btn-brand" onClick={(): void => setEditing({ kind: 'subject', subject: null })}>
                      <MorphIcon icon={Plus} size={16} />
                      Agregar {lower(noun.one)}
                    </button>
                  )}
                </div>
                {plan.subjects.length === 0 ? (
                  <p className="mt-4 rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Este plan aún no tiene {lower(noun.many)}.</p>
                ) : (
                  <ol className="mt-4 grid gap-4 lg:grid-cols-2">
                    {plan.subjects.map((subject, index) => (
                      <li key={subject.id}>
                        <SubjectCard subject={subject} index={index} total={plan.subjects.length} level={level} context={context} actions={actions} />
                      </li>
                    ))}
                  </ol>
                )}
              </section>
              {context.institutionKind !== 'cepre' && <Transversal plan={plan} context={context} actions={actions} />}
            </>
          )}
        </div>
      )}

      {plan && editing?.kind === 'plan' && <PlanDialog slug={slug} plan={plan} mode={editing.mode} onClose={(): void => setEditing(null)} onSaved={(saved): void => (editing.mode === 'duplicate' ? router.push(curriculumPath(saved.id)) : reload())} />}
      {plan && editing?.kind === 'module' && <ModuleDialog slug={slug} curriculumId={plan.id} module={editing.module} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {context && plan && level && editing?.kind === 'subject' && <SubjectDialog slug={slug} context={context} plan={plan} level={level} subject={editing.subject} initialModuleId={editing.moduleId} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {context && plan && editing?.kind === 'competency' && <CompetencyDialog slug={slug} context={context} curriculumId={plan.id} subject={editing.subject} competency={editing.competency} onClose={(): void => setEditing(null)} onSaved={reload} />}
    </AcademicPage>
  );
};

// Weekly hours of every area in every grade, with the total per grade: how the week is filled
const HoursMatrix = ({ plan, level }: { plan: Curriculum; level: Level }): JSX.Element => {
  const totals = level.grades.map((g) => plan.subjects.reduce((sum, s) => sum + (s.gradeIds.includes(g.id) ? (s.weeklyHours ?? 0) : 0), 0));
  const max = Math.max(1, ...totals);
  return (
    <section aria-labelledby="hours-title">
      <h2 id="hours-title" className="text-xl font-semibold text-foreground">
        Horas semanales por grado
      </h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-background">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th scope="col" className="px-4 py-3 text-left font-medium">
                Área
              </th>
              {level.grades.map((g) => (
                <th key={g.id} scope="col" className="px-2 py-3 text-center font-medium tabular-nums" title={g.name}>
                  {g.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plan.subjects.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <th scope="row" className="max-w-56 truncate px-4 py-2 text-left font-normal text-foreground">
                  {s.name}
                </th>
                {level.grades.map((g) => {
                  const on = s.gradeIds.includes(g.id);
                  return (
                    <td key={g.id} className="px-2 py-1.5 text-center">
                      {on ? <span className={cn('inline-flex h-7 min-w-8 items-center justify-center rounded-md px-1.5 font-medium tabular-nums', s.weeklyHours ? 'bg-brand-soft text-brand' : 'bg-secondary text-muted-foreground')}>{s.weeklyHours ?? '·'}</span> : <span className="text-muted-foreground/40">—</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-surface">
              <th scope="row" className="px-4 py-3 text-left font-semibold text-foreground">
                Total por semana
              </th>
              {totals.map((total, i) => (
                <td key={level.grades[i].id} className="px-2 py-3 text-center">
                  <span className="font-semibold text-foreground tabular-nums">{total}</span>
                  <span aria-hidden="true" className="mx-auto mt-1.5 block h-1 rounded-full bg-brand-solid" style={{ width: `${Math.round((total / max) * 100)}%` }} />
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">La jornada escolar regular tiene 30 horas en primaria y 35 en secundaria: las restantes son de libre disponibilidad.</p>
    </section>
  );
};

interface SubjectCardProps {
  subject: Subject;
  index: number;
  total: number;
  level: Level;
  context: AcademicContext;
  actions: Actions;
}

const SubjectCard = ({ subject, index, total, level, context, actions }: SubjectCardProps): JSX.Element => {
  const assessed = assessedNoun[context.institutionKind] ?? assessedNoun.ebr;
  const grades = level.grades.filter((g) => subject.gradeIds.includes(g.id));
  const allGrades = context.hasGrades && grades.length === level.grades.length;
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-background">
      <div className="flex items-start gap-3 px-5 pt-4 pb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground">{subject.name}</h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs">
            {subject.kind !== 'area' && subject.kind !== 'course' && <span className="pill bg-secondary text-foreground">{subjectKindLabels[subject.kind]}</span>}
            {subject.weeklyHours !== undefined && <span className="pill bg-brand-soft text-brand">{subject.weeklyHours} h/semana</span>}
            {context.hasGrades && <span className="pill bg-secondary text-muted-foreground">{allGrades ? `Todos los ${lower(context.vocabulary?.grades ?? 'grados')}` : grades.map((g) => g.shortName).join(' · ') || 'Sin grados'}</span>}
          </div>
        </div>
        {actions.editable && (
          <div className="flex items-center">
            <button type="button" className={iconButton} disabled={index === 0 || actions.isPending} onClick={(): void => actions.onMove(subject, -1)} aria-label={`Subir ${subject.name}`}>
              <MorphIcon icon={ArrowUp} size={15} />
            </button>
            <button type="button" className={iconButton} disabled={index === total - 1 || actions.isPending} onClick={(): void => actions.onMove(subject, 1)} aria-label={`Bajar ${subject.name}`}>
              <MorphIcon icon={ArrowDown} size={15} />
            </button>
            <button type="button" className={iconButton} onClick={(): void => actions.onEditSubject(subject)} aria-label={`Editar ${subject.name}`}>
              <MorphIcon icon={Pencil} size={15} />
            </button>
            <ConfirmDelete compact title={`¿Quitar ${subject.name}?`} description={`Se quita del plan con sus ${lower(assessed.many)}.`} onConfirm={(): void => actions.onDeleteSubject(subject)} />
          </div>
        )}
      </div>
      {subject.kind !== 'tutoring' && (
        <div className="flex-1 border-t border-border px-5 py-3">
          {subject.competencies.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin {lower(assessed.many)}.</p>
          ) : context.institutionKind === 'cepre' ? (
            <ul className="flex flex-wrap gap-1.5">
              {subject.competencies.map((c) => (
                <li key={c.id}>
                  <CompetencyChip competency={c} subject={subject} actions={actions} />
                </li>
              ))}
            </ul>
          ) : (
            <ol className="space-y-1">
              {subject.competencies.map((c) => (
                <li key={c.id}>
                  <CompetencyLine competency={c} subject={subject} actions={actions} />
                </li>
              ))}
            </ol>
          )}
          {actions.editable && (
            <button type="button" onClick={(): void => actions.onAddCompetency(subject)} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
              <MorphIcon icon={Plus} size={14} />
              Agregar {lower(assessed.one)}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const CompetencyLine = ({ competency, subject, actions }: { competency: Competency; subject: Subject | null; actions: Actions }): JSX.Element => (
  <div className="group flex items-start gap-2 rounded-lg py-1 text-sm">
    {competency.code && <span className="mt-0.5 shrink-0 rounded bg-secondary px-1.5 text-xs font-semibold text-muted-foreground tabular-nums">{competency.code}</span>}
    <span className="min-w-0 flex-1 leading-6 text-foreground/90">{competency.name}</span>
    {actions.editable && (
      <span className="flex shrink-0 items-center opacity-60 group-hover:opacity-100">
        <button type="button" className={cn(iconButton, 'size-7')} onClick={(): void => actions.onEditCompetency(subject, competency)} aria-label={`Editar: ${competency.name}`}>
          <MorphIcon icon={Pencil} size={13} />
        </button>
        <ConfirmDelete compact title="¿Quitar del plan?" description={competency.name} onConfirm={(): void => actions.onDeleteCompetency(competency)} />
      </span>
    )}
  </div>
);

const CompetencyChip = ({ competency, subject, actions }: { competency: Competency; subject: Subject; actions: Actions }): JSX.Element =>
  actions.editable ? (
    <button type="button" onClick={(): void => actions.onEditCompetency(subject, competency)} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground hover:border-brand/50">
      {competency.name}
    </button>
  ) : (
    <span className="inline-block rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground">{competency.name}</span>
  );

const Transversal = ({ plan, context, actions }: { plan: Curriculum; context: AcademicContext; actions: Actions }): JSX.Element => (
  <section aria-labelledby="transversal-title" className="rounded-2xl bg-surface p-5 md:p-6">
    <h2 id="transversal-title" className="font-semibold text-foreground">
      {context.institutionKind === 'institute' ? 'Capacidades transversales' : 'Competencias transversales'}
    </h2>
    <p className="mt-1 text-sm text-muted-foreground">No pertenecen a un área: se desarrollan en todas. No cuentan para la promoción.</p>
    {plan.transversal.length > 0 && (
      <ol className="mt-3 space-y-1">
        {plan.transversal.map((c) => (
          <li key={c.id}>
            <CompetencyLine competency={c} subject={null} actions={actions} />
          </li>
        ))}
      </ol>
    )}
    {actions.editable && (
      <button type="button" onClick={(): void => actions.onAddCompetency(null)} className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
        <MorphIcon icon={Plus} size={14} />
        Agregar competencia transversal
      </button>
    )}
  </section>
);

interface InstitutePlanProps {
  plan: Curriculum;
  level: Level;
  context: AcademicContext;
  actions: Actions;
  onAddModule: () => void;
  onEditModule: (module: Module) => void;
  onDeleteModule: (module: Module) => void;
  onAddUnit: (moduleId: string) => void;
}

// Institutes: credits per semester against the plan's total, then each formative module with its units by semester
const InstitutePlan = ({ plan, level, context, actions, onAddModule, onEditModule, onDeleteModule, onAddUnit }: InstitutePlanProps): JSX.Element => {
  const total = plan.subjects.reduce((sum, s) => sum + creditsOf(s), 0);
  const target = context.usesFormativeLevels ? (levelCredits(level) ?? 0) : 0;
  const perSemester = level.grades.map((g) => ({ grade: g, credits: plan.subjects.filter((s) => s.gradeIds.includes(g.id)).reduce((sum, s) => sum + creditsOf(s), 0) }));
  const maxSemester = Math.max(1, ...perSemester.map((x) => x.credits));
  const groups = [...plan.modules.map((m) => ({ module: m as Module | null, units: plan.subjects.filter((s) => s.moduleId === m.id) })), { module: null, units: plan.subjects.filter((s) => !s.moduleId) }].filter((g) => g.module || g.units.length > 0);
  const gradeName = (s: Subject): string => level.grades.find((g) => s.gradeIds.includes(g.id))?.shortName ?? '—';
  const position = (s: Subject): number => level.grades.findIndex((g) => s.gradeIds.includes(g.id));

  return (
    <div className="space-y-10">
      <section aria-labelledby="credits-title" className="rounded-2xl border border-border bg-background p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="credits-title" className="text-xl font-semibold text-foreground">
            Créditos por semestre
          </h2>
          <p className="text-sm">
            <span className="text-2xl font-semibold text-foreground tabular-nums">{total}</span>
            {target > 0 && <span className={cn('ml-1', total === target ? 'text-success' : 'text-warning')}> de {target} créditos del programa</span>}
          </p>
        </div>
        <ol className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {perSemester.map(({ grade, credits }) => (
            <li key={grade.id} className="flex flex-col items-center gap-2">
              <div className="flex h-24 w-full items-end rounded-lg bg-surface">
                <div className="w-full rounded-lg bg-brand-solid/85" style={{ height: `${Math.round((credits / maxSemester) * 100)}%` }} />
              </div>
              <span className="text-sm font-semibold text-foreground tabular-nums">{credits}</span>
              <span className="text-xs text-muted-foreground">{grade.name}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-xs text-muted-foreground">1 crédito = 16 horas de teoría o 32 de práctica.</p>
      </section>

      <section aria-labelledby="modules-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="modules-title" className="text-xl font-semibold text-foreground">
            Módulos formativos
          </h2>
          {actions.editable && (
            <button type="button" className="btn-alt" onClick={onAddModule}>
              <MorphIcon icon={Plus} size={16} />
              Agregar módulo
            </button>
          )}
        </div>
        <div className="mt-4 space-y-4">
          {groups.map(({ module, units }, index) => {
            const credits = units.reduce((sum, s) => sum + creditsOf(s), 0);
            const sorted = [...units].sort((a, b) => position(a) - position(b) || a.position - b.position);
            return (
              <div key={module?.id ?? 'none'} className="rounded-2xl border border-border bg-background">
                <div className="flex flex-wrap items-start gap-3 border-b border-border px-5 py-4">
                  {module && (
                    <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-solid text-sm font-semibold text-white tabular-nums">
                      {index + 1}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{module?.name ?? 'Sin módulo'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {module?.description && `${module.description} · `}
                      {units.length} unidades · {credits} créditos
                    </p>
                  </div>
                  {actions.editable && module && (
                    <div className="flex items-center">
                      <button type="button" className={iconButton} onClick={(): void => onEditModule(module)} aria-label={`Editar ${module.name}`}>
                        <MorphIcon icon={Pencil} size={15} />
                      </button>
                      <ConfirmDelete compact title={`¿Eliminar el módulo ${module.name}?`} description="Sus unidades se quedan en el plan, sin módulo." onConfirm={(): void => onDeleteModule(module)} />
                    </div>
                  )}
                </div>
                <ul className="divide-y divide-border">
                  {sorted.map((unit) => (
                    <li key={unit.id} className={cn('px-5 py-3', unit.kind === 'efsrt' && 'bg-success/5')}>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="w-8 text-sm font-semibold text-muted-foreground tabular-nums">{gradeName(unit)}</span>
                        <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{unit.name}</span>
                        <span className={cn('pill', componentClass[unit.component])}>{componentLabels[unit.component]}</span>
                        <span className="w-28 text-right text-xs text-muted-foreground tabular-nums">
                          {unit.theoryCredits ?? 0} T + {unit.practiceCredits ?? 0} P = <span className="font-semibold text-foreground">{creditsOf(unit)}</span>
                        </span>
                        <span className="w-14 text-right text-xs text-muted-foreground tabular-nums">{unit.weeklyHours ?? 0} h/sem</span>
                        {actions.editable && (
                          <span className="flex items-center">
                            <button type="button" className={iconButton} onClick={(): void => actions.onEditSubject(unit)} aria-label={`Editar ${unit.name}`}>
                              <MorphIcon icon={Pencil} size={14} />
                            </button>
                            <ConfirmDelete compact title={`¿Quitar ${unit.name}?`} description="Se quita del plan con sus capacidades." onConfirm={(): void => actions.onDeleteSubject(unit)} />
                          </span>
                        )}
                      </div>
                      {(unit.competencies.length > 0 || actions.editable) && (
                        <div className="mt-1 pl-12">
                          {unit.competencies.map((c) => (
                            <CompetencyLine key={c.id} competency={c} subject={unit} actions={actions} />
                          ))}
                          {actions.editable && (
                            <button type="button" onClick={(): void => actions.onAddCompetency(unit)} className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                              <MorphIcon icon={Plus} size={12} />
                              Capacidad
                            </button>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {actions.editable && module && (
                  <div className="border-t border-border px-5 py-3">
                    <button type="button" onClick={(): void => onAddUnit(module.id)} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
                      <MorphIcon icon={Plus} size={14} />
                      Agregar unidad o EFSRT
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const levelCredits = (level: Level): number | undefined => level.credits;
