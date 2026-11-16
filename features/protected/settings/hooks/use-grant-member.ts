'use client';

import { sileo } from 'sileo';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { grantMemberAction } from '../actions/grant-member';
import { EMAIL_PATTERN } from '../data/settings-data';
import type { FormState, GrantMemberValues, UseGrantMemberParams } from '../types';

// Give a staff role to an email. The email is trimmed and lowercased; the toast says whether the person can enter
// now or has to create the account with that email first
export const useGrantMember = ({ defaultRole, onGranted }: UseGrantMemberParams): FormState<GrantMemberValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: { email: '', role: defaultRole },
    validate: (v: GrantMemberValues): Record<string, string> => ({
      ...(EMAIL_PATTERN.test(v.email.trim()) ? {} : { email: 'Ingresa un correo válido.' }),
      ...(v.role ? {} : { role: 'Elige el rol.' }),
    }),
    save: (v: GrantMemberValues) => grantMemberAction(slug, { email: v.email.trim().toLowerCase(), role: v.role }),
    onSaved: ({ pending }): void => {
      sileo.success({
        title: pending ? 'Invitación registrada' : 'Acceso otorgado',
        description: pending ? 'Cuando cree su cuenta con ese correo, entrará con este rol.' : 'Ya puede entrar con este rol.',
      });
      onGranted();
    },
  });
};
