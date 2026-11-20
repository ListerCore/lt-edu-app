import 'server-only';
import { headers } from 'next/headers';
import { connection } from 'next/server';

export interface ApiError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export type ApiResult<T> = { ok: true; status: number; data: T } | { ok: false; status: number; error: ApiError };

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  // Session token, sent as Authorization: Bearer
  token?: string;
  // Turnstile token of a public form, verified by lt-edu-api (X-Captcha-Token)
  captchaToken?: string;
}

const unavailable: ApiError = { code: 'api_unavailable', message: 'No pudimos conectar con el servidor. Inténtalo de nuevo en unos minutos.' };

export const apiBaseUrl = (): string | null => process.env.APP__API__URL?.replace(/\/$/, '') ?? null;

const notConfigured: ApiError = { code: 'api_not_configured', message: 'Falta configurar APP__API__URL en lt-edu-app.' };

// The API URL only exists at runtime (the Docker build has no APP__API__URL), so the call must never run while
// prerendering: otherwise "not configured" is baked into the static shell and served forever
const runtimeBaseUrl = async (): Promise<string | null> => {
  await connection();
  return apiBaseUrl();
};

// The visitor's IP and user agent travel to lt-edu-api (rate limits, audit trail, Libro de Reclamaciones)
const visitorHeaders = async (): Promise<Record<string, string>> => {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() || requestHeaders.get('x-real-ip') || '';
  return { ...(forwardedFor && { 'X-Forwarded-For': forwardedFor }), 'User-Agent': requestHeaders.get('user-agent') ?? 'lt-edu-app' };
};

// Calls lt-edu-api from the Next.js server
export const apiRequest = async <T>(path: string, { method = 'GET', body, token, captchaToken }: ApiRequestOptions = {}): Promise<ApiResult<T>> => {
  const baseUrl = await runtimeBaseUrl();
  if (!baseUrl) return { ok: false, status: 503, error: notConfigured };

  const init: RequestInit = {
    method,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(captchaToken && { 'X-Captcha-Token': captchaToken }),
      ...(await visitorHeaders()),
    },
    ...(body !== undefined && { body: JSON.stringify(body) }),
  };
  return send<T>(`${baseUrl}/api/v1${path}`, init);
};

// Multipart upload (files); fetch sets the boundary itself
export const apiUpload = async <T>(path: string, form: FormData, { method = 'POST', token, captchaToken }: { method?: 'POST' | 'PUT'; token?: string; captchaToken?: string } = {}): Promise<ApiResult<T>> => {
  const baseUrl = await runtimeBaseUrl();
  if (!baseUrl) return { ok: false, status: 503, error: notConfigured };
  return send<T>(`${baseUrl}/api/v1${path}`, { method, cache: 'no-store', body: form, headers: { Accept: 'application/json', ...(token && { Authorization: `Bearer ${token}` }), ...(captchaToken && { 'X-Captcha-Token': captchaToken }), ...(await visitorHeaders()) } });
};

const send = async <T>(url: string, init: RequestInit): Promise<ApiResult<T>> => {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    return { ok: false, status: 503, error: unavailable };
  }

  if (response.status === 204) return { ok: true, status: 204, data: undefined as T };

  const payload: unknown = await response.json().catch(() => null);
  if (response.ok) return { ok: true, status: response.status, data: payload as T };

  const error = (payload as { error?: ApiError } | null)?.error;
  return { ok: false, status: response.status, error: error?.message ? error : unavailable };
};
