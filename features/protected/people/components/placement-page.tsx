'use client';

import Link from 'next/link';
import { useState, useTransition, type JSX } from 'react';
import { Plus, Users } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, ConfirmDelete, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { formatDay } from '@/features/protected/academic/data/academic-data';
import { runAcademicAction } from '@/features/protected/academic/hooks/use-academic-form';
import { useAcademicData } from '@/features/protected/academic/hooks/use-academic-data';
import { PdfViewer } from '@/features/protected/documents/components/pdf-viewer';
import { SignersDialog } from '@/features/protected/documents/components/signers-dialog';
import { isPeopleEvent } from '@/hooks/use-live';
import { deletePlacementAction, getPlacementsAction } from '../actions/people-actions';
import { placementKindLabels, studentPath } from '../data/people-data';
import { usePeopleContext } from '../hooks/use-people-context';
import { usePlacementAct } from '../hooks/use-placement-act';
import type { Placement } from '../types';
import { PlacementActCell } from './placement-act-cell';
import { PlacementDialog } from './placement-dialog';

// Ubicación y convalidación (EBA): who was placed by a test or had grades validated, and in which cycle and grade
export const PlacementPage = (): JSX.Element => {
  const { data: ctx, error, isLoading, reload, slug } = usePeopleContext();
  const { data, reload: reloadList } = useAcademicData(`placements:${slug}`, () => getPlacementsAction(slug), isPeopleEvent);
  const [creating, setCreating] = useState(false);
  const [signers, setSigners] = useState(false);
  const [isPending, startTransition] = useTransition();
  const act = usePlacementAct(slug, reloadList);
  const usable = ctx?.context.usesAttentionModes;

  return (
    <AcademicPage
      titleId="placement-title"
      title="Ubicación y convalidación"
      description="Quien no tiene certificados rinde una prueba de ubicación; quien estudió en EBR, en el extranjero o acredita competencias laborales convalida, revalida o pide equivalencia. Cada trámite queda en un acta numerada que firma la dirección."
      context={ctx ? { ...ctx.context, canManage: ctx.canManage } : null}
      actions={
        usable && (
          <>
            {ctx?.canManage && (
              <button type="button" className="btn-alt" onClick={(): void => setSigners(true)}>
                <MorphIcon icon={Users} size={16} />
                Firmantes
              </button>
            )}
            <button type="button" className="btn-brand" onClick={(): void => setCreating(true)}>
              <MorphIcon icon={Plus} size={16} />
              Registrar
            </button>
          </>
        )
      }
    >
      {isLoading ? (
        <PageSkeleton />
      ) : error || !ctx ? (
        <LoadError message={error ?? 'Sin datos.'} onRetry={reload} />
      ) : !usable ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">La ubicación y la convalidación son propias de la Educación Básica Alternativa (CEBA).</p>
      ) : (data ?? []).length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">Aún no hay registros.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-background">
          <table className="w-full min-w-[60rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium">Estudiante</th>
                <th scope="col" className="px-4 py-3 font-medium">Proceso</th>
                <th scope="col" className="px-4 py-3 font-medium">Resultado</th>
                <th scope="col" className="px-4 py-3 font-medium">Fecha</th>
                <th scope="col" className="px-4 py-3 font-medium">Procedencia</th>
                <th scope="col" className="px-4 py-3 font-medium">Acta</th>
                {ctx.canManage && <th scope="col" className="sr-only">Acciones</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(data ?? []).map((p: Placement) => (
                <tr key={p.id}>
                  <td className="px-4 py-2.5">
                    <Link href={studentPath(p.studentId)} className="font-medium text-foreground hover:text-brand">
                      {p.studentName}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-foreground">{placementKindLabels[p.kind]}</td>
                  <td className="px-4 py-2.5 text-foreground">
                    {p.gradeName} · {p.levelName}
                    {p.subjectNames.length > 0 && <span className="block text-xs text-muted-foreground">Convalida: {p.subjectNames.join(', ')}</span>}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{formatDay(p.decidedOn)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {p.origin || '—'}
                    {p.originStudies && <span className="block text-xs">{p.originStudies}</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <PlacementActCell placement={p} canManage={ctx.canManage} busy={act.busy} onGenerate={(): void => act.generate(p)} onSign={(): void => act.sign(p)} onView={(): void => act.view(p)} />
                  </td>
                  {ctx.canManage && (
                    <td className="px-2 py-2 text-right">
                      {p.actStatus !== 'published' && p.actStatus !== 'superseded' && <ConfirmDelete compact isPending={isPending} title="¿Eliminar el registro?" description={`${placementKindLabels[p.kind]} de ${p.studentName}.`} onConfirm={(): void => startTransition(async (): Promise<void> => { await runAcademicAction(deletePlacementAction(slug, p.id)); reloadList(); })} />}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {ctx && creating && <PlacementDialog slug={slug} ctx={ctx} onClose={(): void => setCreating(false)} onSaved={reloadList} />}
      {signers && <SignersDialog slug={slug} kind="placement" title="Firmantes de las actas de ubicación" onClose={(): void => setSigners(false)} onDone={reloadList} />}
      {act.preview.file && <PdfViewer file={act.preview.file} onClose={act.preview.close} />}
    </AcademicPage>
  );
};
