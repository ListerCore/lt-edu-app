'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition, type JSX } from 'react';
import { ArrowLeft, Copy, Lock, LockOpen, Pencil, Play, Plus, Undo2 } from 'lucide';
import { sileo } from 'sileo';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AttachmentsPanel } from '@/features/protected/attachments/components/attachments-panel';
import { cn } from '@/lib/utils';
import { copySectionsAction, deletePeriodAction, deleteSectionAction, getPeriodAction, setPeriodStatusAction } from '../actions/academic-actions';
import { attentionModeLabels, daysBetween, distanceVariantLabels, ebaProgramLabels, formatDay, formatRange, lower, PERIODS_PATH, periodStatusClass, periodStatusLabels, seasonLabels, shiftLabels, termStatusLabels } from '../data/academic-data';
import { runAcademicAction } from '../hooks/use-academic-form';
import { useAcademicData } from '../hooks/use-academic-data';
import { useInstitutionSlug } from '../hooks/use-institution-slug';
import { useToday } from '../hooks/use-today';
import type { AcademicContext, Level, Period, Section, Term } from '../types';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton, SelectField, StatusPill } from './academic-ui';
import { PeriodDialog, SectionDialog, SectionsDialog, TermDialog } from './period-dialogs';
import { PeriodTimeline } from './period-timeline';

type Editing = { kind: 'period' } | { kind: 'term'; term: Term } | { kind: 'sections'; levelId?: string } | { kind: 'section'; section: Section } | null;

// One period: its dates and terms on a timeline, its status, every section grouped by level and grade, and its
// resolutions and annexes
export const PeriodDetailPage = ({ id }: { id: string }): JSX.Element => {
  const slug = useInstitutionSlug();
  const router = useRouter();
  const { data, isLoading, error, reload } = useAcademicData(`period:${slug}:${id}`, () => getPeriodAction(slug, id));
  const [editing, setEditing] = useState<Editing>(null);
  const [copyFrom, setCopyFrom] = useState('');
  const today = useToday();
  const [isPending, startTransition] = useTransition();
  const context = data?.context ?? null;
  const period = data?.period;
  const vocabulary = context?.vocabulary;
  const editable = Boolean(context?.canManage && period && period.status !== 'closed');

  const act = (action: () => Promise<unknown>): void =>
    startTransition(async (): Promise<void> => {
      await action();
      reload();
    });

  const setStatus = (status: string, success: string): void => act(() => runAcademicAction(setPeriodStatusAction(slug, id, status), success));
  const remove = (): void =>
    startTransition(async (): Promise<void> => {
      const result = await runAcademicAction(deletePeriodAction(slug, id));
      if (result.ok) router.push(PERIODS_PATH);
    });
  const copy = (): void =>
    act(async () => {
      const result = await runAcademicAction(copySectionsAction(slug, id, copyFrom), '');
      if (result.ok) {
        sileo.success({ title: result.data === 0 ? 'No había nada nuevo que copiar' : `${result.data} ${lower(vocabulary?.sections ?? 'secciones')} copiadas` });
      }
    });

  const back = (
    <Link href={PERIODS_PATH} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
      <MorphIcon icon={ArrowLeft} size={15} />
      {vocabulary?.periods ?? 'Periodos'}
    </Link>
  );

  return (
    <AcademicPage
      titleId="period-title"
      title={period?.name ?? (isLoading ? 'Cargando…' : 'Periodo')}
      description={period ? `${formatRange(period.startsOn, period.endsOn)} · ${daysBetween(period.startsOn, period.endsOn)} días` : ''}
      context={context}
      back={back}
      actions={period && <StatusActions period={period} context={context} isPending={isPending} onStatus={setStatus} onEdit={(): void => setEditing({ kind: 'period' })} onDelete={remove} />}
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !context || !period ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : (
        <div className="space-y-10">
          <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <StatusPill className={periodStatusClass[period.status]}>{periodStatusLabels[period.status]}</StatusPill>
              {period.season && <StatusPill className="bg-secondary text-foreground">Temporada: {seasonLabels[period.season]}</StatusPill>}
              {period.status === 'planning' && <span className="text-sm text-muted-foreground">Arma las {lower(vocabulary?.sections ?? 'secciones')} y actívalo cuando empiecen las clases.</span>}
            </div>
            <PeriodTimeline period={period} today={today} size="lg" />

            {period.terms.length > 0 && (
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[34rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th scope="col" className="py-2 pr-4 font-medium">Tramo</th>
                      <th scope="col" className="py-2 pr-4 font-medium">Fechas</th>
                      <th scope="col" className="py-2 pr-4 font-medium">Días</th>
                      <th scope="col" className="py-2 pr-4 font-medium">Estado</th>
                      {editable && <th scope="col" className="sr-only">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {period.terms.map((term) => {
                      const current = term.startsOn <= today && today <= term.endsOn;
                      return (
                        <tr key={term.id}>
                          <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                            {term.name}
                            {current && <span className="ml-2 pill bg-brand-solid text-white">Ahora</span>}
                          </th>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {formatDay(term.startsOn, false)} – {formatDay(term.endsOn)}
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground tabular-nums">{daysBetween(term.startsOn, term.endsOn)}</td>
                          <td className="py-3 pr-4">
                            <span className={cn('pill', term.status === 'closed' ? 'bg-brand-soft text-brand' : 'bg-secondary text-foreground')}>{termStatusLabels[term.status]}</span>
                          </td>
                          {editable && (
                            <td className="py-3 text-right">
                              <button type="button" onClick={(): void => setEditing({ kind: 'term', term })} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label={`Editar ${term.name}`}>
                                <MorphIcon icon={Pencil} size={15} />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <section aria-labelledby="sections-title">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 id="sections-title" className="text-xl font-semibold text-foreground">
                  {vocabulary?.sections}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {period.sectionCount} {lower(vocabulary?.sections ?? 'secciones')} · {period.capacityTotal} vacantes en total
                </p>
              </div>
              {editable && (
                <div className="flex flex-wrap items-center gap-2">
                  {data.otherPeriods.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-56">
                        <SelectField id="copy-from" value={copyFrom} placeholder={`Copiar de otro ${lower(vocabulary?.period ?? "periodo")}`} options={data.otherPeriods.map((p) => ({ value: p.id, label: `${p.name} (${p.sectionCount})` }))} onChange={setCopyFrom} />
                      </div>
                      <button type="button" className="btn-alt" disabled={!copyFrom || isPending} onClick={copy}>
                        <MorphIcon icon={Copy} size={16} />
                        Copiar
                      </button>
                    </div>
                  )}
                  <button type="button" className="btn-brand" onClick={(): void => setEditing({ kind: 'sections' })}>
                    <MorphIcon icon={Plus} size={16} />
                    Agregar {lower(vocabulary?.sections ?? 'secciones')}
                  </button>
                </div>
              )}
            </div>
            <SectionsBoard context={context} levels={data.levels} sections={data.sections} editable={editable} isPending={isPending} onAdd={(levelId): void => setEditing({ kind: 'sections', levelId })} onEdit={(section): void => setEditing({ kind: 'section', section })} onDelete={(section): void => act(() => runAcademicAction(deleteSectionAction(slug, section.id)))} />
          </section>

          {/* Stays open after closing the period: the closing resolution usually arrives later */}
          <AttachmentsPanel
            ownerKind="period"
            ownerId={period.id}
            title="Resoluciones y anexos"
            description="La resolución directoral que aprueba el periodo, la calendarización, el plan anual de trabajo y sus anexos."
            categories={['resolution', 'calendar', 'plan', 'annex', 'other']}
          />
        </div>
      )}

      {context && period && editing?.kind === 'period' && <PeriodDialog slug={slug} context={context} period={period} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {period && editing?.kind === 'term' && <TermDialog slug={slug} period={period} term={editing.term} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {context && period && data && editing?.kind === 'sections' && <SectionsDialog slug={slug} context={context} period={period} levels={data.levels} initialLevelId={editing.levelId} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {context && data && editing?.kind === 'section' && <SectionDialog slug={slug} context={context} section={editing.section} level={data.levels.find((l) => l.id === editing.section.levelId)} onClose={(): void => setEditing(null)} onSaved={reload} />}
    </AcademicPage>
  );
};

interface StatusActionsProps {
  period: Period;
  context: AcademicContext | null;
  isPending: boolean;
  onStatus: (status: string, success: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

// What the period can do next: start, close, reopen, back to planning, edit, delete (only while planning)
const StatusActions = ({ period, context, isPending, onStatus, onEdit, onDelete }: StatusActionsProps): JSX.Element => {
  const noun = lower(context?.vocabulary?.period ?? 'periodo');
  return (
    <>
      {period.status !== 'closed' && (
        <button type="button" className="btn-alt" onClick={onEdit}>
          <MorphIcon icon={Pencil} size={16} />
          Editar
        </button>
      )}
      {period.status === 'planning' && (
        <>
          <ConfirmDelete title={`¿Eliminar ${period.name}?`} description={`Se elimina el ${noun} con sus tramos y ${period.sectionCount} ${lower(context?.vocabulary?.sections ?? 'secciones')}. No se puede deshacer.`} onConfirm={onDelete} isPending={isPending} />
          <button type="button" className="btn-brand" disabled={isPending} onClick={(): void => onStatus('active', 'En curso')}>
            <MorphIcon icon={Play} size={16} />
            Iniciar
          </button>
        </>
      )}
      {period.status === 'active' && (
        <>
          <button type="button" className="btn-alt" disabled={isPending} onClick={(): void => onStatus('planning', 'De vuelta en planificación')}>
            <MorphIcon icon={Undo2} size={16} />
            A planificación
          </button>
          <button type="button" className="btn-brand" disabled={isPending} onClick={(): void => onStatus('closed', 'Cerrado')}>
            <MorphIcon icon={Lock} size={16} />
            Cerrar {noun}
          </button>
        </>
      )}
      {period.status === 'closed' && (
        <button type="button" className="btn-alt" disabled={isPending} onClick={(): void => onStatus('active', 'Reabierto')}>
          <MorphIcon icon={LockOpen} size={16} />
          Reabrir
        </button>
      )}
    </>
  );
};

interface SectionsBoardProps {
  context: AcademicContext;
  levels: Level[];
  sections: Section[];
  editable: boolean;
  isPending: boolean;
  onAdd: (levelId: string) => void;
  onEdit: (section: Section) => void;
  onDelete: (section: Section) => void;
}

// Sections per level, one row per grade (CEPRE: one row per area)
const SectionsBoard = ({ context, levels, sections, editable, isPending, onAdd, onEdit, onDelete }: SectionsBoardProps): JSX.Element => {
  const vocabulary = context.vocabulary;
  const withSections = levels.filter((l) => l.isActive || sections.some((s) => s.levelId === l.id));
  if (withSections.length === 0) {
    return <p className="mt-6 rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Primero arma la estructura académica.</p>;
  }
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      {withSections.map((level) => {
        const own = sections.filter((s) => s.levelId === level.id);
        const rows = context.hasGrades ? level.grades.map((g) => ({ key: g.id, label: g.shortName, title: g.name, items: own.filter((s) => s.gradeId === g.id) })) : [{ key: level.id, label: '', title: '', items: own }];
        const capacity = own.reduce((sum, s) => sum + s.capacity, 0);
        return (
          <div key={level.id} className="rounded-2xl border border-border bg-background">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3.5">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-foreground">{level.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {own.length} {lower(own.length === 1 ? (vocabulary?.section ?? 'sección') : (vocabulary?.sections ?? 'secciones'))} · {capacity} vacantes
                </p>
              </div>
              {editable && (
                <button type="button" onClick={(): void => onAdd(level.id)} className="inline-flex size-8 items-center justify-center rounded-md text-brand hover:bg-brand-soft" aria-label={`Agregar ${lower(vocabulary?.sections ?? 'secciones')} en ${level.name}`}>
                  <MorphIcon icon={Plus} size={16} />
                </button>
              )}
            </div>
            <ul className="divide-y divide-border">
              {rows.map((row) => (
                <li key={row.key} className="flex items-start gap-3 px-5 py-3">
                  {row.label && (
                    <span className="mt-1.5 w-10 shrink-0 text-sm font-semibold text-foreground tabular-nums" title={row.title}>
                      {row.label}
                    </span>
                  )}
                  {row.items.length === 0 ? (
                    <span className="py-1.5 text-sm text-muted-foreground">Sin {lower(vocabulary?.sections ?? 'secciones')}</span>
                  ) : (
                    <ul className="flex flex-wrap gap-2">
                      {row.items.map((section) => (
                        <li key={section.id} className="flex items-center rounded-lg border border-border bg-surface">
                          <button type="button" disabled={!editable} onClick={(): void => onEdit(section)} className="flex items-center gap-2 py-1.5 pr-2 pl-3 text-left text-sm enabled:hover:text-brand" aria-label={editable ? `Editar ${section.gradeShort} ${section.name}` : undefined}>
                            <span className="font-semibold text-foreground">{section.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {shiftLabels[section.shift]} · {section.capacity}
                              {section.attentionMode && ` · ${attentionModeLabels[section.attentionMode]}`}
                              {section.distanceVariant && ` ${distanceVariantLabels[section.distanceVariant]?.toLowerCase()}`}
                              {section.program === 'literacy' && ` · ${ebaProgramLabels.literacy}`}
                              {section.room && ` · ${section.room}`}
                            </span>
                          </button>
                          {editable && <ConfirmDelete compact isPending={isPending} title={`¿Eliminar ${section.gradeName ? `${section.gradeName} ` : ''}${section.name}?`} description={`Se elimina de ${level.name}. No se puede deshacer.`} onConfirm={(): void => onDelete(section)} />}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
