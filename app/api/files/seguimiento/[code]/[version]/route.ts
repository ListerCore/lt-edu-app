import { documentsRpc } from '@/lib/api/grpc/documents';

const TRACKING = /^[0-9a-z]{12}$/;

// The PDF of a published (current or superseded) version, opened from the public tracking page. joseph-api is
// internal, so the site relays it; pending and cancelled versions are not served
export const GET = async (_request: Request, { params }: RouteContext<'/api/files/seguimiento/[code]/[version]'>): Promise<Response> => {
  const { code, version } = await params;
  const number = Number(version);
  if (!TRACKING.test(code) || !Number.isInteger(number) || number < 1 || number > 100_000) return new Response(null, { status: 404 });
  const r = await documentsRpc.trackPdf({ trackingCode: code, number }, { timeoutMs: 60_000 });
  if (!r.ok || !r.data.file) return new Response(null, { status: r.ok || r.error.code === 'not_found' ? 404 : 503, headers: { 'cache-control': 'no-store' } });
  const { fileName, content } = r.data.file;
  return new Response(new Uint8Array(content), {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `inline; filename="${fileName.replace(/[^\w.-]/g, '-')}"`,
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
    },
  });
};
