import type { PasswordRule } from '../types';

// Where a completed sign-in lands
export const AFTER_AUTH_PATH = '/dashboard';

// Why a redirect (Google callback) sent the visitor back to sign in
export const authErrorMessages: Record<string, string> = {
  google_cancelled: 'Cancelaste el ingreso con Google.',
  google_failed: 'No pudimos ingresar con Google. Inténtalo de nuevo o usa tu correo.',
  google_not_configured: 'El ingreso con Google no está disponible por ahora. Usa tu correo.',
  not_invited: 'Tu correo de Google no figura en ninguna institución. Pide a tu institución que te registre.',
};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const OTP_LENGTH = 6;

// Seconds before another 2FA code can be requested
export const RESEND_SECONDS = 30;

// Same rules drive the live checklist and the submit validation
export const passwordRules: PasswordRule[] = [
  { label: 'Al menos 10 caracteres', test: (password) => password.length >= 10 },
  { label: 'Una letra mayúscula', test: (password) => /[A-ZÁÉÍÓÚÑ]/.test(password) },
  { label: 'Una letra minúscula', test: (password) => /[a-záéíóúñ]/.test(password) },
  { label: 'Un número', test: (password) => /\d/.test(password) },
];

export const isStrongPassword = (password: string): boolean => passwordRules.every(({ test }) => test(password));

// Masks the local part so the 2FA screen confirms the address without exposing it in full
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  return `${local.slice(0, 2)}${'•'.repeat(Math.max(local.length - 2, 1))}@${domain}`;
};
