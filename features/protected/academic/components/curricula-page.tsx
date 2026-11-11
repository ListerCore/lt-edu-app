'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';
import { ChevronRight, Plus } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { getCurriculaAction } from '../actions/curriculum-actions';
import { curriculumPath, curriculumStatusClass, curriculumStatusLabels, lower, subjectNoun } from '../data/academic-data';
import { useAcademicData } from '../hooks/use-academic-data';
import { useInstitutionSlug } from '../hooks/use-institution-slug';
import type { Curriculum } from '../types';
import { AcademicPage, LoadError, PageSkeleton, StatusPill } from './academic-ui';
import { NewCurriculumDialog } from './curriculum-dialogs';

const statusOrder: Record<string, number> = { active: 0, draft: 1, archived: 2 };
const dateFormat = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });

// Plan de estudios: the plans of every level, the one in force first, then drafts and archived versions
export const CurriculaPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const router = useRouter();
  const { data, isLoading, error, reload } = useAcademicData(`curricula:${slug}`, () => getCurriculaAction(slug));
  const [creating, setCreating] = useState<{ levelId?: string } | null>(null);
  const context = data?.context ?? null;
  const kind = context?.institutionKind ?? 'ebr';
  const subjects = subjectNoun[kind] ?? subjectNoun.ebr;

  return (
    <AcademicPage
      titleId="curricula-title"
      title="Plan de estudios"
      description={describe(kind)}
      context={context}
      actions={
        <button type="button" className="btn-brand" onClick={(): void => setCreating({})}>
          <MorphIcon icon={Plus} size={16} />
          Nuevo plan
        </button>
      }
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !data || !context ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : data.levels.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Primero arma la estructura académica: los planes se hacen para cada {lower(context.vocabulary?.level ?? 'nivel')}.</p>
      ) : (
        <div className="space-y-8">
          {data.levels.map((level) => {
            const plans = data.curricula.filter((c) => c.levelId === level.id).sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
            return (
              <section key={level.id} aria-labelledby={`level-${level.id}`}>
                <div className="flex items-center justify-between gap-3">
                  <h2 id={`level-${level.id}`} className="text-lg font-semibold text-foreground">
                    {level.name}
                  </h2>
                  {context.canManage && (
                    <button type="button" onClick={(): void => setCreating({ levelId: level.id })} className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
                      <MorphIcon icon={Plus} size={14} />
                      Nuevo plan
                    </button>
                  )}
                </div>
                {plans.length === 0 ? (
                  <p className="mt-3 rounded-xl border border-dashed border-border px-5 py-6 text-sm text-muted-foreground">
                    Sin plan de estudios.{data.templateLevelIds.includes(level.id) && context.canManage && ' Puedes partir del plan sugerido.'}
                  </p>
                ) : (
                  <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
                    {plans.map((plan) => (
                      <li key={plan.id}>
                        <PlanRow plan={plan} kind={kind} noun={subjects} />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
      {context && data && creating && (
        <NewCurriculumDialog slug={slug} context={context} levels={data.levels} templateLevelIds={data.templateLevelIds} initialLevelId={creating.levelId} onClose={(): void => setCreating(null)} onSaved={(plan): void => router.push(curriculumPath(plan.id))} />
      )}
    </AcademicPage>
  );
};

const PlanRow = ({ plan, kind, noun }: { plan: Curriculum; kind: string; noun: { one: string; many: string } }): JSX.Element => (
  <Link href={curriculumPath(plan.id)} className={cn('group flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-surface', plan.status === 'archived' && 'text-muted-foreground')}>
    <div className="min-w-0 flex-1">
      <p className="flex flex-wrap items-center gap-2 font-medium text-foreground">
        {plan.name}
        <StatusPill className={curriculumStatusClass[plan.status]}>{curriculumStatusLabels[plan.status]}</StatusPill>
      </p>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {plan.subjectCount} {lower(plan.subjectCount === 1 ? noun.one : noun.many)}
        {kind === 'institute' && ` · ${plan.totalCredits} créditos`}
        {plan.activatedAt && ` · vigente desde el ${dateFormat.format(new Date(plan.activatedAt))}`}
      </p>
    </div>
    <MorphIcon icon={ChevronRight} size={18} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
  </Link>
);

const describe = (kind: string): string => {
  switch (kind) {
    case 'cepre':
      return 'Los cursos de cada área con sus horas semanales y los temas que se dictan. Cada área puede tener varias versiones; una está vigente.';
    case 'institute':
      return 'El plan de cada programa: módulos formativos, unidades didácticas con créditos y las experiencias formativas en situaciones reales de trabajo.';
    default:
      return 'Las áreas curriculares de cada nivel, sus competencias y las horas por grado. Cada nivel tiene un plan vigente y puede preparar la siguiente versión.';
  }
};
