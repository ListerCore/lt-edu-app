'use client';

import { useState, type JSX } from 'react';
import { Search, UserPlus } from 'lucide';
import { Input } from '@/components/ui/input';
import { MorphIcon } from '@/components/ui/morph-icon';
import { AcademicPage, LoadError, PageSkeleton, SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { ebaRoleOverrides, memberRoleLabels } from '../data/settings-data';
import { useRevokeMember } from '../hooks/use-revoke-member';
import { useUsersPage } from '../hooks/use-users-page';
import { GrantMemberDialog } from './grant-member-dialog';
import { MemberRow } from './member-row';

// Configuración › Usuarios y roles: who on the staff enters the panel and with which role. Students and families get
// their access from enrollment, so they are not listed here
export const UsersPage = (): JSX.Element => {
  const page = useUsersPage();
  const { institutionType } = useWorkspace();
  const [granting, setGranting] = useState(false);
  const { revoke, revokingId } = useRevokeMember(page.reload);
  const labels = institutionType === 'EBA' ? { ...memberRoleLabels, ...ebaRoleOverrides } : memberRoleLabels;
  const roleOptions = [{ value: '', label: 'Todos los roles' }, ...page.grantableRoles.map((r) => ({ value: r, label: labels[r] ?? r }))];

  return (
    <AcademicPage
      titleId="users-title"
      title="Usuarios y roles"
      description="Quién del personal entra al panel y con qué rol. Estudiantes y familias reciben su acceso al matricularse."
      context={{ canManage: true }}
      actions={
        <button type="button" className="btn-brand" onClick={(): void => setGranting(true)} disabled={!page.data}>
          <MorphIcon icon={UserPlus} size={16} />
          Dar acceso
        </button>
      }
    >
      {page.error ? (
        <LoadError message={page.error} onRetry={page.reload} />
      ) : page.isLoading ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <label className="relative min-w-0 flex-1 basis-64">
              <span className="sr-only">Buscar por nombre o correo</span>
              <MorphIcon icon={Search} size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
              <Input value={page.query} onChange={(e): void => page.setQuery(e.target.value)} placeholder="Buscar por nombre o correo" className={`${controlClassName} pl-9`} />
            </label>
            <div className="w-full sm:w-56">
              <SelectField id="users-role-filter" value={page.roleFilter} options={roleOptions} onChange={page.setRoleFilter} />
            </div>
          </div>
          {page.groups.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">{page.query || page.roleFilter ? 'Nadie coincide con la búsqueda.' : 'Aún no hay personal con acceso. Empieza con «Dar acceso».'}</p>
          ) : (
            <ul className="divide-y divide-border rounded-2xl border border-border bg-background px-4 md:px-5">
              {page.groups.map((g) => (
                <MemberRow key={g.email} group={g} grantableRoles={page.grantableRoles} revokingId={revokingId} onRevoke={revoke} />
              ))}
            </ul>
          )}
          <p className="text-xs text-muted-foreground">Cada cambio queda en la auditoría. Nadie puede quitarse su propio acceso y la institución siempre conserva un director.</p>
        </div>
      )}
      {granting && page.data && <GrantMemberDialog grantableRoles={page.grantableRoles} onClose={(): void => setGranting(false)} onGranted={page.reload} />}
    </AcademicPage>
  );
};
