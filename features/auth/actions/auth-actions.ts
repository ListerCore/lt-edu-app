'use server';

import type { AuthActionResult, ChangePasswordPayload, ForgotPasswordPayload, PasswordSetupPayload, SignInPayload, SignUpPayload, TwoFactorPayload } from '../types';

// Simulated latency so pending states are visible; replaced by joseph-api calls later
const simulate = async (ms = 700): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated rule: any valid email signs in except passwords containing "error", to exercise the failure path
export const signInAction = async ({ email, password, captchaToken }: SignInPayload): Promise<AuthActionResult> => {
  await simulate();
  if (!captchaToken) return { ok: false, message: 'Completa la verificación de seguridad.' };
  if (password.toLowerCase().includes('error')) return { ok: false, code: 'invalid_credentials', message: 'Correo o contraseña incorrectos.' };
  return { ok: true, message: `Enviamos un código de verificación a ${email}.` };
};

// Simulated rule: emails starting with "registrado@" are already taken; the real API also matches the email
// against the people each institution registered, which decides the institution and the role
export const signUpAction = async ({ email, captchaToken }: SignUpPayload): Promise<AuthActionResult> => {
  await simulate(900);
  if (!captchaToken) return { ok: false, message: 'Completa la verificación de seguridad.' };
  if (email.startsWith('registrado@')) return { ok: false, code: 'email_taken', message: 'Ya existe una cuenta con ese correo.' };
  return { ok: true, message: 'Cuenta creada.' };
};

// Always answers the same way so the form never reveals which emails have an account
export const forgotPasswordAction = async ({ captchaToken }: ForgotPasswordPayload): Promise<AuthActionResult> => {
  await simulate();
  if (!captchaToken) return { ok: false, message: 'Completa la verificación de seguridad.' };
  return { ok: true, message: 'Si el correo tiene una cuenta, recibirá un enlace.' };
};

// Simulated rule: the token "vencido" behaves like an expired link
export const passwordSetupAction = async ({ token }: PasswordSetupPayload): Promise<AuthActionResult> => {
  await simulate();
  if (token === 'vencido') return { ok: false, code: 'expired_link', message: 'El enlace venció. Solicita uno nuevo.' };
  return { ok: true, message: 'Contraseña actualizada.' };
};

// Simulated rule: any 6-digit code works except 000000
export const verifyTwoFactorAction = async ({ code }: TwoFactorPayload): Promise<AuthActionResult> => {
  await simulate(600);
  if (!/^\d{6}$/.test(code) || code === '000000') return { ok: false, code: 'invalid_code', message: 'El código no es válido o ya venció.' };
  return { ok: true, message: 'Identidad verificada.' };
};

// Simulated resend of the 2FA code
export const resendTwoFactorAction = async (): Promise<AuthActionResult> => {
  await simulate(400);
  return { ok: true, message: 'Te enviamos un código nuevo.' };
};

// Simulated rule: a current password containing "error" is rejected
export const changePasswordAction = async ({ currentPassword }: ChangePasswordPayload): Promise<AuthActionResult> => {
  await simulate();
  if (currentPassword.toLowerCase().includes('error')) return { ok: false, code: 'invalid_credentials', message: 'La contraseña actual no es correcta.' };
  return { ok: true, message: 'Contraseña actualizada.' };
};
