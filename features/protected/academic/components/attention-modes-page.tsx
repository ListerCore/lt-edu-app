'use client';

import Link from 'next/link';
import { useState, type JSX } from 'react';
import { Check, Minus, Pencil, Settings2 } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { cn } from '@/lib/utils';
import { getStructureAction } from '../actions/academic-actions';
import { ALL_ATTENTION_MODES, attentionModeHints, attentionModeLabels, STRUCTURE_PATH } from '../data/academic-data';
import { useAcademicData } from '../hooks/use-academic-data';
import { useInstitutionSlug } from '../hooks/use-institution-slug';
import type { Level } from '../types';
import { AcademicPage, LoadError, PageSkeleton } from './academic-ui';
import { LevelDialog, SettingsDialog } from './structure-dialogs';

type Editing = { kind: 'settings' } | { kind: 'level'; level: Level } | null;

// EBA forms of attention: which ones the CEBA offers and in which cycle each one runs
export const AttentionModesPage = (): JSX.Element => {
  const slug = useInstitutionSlug();
  const { data, isLoading, error, reload } = useAcademicData(`structure:${slug}`, () => getStructureAction(slug));
  const [editing, setEditing] = useState<Editing>(null);
  const context = data?.context ?? null;
  const offered = context?.settings?.attentionModes ?? [];
  const levels = data?.levels ?? [];

  return (
    <AcademicPage
      titleId="modes-title"
      title="Formas de atención"
      description="Presencial, semipresencial o a distancia. Cada sección del periodo promocional se abre en una de ellas, según lo que permita su ciclo."
      context={context}
      actions={
        context?.usesAttentionModes && (
          <button type="button" className="btn-alt" onClick={(): void => setEditing({ kind: 'settings' })}>
            <MorphIcon icon={Settings2} size={16} />
            Cambiar las que ofrece
          </button>
        )
      }
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !context ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : !context.usesAttentionModes ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Las formas de atención son propias de la Educación Básica Alternativa (CEBA).</p>
      ) : (
        <div className="space-y-8">
          <ul className="grid gap-4 md:grid-cols-3">
            {ALL_ATTENTION_MODES.map((mode) => {
              const on = offered.includes(mode);
              return (
                <li key={mode} className={cn('rounded-2xl border p-5', on ? 'border-brand/40 bg-brand-soft/40' : 'border-dashed border-border')}>
                  <p className="flex items-center justify-between gap-2 font-semibold text-foreground">
                    {attentionModeLabels[mode]}
                    <span className={cn('pill', on ? 'bg-success/12 text-success' : 'bg-secondary text-muted-foreground')}>{on ? 'Se ofrece' : 'No se ofrece'}</span>
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{attentionModeHints[mode]}</p>
                </li>
              );
            })}
          </ul>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <caption className="sr-only">Formas de atención permitidas en cada ciclo</caption>
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th scope="col" className="px-5 py-3 font-medium">Ciclo</th>
                  {ALL_ATTENTION_MODES.map((mode) => (
                    <th key={mode} scope="col" className="px-5 py-3 text-center font-medium">
                      {attentionModeLabels[mode]}
                    </th>
                  ))}
                  {context.canManage && <th scope="col" className="sr-only">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {levels.map((level) => (
                  <tr key={level.id}>
                    <th scope="row" className="px-5 py-4 font-medium text-foreground">
                      {level.name}
                    </th>
                    {ALL_ATTENTION_MODES.map((mode) => (
                      <td key={mode} className="px-5 py-4 text-center">
                        {level.attentionModes.includes(mode) ? <MorphIcon icon={Check} size={18} strokeWidth={2.5} className="mx-auto text-success" aria-label="Sí" /> : <MorphIcon icon={Minus} size={18} className="mx-auto text-muted-foreground/50" aria-label="No" />}
                      </td>
                    ))}
                    {context.canManage && (
                      <td className="px-5 py-4 text-right">
                        <button type="button" onClick={(): void => setEditing({ kind: 'level', level })} className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label={`Editar ${level.name}`}>
                          <MorphIcon icon={Pencil} size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {levels.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aún no hay ciclos.{' '}
              <Link href={STRUCTURE_PATH} className="font-medium text-brand hover:underline">
                Arma la estructura
              </Link>
              .
            </p>
          )}
        </div>
      )}
      {context && editing?.kind === 'settings' && <SettingsDialog slug={slug} context={context} onClose={(): void => setEditing(null)} onSaved={reload} />}
      {context && editing?.kind === 'level' && <LevelDialog slug={slug} context={context} level={editing.level} onClose={(): void => setEditing(null)} onSaved={reload} />}
    </AcademicPage>
  );
};
