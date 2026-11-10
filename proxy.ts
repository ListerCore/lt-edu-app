import { NextResponse, type NextRequest } from 'next/server';
import { CHALLENGE_COOKIE, clearSessionCookies, SESSION_COOKIE } from '@/lib/auth/cookies';

// Browser WebSocket path -> joseph-api live stream. The upgrade is relayed over the internal network (the API is
// never public); the Origin travels with it and the API checks it against APP__WS__ORIGINS
const liveChannels: Record<string, string> = { '/ws/live': '/api/v1/live' };

const apiUrl = (): string | null => process.env.APP__API__URL?.replace(/\/$/, '') ?? null;

// The panel needs a live session. joseph-api is asked on every navigation, so a revoked or expired session sends
// the person back to sign in at once. If the API cannot be reached the request goes on: every panel call goes
// through the API and fails there anyway
const requireSession = async (request: NextRequest): Promise<NextResponse> => {
  const signIn = (): NextResponse => {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.search = '';
    const response = NextResponse.redirect(url);
    clearSessionCookies(response.cookies);
    return response;
  };
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return signIn();
  const base = apiUrl();
  if (!base) return NextResponse.next();
  try {
    const response = await fetch(`${base}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(3000) });
    if (response.status === 401) return signIn();
  } catch {
    // API unreachable: let the page render its own error state
  }
  return NextResponse.next();
};

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
  const { pathname } = request.nextUrl;

  const target = liveChannels[pathname];
  if (target) {
    const base = apiUrl();
    if (!base) return new NextResponse('live channel not configured', { status: 503 });
    return NextResponse.rewrite(new URL(`${base}${target}`));
  }

  if (pathname.startsWith('/dashboard')) return requireSession(request);

  // The second step only makes sense right after a password was accepted
  if (pathname === '/auth/two-factor' && !request.cookies.has(CHALLENGE_COOKIE)) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
};

export const config = {
  matcher: ['/ws/live', '/dashboard/:path*', '/auth/two-factor'],
};
