'use server';

import { cookies } from 'next/headers';
import { apiRequest, type ApiError } from '@/lib/api/server';
import { CHALLENGE_COOKIE, clearSessionCookies, cookieOptions, SESSION_COOKIE, setSessionCookies } from '@/lib/auth/cookies';
import type { AuthActionResult, ChangePasswordPayload, ForgotPasswordPayload, PasswordSetupPayload, SignInPayload, SignInResult, SignUpPayload, TwoFactorPayload } from '../types';

// joseph-api answers (internal/adapter/inbound/http/handler/auth_handler.go): a session, or the app step
interface SignInResponse {
  session?: { token: string; expires_at: string };
  challenge_token?: string;
  method?: 'totp';
  email?: string;
  expires_at?: string;
}

interface SessionResponse {
  session: { token: string; expires_at: string };
}

const failure = (error: ApiError): AuthActionResult => ({ ok: false, code: error.code as AuthActionResult['code'], message: error.message, fields: error.fields });

const sessionToken = async (): Promise<string | undefined> => (await cookies()).get(SESSION_COOKIE)?.value;

// Password + Turnstile. Without an authenticator app the session starts here; with one, its handle stays in an
// httpOnly cookie for the next step
export const signInAction = async ({ email, password, captchaToken }: SignInPayload): Promise<SignInResult> => {
  if (!captchaToken) return { ok: false, message: 'Completa la verificación de seguridad.' };
  const result = await apiRequest<SignInResponse>('/auth/sign-in', { method: 'POST', body: { email, password }, captchaToken });
  if (!result.ok) return failure(result.error);
  const store = await cookies();
  if (result.data.session) {
    setSessionCookies(store, result.data.session.token, result.data.session.expires_at);
    return { ok: true, message: 'Ingresaste correctamente.', signedIn: true };
  }
  if (!result.data.challenge_token || !result.data.expires_at) return { ok: false, message: 'No pudimos iniciar sesión. Inténtalo de nuevo.' };
  store.set(CHALLENGE_COOKIE, result.data.challenge_token, cookieOptions(new Date(result.data.expires_at)));
  return { ok: true, message: 'Ingresa el código de tu app autenticadora.', signedIn: false };
};

// joseph-api matches the email against the people each institution registered: that decides institution and role
export const signUpAction = async ({ nombre, email, password, captchaToken }: SignUpPayload): Promise<AuthActionResult> => {
  if (!captchaToken) return { ok: false, message: 'Completa la verificación de seguridad.' };
  const result = await apiRequest('/auth/sign-up', { method: 'POST', body: { full_name: nombre, email, password }, captchaToken });
  return result.ok ? { ok: true, message: 'Cuenta creada.' } : failure(result.error);
};

// Always answers the same way so the form never reveals which emails have an account
export const forgotPasswordAction = async ({ email, captchaToken }: ForgotPasswordPayload): Promise<AuthActionResult> => {
  if (!captchaToken) return { ok: false, message: 'Completa la verificación de seguridad.' };
  const result = await apiRequest('/auth/password/forgot', { method: 'POST', body: { email }, captchaToken });
  return result.ok ? { ok: true, message: 'Si el correo tiene una cuenta, recibirá un enlace.' } : failure(result.error);
};

export const passwordSetupAction = async ({ token, password }: PasswordSetupPayload): Promise<AuthActionResult> => {
  if (!token) return { ok: false, code: 'expired_link', message: 'El enlace no es válido. Solicita uno nuevo.' };
  const result = await apiRequest('/auth/password/reset', { method: 'POST', body: { token, password } });
  return result.ok ? { ok: true, message: 'Contraseña actualizada.' } : failure(result.error);
};

// Authenticator-app step (app code or recovery code): on success the session replaces the challenge cookie
export const verifyTwoFactorAction = async ({ code }: TwoFactorPayload): Promise<AuthActionResult> => {
  const store = await cookies();
  const challenge = store.get(CHALLENGE_COOKIE)?.value;
  if (!challenge) return { ok: false, code: 'expired_challenge', message: 'La verificación venció. Ingresa de nuevo.' };
  const result = await apiRequest<SessionResponse>('/auth/sign-in/verify', { method: 'POST', body: { challenge_token: challenge, code } });
  if (!result.ok) {
    if (result.error.code === 'expired_challenge') store.delete(CHALLENGE_COOKIE);
    return failure(result.error);
  }
  store.delete(CHALLENGE_COOKIE);
  setSessionCookies(store, result.data.session.token, result.data.session.expires_at);
  return { ok: true, message: 'Identidad verificada.' };
};

export const changePasswordAction = async ({ currentPassword, password }: ChangePasswordPayload): Promise<AuthActionResult> => {
  const token = await sessionToken();
  if (!token) return { ok: false, code: 'unauthenticated', message: 'Tu sesión venció. Ingresa de nuevo.' };
  const result = await apiRequest('/auth/password/change', { method: 'POST', body: { current_password: currentPassword, password }, token });
  return result.ok ? { ok: true, message: 'Contraseña actualizada.' } : failure(result.error);
};

// Revokes the session in joseph-api and forgets it here; the cookie goes even if the API is unreachable
export const signOutAction = async (): Promise<AuthActionResult> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await apiRequest('/auth/sign-out', { method: 'POST', token });
  clearSessionCookies(store);
  return { ok: true, message: 'Sesión cerrada.' };
};
