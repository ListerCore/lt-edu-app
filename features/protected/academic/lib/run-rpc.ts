import 'server-only';
import { cookies } from 'next/headers';
import type { GrpcResult } from '@/lib/api/grpc/client';
import { SESSION_COOKIE } from '@/lib/auth/cookies';
import { SLUG_PATTERN, UUID_PATTERN } from '../data/academic-data';
import type { AcademicResult } from '../types';

export const signedOut = { ok: false, message: 'Tu sesión venció. Ingresa de nuevo.' } as const;
export const notFound = { ok: false, message: 'No encontramos lo que buscas. Recarga la página.' } as const;

const sessionToken = async (): Promise<string | undefined> => (await cookies()).get(SESSION_COOKIE)?.value;

// Runs one academic RPC with the session and turns its answer (or the API error with its field messages) into a result
export const runRpc = async <Res, T>(slug: string, call: (token: string) => Promise<GrpcResult<Res>>, pick: (data: Res) => T | undefined, message?: string): Promise<AcademicResult<T>> => {
  const token = await sessionToken();
  if (!token) return signedOut;
  if (slug && !SLUG_PATTERN.test(slug)) return notFound;
  const result = await call(token);
  if (!result.ok) return { ok: false, message: result.error.message, ...(result.error.fields && { fields: result.error.fields }) };
  const data = pick(result.data);
  if (data === undefined) return notFound;
  return { ok: true, data, ...(message && { message }) };
};

export const validIds = (...values: string[]): boolean => values.every((value) => UUID_PATTERN.test(value));

// "12" → 12; anything else (empty, letters) → undefined, so the API applies its default or reports the field
export const toInt = (value: string): number | undefined => (/^\d{1,4}$/.test(value.trim()) ? Number(value.trim()) : undefined);
