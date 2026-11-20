// Cookies of the signed-in browser. The session and challenge cookies are httpOnly: only lt-edu-app's server reads
// them and forwards the token to lt-edu-api as Authorization: Bearer. Shared by proxy.ts, route handlers and actions
export const SESSION_COOKIE = 'ltedu_session';
// Handle of a sign-in waiting for its second step (code by email or authenticator app)
export const CHALLENGE_COOKIE = 'ltedu_challenge';
// Readable hint for the UI (navbar, menus): "1" while a session cookie exists. It grants nothing
export const SIGNED_IN_COOKIE = 'ltedu_signed_in';
// Google sign-in in flight: CSRF state and PKCE verifier, only sent back to the callback
export const GOOGLE_STATE_COOKIE = 'ltedu_google_state';
export const GOOGLE_VERIFIER_COOKIE = 'ltedu_google_verifier';
export const GOOGLE_COOKIE_PATH = '/api/auth/google';

export const cookieOptions = (expires: Date) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  expires,
});

export const hintCookieOptions = (expires: Date) => ({ ...cookieOptions(expires), httpOnly: false });

// Anything with a cookies.set/delete (next/headers store or NextResponse.cookies)
interface CookieJar {
  set: (name: string, value: string, options: ReturnType<typeof cookieOptions>) => unknown;
  delete: (name: string) => unknown;
}

// The session token plus the UI hint, with the same expiry
export const setSessionCookies = (jar: CookieJar, token: string, expiresAt: string): void => {
  const expires = new Date(expiresAt);
  jar.set(SESSION_COOKIE, token, cookieOptions(expires));
  jar.set(SIGNED_IN_COOKIE, '1', hintCookieOptions(expires));
};

export const clearSessionCookies = (jar: CookieJar): void => {
  jar.delete(SESSION_COOKIE);
  jar.delete(SIGNED_IN_COOKIE);
};
