'use client';

import Link from 'next/link';
import { useState, type JSX } from 'react';
import { ArrowUpRight, Eye, FilePlus2 } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton } from '@/features/protected/academic/components/academic-ui';
import { STRUCTURE_PATH } from '@/features/protected/academic/data/academic-data';
import { useDeleteAuthorization } from '../hooks/use-delete-authorization';
import { useInstitutionPage } from '../hooks/use-institution-page';
import type { Authorization } from '../types';
import { AuthorizationDialog } from './authorization-dialog';
import { AuthorizationList } from './authorization-list';
import { ModulesCard } from './modules-card';
import { PlatformSheetCard } from './platform-sheet-card';

// Configuración › Institución: the resolutions that authorize the institution and, in a CEBA, the e-learning
// platform sheet the DRE asks for. Official data printed on report cards (DRE, UGEL, modular code, logo) stays in
// the academic profile
export const InstitutionPage = (): JSX.Element => {
  const page = useInstitutionPage();
  const [editing, setEditing] = useState<Authorization | 'new' | null>(null);
  const { remove, deletingId } = useDeleteAuthorization(page.reload);
  const data = page.data;
  const canManage = data?.canManageAuthorizations ?? false;

  return (
    <AcademicPage
      titleId="institution-title"
      title="Institución"
      description={page.isEba ? 'Las resoluciones que autorizan al CEBA y sus formas de atención, y la ficha de la plataforma e-learning para los informes de la DRE.' : 'Las resoluciones que autorizan a la institución, con sus PDF a la mano.'}
      context={canManage ? { canManage: true } : null}
      actions={
        <button type="button" className="btn-brand" onClick={(): void => setEditing('new')}>
          <MorphIcon icon={FilePlus2} size={16} />
          Registrar autorización
        </button>
      }
    >
      {page.error ? (
        <LoadError message={page.error} onRetry={page.reload} />
      ) : page.isLoading || !data ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-10">
          {!canManage && (
            <p className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
              <MorphIcon icon={Eye} size={16} />
              Solo lectura: dirección registra las autorizaciones{data.canEditPlatform ? '; tú puedes editar la ficha de la plataforma' : ''}.
            </p>
          )}

          <section aria-labelledby="authorizations-title" className="space-y-6">
            <header>
              <h2 id="authorizations-title" className="text-lg font-semibold text-foreground">
                Autorizaciones
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                {page.isEba
                  ? 'Cuando registras la forma de atención autorizada de un ciclo, el panel solo deja crear secciones en las formas autorizadas y vigentes.'
                  : 'Creación, ampliaciones y otras resoluciones de la institución.'}
              </p>
            </header>
            <AuthorizationList title="Vigentes" authorizations={page.inForce} canManage={canManage} empty={canManage ? 'Aún no hay autorizaciones. Registra la resolución de creación con «Registrar autorización».' : 'Aún no se registraron autorizaciones.'} deletingId={deletingId} onEdit={setEditing} onDelete={remove} />
            {page.expired.length > 0 && <AuthorizationList title="Vencidas o por empezar" authorizations={page.expired} canManage={canManage} empty="" deletingId={deletingId} onEdit={setEditing} onDelete={remove} />}
          </section>

          <ModulesCard />

          {page.isEba && <PlatformSheetCard key={data.platform.updatedAt} institutionId={data.institutionId} platform={data.platform} canEdit={data.canEditPlatform} onSaved={page.reload} />}

          <p className="text-sm text-muted-foreground">
            La DRE, la UGEL, el código modular, el logo y el tipo de gestión que salen en las libretas se editan en{' '}
            <Link href={STRUCTURE_PATH} className="inline-flex items-center gap-0.5 font-medium text-brand hover:underline">
              Estructura académica
              <MorphIcon icon={ArrowUpRight} size={14} />
            </Link>
            .
          </p>
        </div>
      )}
      {editing && <AuthorizationDialog authorization={editing === 'new' ? null : editing} levels={page.levels} isEba={page.isEba} onClose={(): void => setEditing(null)} onSaved={page.reload} />}
    </AcademicPage>
  );
};
