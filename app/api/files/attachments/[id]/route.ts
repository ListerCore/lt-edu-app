import { cookies } from 'next/headers';
import { apiBaseUrl } from '@/lib/api/server';
import { SESSION_COOKIE } from '@/lib/auth/cookies';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
// Headers of lt-edu-api's answer that travel to the browser
const PASSED = ['content-type', 'content-length', 'content-disposition', 'cache-control', 'x-content-type-options'];

// Files attached to records (PDF, images, Word, Excel). lt-edu-api is internal, so the site relays them with the
// session; the API checks the person's role against the module of the record
export const GET = async (_request: Request, { params }: RouteContext<'/api/files/attachments/[id]'>): Promise<Response> => {
  const { id } = await params;
  const base = apiBaseUrl();
  if (!base || !UUID.test(id)) return new Response(null, { status: 404 });

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // Every attachment is private: without a session there is nothing to ask for
  if (!token) return new Response(null, { status: 404, headers: { 'cache-control': 'no-store' } });
  let upstream: Response;
  try {
    upstream = await fetch(`${base}/api/v1/attachments/${id}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(30_000) });
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
  // Never cache private files, whatever the upstream said
  headers.set('cache-control', 'private, no-store');
  return new Response(upstream.body, { status: 200, headers });
};
