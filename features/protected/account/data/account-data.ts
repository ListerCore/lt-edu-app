import { ownCardholderFor } from '@/features/protected/cards/data/cardholders-roster';
import type { InstitutionType, Role } from '@/features/protected/dashboard/types';
import type { InstitutionKind } from '../types';

// Photo shared with the ID card: own card for students and staff; guardians have their own (their card is the child's)
export const accountPhotoKey = (institutionType: InstitutionType, role: Role): string => (role === 'guardian' ? `guardian-${institutionType}` : (ownCardholderFor(institutionType, role)?.id ?? `account-${role}`));

// joseph-api's institution kinds (iam.institutions.kind)
export const institutionKindLabels: Record<InstitutionKind, string> = {
  ebr: 'Colegio · EBR',
  eba: 'CEBA · EBA',
  ebe: 'CEBE · EBE',
  cepre: 'Pre-universitario',
  institute: 'Instituto',
};

// Seconds before another mailed code can be requested (joseph-api enforces the same 30 s)
export const MAIL_CODE_COOLDOWN = 30;

export const mfaPurposeCopy = {
  mfa_enable: { title: 'Activar la verificación en dos pasos', action: 'Continuar' },
  mfa_disable: { title: 'Desactivar la verificación en dos pasos', action: 'Desactivar' },
  mfa_recovery_codes: { title: 'Generar nuevos códigos de respaldo', action: 'Generar códigos' },
} as const;

const dateTime = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' });
const dateOnly = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

export const formatDateTime = (iso: string): string => dateTime.format(new Date(iso));
export const formatDate = (iso: string): string => dateOnly.format(new Date(iso));

// Plain-text sheet of recovery codes, for the .txt download and the clipboard
export const recoveryCodesText = (codes: string[], email: string, issuedAt: Date): string =>
  [
    'Joseph · Códigos de respaldo de la verificación en dos pasos',
    `Cuenta: ${email}`,
    `Generados: ${dateTime.format(issuedAt)}`,
    '',
    'Cada código sirve una sola vez para ingresar si no tienes tu app autenticadora.',
    'Guárdalos en un lugar seguro. Al generar nuevos, estos dejan de funcionar.',
    '',
    ...codes.map((code, index) => `${String(index + 1).padStart(2, ' ')}. ${code}`),
    '',
  ].join('\n');

export const recoveryCodesFileName = (issuedAt: Date): string => `joseph-codigos-respaldo-${issuedAt.toISOString().slice(0, 10)}.txt`;
