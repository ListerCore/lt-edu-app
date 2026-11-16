'use client';

import { DATE_PATTERN } from '@/features/protected/academic/data/academic-data';
import { useAcademicForm } from '@/features/protected/academic/hooks/use-academic-form';
import { useInstitutionSlug } from '@/features/protected/academic/hooks/use-institution-slug';
import { savePlatformSheetAction } from '../actions/save-platform-sheet';
import { URL_PATTERN } from '../data/settings-data';
import type { FormState, PlatformSheet, PlatformSheetValues, UsePlatformSheetFormParams } from '../types';

// Max length of each text field (academic.platform_sheets)
const limits: Record<Exclude<keyof PlatformSheetValues, 'hostingKind' | 'validUntil'>, number> = {
  platformName: 120,
  url: 300,
  technology: 200,
  administrator: 160,
  accessProfiles: 300,
  hostingOther: 120,
  provider: 160,
  instance: 160,
  contractReference: 160,
  serviceStatus: 160,
  technicalLead: 160,
  technicalLeadSpecialty: 160,
  technicalLeadCip: 20,
};

const initialOf = (p: PlatformSheet): PlatformSheetValues => ({
  platformName: p.platformName,
  url: p.url,
  technology: p.technology,
  administrator: p.administrator,
  accessProfiles: p.accessProfiles,
  hostingKind: p.hostingKind || 'hosting',
  hostingOther: p.hostingOther,
  provider: p.provider,
  instance: p.instance,
  contractReference: p.contractReference,
  serviceStatus: p.serviceStatus,
  validUntil: p.validUntil,
  technicalLead: p.technicalLead,
  technicalLeadSpecialty: p.technicalLeadSpecialty,
  technicalLeadCip: p.technicalLeadCip,
});

const validate = (v: PlatformSheetValues): Record<string, string> => {
  const errors: Record<string, string> = {};
  if (v.url.trim() && !URL_PATTERN.test(v.url.trim())) errors.url = 'Escribe la dirección completa, con https://.';
  if (v.hostingKind === 'other' && !v.hostingOther.trim()) errors.hostingOther = 'Describe el alojamiento.';
  if (v.validUntil && !DATE_PATTERN.test(v.validUntil)) errors.validUntil = 'Fecha no válida.';
  if (!/^\d*$/.test(v.technicalLeadCip.trim())) errors.technicalLeadCip = 'Solo números.';
  return errors;
};

// Edit the platform sheet: every text is trimmed, spaces collapse and each field keeps its length limit
export const useSavePlatformSheet = ({ platform, onSaved }: UsePlatformSheetFormParams): FormState<PlatformSheetValues> => {
  const slug = useInstitutionSlug();
  return useAcademicForm({
    initial: initialOf(platform),
    validate,
    save: (v: PlatformSheetValues) => {
      const payload = { ...v };
      for (const [key, max] of Object.entries(limits) as Array<[keyof typeof limits, number]>) payload[key] = v[key].trim().replace(/\s+/g, ' ').slice(0, max);
      if (payload.hostingKind !== 'other') payload.hostingOther = '';
      return savePlatformSheetAction(slug, payload);
    },
    onSaved: () => onSaved(),
    successTitle: 'Ficha guardada',
  });
};
