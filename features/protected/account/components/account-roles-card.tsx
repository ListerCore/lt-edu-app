'use client';

import type { JSX } from 'react';
import { BriefcaseBusiness, CircleCheck, LoaderCircle } from 'lucide';
import { MorphIcon } from '@/components/ui/morph-icon';
import { institutionKindLabels } from '../data/account-data';
import { useSwitchRole } from '../hooks/use-switch-role';
import type { AccountRolesCardProps } from '../types';

// Every role the person holds, and where; switching changes the role this session works as, without signing in again
export const AccountRolesCard = ({ account, onSwitched }: AccountRolesCardProps): JSX.Element => {
  const { pendingId, switchTo } = useSwitchRole(onSwitched);

  return (
    <section aria-labelledby="account-roles" className="rounded-2xl border border-border bg-background p-6">
      <h2 id="account-roles" className="flex items-center gap-2.5 text-base font-semibold text-foreground">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand-soft text-brand">
          <MorphIcon icon={BriefcaseBusiness} size={16} />
        </span>
        Roles y accesos
      </h2>
      {account.roles.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Todavía no tienes roles asignados. Tu institución te los asigna desde secretaría.</p>
      ) : (
        <ul className="mt-5 divide-y divide-border">
          {account.roles.map((role): JSX.Element => {
            const active = role.id === account.activeRoleId;
            return (
              <li key={role.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{role.name}</p>
                  <p className="text-xs text-muted-foreground">{role.institution ? `${role.institution.name} · ${institutionKindLabels[role.institution.kind]}` : 'Plataforma ListerCore Edu'}</p>
                </div>
                {active ? (
                  <span className="pill inline-flex items-center gap-1 bg-success/12 text-success">
                    <MorphIcon icon={CircleCheck} size={12} />
                    En uso
                  </span>
                ) : (
                  <button type="button" onClick={(): void => switchTo(role.id)} disabled={pendingId !== null} className="btn-alt h-8 px-3 text-xs">
                    {pendingId === role.id && <MorphIcon icon={LoaderCircle} size={12} className="animate-spin" />}
                    Usar este rol
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
