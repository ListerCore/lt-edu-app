import { cookies } from 'next/headers';
import { apiBaseUrl } from '@/lib/api/server';
import { SESSION_COOKIE } from '@/lib/auth/cookies';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
// Headers of joseph-api's answer that travel to the browser
const PASSED = ['content-type', 'content-length', 'content-disposition', 'cache-control', 'x-content-type-options'];

// Images and PDFs of announcements. joseph-api is internal, so the site relays them; the session (if any) goes
// along so internal announcements open for the people allowed to read them
export const GET = async (_request: Request, { params }: RouteContext<'/api/files/announcements/[id]/[attachmentId]'>): Promise<Response> => {
  const { id, attachmentId } = await params;
  const base = apiBaseUrl();
  if (!base || !UUID.test(id) || !UUID.test(attachmentId)) return new Response(null, { status: 404 });

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  let upstream: Response;
  try {
    upstream = await fetch(`${base}/api/v1/announcements/${id}/attachments/${attachmentId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {}, cache: 'no-store', signal: AbortSignal.timeout(30_000) });
  } catch {
    return new Response(null, { status: 502 });
  }
  // Missing, not allowed or signed out all look the same from outside
  if (!upstream.ok || !upstream.body) return new Response(null, { status: upstream.status === 503 ? 503 : 404, headers: { 'cache-control': 'no-store' } });

  const headers = new Headers();
  for (const name of PASSED) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, value);
  }
  return new Response(upstream.body, { status: 200, headers });
};
