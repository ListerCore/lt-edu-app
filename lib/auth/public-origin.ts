import 'server-only';

// Public origin of the site (https://demo.listercore.es). Behind Dokploy's proxy request.url carries the internal
// host, so APP__SITE_URL wins; without it the forwarded headers, then the request itself
export const publicOrigin = (request: Request): string => {
  const configured = process.env.APP__SITE_URL?.trim().replace(/\/$/, '');
  if (configured) return configured;
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host) return `${request.headers.get('x-forwarded-proto') ?? 'http'}://${host}`;
  return new URL(request.url).origin;
};
