'use server';

import { cookies } from 'next/headers';
import { apiRequest, type ApiError } from '@/lib/api/server';
import { SESSION_COOKIE } from '@/lib/auth/cookies';
import type { Account, AccountActionResult, AccountRole, MailedCode, MfaPurpose, TotpSetup, TwoFactorStatus } from '../types';

// joseph-api answers (internal/adapter/inbound/http/handler/auth_handler.go)
interface MeResponse {
  user: { id: string; email: string; full_name: string; avatar_url: string | null; email_verified: boolean; has_password: boolean; created_at: string };
  roles: AccountRole[];
  active_role_id: string | null;
  google_linked: boolean;
  password_changed_at: string | null;
  last_sign_in_at: string | null;
}

interface MfaResponse {
  totp_enabled: boolean;
  enabled_at: string | null;
  recovery_codes: { total: number; remaining: number; used: Array<{ code: string; used_at: string }> };
}

const failure = <T>(error: ApiError): AccountActionResult<T> => ({ ok: false, code: error.code, message: error.message });

const signedOut = <T>(): AccountActionResult<T> => ({ ok: false, code: 'unauthenticated', message: 'Tu sesión venció. Ingresa de nuevo.' });

const sessionToken = async (): Promise<string | undefined> => (await cookies()).get(SESSION_COOKIE)?.value;

// GET /auth/me: who is signed in, with every role
export const getAccountAction = async (): Promise<AccountActionResult<Account>> => {
  const token = await sessionToken();
  if (!token) return signedOut();
  const result = await apiRequest<MeResponse>('/auth/me', { token });
  if (!result.ok) return failure(result.error);
  const { user, ...rest } = result.data;
  return {
    ok: true,
    message: 'ok',
    data: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      avatarUrl: user.avatar_url,
      emailVerified: user.email_verified,
      hasPassword: user.has_password,
      createdAt: user.created_at,
      roles: rest.roles,
      activeRoleId: rest.active_role_id,
      googleLinked: rest.google_linked,
      passwordChangedAt: rest.password_changed_at,
      lastSignInAt: rest.last_sign_in_at,
    },
  };
};

// GET /auth/mfa: the authenticator app and the recovery codes
export const getTwoFactorStatusAction = async (): Promise<AccountActionResult<TwoFactorStatus>> => {
  const token = await sessionToken();
  if (!token) return signedOut();
  const result = await apiRequest<MfaResponse>('/auth/mfa', { token });
  if (!result.ok) return failure(result.error);
  const { totp_enabled, enabled_at, recovery_codes } = result.data;
  return {
    ok: true,
    message: 'ok',
    data: { enabled: totp_enabled, enabledAt: enabled_at, recovery: { total: recovery_codes.total, remaining: recovery_codes.remaining, used: recovery_codes.used.map(({ code, used_at }) => ({ code, usedAt: used_at })) } },
  };
};

// PUT /auth/me/active-role: work as another of the person's roles without signing in again
export const setActiveRoleAction = async (userRoleId: string): Promise<AccountActionResult> => {
  const token = await sessionToken();
  if (!token) return signedOut();
  const result = await apiRequest('/auth/me/active-role', { method: 'PUT', body: { user_role_id: userRoleId }, token });
  return result.ok ? { ok: true, message: 'Rol actualizado.' } : failure(result.error);
};

// POST /auth/mfa/email-code: mails the code that confirms turning the app on/off or renewing the recovery codes
export const sendTwoFactorCodeAction = async (purpose: MfaPurpose): Promise<AccountActionResult<MailedCode>> => {
  const token = await sessionToken();
  if (!token) return signedOut();
  const result = await apiRequest<{ challenge_token: string; email: string }>('/auth/mfa/email-code', { method: 'POST', body: { purpose }, token });
  if (!result.ok) return failure(result.error);
  return { ok: true, message: `Enviamos un código a ${result.data.email}.`, data: { challengeToken: result.data.challenge_token, email: result.data.email } };
};

// POST /auth/mfa/totp: with the mailed code, a new secret and its QR for the app
export const beginTotpAction = async (challengeToken: string, code: string): Promise<AccountActionResult<TotpSetup>> => {
  const token = await sessionToken();
  if (!token) return signedOut();
  const result = await apiRequest<{ secret: string; otpauth_uri: string; qr_png: string }>('/auth/mfa/totp', { method: 'POST', body: { challenge_token: challengeToken, code }, token });
  if (!result.ok) return failure(result.error);
  return { ok: true, message: 'ok', data: { secret: result.data.secret, otpauthUri: result.data.otpauth_uri, qrPng: result.data.qr_png } };
};

// POST /auth/mfa/totp/confirm: the app's first code turns it on; answers the recovery codes (shown once)
export const confirmTotpAction = async (code: string): Promise<AccountActionResult<string[]>> => {
  const token = await sessionToken();
  if (!token) return signedOut();
  const result = await apiRequest<{ recovery_codes: string[] }>('/auth/mfa/totp/confirm', { method: 'POST', body: { code }, token });
  return result.ok ? { ok: true, message: 'Verificación en dos pasos activada.', data: result.data.recovery_codes } : failure(result.error);
};

// POST /auth/mfa/totp/disable with the mailed code
export const disableTotpAction = async (challengeToken: string, code: string): Promise<AccountActionResult> => {
  const token = await sessionToken();
  if (!token) return signedOut();
  const result = await apiRequest('/auth/mfa/totp/disable', { method: 'POST', body: { challenge_token: challengeToken, code }, token });
  return result.ok ? { ok: true, message: 'Verificación en dos pasos desactivada.' } : failure(result.error);
};

// POST /auth/mfa/recovery-codes with the mailed code: every previous code stops working
export const regenerateRecoveryCodesAction = async (challengeToken: string, code: string): Promise<AccountActionResult<string[]>> => {
  const token = await sessionToken();
  if (!token) return signedOut();
  const result = await apiRequest<{ recovery_codes: string[] }>('/auth/mfa/recovery-codes', { method: 'POST', body: { challenge_token: challengeToken, code }, token });
  return result.ok ? { ok: true, message: 'Generamos nuevos códigos de respaldo.', data: result.data.recovery_codes } : failure(result.error);
};
