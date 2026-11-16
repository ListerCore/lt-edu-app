'use client';

import type { JSX } from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { SelectField, controlClassName } from '@/features/protected/academic/components/academic-ui';
import { FormDialog } from '@/features/protected/academic/components/form-dialog';
import { items } from '@/features/protected/academic/data/academic-data';
import { useWorkspace } from '@/features/protected/dashboard/hooks/use-workspace';
import { ebaRoleOverrides, memberRoleLabels } from '../data/settings-data';
import { useGrantMember } from '../hooks/use-grant-member';
import type { GrantMemberDialogProps } from '../types';

// Give a staff role by email. Without an account yet, the person enters with this role once they sign up with it
export const GrantMemberDialog = ({ grantableRoles, onClose, onGranted }: GrantMemberDialogProps): JSX.Element => {
  const { institutionType } = useWorkspace();
  const labels = institutionType === 'EBA' ? { ...memberRoleLabels, ...ebaRoleOverrides } : memberRoleLabels;
  const { values, errors, isPending, setField, submit } = useGrantMember({
    defaultRole: grantableRoles.includes('teacher') ? 'teacher' : (grantableRoles[0] ?? ''),
    onGranted: (): void => {
      onGranted();
      onClose();
    },
  });
  return (
    <FormDialog title="Dar acceso" description="Si la persona aún no tiene cuenta, la crea con este mismo correo y entra con el rol asignado: nunca elige su rol." submitLabel="Dar acceso" isPending={isPending} onSubmit={submit} onClose={onClose}>
      <FormField id="member-email" label="Correo" required error={errors.email}>
        <Input id="member-email" type="email" autoComplete="off" placeholder="nombre@correo.com" value={values.email} maxLength={254} onChange={(e): void => setField('email', e.target.value)} aria-invalid={Boolean(errors.email)} className={controlClassName} />
      </FormField>
      <FormField id="member-role" label="Rol" required error={errors.role}>
        <SelectField id="member-role" value={values.role} options={items(labels, grantableRoles)} onChange={(v): void => setField('role', v)} invalid={Boolean(errors.role)} />
      </FormField>
    </FormDialog>
  );
};
