import { timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AFTER_AUTH_PATH } from '@/features/auth/data/auth-data';
import { apiRequest } from '@/lib/api/server';
import { CHALLENGE_COOKIE, cookieOptions, GOOGLE_COOKIE_PATH, GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE, setSessionCookies } from '@/lib/auth/cookies';
import { publicOrigin } from '@/lib/auth/public-origin';

// lt-edu-api answers a session, or the authenticator-app step when the account has TOTP on
interface GoogleCallbackResponse {
  session?: { token: string; expires_at: string };
  challenge_token?: string;
  method?: 'totp';
  email?: string;
  expires_at?: string;
}

const sameState = (got: string, expected: string): boolean => got.length === expected.length && timingSafeEqual(Buffer.from(got), Buffer.from(expected));

// Google sends the visitor back here (authorized redirect URI: <site>/api/auth/google/callback)
export const GET = async (request: Request): Promise<Response> => {
  const origin = publicOrigin(request);
  const params = new URL(request.url).searchParams;
  const store = await cookies();
  const expected = store.get(GOOGLE_STATE_COOKIE)?.value ?? '';
  const verifier = store.get(GOOGLE_VERIFIER_COOKIE)?.value ?? '';
  // One use: the state and verifier go whatever happens next
  const forget = (response: NextResponse): NextResponse => {
    for (const name of [GOOGLE_STATE_COOKIE, GOOGLE_VERIFIER_COOKIE]) response.cookies.set(name, '', { path: GOOGLE_COOKIE_PATH, maxAge: 0 });
    return response;
  };
  const back = (error: string): NextResponse => forget(NextResponse.redirect(`${origin}/auth/signin?error=${error}`));

  // The visitor closed the consent screen or Google refused
  if (params.get('error')) return back('google_cancelled');
  const code = params.get('code');
  const state = params.get('state') ?? '';
  if (!code || !expected || !verifier || !sameState(state, expected)) return back('google_failed');

  const result = await apiRequest<GoogleCallbackResponse>('/auth/google/callback', { method: 'POST', body: { code, code_verifier: verifier } });
  if (!result.ok) return back(result.error.code === 'not_invited' ? 'not_invited' : result.error.code === 'google_not_configured' ? 'google_not_configured' : 'google_failed');

  const { data } = result;
  if (data.session) {
    const response = forget(NextResponse.redirect(`${origin}${AFTER_AUTH_PATH}`));
    setSessionCookies(response.cookies, data.session.token, data.session.expires_at);
    return response;
  }
  if (data.challenge_token && data.expires_at) {
    const response = forget(NextResponse.redirect(`${origin}/auth/two-factor`));
    response.cookies.set(CHALLENGE_COOKIE, data.challenge_token, cookieOptions(new Date(data.expires_at)));
    return response;
  }
  return back('google_failed');
};
