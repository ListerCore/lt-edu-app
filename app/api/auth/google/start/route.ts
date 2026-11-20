import { createHash, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { apiRequest } from '@/lib/api/server';
import { GOOGLE_COOKIE_PATH, GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE } from '@/lib/auth/cookies';
import { publicOrigin } from '@/lib/auth/public-origin';

// Starts "Continuar con Google": CSRF state and PKCE verifier stay in httpOnly cookies scoped to the callback,
// lt-edu-api only sees the state and the S256 challenge and answers Google's consent URL
export const POST = async (request: Request): Promise<Response> => {
  // Same-origin only, so another site cannot start a sign-in in the visitor's browser
  if (request.headers.get('origin') !== publicOrigin(request)) return NextResponse.json({ error: { code: 'forbidden', message: 'Origen no permitido.' } }, { status: 403 });

  const state = randomBytes(32).toString('base64url');
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');

  const result = await apiRequest<{ url: string }>('/auth/google/authorize', { method: 'POST', body: { state, code_challenge: challenge } });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });

  const response = NextResponse.json({ url: result.data.url });
  const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: GOOGLE_COOKIE_PATH, maxAge: 600 };
  response.cookies.set(GOOGLE_STATE_COOKIE, state, options);
  response.cookies.set(GOOGLE_VERIFIER_COOKIE, verifier, options);
  return response;
};
