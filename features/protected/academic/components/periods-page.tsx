'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';
import { ChevronRight, Plus } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { getPeriodsAction } from '../actions/academic-actions';
import { formatRange, lower, periodPath, periodStatusClass, periodStatusLabels, seasonLabels, termSchemeLabels } from '../data/academic-data';
import { useAcademicData } from '../hooks/use-academic-data';
import { useInstitutionSlug } from '../hooks/use-institution-slug';
import { useToday } from '../hooks/use-today';
import type { AcademicContext, Period } from '../types';
import { AcademicPage, LoadError, PageSkeleton, StatusPill } from './academic-ui';
import { PeriodDialog } from './period-dialogs';
import { PeriodTimeline } from './period-timeline';

const order: Record<string, number> = { active: 0, planning: 1, closed: 2 };

// Años lectivos / periodos promocionales / ciclos / semestres académicos: running first, then planned, then closed
export const PeriodsPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const router = useRouter();
  const { data, isLoading, error, reload } = useAcademicData(`periods:${slug}`, () => getPeriodsAction(slug));
  const [creating, setCreating] = useState(false);
  const today = useToday();
  const context = data?.context ?? null;
  const vocabulary = context?.vocabulary;
  const periods = [...(data?.periods ?? [])].sort((a, b) => order[a.status] - order[b.status] || b.startsOn.localeCompare(a.startsOn));

  return (
    <AcademicPage
      titleId="periods-title"
      title={vocabulary?.periods ?? 'Periodos'}
      description={context ? describe(context) : 'Los periodos académicos de la institución.'}
      context={context}
      actions={
        <button type="button" className="btn-brand" onClick={(): void => setCreating(true)}>
          <MorphIcon icon={Plus} size={16} />
          Nuevo {lower(vocabulary?.period ?? 'periodo')}
        </button>
      }
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !context ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : periods.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <p className="text-lg font-semibold text-foreground">Aún no hay {lower(vocabulary?.periods ?? 'periodos')}</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">Crea el primero con sus fechas. Se divide solo y luego armas sus {lower(vocabulary?.sections ?? 'secciones')}.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {periods.map((period) => (
            <li key={period.id}>
              <PeriodRow period={period} context={context} today={today} />
            </li>
          ))}
        </ul>
      )}
      {context && creating && <PeriodDialog slug={slug} context={context} period={null} onClose={(): void => setCreating(false)} onSaved={(p): void => router.push(periodPath(p.id))} />}
    </AcademicPage>
  );
};

const PeriodRow = ({ period, context, today }: { period: Period; context: AcademicContext; today: string }): JSX.Element => {
  const current = period.terms.find((t) => t.startsOn <= today && today <= t.endsOn);
  const vocabulary = context.vocabulary;
  return (
    <Link href={periodPath(period.id)} className="group block rounded-2xl border border-border bg-background p-5 transition-colors hover:border-brand/50 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="flex flex-wrap items-center gap-2 text-lg font-semibold text-foreground">
            {period.name}
            <StatusPill className={periodStatusClass[period.status]}>{periodStatusLabels[period.status]}</StatusPill>
            {period.season && <StatusPill className="bg-secondary text-foreground">{seasonLabels[period.season]}</StatusPill>}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatRange(period.startsOn, period.endsOn)}
            {period.termScheme !== 'none' && ` · ${period.terms.length} ${lower(termSchemeLabels[period.termScheme])}`}
            {current && period.status === 'active' && <span className="font-medium text-foreground"> · ahora: {current.name}</span>}
          </p>
        </div>
        <div className="flex items-center gap-6 text-right">
          <div>
            <p className="text-xl font-semibold text-foreground tabular-nums">{period.sectionCount}</p>
            <p className="text-xs text-muted-foreground">{lower(vocabulary?.sections ?? 'secciones')}</p>
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground tabular-nums">{period.capacityTotal}</p>
            <p className="text-xs text-muted-foreground">vacantes</p>
          </div>
          <MorphIcon icon={ChevronRight} size={18} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
      <div className="mt-4">
        <PeriodTimeline period={period} today={today} />
      </div>
    </Link>
  );
};

const describe = (context: AcademicContext): string => {
  switch (context.institutionKind) {
    case 'eba':
      return 'Cada periodo promocional va del inicio al término de un grado. En semipresencial o a distancia puede haber dos en un mismo año.';
    case 'cepre':
      return 'Ciclos por temporada: verano, anual, semestral, intensivo o repaso. Pueden correr varios a la vez.';
    case 'institute':
      return 'Semestres académicos. Solo uno puede estar en curso.';
    default:
      return 'El año lectivo y su división en bimestres o trimestres. Solo uno puede estar en curso.';
  }
};
