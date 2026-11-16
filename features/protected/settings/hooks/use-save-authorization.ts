'use client';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { saveAuthorizationAction } from '../actions/save-authorization';
import type { Authorization, AuthorizationValues, FormState, UseAuthorizationFormParams } from '../types';

const clean = (value: string, max: number): string => value.trim().replace(/\s+/g, ' ').slice(0, max);

const validate = (v: AuthorizationValues): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (!v.kind) errors.kind = 'Elige el tipo de autorización.';
  if (v.kind === 'attention_mode' && !v.attentionMode) errors.attentionMode = 'Elige la forma de atención autorizada.';
  if (clean(v.resolution, 120).length < 3) errors.resolution = 'Escribe el número de la resolución.';
  if (!DATE_PATTERN.test(v.issuedOn)) errors.issuedOn = 'Indica la fecha de la resolución.';
  if (v.expiresOn && DATE_PATTERN.test(v.issuedOn) && v.expiresOn < v.issuedOn) errors.expiresOn = 'El vencimiento no puede ser anterior a la resolución.';
  return errors;
};

const initialOf = (a: Authorization | null): AuthorizationValues =>
  a
    ? { kind: a.kind, levelId: a.levelId, attentionMode: a.attentionMode, resolution: a.resolution, issuedBy: a.issuedBy, issuedOn: a.issuedOn, expiresOn: a.expiresOn, fileNumber: a.fileNumber, notes: a.notes }
    : { kind: 'creation', levelId: '', attentionMode: '', resolution: '', issuedBy: '', issuedOn: '', expiresOn: '', fileNumber: '', notes: '' };

// Record or edit one authorizing resolution. The resolution number is kept as written (only spaces collapse); a
// non-mode authorization never sends a cycle or form
export const useSaveAuthorization = ({ authorization, onSaved }: UseAuthorizationFormParams): FormState<AuthorizationValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: initialOf(authorization),
    validate,
    save: (v: AuthorizationValues) => {
      const isMode = v.kind === 'attention_mode';
      return saveAuthorizationAction(slug, {
        id: authorization?.id ?? '',
        kind: v.kind,
        levelId: isMode ? v.levelId : '',
        attentionMode: isMode ? v.attentionMode : '',
        resolution: clean(v.resolution, 120),
        issuedBy: clean(v.issuedBy, 160),
        issuedOn: v.issuedOn,
        expiresOn: v.expiresOn,
        fileNumber: clean(v.fileNumber, 40),
        notes: v.notes.trim().slice(0, 500),
      });
    },
    onSaved: () => onSaved(),
  });
};
