'use client';

import Link from 'next/link';
import { useState, useTransition, type JSX } from 'react';
import { ArrowDown, ArrowUp, CalendarRange, LayoutTemplate, Pencil, Plus, Settings2 } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { applyTemplateAction, deleteGradeAction, deleteLevelAction, getStructureAction, reorderGradesAction, reorderLevelsAction } from '../actions/academic-actions';
import { weekdayShort, attentionModeLabels, formativeLevelLabels, gradingScaleLabels, lower, managementLabels, PERIODS_PATH, shiftLabels, termSchemeLabels } from '../data/academic-data';
import { runAcademicAction } from '../hooks/use-academic-form';
import { useAcademicData } from '../hooks/use-academic-data';
import { useInstitutionSlug } from '../hooks/use-institution-slug';
import type { AcademicContext, Grade, Level } from '../types';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton } from './academic-ui';
import { GradeDialog, LevelDialog, SettingsDialog } from './structure-dialogs';

type Editing = { kind: 'level'; level: Level | null } | { kind: 'grade'; level: Level; grade: Grade | null } | { kind: 'settings' } | null;

const iconButton = 'flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent';

const move = <T,>(list: T[], index: number, step: number): T[] => {
  const next = [...list];
  const [item] = next.splice(index, 1);
  next.splice(index + step, 0, item);
  return next;
};

// Niveles y grados (or ciclos, áreas, programas de estudios): the structure every period's sections hang from
export const StructurePage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const { data, isLoading, error, reload } = useAcademicData(`structure:${slug}`, () => getStructureAction(slug));
  const [editing, setEditing] = useState<Editing>(null);
  const [isPending, startTransition] = useTransition();
  const context = data?.context ?? null;
  const vocabulary = context?.vocabulary;
  const levels = data?.levels ?? [];
  const canManage = context?.canManage ?? false;

  const title = vocabulary ? (context.hasGrades ? `${vocabulary.levels} y ${lower(vocabulary.grades)}` : vocabulary.levels) : 'Estructura académica';

  const act = (action: () => Promise<unknown>): void =>
    startTransition(async (): Promise<void> => {
      await action();
      reload();
    });

  const loadTemplate = (): void => act(() => runAcademicAction(applyTemplateAction(slug)));
  const reorderLevels = (index: number, step: number): void => act(() => runAcademicAction(reorderLevelsAction(slug, move(levels, index, step).map((l) => l.id))));
  const reorderGrades = (level: Level, index: number, step: number): void => act(() => runAcademicAction(reorderGradesAction(slug, level.id, move(level.grades, index, step).map((g) => g.id))));

  return (
    <AcademicPage
      titleId="structure-title"
      title={title}
      description={context ? describe(context) : 'Cómo se organiza la institución.'}
      context={context}
      actions={
        levels.length > 0 && (
          <button type="button" className="btn-brand" onClick={(): void => setEditing({ kind: 'level', level: null })}>
            <MorphIcon icon={Plus} size={16} />
            Agregar {lower(vocabulary?.level ?? 'nivel')}
          </button>
        )
      }
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !context ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : (
        <div className="space-y-8">
          <ProfileStrip context={context} onEdit={canManage ? (): void => setEditing({ kind: 'settings' }) : undefined} />

          {levels.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
              <p className="text-lg font-semibold text-foreground">Aún no hay {lower(vocabulary?.levels ?? 'niveles')}</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Carga la estructura habitual de este tipo de institución y ajústala, o empieza desde cero.</p>
              {canManage && (
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button type="button" className="btn-brand" disabled={isPending} onClick={loadTemplate}>
                    <MorphIcon icon={LayoutTemplate} size={16} />
                    Cargar estructura sugerida
                  </button>
                  <button type="button" className="btn-alt" onClick={(): void => setEditing({ kind: 'level', level: null })}>
                    <MorphIcon icon={Plus} size={16} />
                    Empezar desde cero
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ol className="space-y-4">
              {levels.map((level, index) => (
                <li key={level.id} className={cn('rounded-2xl border border-border bg-background', !level.isActive && 'opacity-70')}>
                  <div className="flex flex-wrap items-start gap-4 p-5 md:p-6">
                    <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-solid text-sm font-semibold text-white tabular-nums">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="flex flex-wrap items-center gap-2 text-lg font-semibold text-foreground">
                        {level.name}
                        {!level.isActive && <span className="pill bg-secondary text-muted-foreground">Inactivo</span>}
                      </h2>
                      {level.description && <p className="mt-0.5 text-sm text-muted-foreground">{level.description}</p>}
                      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                        {level.formativeLevel && <span className="pill bg-secondary text-foreground">{formativeLevelLabels[level.formativeLevel]}</span>}
                        {level.credits !== undefined && <span className="pill bg-secondary text-foreground">{level.credits} créditos</span>}
                        {level.attentionModes.map((mode) => (
                          <span key={mode} className="pill bg-brand-soft text-brand">
                            {attentionModeLabels[mode]}
                          </span>
                        ))}
                        <span className="pill bg-secondary text-muted-foreground">
                          {level.sectionCount} {level.sectionCount === 1 ? lower(vocabulary?.section ?? 'sección') : lower(vocabulary?.sections ?? 'secciones')} en total
                        </span>
                      </div>
                    </div>
                    {canManage && (
                      <div className="flex items-center gap-0.5">
                        <button type="button" className={iconButton} disabled={index === 0 || isPending} onClick={(): void => reorderLevels(index, -1)} aria-label={`Subir ${level.name}`}>
                          <MorphIcon icon={ArrowUp} size={15} />
                        </button>
                        <button type="button" className={iconButton} disabled={index === levels.length - 1 || isPending} onClick={(): void => reorderLevels(index, 1)} aria-label={`Bajar ${level.name}`}>
                          <MorphIcon icon={ArrowDown} size={15} />
                        </button>
                        <button type="button" className={iconButton} onClick={(): void => setEditing({ kind: 'level', level })} aria-label={`Editar ${level.name}`}>
                          <MorphIcon icon={Pencil} size={15} />
                        </button>
                        <ConfirmDelete
                          compact
                          title={`¿Eliminar ${level.name}?`}
                          description="Se elimina de la estructura. No se puede deshacer."
                          disabled={level.grades.length > 0 || level.sectionCount > 0}
                          disabledReason={`Primero elimina sus ${lower(vocabulary?.grades || vocabulary?.sections || 'grados')}, o desactívalo.`}
                          onConfirm={(): void => act(() => runAcademicAction(deleteLevelAction(slug, level.id)))}
                        />
                      </div>
                    )}
                  </div>

                  {context.hasGrades && (
                    <div className="border-t border-border px-5 py-4 md:px-6">
                      {level.grades.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sin {lower(vocabulary?.grades ?? 'grados')} todavía.</p>
                      ) : (
                        <ol className="flex flex-wrap gap-2" aria-label={`${vocabulary?.grades} de ${level.name}`}>
                          {level.grades.map((grade, gIndex) => (
                            <li key={grade.id} className="group flex items-center gap-1 rounded-xl border border-border bg-surface py-1.5 pr-1.5 pl-3">
                              <span className="text-sm font-semibold text-foreground tabular-nums">{grade.shortName}</span>
                              <span className="hidden text-sm text-muted-foreground sm:inline">{grade.name !== grade.shortName && `· ${grade.name}`}</span>
                              <span className="ml-1 rounded-full bg-background px-1.5 text-xs text-muted-foreground tabular-nums" title={`${grade.sectionCount} ${lower(vocabulary?.sections ?? 'secciones')} en todos los periodos`}>
                                {grade.sectionCount}
                              </span>
                              {canManage && (
                                <span className="flex items-center">
                                  <button type="button" className={cn(iconButton, 'size-7')} disabled={gIndex === 0 || isPending} onClick={(): void => reorderGrades(level, gIndex, -1)} aria-label={`Mover ${grade.name} antes`}>
                                    <MorphIcon icon={ArrowUp} size={13} className="-rotate-90" />
                                  </button>
                                  <button type="button" className={cn(iconButton, 'size-7')} onClick={(): void => setEditing({ kind: 'grade', level, grade })} aria-label={`Editar ${grade.name}`}>
                                    <MorphIcon icon={Pencil} size={13} />
                                  </button>
                                  <ConfirmDelete
                                    compact
                                    title={`¿Eliminar ${grade.name} de ${level.name}?`}
                                    description="Se elimina de la estructura. No se puede deshacer."
                                    disabled={grade.sectionCount > 0}
                                    disabledReason={`Tiene ${lower(vocabulary?.sections ?? 'secciones')} en algún periodo.`}
                                    onConfirm={(): void => act(() => runAcademicAction(deleteGradeAction(slug, grade.id)))}
                                  />
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      )}
                      {canManage && (
                        <button type="button" onClick={(): void => setEditing({ kind: 'grade', level, grade: null })} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
                          <MorphIcon icon={Plus} size={14} />
                          Agregar {lower(vocabulary?.grade ?? 'grado')}
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}

          <p className="text-sm text-muted-foreground">
            Las {lower(vocabulary?.sections ?? 'secciones')} se arman en cada {lower(vocabulary?.period ?? 'periodo')}:{' '}
            <Link href={PERIODS_PATH} className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
              <MorphIcon icon={CalendarRange} size={14} />
              ir a {lower(vocabulary?.periods ?? 'periodos')}
            </Link>
            .
          </p>
        </div>
      )}

      {context && editing?.kind === 'level' && <LevelDialog slug={slug} context={context} level={editing.level} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {context && editing?.kind === 'grade' && <GradeDialog slug={slug} context={context} level={editing.level} grade={editing.grade} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {context && editing?.kind === 'settings' && <SettingsDialog slug={slug} context={context} onClose={(): void => setEditing(null)} onSaved={reload} />}
    </AcademicPage>
  );
};

const describe = (context: AcademicContext): string => {
  switch (context.institutionKind) {
    case 'eba':
      return 'Ciclos Inicial, Intermedio y Avanzado con sus grados, y las formas de atención en que se ofrece cada uno.';
    case 'ebe':
      return 'PRITE, Inicial y Primaria con sus grados o edades. Cada estudiante sigue además su plan de orientación individual.';
    case 'cepre':
      return 'Las áreas o grupos de carreras a los que se preparan los alumnos. Cada ciclo arma sus aulas por área y turno.';
    case 'institute':
      return 'Programas de estudios con su nivel formativo, créditos y semestres del plan.';
    default:
      return 'Niveles de la Educación Básica Regular y sus grados. Las secciones se arman en cada año lectivo.';
  }
};

// The profile in one line of facts, editable by managers
const ProfileStrip = ({ context, onEdit }: { context: AcademicContext; onEdit?: () => void }): JSX.Element => {
  const s = context.settings;
  const facts = [
    { label: 'Gestión', value: managementLabels[s?.management === 'public' ? 'public' : 'private'] },
    { label: 'Periodos', value: `${context.vocabulary?.periods ?? ''}${s && s.termScheme !== 'none' ? ` en ${lower(termSchemeLabels[s.termScheme])}` : ''}` },
    { label: 'Calificación', value: `${gradingScaleLabels[s?.gradingScale ?? 'literal']}${s?.passingGrade ? ` · aprueba con ${s.passingGrade}` : ''}${s?.conductGrade ? ' · conducta 0–20' : ''}` },
    { label: 'Turnos', value: (s?.shifts ?? []).map((x) => shiftLabels[x]).join(', ') },
    { label: 'Días de clase', value: (s?.weekDays ?? []).map((d) => weekdayShort[String(d)]).join(', ') },
    { label: 'Asistencia', value: `tolerancia ${s?.lateAfterMinutes ?? 10} min · alerta desde ${s?.absenceLimitPercent ?? 30} %` },
    ...(context.usesAttentionModes ? [{ label: 'Formas de atención', value: (s?.attentionModes ?? []).map((x) => attentionModeLabels[x]).join(', ') }] : []),
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl bg-surface px-5 py-4 md:px-6">
      <dl className="flex flex-1 flex-wrap gap-x-8 gap-y-3">
        {facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{fact.label}</dt>
            <dd className="text-sm font-medium text-foreground">{fact.value || '—'}</dd>
          </div>
        ))}
      </dl>
      {onEdit && (
        <button type="button" className="btn-alt" onClick={onEdit}>
          <MorphIcon icon={Settings2} size={16} />
          Perfil académico
        </button>
      )}
    </div>
  );
};
