import { NextResponse, type NextRequest } from 'next/server';

// Browser WebSocket path -> joseph-api live stream. The upgrade is relayed over the internal network (the API is
// never public); the Origin travels with it and the API checks it against APP__WS__ORIGINS
const liveChannels: Record<string, string> = { '/ws/live': '/api/v1/live' };

export const proxy = (request: NextRequest): NextResponse => {
  const target = liveChannels[request.nextUrl.pathname];
  if (!target) return NextResponse.next();
  const apiUrl = process.env.APP__API__URL?.replace(/\/$/, '');
  if (!apiUrl) return new NextResponse('live channel not configured', { status: 503 });
  return NextResponse.rewrite(new URL(`${apiUrl}${target}`));
};

export const config = {
  matcher: ['/ws/live'],
};
