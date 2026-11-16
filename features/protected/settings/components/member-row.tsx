'use client';

import type { JSX } from 'react';
import { Clock, MailCheck } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { ConfirmDelete } from '@/features/protected/academic/components/academic-ui';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { cn } from '@/lib/utils';
import { ebaRoleOverrides, memberRoleLabels } from '../data/settings-data';
import type { MemberRowProps } from '../types';

const signInFormat = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Lima' });

// One person: name and email, each role (or invitation) with a way to take it away, and their last sign-in
export const MemberRow = ({ group, grantableRoles, revokingId, onRevoke }: MemberRowProps): JSX.Element => {
  const { institutionType } = useWorkspace();
  const labelOf = (role: string): string => (institutionType === 'EBA' ? ebaRoleOverrides[role] : undefined) ?? memberRoleLabels[role] ?? role;
  const initials = (group.fullName || group.email)
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

  return (
    <li className="flex flex-wrap items-center gap-x-4 gap-y-3 py-4">
      <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold', group.pending ? 'bg-secondary text-muted-foreground' : 'bg-brand-soft text-brand')} aria-hidden="true">
        {initials}
      </span>
      <div className="min-w-0 flex-1 basis-56">
        <p className="truncate text-sm font-semibold text-foreground">
          {group.fullName || group.email}
          {group.isSelf && <span className="ml-2 text-xs font-normal text-muted-foreground">(tú)</span>}
        </p>
        <p className="truncate text-xs text-muted-foreground">{group.fullName ? group.email : 'Aún no creó su cuenta'}</p>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MorphIcon icon={group.pending ? Clock : MailCheck} size={12} />
          {group.pending ? 'Invitación pendiente' : group.lastSignInAt ? `Último ingreso: ${signInFormat.format(new Date(group.lastSignInAt))}` : 'Nunca ingresó'}
        </p>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Roles">
        {group.accesses.map((a) => {
          const removable = grantableRoles.includes(a.role) && !(group.isSelf && !a.pending);
          return (
            <li key={a.id} className={cn('flex items-center rounded-full border py-0.5 pr-0.5 pl-3 text-xs font-medium', a.pending ? 'border-dashed border-border text-muted-foreground' : 'border-border text-foreground')}>
              {labelOf(a.role)}
              {a.pending && <span className="ml-1 font-normal">· invitado</span>}
              {removable ? (
                <ConfirmDelete
                  compact
                  label="Quitar"
                  title={a.pending ? `¿Cancelar la invitación de ${group.email}?` : `¿Quitar el rol ${labelOf(a.role)}?`}
                  description={a.pending ? 'Si crea su cuenta con ese correo, ya no entrará con este rol.' : `${group.fullName || group.email} deja de entrar como ${labelOf(a.role).toLowerCase()} en esta institución.`}
                  isPending={revokingId === a.id}
                  onConfirm={(): void => onRevoke(a.id)}
                />
              ) : (
                <span className="w-2" />
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
};
